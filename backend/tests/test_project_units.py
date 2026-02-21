"""
Test suite for Project Units (Daire Yönetimi) feature
Tests CRUD operations for projects with units/apartments
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestProjectUnits:
    """Test project units (daire) management"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test data and authentication"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login to get token
        login_response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "admin123"
        })
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"
        self.token = login_response.json().get("access_token")
        self.session.headers.update({"Authorization": f"Bearer {self.token}"})
        
        yield
        
        # Cleanup - delete test projects
        projects = self.session.get(f"{BASE_URL}/api/projects").json()
        for project in projects:
            if project.get("title", "").startswith("TEST_"):
                self.session.delete(f"{BASE_URL}/api/projects/{project['id']}")
    
    def test_health_check(self):
        """Test API health endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        print("✓ Health check passed")
    
    def test_admin_login(self):
        """Test admin login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "admin123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        print("✓ Admin login successful")
    
    def test_create_project_with_units(self):
        """Test creating a project with units (daireler)"""
        project_data = {
            "title": "TEST_Daire_Projesi",
            "location": "İstanbul, Kadıköy",
            "type": "Rezidans",
            "status": "ongoing",
            "image": "https://example.com/image.jpg",
            "images": [],
            "description": "Test projesi açıklaması",
            "price": "₺5.000.000 - ₺8.000.000",
            "features": ["Deniz Manzarası", "Kapalı Havuz"],
            "completion_date": "2025",
            "payment_plan": "Peşin veya taksitli ödeme",
            "floor_plan": "",
            "units": [
                {
                    "unit_number": "A1",
                    "floor": 1,
                    "rooms": "2+1",
                    "area_m2": 120,
                    "price": "₺5.500.000",
                    "status": "available"
                },
                {
                    "unit_number": "A2",
                    "floor": 1,
                    "rooms": "3+1",
                    "area_m2": 150,
                    "price": "₺6.500.000",
                    "status": "sold"
                },
                {
                    "unit_number": "B1",
                    "floor": 2,
                    "rooms": "2+1",
                    "area_m2": 120,
                    "price": "₺5.800.000",
                    "status": "reserved"
                }
            ]
        }
        
        response = self.session.post(f"{BASE_URL}/api/projects", json=project_data)
        assert response.status_code == 201, f"Create failed: {response.text}"
        
        data = response.json()
        assert data["title"] == "TEST_Daire_Projesi"
        assert "units" in data
        assert len(data["units"]) == 3
        
        # Verify unit data
        units = data["units"]
        assert units[0]["unit_number"] == "A1"
        assert units[0]["floor"] == 1
        assert units[0]["rooms"] == "2+1"
        assert units[0]["area_m2"] == 120
        assert units[0]["price"] == "₺5.500.000"
        assert units[0]["status"] == "available"
        
        print(f"✓ Project created with {len(units)} units")
        return data["id"]
    
    def test_get_project_with_units(self):
        """Test retrieving a project and verifying units are persisted"""
        # First create a project
        project_data = {
            "title": "TEST_Get_Units_Project",
            "location": "Ankara",
            "type": "Apartman",
            "status": "ongoing",
            "image": "https://example.com/image.jpg",
            "description": "Test",
            "price": "₺3.000.000",
            "features": ["Otopark"],
            "completion_date": "2026",
            "units": [
                {
                    "unit_number": "C1",
                    "floor": 3,
                    "rooms": "4+1",
                    "area_m2": 200,
                    "price": "₺8.000.000",
                    "status": "available"
                }
            ]
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/projects", json=project_data)
        assert create_response.status_code == 201
        project_id = create_response.json()["id"]
        
        # Now GET the project
        get_response = self.session.get(f"{BASE_URL}/api/projects/{project_id}")
        assert get_response.status_code == 200
        
        data = get_response.json()
        assert data["title"] == "TEST_Get_Units_Project"
        assert "units" in data
        assert len(data["units"]) == 1
        assert data["units"][0]["unit_number"] == "C1"
        assert data["units"][0]["rooms"] == "4+1"
        
        print("✓ Project retrieved with units intact")
    
    def test_update_project_units(self):
        """Test updating a project's units"""
        # Create project first
        project_data = {
            "title": "TEST_Update_Units_Project",
            "location": "İzmir",
            "type": "Villa",
            "status": "ongoing",
            "image": "https://example.com/image.jpg",
            "description": "Test",
            "price": "₺10.000.000",
            "features": ["Bahçe"],
            "completion_date": "2025",
            "units": [
                {
                    "unit_number": "V1",
                    "floor": 1,
                    "rooms": "5+1",
                    "area_m2": 300,
                    "price": "₺10.000.000",
                    "status": "available"
                }
            ]
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/projects", json=project_data)
        assert create_response.status_code == 201
        project_id = create_response.json()["id"]
        
        # Update with new units
        update_data = {
            "units": [
                {
                    "unit_number": "V1",
                    "floor": 1,
                    "rooms": "5+1",
                    "area_m2": 300,
                    "price": "₺10.000.000",
                    "status": "sold"  # Changed from available to sold
                },
                {
                    "unit_number": "V2",
                    "floor": 2,
                    "rooms": "4+1",
                    "area_m2": 250,
                    "price": "₺9.000.000",
                    "status": "available"
                }
            ]
        }
        
        update_response = self.session.put(f"{BASE_URL}/api/projects/{project_id}", json=update_data)
        assert update_response.status_code == 200
        
        data = update_response.json()
        assert len(data["units"]) == 2
        assert data["units"][0]["status"] == "sold"
        assert data["units"][1]["unit_number"] == "V2"
        
        # Verify persistence with GET
        get_response = self.session.get(f"{BASE_URL}/api/projects/{project_id}")
        assert get_response.status_code == 200
        get_data = get_response.json()
        assert len(get_data["units"]) == 2
        
        print("✓ Project units updated and persisted")
    
    def test_unit_status_values(self):
        """Test all unit status values: available, sold, reserved"""
        project_data = {
            "title": "TEST_Status_Values_Project",
            "location": "Bursa",
            "type": "Rezidans",
            "status": "ongoing",
            "image": "https://example.com/image.jpg",
            "description": "Test",
            "price": "₺4.000.000",
            "features": ["Güvenlik"],
            "completion_date": "2025",
            "units": [
                {"unit_number": "S1", "floor": 1, "rooms": "1+1", "area_m2": 60, "price": "₺2.000.000", "status": "available"},
                {"unit_number": "S2", "floor": 1, "rooms": "2+1", "area_m2": 90, "price": "₺3.000.000", "status": "sold"},
                {"unit_number": "S3", "floor": 2, "rooms": "3+1", "area_m2": 120, "price": "₺4.000.000", "status": "reserved"}
            ]
        }
        
        response = self.session.post(f"{BASE_URL}/api/projects", json=project_data)
        assert response.status_code == 201
        
        data = response.json()
        statuses = [u["status"] for u in data["units"]]
        assert "available" in statuses
        assert "sold" in statuses
        assert "reserved" in statuses
        
        print("✓ All unit status values (available, sold, reserved) work correctly")
    
    def test_unit_room_types(self):
        """Test various room types: 1+0, 1+1, 2+1, 3+1, 4+1, 5+1"""
        project_data = {
            "title": "TEST_Room_Types_Project",
            "location": "Antalya",
            "type": "Apartman",
            "status": "ongoing",
            "image": "https://example.com/image.jpg",
            "description": "Test",
            "price": "₺2.000.000 - ₺10.000.000",
            "features": ["Havuz"],
            "completion_date": "2025",
            "units": [
                {"unit_number": "R1", "floor": 1, "rooms": "1+0", "area_m2": 40, "price": "₺1.500.000", "status": "available"},
                {"unit_number": "R2", "floor": 1, "rooms": "1+1", "area_m2": 60, "price": "₺2.000.000", "status": "available"},
                {"unit_number": "R3", "floor": 2, "rooms": "2+1", "area_m2": 90, "price": "₺3.000.000", "status": "available"},
                {"unit_number": "R4", "floor": 2, "rooms": "3+1", "area_m2": 120, "price": "₺4.500.000", "status": "available"},
                {"unit_number": "R5", "floor": 3, "rooms": "4+1", "area_m2": 160, "price": "₺6.000.000", "status": "available"},
                {"unit_number": "R6", "floor": 3, "rooms": "5+1", "area_m2": 200, "price": "₺8.000.000", "status": "available"}
            ]
        }
        
        response = self.session.post(f"{BASE_URL}/api/projects", json=project_data)
        assert response.status_code == 201
        
        data = response.json()
        room_types = [u["rooms"] for u in data["units"]]
        expected_types = ["1+0", "1+1", "2+1", "3+1", "4+1", "5+1"]
        for rt in expected_types:
            assert rt in room_types, f"Room type {rt} not found"
        
        print("✓ All room types (1+0 to 5+1) work correctly")
    
    def test_get_existing_project_units(self):
        """Test getting the existing project mentioned in the task"""
        project_id = "37997684-d683-4ae7-913d-657def469bdc"
        response = self.session.get(f"{BASE_URL}/api/projects/{project_id}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Found existing project: {data.get('title')}")
            if data.get("units"):
                print(f"  - Units count: {len(data['units'])}")
                for unit in data["units"]:
                    print(f"    - {unit.get('unit_number')}: {unit.get('rooms')}, {unit.get('status')}")
            else:
                print("  - No units defined yet")
        else:
            print(f"⚠ Project {project_id} not found (may have been deleted)")
    
    def test_delete_project_with_units(self):
        """Test deleting a project with units"""
        # Create project
        project_data = {
            "title": "TEST_Delete_Project",
            "location": "Mersin",
            "type": "Ticari",
            "status": "completed",
            "image": "https://example.com/image.jpg",
            "description": "Test",
            "price": "₺15.000.000",
            "features": ["Asansör"],
            "completion_date": "2024",
            "units": [
                {"unit_number": "D1", "floor": 1, "rooms": "2+1", "area_m2": 100, "price": "₺5.000.000", "status": "sold"}
            ]
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/projects", json=project_data)
        assert create_response.status_code == 201
        project_id = create_response.json()["id"]
        
        # Delete project
        delete_response = self.session.delete(f"{BASE_URL}/api/projects/{project_id}")
        assert delete_response.status_code == 200
        
        # Verify deletion
        get_response = self.session.get(f"{BASE_URL}/api/projects/{project_id}")
        assert get_response.status_code == 404
        
        print("✓ Project with units deleted successfully")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
