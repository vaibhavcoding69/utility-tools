from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import json
import csv
import io
import random
from faker import Faker
import re
import secrets
from typing import Optional

class CsvPayload(BaseModel):
    csv: str = None
    data: str = None  # Alternative field name from frontend

class JsonPayload(BaseModel):
    data: str

class SqlPayload(BaseModel):
    query: str = None
    data: str = None  # Alternative field name from frontend

class SqlMinifyPayload(BaseModel):
    query: str

class BaseConvertPayload(BaseModel):
    value: str
    from_base: int
    to_base: int

class FakeDataPayload(BaseModel):
    data_type: str = "person"
    count: int = 10
    locale: str = "en_US"

class RandomStringPayload(BaseModel):
    length: int = 16
    lowercase: bool = True
    uppercase: bool = True
    digits: bool = True
    symbols: bool = False

router = APIRouter()

@router.post("/csv-to-json")
async def csv_to_json(payload: CsvPayload):
    try:
        csv_data = payload.csv or payload.data
        if not csv_data:
            raise ValueError("CSV data is required")
        buf = io.StringIO(csv_data)
        reader = csv.DictReader(buf)
        rows = list(reader)
        return {
            "success": True,
            "json": json.dumps(rows, ensure_ascii=False, indent=2),
            "data": rows,
        }
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
    try:
        sql_data = payload.query or payload.data
        if not sql_data:
            raise ValueError("SQL query is required")

        keywords = [
            "SELECT",
            "FROM",
            "WHERE",
            "AND",
            "OR",
            "JOIN",
            "LEFT",
            "RIGHT",
            "INNER",
            "OUTER",
            "ON",
            "GROUP BY",
            "ORDER BY",
            "HAVING",
            "LIMIT",
            "INSERT",
            "INTO",
            "VALUES",
            "UPDATE",
            "SET",
            "DELETE",
            "CREATE",
            "TABLE",
            "INDEX",
            "DROP",
            "ALTER",
            "AS",
            "DISTINCT",
            "UNION",
            "ALL",
        ]

        formatted = " ".join(sql_data.split())

        for kw in [
            "SELECT",
            "FROM",
            "WHERE",
            "JOIN",
            "LEFT JOIN",
            "RIGHT JOIN",
            "INNER JOIN",
            "GROUP BY",
            "ORDER BY",
            "HAVING",
            "LIMIT",
            "AND",
            "OR",
        ]:
            formatted = formatted.replace(f" {kw} ", f"\n{kw} ")
            formatted = formatted.replace(f" {kw.lower()} ", f"\n{kw} ")

        formatted = formatted.strip()

        return {"success": True, "formatted": formatted}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/sql/minify")
async def sql_minify(payload: SqlMinifyPayload):
    try:
        q = re.sub(r"/\*.*?\*/", "", payload.query, flags=re.S)
        q = re.sub(r"--.*", "", q)
        q = " ".join(q.split())
        return {"success": True, "minified": q.strip()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/fake/generate")
async def fake_data_generate(payload: FakeDataPayload):
    try:
        fake = Faker(payload.locale) if payload.locale else Faker()
        count = min(payload.count, 100)
        data_type = payload.data_type.lower()

        rows = []
        for _ in range(count):
            if data_type == "person":
                rows.append(
                    {
                        "name": fake.name(),
                        "email": fake.email(),
                        "phone": fake.phone_number(),
                        "address": fake.address().replace("\n", ", "),
                        "company": fake.company(),
                        "job": fake.job(),
                    }
                )
            elif data_type == "address":
                rows.append(
                    {
                        "street": fake.street_address(),
                        "city": fake.city(),
                        "state": fake.state(),
                        "zip": fake.zipcode(),
                        "country": fake.country(),
                    }
                )
            elif data_type == "company":
                rows.append(
                    {
                        "name": fake.company(),
                        "catch_phrase": fake.catch_phrase(),
                        "bs": fake.bs(),
                        "industry": fake.job(),
                    }
                )
            elif data_type == "email":
                rows.append({"email": fake.email()})
            elif data_type == "phone":
                rows.append({"phone": fake.phone_number()})
            elif data_type == "date":
                rows.append(
                    {
                        "date": fake.date(),
                        "datetime": fake.date_time().isoformat(),
                        "time": fake.time(),
                    }
                )
            elif data_type == "text":
                rows.append(
                    {
                        "sentence": fake.sentence(),
                        "paragraph": fake.paragraph(),
                        "text": fake.text(max_nb_chars=200),
                    }
                )
            else:
                rows.append(
                    {
                        "name": fake.name(),
                        "email": fake.email(),
                        "phone": fake.phone_number(),
                    }
                )

        return {"success": True, "data": rows, "rows": rows}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/fake-data")
async def fake_data(count: int = 10, locale: str | None = None):
    fake = Faker(locale) if locale else Faker()
    rows = []
    for _ in range(min(count, 1000)):
        rows.append(
            {
                "name": fake.name(),
                "email": fake.email(),
                "address": fake.address(),
                "company": fake.company(),
                "phone": fake.phone_number(),
            }
        )
    return {"success": True, "rows": rows, "data": rows}

@router.post("/base/convert")
async def convert_base_post(payload: BaseConvertPayload):
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
        return {"success": True, "value": out, "result": out}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

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
        return {"success": True, "value": out, "result": out}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/random/string")
async def random_string(payload: RandomStringPayload):
    charset = ""
    if payload.lowercase:
        charset += "abcdefghijklmnopqrstuvwxyz"
    if payload.uppercase:
        charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if payload.digits:
        charset += "0123456789"
    if payload.symbols:
        charset += "!@#$%^&*()-_=+[]{};:,.<>/?"
    if not charset:
        raise HTTPException(status_code=400, detail="At least one charset must be enabled")
    value = "".join(secrets.choice(charset) for _ in range(payload.length))
    return {"success": True, "value": value}
