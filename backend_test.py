#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class RealEstateCMSAPITester:
    def __init__(self, base_url="https://proje-vitrini-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Dict[Any, Any] = None, headers: Dict[str, str] = None) -> tuple:
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        
        # Default headers
        test_headers = {'Content-Type': 'application/json'}
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        print(f"\n🔍 Testing {name}...")
        print(f"    URL: {url}")
        print(f"    Method: {method}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=test_headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if success:
                try:
                    response_data = response.json()
                    details += f", Response: {json.dumps(response_data, indent=2)[:200]}..."
                except:
                    details += f", Response: {response.text[:200]}..."
            else:
                details += f", Expected: {expected_status}"
                try:
                    error_data = response.json()
                    details += f", Error: {error_data}"
                except:
                    details += f", Error: {response.text[:200]}"

            self.log_test(name, success, details)
            return success, response.json() if success and response.text else {}

        except Exception as e:
            error_msg = f"Exception: {str(e)}"
            self.log_test(name, False, error_msg)
            return False, {}

    def test_health_check(self):
        """Test API health check"""
        return self.run_test("API Health Check", "GET", "", 200)

    def test_admin_login(self):
        """Test admin login with default credentials"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"username": "admin", "password": "admin123"}
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"    ✅ Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_token_verification(self):
        """Test token verification"""
        if not self.token:
            self.log_test("Token Verification", False, "No token available")
            return False
        
        return self.run_test("Token Verification", "GET", "auth/verify", 200)

    def test_user_management(self):
        """Test user management endpoints"""
        if not self.token:
            self.log_test("User Management", False, "No token available")
            return False

        # Get all users
        success, users = self.run_test("Get All Users", "GET", "auth/users", 200)
        
        # Create new user
        test_user_data = {
            "username": f"testuser_{datetime.now().strftime('%H%M%S')}",
            "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "TestPass123!"
        }
        
        success, new_user = self.run_test(
            "Create New User",
            "POST", 
            "auth/register",
            201,
            data=test_user_data
        )
        
        if success and 'id' in new_user:
            # Delete the created user
            self.run_test(
                "Delete User",
                "DELETE",
                f"auth/users/{new_user['id']}",
                200
            )

    def test_projects_crud(self):
        """Test Projects CRUD operations"""
        if not self.token:
            self.log_test("Projects CRUD", False, "No token available")
            return False

        # Get all projects
        self.run_test("Get All Projects", "GET", "projects", 200)
        
        # Create new project
        project_data = {
            "title": "Test Projesi",
            "location": "Test Lokasyon",
            "type": "Konut",
            "status": "completed",
            "image": "https://example.com/test.jpg",
            "description": "Test açıklaması",
            "price": "500.000 TL",
            "features": ["Test özellik 1", "Test özellik 2"],
            "completion_date": "2024"
        }
        
        success, new_project = self.run_test(
            "Create Project",
            "POST",
            "projects",
            201,
            data=project_data
        )
        
        if success and 'id' in new_project:
            project_id = new_project['id']
            
            # Get single project
            self.run_test("Get Single Project", "GET", f"projects/{project_id}", 200)
            
            # Update project
            update_data = {"title": "Updated Test Projesi"}
            self.run_test(
                "Update Project",
                "PUT",
                f"projects/{project_id}",
                200,
                data=update_data
            )
            
            # Delete project
            self.run_test("Delete Project", "DELETE", f"projects/{project_id}", 200)

    def test_blog_crud(self):
        """Test Blog CRUD operations"""
        if not self.token:
            self.log_test("Blog CRUD", False, "No token available")
            return False

        # Get all blog posts
        self.run_test("Get All Blog Posts", "GET", "blog", 200)
        
        # Create new blog post
        blog_data = {
            "title": "Test Blog Yazısı",
            "excerpt": "Test özet",
            "content": "Test içerik",
            "category": "Piyasa Analizi",
            "image": "https://example.com/blog.jpg",
            "author": "Test Yazar",
            "read_time": "5 dk"
        }
        
        success, new_post = self.run_test(
            "Create Blog Post",
            "POST",
            "blog",
            201,
            data=blog_data
        )
        
        if success and 'id' in new_post:
            post_id = new_post['id']
            
            # Get single blog post
            self.run_test("Get Single Blog Post", "GET", f"blog/{post_id}", 200)
            
            # Update blog post
            update_data = {"title": "Updated Test Blog Yazısı"}
            self.run_test(
                "Update Blog Post",
                "PUT",
                f"blog/{post_id}",
                200,
                data=update_data
            )
            
            # Delete blog post
            self.run_test("Delete Blog Post", "DELETE", f"blog/{post_id}", 200)

    def test_content_management(self):
        """Test Content Management endpoints"""
        if not self.token:
            self.log_test("Content Management", False, "No token available")
            return False

        # Test About content
        self.run_test("Get About Content", "GET", "content/about", 200)
        
        about_update = {
            "name": "Updated Test Name",
            "title": "Updated Test Title"
        }
        self.run_test(
            "Update About Content",
            "PUT",
            "content/about",
            200,
            data=about_update
        )
        
        # Test Contact info
        self.run_test("Get Contact Info", "GET", "content/contact", 200)
        
        contact_update = {
            "phone": "+90 555 123 4567"
        }
        self.run_test(
            "Update Contact Info",
            "PUT",
            "content/contact",
            200,
            data=contact_update
        )
        
        # Test Hero content
        self.run_test("Get Hero Content", "GET", "content/hero", 200)
        
        hero_update = {
            "title": "Updated Hero Title"
        }
        self.run_test(
            "Update Hero Content",
            "PUT",
            "content/hero",
            200,
            data=hero_update
        )

    def test_contact_messages(self):
        """Test Contact Messages functionality"""
        # Create message (public endpoint)
        message_data = {
            "name": "Test Kullanıcı",
            "email": "test@example.com",
            "phone": "+90 555 123 4567",
            "subject": "Test Mesajı",
            "message": "Bu bir test mesajıdır."
        }
        
        success, new_message = self.run_test(
            "Create Contact Message",
            "POST",
            "messages",
            201,
            data=message_data
        )
        
        if not self.token:
            self.log_test("Contact Messages Admin", False, "No token available")
            return success

        # Get all messages (admin only)
        self.run_test("Get All Messages", "GET", "messages", 200)
        
        # Get unread count
        self.run_test("Get Unread Count", "GET", "messages/stats/unread-count", 200)
        
        if success and 'id' in new_message:
            message_id = new_message['id']
            
            # Get single message
            self.run_test("Get Single Message", "GET", f"messages/{message_id}", 200)
            
            # Mark as read
            self.run_test("Mark Message as Read", "PATCH", f"messages/{message_id}/read", 200)
            
            # Delete message
            self.run_test("Delete Message", "DELETE", f"messages/{message_id}", 200)

    def test_file_upload(self):
        """Test file upload functionality"""
        if not self.token:
            self.log_test("File Upload", False, "No token available")
            return False

        # Note: This is a basic test - actual file upload would need multipart/form-data
        # For now, we'll just test the endpoint accessibility
        print("\n🔍 Testing File Upload endpoint accessibility...")
        
        # Test upload endpoint (will fail without actual file, but should return proper error)
        url = f"{self.api_url}/upload/image"
        headers = {'Authorization': f'Bearer {self.token}'}
        
        try:
            response = requests.post(url, headers=headers, timeout=10)
            # Expecting 422 (validation error) since we're not sending a file
            success = response.status_code == 422
            details = f"Status: {response.status_code} (Expected 422 for missing file)"
            self.log_test("File Upload Endpoint", success, details)
        except Exception as e:
            self.log_test("File Upload Endpoint", False, f"Exception: {str(e)}")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Real Estate CMS API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print("=" * 60)

        # Basic connectivity
        self.test_health_check()
        
        # Authentication
        if self.test_admin_login():
            self.test_token_verification()
            
            # Protected endpoints
            self.test_user_management()
            self.test_projects_crud()
            self.test_blog_crud()
            self.test_content_management()
            self.test_file_upload()
        
        # Public endpoints
        self.test_contact_messages()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        # Print failed tests
        failed_tests = [t for t in self.test_results if not t['success']]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test runner"""
    tester = RealEstateCMSAPITester()
    
    try:
        success = tester.run_all_tests()
        return 0 if success else 1
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())