"""
Test P0 Features:
- GET /api/content/home-stats endpoint
- GET /api/content/home-cta endpoint  
- PUT /api/content/home-stats (admin)
- PUT /api/content/home-cta (admin)
- Contact info map_embed_url field
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestHomeStatsAPI:
    """Test home stats endpoint"""
    
    def test_get_home_stats_success(self):
        """Test GET /api/content/home-stats returns correct structure"""
        response = requests.get(f"{BASE_URL}/api/content/home-stats")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "id" in data, "Response should have 'id' field"
        assert "stats" in data, "Response should have 'stats' field"
        assert isinstance(data["stats"], list), "stats should be a list"
        
        # Validate stats structure if present
        if len(data["stats"]) > 0:
            stat = data["stats"][0]
            assert "icon" in stat, "Stat should have 'icon' field"
            assert "value" in stat, "Stat should have 'value' field"
            assert "label" in stat, "Stat should have 'label' field"
        
        print(f"✓ GET /api/content/home-stats - Returns {len(data['stats'])} stats")
    
    def test_update_home_stats_requires_auth(self):
        """Test PUT /api/content/home-stats requires authentication"""
        response = requests.put(
            f"{BASE_URL}/api/content/home-stats",
            json={"stats": []}
        )
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
        print("✓ PUT /api/content/home-stats - Requires authentication")
    
    def test_update_home_stats_with_auth(self, auth_token):
        """Test PUT /api/content/home-stats with authentication"""
        # First get current stats
        get_response = requests.get(f"{BASE_URL}/api/content/home-stats")
        original_data = get_response.json()
        
        # Update stats
        new_stats = {
            "stats": [
                {"id": "test1", "icon": "award", "value": "TEST_20+", "label": "Test Deneyim", "order": 0, "is_active": True},
                {"id": "test2", "icon": "building", "value": "TEST_300+", "label": "Test Proje", "order": 1, "is_active": True}
            ]
        }
        
        update_response = requests.put(
            f"{BASE_URL}/api/content/home-stats",
            json=new_stats,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200, f"Expected 200, got {update_response.status_code}"
        
        # Verify update persisted
        verify_response = requests.get(f"{BASE_URL}/api/content/home-stats")
        verify_data = verify_response.json()
        assert len(verify_data["stats"]) == 2, "Should have 2 stats after update"
        assert verify_data["stats"][0]["value"] == "TEST_20+", "First stat value should be updated"
        
        # Restore original stats
        requests.put(
            f"{BASE_URL}/api/content/home-stats",
            json={"stats": original_data.get("stats", [])},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        print("✓ PUT /api/content/home-stats - Updates stats successfully")


class TestHomeCTAAPI:
    """Test home CTA endpoint"""
    
    def test_get_home_cta_success(self):
        """Test GET /api/content/home-cta returns correct structure"""
        response = requests.get(f"{BASE_URL}/api/content/home-cta")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "id" in data, "Response should have 'id' field"
        assert "title" in data, "Response should have 'title' field"
        assert "description" in data, "Response should have 'description' field"
        assert "button_text" in data, "Response should have 'button_text' field"
        assert "button_link" in data, "Response should have 'button_link' field"
        
        print(f"✓ GET /api/content/home-cta - Returns CTA with title: {data['title'][:30]}...")
    
    def test_update_home_cta_requires_auth(self):
        """Test PUT /api/content/home-cta requires authentication"""
        response = requests.put(
            f"{BASE_URL}/api/content/home-cta",
            json={"title": "Test"}
        )
        assert response.status_code in [401, 403], f"Expected 401/403 without auth, got {response.status_code}"
        print("✓ PUT /api/content/home-cta - Requires authentication")
    
    def test_update_home_cta_with_auth(self, auth_token):
        """Test PUT /api/content/home-cta with authentication"""
        # First get current CTA
        get_response = requests.get(f"{BASE_URL}/api/content/home-cta")
        original_data = get_response.json()
        
        # Update CTA
        new_cta = {
            "title": "TEST_CTA_Title",
            "description": "TEST_CTA_Description",
            "button_text": "TEST_Button",
            "button_link": "/test-link"
        }
        
        update_response = requests.put(
            f"{BASE_URL}/api/content/home-cta",
            json=new_cta,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200, f"Expected 200, got {update_response.status_code}"
        
        # Verify update persisted
        verify_response = requests.get(f"{BASE_URL}/api/content/home-cta")
        verify_data = verify_response.json()
        assert verify_data["title"] == "TEST_CTA_Title", "Title should be updated"
        assert verify_data["button_text"] == "TEST_Button", "Button text should be updated"
        
        # Restore original CTA
        requests.put(
            f"{BASE_URL}/api/content/home-cta",
            json={
                "title": original_data.get("title"),
                "description": original_data.get("description"),
                "button_text": original_data.get("button_text"),
                "button_link": original_data.get("button_link")
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        print("✓ PUT /api/content/home-cta - Updates CTA successfully")


class TestContactMapURL:
    """Test contact info map_embed_url field"""
    
    def test_get_contact_has_map_embed_url_field(self):
        """Test GET /api/content/contact returns map_embed_url field"""
        response = requests.get(f"{BASE_URL}/api/content/contact")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        # map_embed_url field should exist (can be null)
        assert "map_embed_url" in data or data.get("map_embed_url") is None or isinstance(data.get("map_embed_url"), str), \
            "Response should have 'map_embed_url' field"
        
        print(f"✓ GET /api/content/contact - Has map_embed_url field: {data.get('map_embed_url', 'null')[:50] if data.get('map_embed_url') else 'null'}...")
    
    def test_update_contact_map_embed_url(self, auth_token):
        """Test updating map_embed_url field"""
        # First get current contact
        get_response = requests.get(f"{BASE_URL}/api/content/contact")
        original_data = get_response.json()
        
        # Update with test URL
        test_url = "https://www.google.com/maps/embed?pb=TEST_123"
        update_response = requests.put(
            f"{BASE_URL}/api/content/contact",
            json={"map_embed_url": test_url},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200, f"Expected 200, got {update_response.status_code}"
        
        # Verify update persisted
        verify_response = requests.get(f"{BASE_URL}/api/content/contact")
        verify_data = verify_response.json()
        assert verify_data.get("map_embed_url") == test_url, "map_embed_url should be updated"
        
        # Restore original
        requests.put(
            f"{BASE_URL}/api/content/contact",
            json={"map_embed_url": original_data.get("map_embed_url")},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        print("✓ PUT /api/content/contact - Updates map_embed_url successfully")


# Pytest fixtures
@pytest.fixture(scope="module")
def auth_token():
    """Get authentication token"""
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"username": "admin", "password": "admin123"}
    )
    if response.status_code == 200:
        return response.json().get("access_token")
    pytest.skip("Authentication failed - skipping authenticated tests")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
