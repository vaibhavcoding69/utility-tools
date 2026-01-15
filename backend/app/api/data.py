from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import csv
import io
import pandas as pd
import random
from faker import Faker

class CsvPayload(BaseModel):
    csv: str

class JsonPayload(BaseModel):
    data: str

class SqlPayload(BaseModel):
    query: str

class BaseConvertPayload(BaseModel):
    value: str
    from_base: int
    to_base: int

class FakeDataPayload(BaseModel):
    count: int = 10
    locale: str | None = None

router = APIRouter()

@router.post("/csv-to-json")
async def csv_to_json(payload: CsvPayload):
    try:
        buf = io.StringIO(payload.csv)
        reader = csv.DictReader(buf)
        rows = list(reader)
        return {"success": True, "json": json.dumps(rows, ensure_ascii=False)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/json-to-csv")
async def json_to_csv(payload: JsonPayload):
    try:
        data = json.loads(payload.data)
        if not isinstance(data, list) or not data:
            raise ValueError("JSON must be a non-empty array of objects")
        buf = io.StringIO()
        writer = csv.DictWriter(buf, fieldnames=data[0].keys())
        writer.writeheader()
        for row in data:
            writer.writerow(row)
        return {"success": True, "csv": buf.getvalue()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/sql/format")
async def sql_format(payload: SqlPayload):
    # Minimal formatter: collapse whitespace
    formatted = " ".join(payload.query.split())
    return {"success": True, "formatted": formatted}

@router.get("/fake-data")
async def fake_data(count: int = 10, locale: str | None = None):
    fake = Faker(locale) if locale else Faker()
    rows = []
    for _ in range(min(count, 1000)):
        rows.append({
            "name": fake.name(),
            "email": fake.email(),
            "address": fake.address(),
            "company": fake.company(),
            "phone": fake.phone_number(),
        })
    return {"success": True, "rows": rows}

@router.post("/convert/base")
async def convert_base(payload: BaseConvertPayload):
    try:
        num = int(payload.value, payload.from_base)
        digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        if payload.to_base < 2 or payload.to_base > 36:
            raise ValueError("to_base must be between 2 and 36")
        out = ""
        if num == 0:
            out = "0"
        else:
            while num > 0:
                out = digits[num % payload.to_base] + out
                num //= payload.to_base
        return {"success": True, "value": out}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
