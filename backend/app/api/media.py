from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import base64
from io import BytesIO


class QRPayload(BaseModel):
    data: str


class ImageBase64Payload(BaseModel):
    data: str  # base64 string
    quality: int | None = 75


class ColorPalettePayload(BaseModel):
    data: str  # base64 string
    colors: int = 5


router = APIRouter()


@router.post("/qr/generate")
async def qr_generate(payload: QRPayload):
    try:
        import qrcode
    except ImportError:
        raise HTTPException(status_code=500, detail="python-qrcode not installed")
    img = qrcode.make(payload.data)
    buf = BytesIO()
    img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    return {"success": True, "image": f"data:image/png;base64,{b64}"}


@router.post("/qr/read")
async def qr_read(payload: ImageBase64Payload):
    try:
        from PIL import Image
    except ImportError:
        raise HTTPException(status_code=500, detail="Pillow not installed")
    try:
        raw = base64.b64decode(payload.data.split(",")[-1])
        img = Image.open(BytesIO(raw))
        try:
            import zbarlight
        except ImportError:
            raise HTTPException(status_code=500, detail="zbarlight not installed")
        codes = zbarlight.scan_codes(["qrcode"], img)
        decoded = codes[0].decode("utf-8") if codes else None
        return {"success": True, "data": decoded}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/image/compress")
async def image_compress(payload: ImageBase64Payload):
    try:
        from PIL import Image
    except ImportError:
        raise HTTPException(status_code=500, detail="Pillow not installed")
    try:
        raw = base64.b64decode(payload.data.split(",")[-1])
        img = Image.open(BytesIO(raw))
        buf = BytesIO()
        img.save(buf, format="JPEG", optimize=True, quality=payload.quality or 75)
        b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
        return {"success": True, "image": f"data:image/jpeg;base64,{b64}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/image/to-base64")
async def image_to_base64(payload: ImageBase64Payload):
    try:
        base64.b64decode(payload.data)  # sanity
        return {"success": True, "image": payload.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/color/palette")
async def color_palette(payload: ColorPalettePayload):
    try:
        from PIL import Image
    except ImportError:
        raise HTTPException(status_code=500, detail="Pillow not installed")
    try:
        raw = base64.b64decode(payload.data.split(",")[-1])
        img = Image.open(BytesIO(raw)).convert("RGB")
        small = img.resize((64, 64))
        colors = small.getcolors(64 * 64)
        colors = sorted(colors, key=lambda c: c[0], reverse=True)
        top = colors[: max(1, min(payload.colors, len(colors)))]
        palette = [f"rgb({r},{g},{b})" for _, (r, g, b) in top]
        return {"success": True, "palette": palette}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
