# Test Credentials

## Admin Panel
- URL: `/admin/login`
- Username: `admin`
- Password: `admin123`
- Role: admin

## Notes
- Default admin is auto-created on first backend startup if no users exist.
- Auth uses JWT (HS256), `verify_token` dependency for protected endpoints.
- Admin login endpoint: `POST /api/auth/login` body `{username, password}` → returns `{access_token, token_type}`
