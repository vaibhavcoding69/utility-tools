"""
Utility functions for the Utility Tools API.

This module contains helper functions for usage tracking, data validation,
and common operations used throughout the API.
"""

from pathlib import Path
from typing import Dict, Any
import json
from asyncio import Lock
import logging

from ..config import USAGE_STATS_FILE

# Set up logging
logger = logging.getLogger(__name__)

# Global variables for usage tracking
_usage_lock = Lock()
_request_count = 0
_tool_usage: Dict[str, int] = {}


def load_usage_stats() -> None:
    """Load usage statistics from file."""
    global _request_count, _tool_usage

    if not USAGE_STATS_FILE.exists():
        _request_count = 0
        _tool_usage = {}
        return

    try:
        data = json.loads(USAGE_STATS_FILE.read_text(encoding="utf-8"))
        _request_count = int(data.get("total", 0))
        _tool_usage = {
            key: int(value)
            for key, value in data.get("tools", {}).items()
            if isinstance(key, str)
        }
    except Exception as e:
        logger.warning(f"Failed to load usage stats: {e}")
        _request_count = 0
        _tool_usage = {}


def save_usage_stats() -> None:
    """Save usage statistics to file."""
    data = {
        "total": _request_count,
        "tools": _tool_usage
    }

    try:
        USAGE_STATS_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")
    except Exception as e:
        logger.error(f"Failed to save usage stats: {e}")


def increment_request_count() -> None:
    """Increment the total request count."""
    global _request_count
    _request_count += 1


def increment_tool_usage(tool_key: str) -> None:
    """Increment usage count for a specific tool."""
    global _tool_usage
    _tool_usage[tool_key] = _tool_usage.get(tool_key, 0) + 1


def get_request_count() -> int:
    """Get the total request count."""
    return _request_count


def get_tool_usage(limit: int = 6) -> list:
    """Get most used tools, limited to specified count."""
    safe_limit = max(1, min(limit, 20))
    sorted_tools = sorted(_tool_usage.items(), key=lambda item: item[1], reverse=True)
    return [
        {"id": tool_id, "count": count}
        for tool_id, count in sorted_tools[:safe_limit]
    ]


def get_tool_key_from_path(path: str) -> str | None:
    """Get tool key from API path."""
    from .config import TOOL_PATH_MAPPING
    return TOOL_PATH_MAPPING.get(path)


# Initialize usage stats on import
load_usage_stats()