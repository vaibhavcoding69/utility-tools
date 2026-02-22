from pathlib import Path
from typing import Dict, Any
import json
from asyncio import Lock
import logging

from ..config import USAGE_STATS_FILE

logger = logging.getLogger(__name__)

_usage_lock = Lock()
_request_count = 0
_tool_usage: Dict[str, int] = {}

def load_usage_stats() -> None:
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
    pass

def increment_request_count() -> None:
    global _request_count
    _request_count += 1

def increment_tool_usage(tool_key: str) -> None:
    global _tool_usage
    _tool_usage[tool_key] = _tool_usage.get(tool_key, 0) + 1

def get_request_count() -> int:
    return _request_count

def get_tool_usage(limit: int = 6) -> list:
    safe_limit = max(1, min(limit, 20))
    sorted_tools = sorted(_tool_usage.items(), key=lambda item: item[1], reverse=True)
    return [
        {"id": tool_id, "count": count}
        for tool_id, count in sorted_tools[:safe_limit]
    ]

def get_tool_key_from_path(path: str) -> str | None:
    from ..config import TOOL_PATH_MAPPING
    return TOOL_PATH_MAPPING.get(path)

load_usage_stats()
