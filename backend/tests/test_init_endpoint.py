"""
Test suite for /api/content/init endpoint - Single API call performance refactor
Tests that all 8 data sections are returned in one call
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestInitEndpoint:
    """Tests for the unified /api/content/init endpoint"""
    
    def test_init_endpoint_returns_200(self):
        """Test that /api/content/init returns 200 OK"""
        response = requests.get(f"{BASE_URL}/api/content/init")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✓ /api/content/init returns 200 OK")
    
    def test_init_returns_all_8_sections(self):
        """Test that init endpoint returns all 8 required data sections"""
        response = requests.get(f"{BASE_URL}/api/content/init")
        assert response.status_code == 200
        data = response.json()
        
        required_sections = ['siteSettings', 'contact', 'seoSettings', 'carousel', 
                            'projects', 'heroFeatures', 'homeStats', 'homeCTA']
        
        for section in required_sections:
            assert section in data, f"Missing section: {section}"
        
        print(f"✓ All 8 sections present: {list(data.keys())}")
    
    def test_site_settings_structure(self):
        """Test siteSettings has expected fields"""
        response = requests.get(f"{BASE_URL}/api/content/init")
        data = response.json()
        
        site_settings = data.get('siteSettings')
        assert site_settings is not None, "siteSettings is None"
        assert 'site_name' in site_settings, "Missing site_name in siteSettings"
        print(f"✓ siteSettings has site_name: {site_settings.get('site_name')}")
    
    def test_contact_structure(self):
        """Test contact has expected fields"""
        response = requests.get(f"{BASE_URL}/api/content/init")
        data = response.json()
        
        contact = data.get('contact')
        assert contact is not None, "contact is None"
        # Check for common contact fields
        expected_fields = ['phone', 'email', 'address']
        for field in expected_fields:
            assert field in contact, f"Missing {field} in contact"
        print(f"✓ contact has phone: {contact.get('phone')}, email: {contact.get('email')}")
    
    def test_seo_settings_structure(self):
        """Test seoSettings has expected fields"""
        response = requests.get(f"{BASE_URL}/api/content/init")
        data = response.json()
        
        seo = data.get('seoSettings')
        assert seo is not None, "seoSettings is None"
        assert 'site_title' in seo, "Missing site_title in seoSettings"
        assert 'site_description' in seo, "Missing site_description in seoSettings"
        print(f"✓ seoSettings has title: {seo.get('site_title')[:50]}...")
    
    def test_carousel_is_array(self):
        """Test carousel returns array of slides"""
        response = requests.get(f"{BASE_URL}/api/content/init")
        data = response.json()
        
        carousel = data.get('carousel')
        assert isinstance(carousel, list), "carousel should be a list"
        assert len(carousel) > 0, "carousel should have at least 1 slide"
        
        # Check first slide has required fields
        first_slide = carousel[0]
        assert 'image' in first_slide, "Carousel slide missing image"
        assert 'title' in first_slide, "Carousel slide missing title"
        print(f"✓ carousel has {len(carousel)} slides, first slide title: {first_slide.get('title')[:30]}...")
    
    def test_projects_is_array(self):
        """Test projects returns array"""
        response = requests.get(f"{BASE_URL}/api/content/init")
        data = response.json()
        
        projects = data.get('projects')
        assert isinstance(projects, list), "projects should be a list"
        assert len(projects) >= 3, "Should have at least 3 projects for homepage display"
        
        # Check first project has required fields
        first_project = projects[0]
        assert 'title' in first_project, "Project missing title"
        assert 'image' in first_project, "Project missing image"
        assert 'type' in first_project, "Project missing type"
        print(f"✓ projects has {len(projects)} items, first: {first_project.get('title')}")
    
    def test_hero_features_structure(self):
        """Test heroFeatures has expected fields"""
        response = requests.get(f"{BASE_URL}/api/content/init")
        data = response.json()
        
        hero = data.get('heroFeatures')
        assert hero is not None, "heroFeatures is None"
        assert 'badge_text' in hero, "Missing badge_text in heroFeatures"
        assert 'trust_indicators' in hero, "Missing trust_indicators in heroFeatures"
        print(f"✓ heroFeatures has badge: {hero.get('badge_text')}")
    
    def test_home_stats_structure(self):
        """Test homeStats has stats array"""
        response = requests.get(f"{BASE_URL}/api/content/init")
        data = response.json()
        
        home_stats = data.get('homeStats')
        assert home_stats is not None, "homeStats is None"
        assert 'stats' in home_stats, "Missing stats array in homeStats"
        assert isinstance(home_stats['stats'], list), "stats should be a list"
        assert len(home_stats['stats']) >= 4, "Should have at least 4 stats"
        print(f"✓ homeStats has {len(home_stats['stats'])} stat items")
    
    def test_home_cta_structure(self):
        """Test homeCTA has expected fields"""
        response = requests.get(f"{BASE_URL}/api/content/init")
        data = response.json()
        
        cta = data.get('homeCTA')
        assert cta is not None, "homeCTA is None"
        assert 'title' in cta, "Missing title in homeCTA"
        assert 'button_text' in cta, "Missing button_text in homeCTA"
        assert 'button_link' in cta, "Missing button_link in homeCTA"
        print(f"✓ homeCTA has title: {cta.get('title')[:40]}...")
    
    def test_no_mongodb_id_in_response(self):
        """Test that MongoDB _id is not exposed in response"""
        response = requests.get(f"{BASE_URL}/api/content/init")
        data = response.json()
        
        # Check top-level objects don't have _id
        for key, value in data.items():
            if isinstance(value, dict):
                assert '_id' not in value, f"_id exposed in {key}"
            elif isinstance(value, list):
                for item in value:
                    if isinstance(item, dict):
                        assert '_id' not in item, f"_id exposed in {key} array item"
        print("✓ No MongoDB _id exposed in response")


class TestAdminLogin:
    """Test admin authentication"""
    
    def test_admin_login_success(self):
        """Test admin login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "admin123"
        })
        assert response.status_code == 200, f"Login failed: {response.status_code}"
        data = response.json()
        assert 'access_token' in data, "Missing access_token in response"
        print(f"✓ Admin login successful, token received")
        return data['access_token']
    
    def test_admin_login_wrong_password(self):
        """Test admin login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "wrongpassword"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Wrong password correctly rejected with 401")


class TestOtherEndpoints:
    """Test that individual endpoints still work"""
    
    def test_projects_endpoint(self):
        """Test /api/projects returns projects"""
        response = requests.get(f"{BASE_URL}/api/projects")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ /api/projects returns {len(data)} projects")
    
    def test_blog_endpoint(self):
        """Test /api/blog returns blog posts"""
        response = requests.get(f"{BASE_URL}/api/blog")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ /api/blog returns {len(data)} posts")
    
    def test_carousel_endpoint(self):
        """Test /api/carousel returns slides"""
        response = requests.get(f"{BASE_URL}/api/carousel")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ /api/carousel returns {len(data)} slides")
    
    def test_about_endpoint(self):
        """Test /api/content/about returns about content"""
        response = requests.get(f"{BASE_URL}/api/content/about")
        assert response.status_code == 200
        data = response.json()
        assert 'title' in data or 'name' in data
        print(f"✓ /api/content/about returns content")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
