from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
from models import FAQ, FAQCreate, FAQUpdate
from auth import verify_token


def _db():
    from server import db
    return db


router = APIRouter(prefix="/faqs", tags=["FAQs"])


# Default FAQs (used as one-time seed if collection is empty)
DEFAULT_FAQS = [
    {
        "question": "Danışmanlık ücreti alıyor musunuz?",
        "answer": "İlk görüşme ve danışmanlık hizmetimiz tamamen ücretsizdir. Satış işlemi gerçekleştiğinde komisyon alınır.",
        "color": "amber",
        "sort_order": 1,
        "is_active": True,
    },
    {
        "question": "Hangi bölgelerde hizmet veriyorsunuz?",
        "answer": "Başta Antalya'nın tüm ilçeleri olmak üzere Türkiye'nin büyük şehirlerinde aktif olarak hizmet vermekteyiz.",
        "color": "blue",
        "sort_order": 2,
        "is_active": True,
    },
    {
        "question": "Yatırım danışmanlığı yapıyor musunuz?",
        "answer": "Evet, gayrimenkul yatırımı yapmak isteyenlere piyasa analizi ve karlı yatırım önerileri sunuyoruz.",
        "color": "green",
        "sort_order": 3,
        "is_active": True,
    },
]


@router.get("", response_model=List[FAQ])
async def list_faqs(active_only: bool = True):
    db = _db()
    # Seed defaults once
    count = await db.faqs.count_documents({})
    if count == 0:
        for item in DEFAULT_FAQS:
            faq = FAQ(**item)
            await db.faqs.insert_one(faq.dict())

    query = {"is_active": True} if active_only else {}
    cursor = db.faqs.find(query, {"_id": 0}).sort("sort_order", 1)
    return await cursor.to_list(length=None)


@router.post("", response_model=FAQ)
async def create_faq(payload: FAQCreate, current_user: dict = Depends(verify_token)):
    faq = FAQ(**payload.dict())
    await _db().faqs.insert_one(faq.dict())
    return faq


@router.put("/{faq_id}", response_model=FAQ)
async def update_faq(faq_id: str, payload: FAQUpdate, current_user: dict = Depends(verify_token)):
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    result = await _db().faqs.update_one({"id": faq_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    doc = await _db().faqs.find_one({"id": faq_id}, {"_id": 0})
    return doc


@router.delete("/{faq_id}")
async def delete_faq(faq_id: str, current_user: dict = Depends(verify_token)):
    result = await _db().faqs.delete_one({"id": faq_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"message": "FAQ deleted"}
