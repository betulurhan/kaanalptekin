"""
Backend tests for 5 new features:
- Resale Listings (CRUD + auth enforcement)
- Talep Forms (public POST + admin GET/PUT/DELETE)
- Ekspertiz Forms (public POST + admin GET/PUT/DELETE)
- Market Trends (public GET + admin PUT)
- Auth enforcement on protected endpoints
- Regression on existing endpoints
"""
import os
import pytest
import requests
import uuid

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://antalya-real-estate-1.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_USER = "admin"
ADMIN_PASS = "admin123"


# ----------------- Fixtures -----------------
@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    data = r.json()
    assert "access_token" in data
    return data["access_token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ----------------- Health / Regression -----------------
class TestHealthAndRegression:
    def test_health(self, session):
        r = session.get(f"{API}/health")
        assert r.status_code == 200
        assert r.json().get("status") == "healthy"

    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200

    def test_projects_list(self, session):
        r = session.get(f"{API}/projects")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_blog_list(self, session):
        r = session.get(f"{API}/blog")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_content_init(self, session):
        r = session.get(f"{API}/content/init")
        assert r.status_code == 200
        d = r.json()
        for k in ["siteSettings", "contact", "carousel", "projects"]:
            assert k in d

    def test_carousel(self, session):
        r = session.get(f"{API}/carousel")
        assert r.status_code == 200

    def test_ilce_verileri(self, session):
        r = session.get(f"{API}/ilce-verileri")
        assert r.status_code == 200


# ----------------- Resale Listings -----------------
class TestResaleListings:
    created_ids = []

    def test_get_list_public(self, session):
        r = session.get(f"{API}/resale")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_get_404(self, session):
        r = session.get(f"{API}/resale/nonexistent-id-xyz")
        assert r.status_code == 404

    def test_create_unauth(self, session):
        payload = {
            "title": "TEST_ Should Fail",
            "property_type": "Daire",
            "listing_type": "sale",
            "location": "Antalya",
            "district": "Konyaaltı",
            "price": "1000000",
        }
        r = session.post(f"{API}/resale", json=payload)
        assert r.status_code in (401, 403), f"Expected 401/403, got {r.status_code}"

    def test_create_invalid_token(self, session):
        payload = {
            "title": "TEST_ Bad Token",
            "property_type": "Daire",
            "listing_type": "sale",
            "location": "Antalya",
            "district": "Konyaaltı",
            "price": "1000000",
        }
        r = session.post(f"{API}/resale", json=payload, headers={"Authorization": "Bearer invalidtoken123"})
        assert r.status_code == 401

    def test_create_full(self, session, auth_headers):
        payload = {
            "title": "TEST_ Resale Daire Konyaaltı",
            "property_type": "Daire",
            "listing_type": "sale",
            "location": "Antalya",
            "district": "Konyaaltı",
            "address": "Liman Mah.",
            "price": "5500000",
            "area_m2": 120,
            "rooms": "3+1",
            "bathrooms": 2,
            "floor": "5",
            "building_age": "3",
            "has_elevator": True,
            "parking": "var",
            "heating": "kombi",
            "features": ["deniz manzarası", "balkon"],
            "description": "Test description",
            "image": "https://example.com/img.jpg",
            "images": ["https://example.com/img1.jpg"],
            "is_active": True,
        }
        r = session.post(f"{API}/resale", json=payload, headers=auth_headers)
        assert r.status_code == 200, f"{r.status_code}: {r.text}"
        d = r.json()
        assert "id" in d
        assert d["title"] == payload["title"]
        assert d["property_type"] == "Daire"
        assert d["area_m2"] == 120
        assert d["has_elevator"] is True
        assert d["features"] == ["deniz manzarası", "balkon"]
        TestResaleListings.created_ids.append(d["id"])

    def test_get_by_id(self, session):
        assert TestResaleListings.created_ids, "create test did not populate id"
        lid = TestResaleListings.created_ids[0]
        r = session.get(f"{API}/resale/{lid}")
        assert r.status_code == 200
        d = r.json()
        assert d["id"] == lid
        assert d["title"].startswith("TEST_")

    def test_list_includes_created(self, session):
        lid = TestResaleListings.created_ids[0]
        r = session.get(f"{API}/resale")
        assert r.status_code == 200
        ids = [x["id"] for x in r.json()]
        assert lid in ids

    def test_filters(self, session):
        r = session.get(f"{API}/resale", params={"type_filter": "Daire", "listing_type": "sale"})
        assert r.status_code == 200
        for item in r.json():
            assert item["property_type"] == "Daire"
            assert item["listing_type"] == "sale"

    def test_update_unauth(self, session):
        lid = TestResaleListings.created_ids[0]
        r = session.put(f"{API}/resale/{lid}", json={"title": "X"})
        assert r.status_code in (401, 403)

    def test_update_success(self, session, auth_headers):
        lid = TestResaleListings.created_ids[0]
        r = session.put(f"{API}/resale/{lid}", json={"price": "6000000", "is_active": False}, headers=auth_headers)
        assert r.status_code == 200, r.text
        # Verify persistence
        r2 = session.get(f"{API}/resale/{lid}")
        assert r2.status_code == 200
        d = r2.json()
        assert d["price"] == "6000000"
        assert d["is_active"] is False

    def test_update_404(self, session, auth_headers):
        r = session.put(f"{API}/resale/no-such-id", json={"title": "X"}, headers=auth_headers)
        assert r.status_code == 404

    def test_active_only_filter_excludes_inactive(self, session):
        # we set is_active=False above, so default (active_only=True) should not include it
        lid = TestResaleListings.created_ids[0]
        r = session.get(f"{API}/resale")
        assert r.status_code == 200
        ids = [x["id"] for x in r.json()]
        assert lid not in ids
        # but with active_only=false
        r2 = session.get(f"{API}/resale", params={"active_only": "false"})
        assert r2.status_code == 200
        ids2 = [x["id"] for x in r2.json()]
        assert lid in ids2

    def test_delete_unauth(self, session):
        lid = TestResaleListings.created_ids[0]
        r = session.delete(f"{API}/resale/{lid}")
        assert r.status_code in (401, 403)

    def test_delete_success(self, session, auth_headers):
        lid = TestResaleListings.created_ids[0]
        r = session.delete(f"{API}/resale/{lid}", headers=auth_headers)
        assert r.status_code == 200
        # confirm gone
        r2 = session.get(f"{API}/resale/{lid}")
        assert r2.status_code == 404
        TestResaleListings.created_ids.remove(lid)

    def test_delete_404(self, session, auth_headers):
        r = session.delete(f"{API}/resale/never-existed", headers=auth_headers)
        assert r.status_code == 404


# ----------------- Talep Forms -----------------
class TestTalepForms:
    created_ids = []

    def test_submit_public(self, session):
        payload = {
            "name": "TEST_ Ahmet Yılmaz",
            "phone": "+905551234567",
            "email": "test@example.com",
            "property_type": "Daire",
            "location": "Konyaaltı",
            "budget": "5000000",
            "message": "Test talep",
        }
        r = session.post(f"{API}/forms/talep", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "id" in d
        assert d["status"] == "pending"
        assert d["name"] == payload["name"]
        TestTalepForms.created_ids.append(d["id"])

    def test_submit_minimal(self, session):
        payload = {"name": "TEST_ Min", "phone": "5551112222", "property_type": "Villa"}
        r = session.post(f"{API}/forms/talep", json=payload)
        assert r.status_code == 200
        TestTalepForms.created_ids.append(r.json()["id"])

    def test_submit_invalid(self, session):
        # Missing required name
        r = session.post(f"{API}/forms/talep", json={"phone": "x", "property_type": "Daire"})
        assert r.status_code == 422

    def test_list_unauth(self, session):
        r = session.get(f"{API}/forms/talep")
        assert r.status_code in (401, 403)

    def test_list_admin(self, session, auth_headers):
        r = session.get(f"{API}/forms/talep", headers=auth_headers)
        assert r.status_code == 200
        forms = r.json()
        assert isinstance(forms, list)
        ids = [f["id"] for f in forms]
        for cid in TestTalepForms.created_ids:
            assert cid in ids

    def test_update_status_unauth(self, session):
        fid = TestTalepForms.created_ids[0]
        r = session.put(f"{API}/forms/talep/{fid}/status", json={"status": "contacted"})
        assert r.status_code in (401, 403)

    def test_update_status_admin(self, session, auth_headers):
        fid = TestTalepForms.created_ids[0]
        r = session.put(f"{API}/forms/talep/{fid}/status", json={"status": "contacted"}, headers=auth_headers)
        assert r.status_code == 200
        # verify persistence
        r2 = session.get(f"{API}/forms/talep", headers=auth_headers)
        item = next((x for x in r2.json() if x["id"] == fid), None)
        assert item is not None
        assert item["status"] == "contacted"

    def test_update_status_404(self, session, auth_headers):
        r = session.put(f"{API}/forms/talep/missing-id/status", json={"status": "contacted"}, headers=auth_headers)
        assert r.status_code == 404

    def test_delete_unauth(self, session):
        fid = TestTalepForms.created_ids[0]
        r = session.delete(f"{API}/forms/talep/{fid}")
        assert r.status_code in (401, 403)

    def test_delete_admin(self, session, auth_headers):
        for fid in list(TestTalepForms.created_ids):
            r = session.delete(f"{API}/forms/talep/{fid}", headers=auth_headers)
            assert r.status_code == 200
            TestTalepForms.created_ids.remove(fid)

    def test_delete_404(self, session, auth_headers):
        r = session.delete(f"{API}/forms/talep/missing-id-xyz", headers=auth_headers)
        assert r.status_code == 404


# ----------------- Ekspertiz Forms -----------------
class TestEkspertizForms:
    created_ids = []

    def test_submit_public(self, session):
        payload = {
            "name": "TEST_ Mehmet K",
            "phone": "+905551112233",
            "email": "ek@test.com",
            "property_type": "Daire",
            "district": "Muratpaşa",
            "address": "Test Cad. No:1",
            "area_m2": "150",
            "rooms": "3+1",
            "building_age": "5",
            "floor": "3",
            "has_elevator": True,
            "parking": "var",
            "notes": "test ekspertiz",
        }
        r = session.post(f"{API}/forms/ekspertiz", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "id" in d
        assert d["status"] == "pending"
        TestEkspertizForms.created_ids.append(d["id"])

    def test_submit_invalid(self, session):
        r = session.post(f"{API}/forms/ekspertiz", json={"name": "x"})
        assert r.status_code == 422

    def test_list_unauth(self, session):
        r = session.get(f"{API}/forms/ekspertiz")
        assert r.status_code in (401, 403)

    def test_list_admin(self, session, auth_headers):
        r = session.get(f"{API}/forms/ekspertiz", headers=auth_headers)
        assert r.status_code == 200
        ids = [f["id"] for f in r.json()]
        for cid in TestEkspertizForms.created_ids:
            assert cid in ids

    def test_update_status_admin(self, session, auth_headers):
        fid = TestEkspertizForms.created_ids[0]
        r = session.put(f"{API}/forms/ekspertiz/{fid}/status", json={"status": "in_progress"}, headers=auth_headers)
        assert r.status_code == 200
        r2 = session.get(f"{API}/forms/ekspertiz", headers=auth_headers)
        item = next((x for x in r2.json() if x["id"] == fid), None)
        assert item and item["status"] == "in_progress"

    def test_update_status_unauth(self, session):
        fid = TestEkspertizForms.created_ids[0]
        r = session.put(f"{API}/forms/ekspertiz/{fid}/status", json={"status": "completed"})
        assert r.status_code in (401, 403)

    def test_delete_admin(self, session, auth_headers):
        for fid in list(TestEkspertizForms.created_ids):
            r = session.delete(f"{API}/forms/ekspertiz/{fid}", headers=auth_headers)
            assert r.status_code == 200
            TestEkspertizForms.created_ids.remove(fid)


# ----------------- Market Trends -----------------
class TestMarketTrends:
    original_data = None

    def test_get_public(self, session):
        r = session.get(f"{API}/market-trends")
        assert r.status_code == 200
        d = r.json()
        assert isinstance(d, dict)
        # Should contain default regions or persisted
        assert len(d) > 0
        # snapshot for restore
        TestMarketTrends.original_data = d

    def test_update_unauth(self, session):
        r = session.put(f"{API}/market-trends", json={"data": {"konyaalti": []}})
        assert r.status_code in (401, 403)

    def test_update_admin(self, session, auth_headers):
        new_data = {
            "data": {
                "konyaalti": [
                    {"year": "2020", "value": 100, "change": 0.0},
                    {"year": "2021", "value": 200, "change": 100.0},
                ],
                "muratpasa": [
                    {"year": "2020", "value": 500, "change": 0.5},
                ],
            }
        }
        r = session.put(f"{API}/market-trends", json=new_data, headers=auth_headers)
        assert r.status_code == 200, r.text
        # verify persistence
        r2 = session.get(f"{API}/market-trends")
        assert r2.status_code == 200
        d = r2.json()
        assert "konyaalti" in d
        assert d["konyaalti"][0]["year"] == "2020"
        assert d["konyaalti"][0]["value"] == 100
        assert d["konyaalti"][1]["change"] == 100.0
        assert d["muratpasa"][0]["value"] == 500

    def test_update_invalid_payload(self, session, auth_headers):
        # Missing required 'data' key
        r = session.put(f"{API}/market-trends", json={"foo": "bar"}, headers=auth_headers)
        assert r.status_code == 422

    def test_restore_data(self, session, auth_headers):
        # Restore original data so we don't break the live site
        if TestMarketTrends.original_data:
            payload = {"data": TestMarketTrends.original_data}
            r = session.put(f"{API}/market-trends", json=payload, headers=auth_headers)
            assert r.status_code == 200
