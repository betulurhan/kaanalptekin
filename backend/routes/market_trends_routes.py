from fastapi import APIRouter, Depends
from typing import Dict, List, Optional
from pydantic import BaseModel
from datetime import datetime
from auth import verify_token


def _db():
    from server import db
    return db


router = APIRouter(prefix="/market-trends", tags=["Market Trends"])

class RegionData(BaseModel):
    year: str
    value: int
    change: float

class MarketTrendsUpdate(BaseModel):
    data: Dict[str, List[RegionData]]

# Default Antalya market data
DEFAULT_TRENDS = {
    "konyaalti": [
        {"year": "2020", "value": 450000, "change": 0},
        {"year": "2021", "value": 580000, "change": 28.9},
        {"year": "2022", "value": 920000, "change": 58.6},
        {"year": "2023", "value": 1450000, "change": 57.6},
        {"year": "2024", "value": 2100000, "change": 44.8},
        {"year": "2025", "value": 2850000, "change": 35.7}
    ],
    "muratpasa": [
        {"year": "2020", "value": 520000, "change": 0},
        {"year": "2021", "value": 650000, "change": 25.0},
        {"year": "2022", "value": 1050000, "change": 61.5},
        {"year": "2023", "value": 1680000, "change": 60.0},
        {"year": "2024", "value": 2400000, "change": 42.9},
        {"year": "2025", "value": 3200000, "change": 33.3}
    ],
    "kepez": [
        {"year": "2020", "value": 280000, "change": 0},
        {"year": "2021", "value": 350000, "change": 25.0},
        {"year": "2022", "value": 550000, "change": 57.1},
        {"year": "2023", "value": 850000, "change": 54.5},
        {"year": "2024", "value": 1200000, "change": 41.2},
        {"year": "2025", "value": 1650000, "change": 37.5}
    ],
    "aksu": [
        {"year": "2020", "value": 320000, "change": 0},
        {"year": "2021", "value": 420000, "change": 31.3},
        {"year": "2022", "value": 680000, "change": 61.9},
        {"year": "2023", "value": 1100000, "change": 61.8},
        {"year": "2024", "value": 1550000, "change": 40.9},
        {"year": "2025", "value": 2100000, "change": 35.5}
    ],
    "dosemealti": [
        {"year": "2020", "value": 380000, "change": 0},
        {"year": "2021", "value": 480000, "change": 26.3},
        {"year": "2022", "value": 750000, "change": 56.3},
        {"year": "2023", "value": 1180000, "change": 57.3},
        {"year": "2024", "value": 1700000, "change": 44.1},
        {"year": "2025", "value": 2350000, "change": 38.2}
    ],
    "altintas": [
        {"year": "2020", "value": 350000, "change": 0},
        {"year": "2021", "value": 450000, "change": 28.6},
        {"year": "2022", "value": 720000, "change": 60.0},
        {"year": "2023", "value": 1150000, "change": 59.7},
        {"year": "2024", "value": 1680000, "change": 46.1},
        {"year": "2025", "value": 2300000, "change": 36.9}
    ]
}

@router.get("")
async def get_market_trends():
    trends = await _db().market_trends.find_one({"id": "market-trends"}, {"_id": 0})
    if trends and "data" in trends:
        return trends["data"]
    return DEFAULT_TRENDS

@router.put("")
async def update_market_trends(trends: MarketTrendsUpdate, current_user: dict = Depends(verify_token)):
    # Convert pydantic models to dicts for BSON storage
    serializable_data = {
        region_id: [item.dict() if hasattr(item, 'dict') else item for item in items]
        for region_id, items in trends.data.items()
    }
    await _db().market_trends.update_one(
        {"id": "market-trends"},
        {"$set": {"id": "market-trends", "data": serializable_data, "updated_at": datetime.utcnow()}},
        upsert=True
    )
    return {"message": "Market trends updated"}
