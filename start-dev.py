#!/usr/bin/env python
"""
Development server launcher for PC Builder project
Starts both backend (Django) and frontend (Vite) servers
"""

import subprocess
import sys
import os
import time
import threading
from pathlib import Path

# Project paths
PROJECT_ROOT = Path(__file__).parent
BACKEND_PATH = PROJECT_ROOT / "backend"
FRONTEND_PATH = PROJECT_ROOT / "frontend"

def start_backend():
    """Start Django backend server"""
    print("Starting Django backend server...")
    os.chdir(BACKEND_PATH)
    
    # Install dependencies if needed
    if not (BACKEND_PATH / "venv").exists():
        print("Installing Python dependencies...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        venv_python = BACKEND_PATH / "venv" / "Scripts" / "python.exe"
        subprocess.run([str(venv_python), "-m", "pip", "install", "-r", "requirements.txt"], check=True)
    else:
        venv_python = BACKEND_PATH / "venv" / "Scripts" / "python.exe"
    
    # Start Django server
    subprocess.run([str(venv_python), "manage.py", "runserver"])

def start_frontend():
    """Start Vite frontend server"""
    print("Starting Vite frontend server...")
    os.chdir(FRONTEND_PATH)
    
    # Install dependencies if needed
    if not (FRONTEND_PATH / "node_modules").exists():
        print("Installing Node.js dependencies...")
        subprocess.run(["npm", "install"], check=True)
    
    # Start frontend server
    subprocess.run(["npm", "run", "dev"])

def main():
    """Main launcher function"""
    print("=== PC Builder Development Server Launcher ===")
    print(f"Project root: {PROJECT_ROOT}")
    print(f"Backend: {BACKEND_PATH}")
    print(f"Frontend: {FRONTEND_PATH}")
    print()
    
    # Check if directories exist
    if not BACKEND_PATH.exists():
        print(f"Error: Backend directory not found at {BACKEND_PATH}")
        return
    
    if not FRONTEND_PATH.exists():
        print(f"Error: Frontend directory not found at {FRONTEND_PATH}")
        return
    
    choice = input("Choose server to start:\n1. Backend only (Django)\n2. Frontend only (Vite)\n3. Both servers\nEnter choice (1-3): ")
    
    if choice == "1":
        start_backend()
    elif choice == "2":
        start_frontend()
    elif choice == "3":
        print("Starting both servers...")
        
        # Start backend in thread
        backend_thread = threading.Thread(target=start_backend, daemon=True)
        backend_thread.start()
        
        # Wait a bit for backend to start
        time.sleep(3)
        
        # Start frontend in main thread
        start_frontend()
    else:
        print("Invalid choice")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nServers stopped")
    except Exception as e:
        print(f"Error: {e}")
