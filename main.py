import os
import subprocess
import sys


def run_frontend():
    root = os.path.abspath(os.path.dirname(__file__))
    frontend_dir = os.path.join(root, "frontend")

    if not os.path.isdir(frontend_dir):
        sys.stderr.write("frontend directory not found.\n")
        sys.exit(1)

    cmd = ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
    proc = subprocess.Popen(cmd, cwd=frontend_dir)
    try:
        proc.wait()
    except KeyboardInterrupt:
        proc.terminate()
        proc.wait()


if __name__ == "__main__":
    run_frontend()
