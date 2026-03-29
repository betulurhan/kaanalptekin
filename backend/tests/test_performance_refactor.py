"""
Backend API tests for performance refactor - unified endpoints
Tests the new /api/content/site-data and /api/content/homepage-data endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestUnifiedEndpoints:
    """Tests for new unified endpoints that replace multiple API calls"""
    
    def test_site_data_endpoint_returns_200(self):
        """Test /api/content/site-data returns 200"""
        response = requests.get(f"{BASE_URL}/api/content/site-data")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✓ /api/content/site-data returns 200")
    
    def test_site_data_contains_site_settings(self):
        """Test site-data contains siteSettings object"""
        response = requests.get(f"{BASE_URL}/api/content/site-data")
        data = response.json()
        assert "siteSettings" in data, "Missing siteSettings in response"
        assert data["siteSettings"] is not None, "siteSettings is null"
        assert "site_name" in data["siteSettings"], "Missing site_name in siteSettings"
        print(f"✓ siteSettings present with site_name: {data['siteSettings'].get('site_name')}")
    
    def test_site_data_contains_contact(self):
        """Test site-data contains contact object"""
        response = requests.get(f"{BASE_URL}/api/content/site-data")
        data = response.json()
        assert "contact" in data, "Missing contact in response"
        assert data["contact"] is not None, "contact is null"
        assert "phone" in data["contact"], "Missing phone in contact"
        assert "email" in data["contact"], "Missing email in contact"
        print(f"✓ contact present with phone: {data['contact'].get('phone')}")
    
    def test_site_data_contains_seo_settings(self):
        """Test site-data contains seoSettings object"""
        response = requests.get(f"{BASE_URL}/api/content/site-data")
        data = response.json()
        assert "seoSettings" in data, "Missing seoSettings in response"
        assert data["seoSettings"] is not None, "seoSettings is null"
        assert "site_title" in data["seoSettings"], "Missing site_title in seoSettings"
        assert "site_description" in data["seoSettings"], "Missing site_description"
        print(f"✓ seoSettings present with title: {data['seoSettings'].get('site_title')[:50]}...")
    
    def test_site_data_has_cache_header(self):
        """Test site-data returns Cache-Control header"""
        response = requests.get(f"{BASE_URL}/api/content/site-data")
        cache_control = response.headers.get('Cache-Control', '')
        assert 'max-age' in cache_control, f"Missing max-age in Cache-Control: {cache_control}"
        print(f"✓ Cache-Control header present: {cache_control}")
    
    def test_homepage_data_endpoint_returns_200(self):
        """Test /api/content/homepage-data returns 200"""
        response = requests.get(f"{BASE_URL}/api/content/homepage-data")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✓ /api/content/homepage-data returns 200")
    
    def test_homepage_data_contains_carousel(self):
        """Test homepage-data contains carousel array"""
        response = requests.get(f"{BASE_URL}/api/content/homepage-data")
        data = response.json()
        assert "carousel" in data, "Missing carousel in response"
        assert isinstance(data["carousel"], list), "carousel should be a list"
        assert len(data["carousel"]) > 0, "carousel is empty"
        # Check carousel slide structure
        slide = data["carousel"][0]
        assert "title" in slide, "Missing title in carousel slide"
        assert "image" in slide, "Missing image in carousel slide"
        print(f"✓ carousel present with {len(data['carousel'])} slides")
    
    def test_homepage_data_contains_projects(self):
        """Test homepage-data contains projects array"""
        response = requests.get(f"{BASE_URL}/api/content/homepage-data")
        data = response.json()
        assert "projects" in data, "Missing projects in response"
        assert isinstance(data["projects"], list), "projects should be a list"
        assert len(data["projects"]) > 0, "projects is empty"
        # Check project structure
        project = data["projects"][0]
        assert "title" in project, "Missing title in project"
        assert "image" in project, "Missing image in project"
        assert "location" in project, "Missing location in project"
        print(f"✓ projects present with {len(data['projects'])} items")
    
    def test_homepage_data_contains_hero_features(self):
        """Test homepage-data contains heroFeatures object"""
        response = requests.get(f"{BASE_URL}/api/content/homepage-data")
        data = response.json()
        assert "heroFeatures" in data, "Missing heroFeatures in response"
        assert data["heroFeatures"] is not None, "heroFeatures is null"
        assert "trust_indicators" in data["heroFeatures"], "Missing trust_indicators"
        assert "features" in data["heroFeatures"], "Missing features"
        print(f"✓ heroFeatures present with {len(data['heroFeatures'].get('features', []))} features")
    
    def test_homepage_data_contains_home_stats(self):
        """Test homepage-data contains homeStats object"""
        response = requests.get(f"{BASE_URL}/api/content/homepage-data")
        data = response.json()
        assert "homeStats" in data, "Missing homeStats in response"
        assert data["homeStats"] is not None, "homeStats is null"
        assert "stats" in data["homeStats"], "Missing stats array"
        assert len(data["homeStats"]["stats"]) > 0, "stats array is empty"
        print(f"✓ homeStats present with {len(data['homeStats']['stats'])} stats")
    
    def test_homepage_data_contains_home_cta(self):
        """Test homepage-data contains homeCTA object"""
        response = requests.get(f"{BASE_URL}/api/content/homepage-data")
        data = response.json()
        assert "homeCTA" in data, "Missing homeCTA in response"
        assert data["homeCTA"] is not None, "homeCTA is null"
        assert "title" in data["homeCTA"], "Missing title in homeCTA"
        assert "button_text" in data["homeCTA"], "Missing button_text in homeCTA"
        print(f"✓ homeCTA present with title: {data['homeCTA'].get('title')[:40]}...")
    
    def test_homepage_data_has_cache_header(self):
        """Test homepage-data returns Cache-Control header"""
        response = requests.get(f"{BASE_URL}/api/content/homepage-data")
        cache_control = response.headers.get('Cache-Control', '')
        assert 'max-age' in cache_control, f"Missing max-age in Cache-Control: {cache_control}"
        print(f"✓ Cache-Control header present: {cache_control}")


class TestIndividualEndpoints:
    """Tests for individual content endpoints still working"""
    
    def test_site_settings_endpoint(self):
        """Test /api/content/site-settings returns 200"""
        response = requests.get(f"{BASE_URL}/api/content/site-settings")
        assert response.status_code == 200
        data = response.json()
        assert "site_name" in data
        print("✓ /api/content/site-settings works")
    
    def test_contact_endpoint(self):
        """Test /api/content/contact returns 200"""
        response = requests.get(f"{BASE_URL}/api/content/contact")
        assert response.status_code == 200
        data = response.json()
        assert "phone" in data
        print("✓ /api/content/contact works")
    
    def test_seo_settings_endpoint(self):
        """Test /api/content/seo-settings returns 200"""
        response = requests.get(f"{BASE_URL}/api/content/seo-settings")
        assert response.status_code == 200
        data = response.json()
        assert "site_title" in data
        print("✓ /api/content/seo-settings works")
    
    def test_hero_features_endpoint(self):
        """Test /api/content/hero-features returns 200"""
        response = requests.get(f"{BASE_URL}/api/content/hero-features")
        assert response.status_code == 200
        data = response.json()
        assert "features" in data
        print("✓ /api/content/hero-features works")
    
    def test_home_stats_endpoint(self):
        """Test /api/content/home-stats returns 200"""
        response = requests.get(f"{BASE_URL}/api/content/home-stats")
        assert response.status_code == 200
        data = response.json()
        assert "stats" in data
        print("✓ /api/content/home-stats works")
    
    def test_home_cta_endpoint(self):
        """Test /api/content/home-cta returns 200"""
        response = requests.get(f"{BASE_URL}/api/content/home-cta")
        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        print("✓ /api/content/home-cta works")


class TestAuthEndpoints:
    """Tests for authentication endpoints"""
    
    def test_admin_login_success(self):
        """Test admin login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "admin123"
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data, "Missing access_token in response"
        print("✓ Admin login successful")
        return data["access_token"]
    
    def test_admin_login_wrong_password(self):
        """Test admin login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "wrongpassword"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Wrong password returns 401")


class TestProjectsAndBlog:
    """Tests for projects and blog endpoints"""
    
    def test_projects_list(self):
        """Test /api/projects returns list"""
        response = requests.get(f"{BASE_URL}/api/projects")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        print(f"✓ /api/projects returns {len(data)} projects")
    
    def test_blog_list(self):
        """Test /api/blog returns list"""
        response = requests.get(f"{BASE_URL}/api/blog")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ /api/blog returns {len(data)} posts")
    
    def test_carousel_list(self):
        """Test /api/carousel returns list"""
        response = requests.get(f"{BASE_URL}/api/carousel")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        print(f"✓ /api/carousel returns {len(data)} slides")


class TestImageUrls:
    """Tests to verify images use valid URLs (not dead preview URLs)"""
    
    def test_carousel_images_not_dead_urls(self):
        """Test carousel images don't use dead preview URLs"""
        response = requests.get(f"{BASE_URL}/api/content/homepage-data")
        data = response.json()
        for slide in data.get("carousel", []):
            image = slide.get("image", "")
            assert ".preview.emergentagent.com/api/upload" not in image, \
                f"Dead preview URL found in carousel: {image}"
        print("✓ Carousel images use valid URLs")
    
    def test_project_images_not_dead_urls(self):
        """Test project main images don't use dead preview URLs"""
        response = requests.get(f"{BASE_URL}/api/content/homepage-data")
        data = response.json()
        for project in data.get("projects", []):
            image = project.get("image", "")
            # Main image should be valid
            if image:
                assert ".preview.emergentagent.com/api/upload" not in image, \
                    f"Dead preview URL found in project image: {image}"
        print("✓ Project main images use valid URLs")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
