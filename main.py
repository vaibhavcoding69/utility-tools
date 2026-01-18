import os
import subprocess
import sys


def run_backend():
    root = os.path.abspath(os.path.dirname(__file__))
    backend_dir = os.path.join(root, "backend")
    if not os.path.isdir(backend_dir):
        sys.stderr.write("backend directory not found.\n")
        sys.exit(1)

    cmd = [
        sys.executable,
        "-m", "uvicorn", "backend.index:app", "--host", "0.0.0.0", "--port", "8000", "--reload",
    ]
    return subprocess.Popen(cmd, cwd=root)


def run_frontend():
    root = os.path.abspath(os.path.dirname(__file__))
    frontend_dir = os.path.join(root, "frontend")

    if not os.path.isdir(frontend_dir):
        sys.stderr.write("frontend directory not found.\n")
        sys.exit(1)

    cmd = ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
    return subprocess.Popen(cmd, cwd=frontend_dir)


if __name__ == "__main__":
    backend_proc = run_backend()
    frontend_proc = run_frontend()
    try:
        # Wait on the frontend; backend is reload-enabled
        frontend_proc.wait()
    except KeyboardInterrupt:
        pass
    finally:
        for proc in (frontend_proc, backend_proc):
            if proc and proc.poll() is None:
                proc.terminate()
                try:
                    proc.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    proc.kill()
