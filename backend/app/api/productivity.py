from fastapi import APIRouter
from pydantic import BaseModel
import markdown as md


class TextPayload(BaseModel):
    data: str


router = APIRouter()


@router.post("/text/word-count")
async def word_count(payload: TextPayload):
    text = payload.data
    words = len(text.split())
    chars = len(text)
    chars_no_spaces = len(text.replace(" ", "").replace("\n", "").replace("\t", ""))
    lines = len(text.split("\n"))
    return {
        "success": True,
        "words": words,
        "characters": chars,
        "characters_no_spaces": chars_no_spaces,
        "lines": lines,
    }


@router.post("/text/case-convert")
async def case_convert(payload: TextPayload):
    text = payload.data
    return {
        "success": True,
        "uppercase": text.upper(),
        "lowercase": text.lower(),
        "title_case": text.title(),
        "sentence_case": text.capitalize(),
        "snake_case": text.lower().replace(" ", "_"),
        "kebab_case": text.lower().replace(" ", "-"),
        "camel_case": "".join(word.capitalize() for word in text.split()),
    }


@router.post("/markdown/render")
async def markdown_render(payload: TextPayload):
    html = md.markdown(payload.data)
    return {"success": True, "html": html}
