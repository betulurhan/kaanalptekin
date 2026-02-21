"""
Test Logo Management API - Site Settings Endpoints
Tests for GET /api/content/site-settings and PUT /api/content/site-settings
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestSiteSettingsAPI:
    """Site Settings (Logo Management) endpoint tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures"""
        self.api_url = f"{BASE_URL}/api/content/site-settings"
        self.login_url = f"{BASE_URL}/api/auth/login"
        
    def get_auth_token(self):
        """Get authentication token"""
        response = requests.post(self.login_url, json={
            "username": "admin",
            "password": "admin123"
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        return response.json()["access_token"]
    
    def test_get_site_settings_public(self):
        """Test GET /api/content/site-settings - Public endpoint"""
        response = requests.get(self.api_url)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "id" in data
        assert "site_name" in data
        assert "navbar_logo" in data
        assert "footer_logo" in data
        assert "updated_at" in data
        
        print(f"✓ GET site-settings returned: site_name={data['site_name']}")
    
    def test_update_site_settings_requires_auth(self):
        """Test PUT /api/content/site-settings - Requires authentication"""
        response = requests.put(self.api_url, json={
            "site_name": "Test Site"
        })
        
        assert response.status_code == 401, "Should require authentication"
        print("✓ PUT site-settings requires authentication")
    
    def test_update_site_name(self):
        """Test updating site name"""
        token = self.get_auth_token()
        
        # Update site name
        response = requests.put(
            self.api_url,
            json={"site_name": "TEST_Özpınarlar İnşaat"},
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["site_name"] == "TEST_Özpınarlar İnşaat"
        
        # Verify with GET
        get_response = requests.get(self.api_url)
        assert get_response.status_code == 200
        assert get_response.json()["site_name"] == "TEST_Özpınarlar İnşaat"
        
        print("✓ Site name updated and verified")
        
        # Reset
        requests.put(
            self.api_url,
            json={"site_name": "GayrimenkulRehberi"},
            headers={"Authorization": f"Bearer {token}"}
        )
    
    def test_update_navbar_logo(self):
        """Test updating navbar logo URL"""
        token = self.get_auth_token()
        
        test_logo_url = "https://example.com/test-navbar-logo.png"
        
        # Update navbar logo
        response = requests.put(
            self.api_url,
            json={"navbar_logo": test_logo_url},
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["navbar_logo"] == test_logo_url
        
        # Verify with GET
        get_response = requests.get(self.api_url)
        assert get_response.status_code == 200
        assert get_response.json()["navbar_logo"] == test_logo_url
        
        print("✓ Navbar logo updated and verified")
        
        # Reset
        requests.put(
            self.api_url,
            json={"navbar_logo": ""},
            headers={"Authorization": f"Bearer {token}"}
        )
    
    def test_update_footer_logo(self):
        """Test updating footer logo URL"""
        token = self.get_auth_token()
        
        test_logo_url = "https://example.com/test-footer-logo.png"
        
        # Update footer logo
        response = requests.put(
            self.api_url,
            json={"footer_logo": test_logo_url},
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["footer_logo"] == test_logo_url
        
        # Verify with GET
        get_response = requests.get(self.api_url)
        assert get_response.status_code == 200
        assert get_response.json()["footer_logo"] == test_logo_url
        
        print("✓ Footer logo updated and verified")
        
        # Reset
        requests.put(
            self.api_url,
            json={"footer_logo": ""},
            headers={"Authorization": f"Bearer {token}"}
        )
    
    def test_update_all_settings(self):
        """Test updating all site settings at once"""
        token = self.get_auth_token()
        
        update_data = {
            "site_name": "TEST_Full Update",
            "navbar_logo": "https://example.com/navbar.png",
            "footer_logo": "https://example.com/footer.png"
        }
        
        # Update all settings
        response = requests.put(
            self.api_url,
            json=update_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["site_name"] == update_data["site_name"]
        assert data["navbar_logo"] == update_data["navbar_logo"]
        assert data["footer_logo"] == update_data["footer_logo"]
        
        # Verify persistence with GET
        get_response = requests.get(self.api_url)
        assert get_response.status_code == 200
        get_data = get_response.json()
        
        assert get_data["site_name"] == update_data["site_name"]
        assert get_data["navbar_logo"] == update_data["navbar_logo"]
        assert get_data["footer_logo"] == update_data["footer_logo"]
        
        print("✓ All settings updated and verified")
        
        # Reset to defaults
        requests.put(
            self.api_url,
            json={
                "site_name": "GayrimenkulRehberi",
                "navbar_logo": "",
                "footer_logo": ""
            },
            headers={"Authorization": f"Bearer {token}"}
        )
    
    def test_clear_logo_with_empty_string(self):
        """Test clearing logo by setting empty string"""
        token = self.get_auth_token()
        
        # First set a logo
        requests.put(
            self.api_url,
            json={"navbar_logo": "https://example.com/logo.png"},
            headers={"Authorization": f"Bearer {token}"}
        )
        
        # Clear with empty string
        response = requests.put(
            self.api_url,
            json={"navbar_logo": ""},
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["navbar_logo"] == ""
        
        print("✓ Logo cleared with empty string")
    
    def test_invalid_token_rejected(self):
        """Test that invalid token is rejected"""
        response = requests.put(
            self.api_url,
            json={"site_name": "Test"},
            headers={"Authorization": "Bearer invalid_token"}
        )
        
        assert response.status_code == 401
        print("✓ Invalid token rejected")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
