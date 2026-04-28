from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict
from pydantic import BaseModel
from datetime import datetime
import uuid
from auth import verify_token


def _db():
    from server import db
    return db


router = APIRouter(prefix="/forms", tags=["Forms"])

# Talep Form Models
class TalepFormBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    property_type: str
    location: Optional[str] = None
    budget: Optional[str] = None
    message: Optional[str] = None

class TalepForm(TalepFormBase):
    id: str
    status: str = "pending"  # pending, contacted, completed
    created_at: datetime
    updated_at: datetime
    notes: Optional[str] = None

# Ekspertiz Form Models
class EkspertizFormBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    property_type: str
    district: str
    address: str
    area_m2: Optional[str] = None
    rooms: Optional[str] = None
    building_age: Optional[str] = None
    floor: Optional[str] = None
    has_elevator: Optional[bool] = False
    parking: Optional[str] = None
    notes: Optional[str] = None

class EkspertizForm(EkspertizFormBase):
    id: str
    status: str = "pending"  # pending, in_progress, completed
    created_at: datetime
    updated_at: datetime
    admin_notes: Optional[str] = None
    report_url: Optional[str] = None

# Talep Endpoints
@router.post("/talep", response_model=TalepForm)
async def submit_talep(form: TalepFormBase):
    form_dict = form.dict()
    form_dict["id"] = str(uuid.uuid4())
    form_dict["status"] = "pending"
    form_dict["created_at"] = datetime.utcnow()
    form_dict["updated_at"] = datetime.utcnow()
    form_dict["notes"] = None
    
    await _db().talep_forms.insert_one(form_dict)
    return {k: v for k, v in form_dict.items() if k != "_id"}

@router.get("/talep", response_model=List[TalepForm])
async def get_talep_list(current_user: dict = Depends(verify_token)):
    forms = await _db().talep_forms.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return forms

@router.put("/talep/{form_id}/status")
async def update_talep_status(form_id: str, status: Dict, current_user: dict = Depends(verify_token)):
    result = await _db().talep_forms.update_one(
        {"id": form_id},
        {"$set": {"status": status.get("status"), "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Form not found")
    return {"message": "Status updated"}

@router.delete("/talep/{form_id}")
async def delete_talep(form_id: str, current_user: dict = Depends(verify_token)):
    result = await _db().talep_forms.delete_one({"id": form_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Form not found")
    return {"message": "Form deleted"}

# Ekspertiz Endpoints
@router.post("/ekspertiz", response_model=EkspertizForm)
async def submit_ekspertiz(form: EkspertizFormBase):
    form_dict = form.dict()
    form_dict["id"] = str(uuid.uuid4())
    form_dict["status"] = "pending"
    form_dict["created_at"] = datetime.utcnow()
    form_dict["updated_at"] = datetime.utcnow()
    form_dict["admin_notes"] = None
    form_dict["report_url"] = None
    
    await _db().ekspertiz_forms.insert_one(form_dict)
    return {k: v for k, v in form_dict.items() if k != "_id"}

@router.get("/ekspertiz", response_model=List[EkspertizForm])
async def get_ekspertiz_list(current_user: dict = Depends(verify_token)):
    forms = await _db().ekspertiz_forms.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return forms

@router.put("/ekspertiz/{form_id}/status")
async def update_ekspertiz_status(form_id: str, status: Dict, current_user: dict = Depends(verify_token)):
    result = await _db().ekspertiz_forms.update_one(
        {"id": form_id},
        {"$set": {"status": status.get("status"), "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Form not found")
    return {"message": "Status updated"}

@router.delete("/ekspertiz/{form_id}")
async def delete_ekspertiz(form_id: str, current_user: dict = Depends(verify_token)):
    result = await _db().ekspertiz_forms.delete_one({"id": form_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Form not found")
    return {"message": "Form deleted"}
