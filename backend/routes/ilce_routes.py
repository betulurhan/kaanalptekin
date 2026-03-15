from fastapi import APIRouter, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import IlceVerisi, IlceVerisiCreate, IlceVerisiUpdate
from auth import verify_token
from datetime import datetime
from typing import List
import uuid

router = APIRouter(prefix="/ilce-verileri", tags=["İlçe Verileri"])

def get_db():
    from server import db
    return db

# Antalya İlçeleri (varsayılan liste)
ANTALYA_ILCELERI = [
    "Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike",
    "Gazipaşa", "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Kepez", "Konyaaltı",
    "Korkuteli", "Kumluca", "Manavgat", "Muratpaşa", "Serik"
]


@router.get("", response_model=List[IlceVerisi])
async def get_ilce_verileri(
    sadece_aktif: bool = False,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Tüm ilçe verilerini getir"""
    query = {"aktif": True} if sadece_aktif else {}
    veriler = await db.ilce_verileri.find(query).sort("ilce_adi", 1).to_list(100)
    return [IlceVerisi(**v) for v in veriler]


@router.get("/varsayilan-ilceler")
async def get_varsayilan_ilceler():
    """Antalya ilçelerinin listesini getir"""
    return {"ilceler": ANTALYA_ILCELERI}


@router.get("/{ilce_id}", response_model=IlceVerisi)
async def get_ilce_verisi(
    ilce_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Tek bir ilçe verisini getir"""
    veri = await db.ilce_verileri.find_one({"id": ilce_id})
    if not veri:
        raise HTTPException(status_code=404, detail="İlçe verisi bulunamadı")
    return IlceVerisi(**veri)


@router.post("", response_model=IlceVerisi)
async def create_ilce_verisi(
    veri: IlceVerisiCreate,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Yeni ilçe verisi oluştur (admin only)"""
    # Aynı ilçe var mı kontrol et
    existing = await db.ilce_verileri.find_one({"ilce_adi": veri.ilce_adi})
    if existing:
        raise HTTPException(status_code=400, detail="Bu ilçe zaten mevcut")
    
    ilce_data = {
        "id": str(uuid.uuid4()),
        **veri.dict(),
        "guncelleme_tarihi": datetime.utcnow()
    }
    await db.ilce_verileri.insert_one(ilce_data)
    return IlceVerisi(**ilce_data)


@router.put("/{ilce_id}", response_model=IlceVerisi)
async def update_ilce_verisi(
    ilce_id: str,
    veri: IlceVerisiUpdate,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """İlçe verisini güncelle (admin only)"""
    existing = await db.ilce_verileri.find_one({"id": ilce_id})
    if not existing:
        raise HTTPException(status_code=404, detail="İlçe verisi bulunamadı")
    
    update_data = {k: v for k, v in veri.dict().items() if v is not None}
    update_data["guncelleme_tarihi"] = datetime.utcnow()
    
    await db.ilce_verileri.update_one(
        {"id": ilce_id},
        {"$set": update_data}
    )
    
    updated = await db.ilce_verileri.find_one({"id": ilce_id})
    return IlceVerisi(**updated)


@router.delete("/{ilce_id}")
async def delete_ilce_verisi(
    ilce_id: str,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """İlçe verisini sil (admin only)"""
    result = await db.ilce_verileri.delete_one({"id": ilce_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="İlçe verisi bulunamadı")
    return {"message": "İlçe verisi silindi"}


@router.post("/toplu-ekle")
async def toplu_ilce_ekle(
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Tüm Antalya ilçelerini varsayılan değerlerle ekle (admin only)"""
    # Fetch all existing districts at once to avoid N+1 queries
    existing_docs = await db.ilce_verileri.find({}, {"ilce_adi": 1}).to_list(100)
    existing_ilceler = {doc["ilce_adi"] for doc in existing_docs}
    
    # Prepare batch insert
    new_ilceler = []
    for ilce in ANTALYA_ILCELERI:
        if ilce not in existing_ilceler:
            ilce_data = {
                "id": str(uuid.uuid4()),
                "ilce_adi": ilce,
                "ortalama_m2_fiyati": 0,
                "ortalama_kira_m2": 0,
                "aciklama": "",
                "aktif": True,
                "guncelleme_tarihi": datetime.utcnow()
            }
            new_ilceler.append(ilce_data)
    
    if new_ilceler:
        await db.ilce_verileri.insert_many(new_ilceler)
    
    return {"message": f"{len(new_ilceler)} ilçe eklendi", "toplam_ilce": len(ANTALYA_ILCELERI)}
