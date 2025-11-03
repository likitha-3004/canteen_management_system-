import os
import sys

# Add repo root to sys.path so we can import backend.app
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.app import app  # your Flask instance is named `app`