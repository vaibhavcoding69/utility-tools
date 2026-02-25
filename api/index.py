import sys
from pathlib import Path

# Add the root directory to the path so we can import from backend
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.index import app


