from .health import router as health
from .developer import router as developer
from .security import router as security
from .data import router as data

__all__ = ["health", "developer", "security", "data"]
