import mysql.connector
from mysql.connector import Error
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS

# --- DATABASE CONFIGURATION ---
DB_CONFIG = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'likitha123',
    'database': 'canteen_db'
}

# --- Create the Flask App ---
app = Flask(__name__)
# Allow requests from Vite dev servers
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174"]}})

# --- Database Helper Functions ---
def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            return conn
    except Error as e:
        print(f"Error connecting to MySQL database: {e}")
        return None

# --- API ENDPOINTS ---

# 1. Login Endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    print("--- LOGIN ATTEMPT ---")
    print(f"Email from React: '{data.get('email')}'")
    print(f"Password from React: '{data.get('password')}'")
    
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor(dictionary=True)
    try:
        query = """
            SELECT 
                user_id, 
                TRIM(name) AS name, 
                TRIM(email) AS email, 
                TRIM(role) AS role 
            FROM users 
            WHERE TRIM(email) = %s AND TRIM(password) = %s
        """
        cursor.execute(query, (email, password))
        user = cursor.fetchone()
        
        if user:
            print("--- LOGIN SUCCESS ---")
            return jsonify(user)
        else:
            print("--- LOGIN FAILED ---")
            return jsonify({"error": "Invalid email or password"}), 401
    except Error as e:
        print(f"--- LOGIN ERROR --- \n{e}")
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# 2. Register Endpoint
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = 'customer'

    if not all([name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT user_id FROM users WHERE TRIM(email) = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "An account with this email already exists"}), 409

        query = "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (name, email, password, role))
        conn.commit()
        
        new_user_id = cursor.lastrowid
        
        new_user_data = {
            "user_id": new_user_id,
            "name": name,
            "email": email,
            "role": role
        }
        return jsonify(new_user_data), 201
    except Error as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# 3. Get Single User
@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT user_id, TRIM(name) AS name, TRIM(email) AS email, TRIM(role) AS role FROM users WHERE user_id = %s"
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()
        if user:
            return jsonify(user)
        else:
            return jsonify({"error": "User not found"}), 404
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# 4. Fetch Menu
@app.route('/api/menu', methods=['GET'])
def fetch_menu():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT item_id, item_name, category, CAST(price AS FLOAT) as price, stock_qty FROM menu_items WHERE stock_qty > 0"
        cursor.execute(query)
        menu_items = cursor.fetchall()
        return jsonify(menu_items)
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# 5. Fetch User Orders
@app.route('/api/orders/user/<int:user_id>', methods=['GET'])
def fetch_user_orders(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor(dictionary=True)
    try:
        query = """
            SELECT order_id, order_date, CAST(total_amount AS FLOAT) as total_amount, status 
            FROM orders 
            WHERE user_id = %s 
            ORDER BY order_date DESC
        """
        cursor.execute(query, (user_id,))
        orders = cursor.fetchall()
        for order in orders:
            if isinstance(order.get('order_date'), datetime):
                order['order_date'] = order['order_date'].isoformat()
        return jsonify(orders)
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# 6. Fetch All Orders (Admin)
@app.route('/api/orders/all', methods=['GET'])
def fetch_all_orders():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor(dictionary=True)
    try:
        query = """
            SELECT o.order_id, o.order_date, CAST(o.total_amount AS FLOAT) as total_amount, o.status, u.name AS customer_name
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            ORDER BY o.order_date DESC
        """
        cursor.execute(query)
        all_orders = cursor.fetchall()
        for order in all_orders:
            if isinstance(order.get('order_date'), datetime):
                order['order_date'] = order['order_date'].isoformat()
        return jsonify(all_orders)
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# 7. Place Order
@app.route('/api/order/place', methods=['POST'])
def place_order():
    data = request.json
    user_id = data.get('user_id')
    cart = data.get('cart')
    total_amount = data.get('totalAmount')
    payment_method = data.get('paymentMethod', 'UPI')

    if not all([user_id, cart, total_amount]):
        return jsonify({"error": "Missing data"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor(dictionary=True)
    try:
        conn.start_transaction()

        for item in cart:
            cursor.execute("SELECT stock_qty, item_name FROM menu_items WHERE item_id = %s FOR UPDATE", (item['item_id'],))
            db_item = cursor.fetchone()
            if not db_item or db_item['stock_qty'] < item['quantity']:
                conn.rollback()
                return jsonify({"error": f"Not enough stock for {db_item['item_name'] if db_item else 'item'}"}), 400

        order_time = datetime.now()
        order_query = "INSERT INTO orders (user_id, order_date, total_amount, status) VALUES (%s, %s, %s, 'pending')"
        cursor.execute(order_query, (user_id, order_time, total_amount))
        order_id = cursor.lastrowid

        for item in cart:
            stock_query = "UPDATE menu_items SET stock_qty = stock_qty - %s WHERE item_id = %s"
            cursor.execute(stock_query, (item['quantity'], item['item_id']))
        
        payment_query = "INSERT INTO payments (order_id, payment_method, amount, payment_date) VALUES (%s, %s, %s, %s)"
        cursor.execute(payment_query, (order_id, payment_method, total_amount, order_time))

        status_query = "UPDATE orders SET status = 'completed' WHERE order_id = %s"
        cursor.execute(status_query, (order_id,))

        conn.commit()
        
        new_order = { 
            "order_id": order_id, 
            "order_date": order_time.isoformat(), 
            "total_amount": total_amount, 
            "status": "completed" 
        }
        return jsonify(new_order), 201

    except Error as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# ✅ NEW ENDPOINT — Add Payment AFTER Adding Items to Cart
@app.route('/api/payment/add', methods=['POST'])
def add_payment():
    """
    This endpoint lets users add payment *after* items are added to cart,
    without placing the order again.
    """
    data = request.json
    order_id = data.get('order_id')
    payment_method = data.get('payment_method', 'UPI')
    amount = data.get('amount')

    if not all([order_id, amount]):
        return jsonify({"error": "Missing order ID or amount"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    try:
        payment_date = datetime.now()
        query = """
            INSERT INTO payments (order_id, payment_method, amount, payment_date)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (order_id, payment_method, amount, payment_date))

        # Optionally mark order as 'paid'
        cursor.execute("UPDATE orders SET status = 'paid' WHERE order_id = %s", (order_id,))
        conn.commit()

        return jsonify({
            "message": "Payment recorded successfully",
            "order_id": order_id,
            "payment_method": payment_method,
            "amount": amount,
            "payment_date": payment_date.isoformat()
        }), 201

    except Error as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# 8. Update Stock
@app.route('/api/stock/update', methods=['POST'])
def update_stock():
    data = request.json
    item_id = data.get('item_id')
    new_stock = data.get('new_stock')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor(dictionary=True)
    try:
        query = "UPDATE menu_items SET stock_qty = %s WHERE item_id = %s"
        cursor.execute(query, (new_stock, item_id))
        conn.commit()
        
        cursor.execute("SELECT item_id, item_name, category, CAST(price AS FLOAT) as price, stock_qty FROM menu_items WHERE item_id = %s", (item_id,))
        updated_item = cursor.fetchone()
        return jsonify(updated_item)
    except Error as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# 9. Update Order Status
@app.route('/api/order/status', methods=['POST'])
def update_order_status():
    data = request.json
    order_id = data.get('order_id')
    new_status = data.get('new_status')

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
        
    cursor = conn.cursor(dictionary=True)
    try:
        query = "UPDATE orders SET status = %s WHERE order_id = %s"
        cursor.execute(query, (new_status, order_id))
        conn.commit()

        cursor.execute("SELECT * FROM orders WHERE order_id = %s", (order_id,))
        updated_order = cursor.fetchone()
        if isinstance(updated_order.get('order_date'), datetime):
            updated_order['order_date'] = updated_order['order_date'].isoformat()
        return jsonify(updated_order)
    except Error as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)
