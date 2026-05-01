"""Tests for NEW endpoints: FAQ CRUD and ContactInfo social fields (youtube, whatsapp)."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://antalya-real-estate-1.preview.emergentagent.com').rstrip('/')


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def token(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"username": "admin", "password": "admin123"}, timeout=15)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="module")
def auth(api, token):
    api.headers.update({"Authorization": f"Bearer {token}"})
    return api


# -------- FAQs --------
class TestFAQ:
    def test_list_faqs_public_seeded(self, api):
        r = api.get(f"{BASE_URL}/api/faqs", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 3
        # Validate fields
        first = data[0]
        for k in ("id", "question", "answer", "color", "sort_order", "is_active"):
            assert k in first
        # default order
        questions = [f["question"] for f in data]
        assert any("Danışmanlık" in q for q in questions)

    def test_create_faq_requires_auth(self, api):
        # Strip auth if any
        s = requests.Session()
        r = s.post(f"{BASE_URL}/api/faqs", json={"question": "x", "answer": "y"}, timeout=15)
        assert r.status_code in (401, 403)

    def test_create_update_delete_faq(self, auth):
        payload = {
            "question": "TEST_Q_autotest",
            "answer": "TEST_A_autotest",
            "color": "amber",
            "sort_order": 99,
            "is_active": True,
        }
        r = auth.post(f"{BASE_URL}/api/faqs", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        created = r.json()
        faq_id = created["id"]
        assert created["question"] == payload["question"]

        # GET - verify persisted
        r = auth.get(f"{BASE_URL}/api/faqs", timeout=15)
        assert any(f["id"] == faq_id for f in r.json())

        # UPDATE
        r = auth.put(f"{BASE_URL}/api/faqs/{faq_id}", json={"answer": "TEST_A_updated"}, timeout=15)
        assert r.status_code == 200, r.text
        assert r.json()["answer"] == "TEST_A_updated"

        # DELETE
        r = auth.delete(f"{BASE_URL}/api/faqs/{faq_id}", timeout=15)
        assert r.status_code == 200

        # DELETE again -> 404
        r = auth.delete(f"{BASE_URL}/api/faqs/{faq_id}", timeout=15)
        assert r.status_code == 404

    def test_update_nonexistent_faq(self, auth):
        r = auth.put(f"{BASE_URL}/api/faqs/nonexistent-id-xyz", json={"answer": "z"}, timeout=15)
        assert r.status_code == 404


# -------- Contact youtube/whatsapp fields --------
class TestContactSocial:
    def test_get_contact(self, api):
        r = api.get(f"{BASE_URL}/api/content/contact", timeout=15)
        assert r.status_code == 200
        # Accept missing keys too (defaults added); fields must be acceptable
        data = r.json()
        # Keys should at least be present or be settable below
        assert isinstance(data, dict)

    def test_update_contact_youtube_whatsapp(self, auth):
        # fetch current
        cur = auth.get(f"{BASE_URL}/api/content/contact", timeout=15).json()
        payload = {
            **{k: v for k, v in cur.items() if k not in ("_id",)},
            "youtube": "https://youtube.com/@testchannel",
            "whatsapp": "https://wa.me/905551112233",
        }
        r = auth.put(f"{BASE_URL}/api/content/contact", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body.get("youtube") == "https://youtube.com/@testchannel"
        assert body.get("whatsapp") == "https://wa.me/905551112233"

        # Persist verify
        r2 = auth.get(f"{BASE_URL}/api/content/contact", timeout=15)
        assert r2.json().get("youtube") == "https://youtube.com/@testchannel"
        assert r2.json().get("whatsapp") == "https://wa.me/905551112233"

    def test_update_contact_null_social_fields(self, auth):
        cur = auth.get(f"{BASE_URL}/api/content/contact", timeout=15).json()
        payload = {
            **{k: v for k, v in cur.items() if k not in ("_id",)},
            "youtube": None,
            "whatsapp": None,
        }
        r = auth.put(f"{BASE_URL}/api/content/contact", json=payload, timeout=15)
        assert r.status_code == 200


# -------- Init endpoint regression --------
class TestInitEndpoint:
    def test_init(self, api):
        r = api.get(f"{BASE_URL}/api/content/init", timeout=20)
        assert r.status_code == 200
        data = r.json()
        for k in ("siteSettings", "contact", "carousel", "projects", "blogPosts"):
            assert k in data


# -------- Auth guard on FAQ mutation --------
class TestFAQAuthGuard:
    def test_put_no_token(self):
        r = requests.put(f"{BASE_URL}/api/faqs/abc", json={"answer": "x"}, timeout=15)
        assert r.status_code in (401, 403)

    def test_delete_no_token(self):
        r = requests.delete(f"{BASE_URL}/api/faqs/abc", timeout=15)
        assert r.status_code in (401, 403)
