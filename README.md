# topicsHW4
CRUD application for Topics in CS Python Web Development with authenticator implementation

My previously created Sleep Tracker app now uses MongoDB to securely store users' data

**New Implementations:**
- Requires user login/registration
- Stores users' sleep data for their unique user, protected by login. Users will not be able to see anybody else's data other than their own
- Sleep data is now saved
  - Before the update, a user had no way to save their sleep data, and it would be wiped as soon as the page reloads


Summary of Technical Additions:
- Created auth.html
  - Front end for login/register forms
- Updated main.js
  - Added local token storage to allow users to stay logged in and log out
  - Requires users to log in
- Created auth_routes.py
  - Creates FastAPI routes to allow users to register and log in
- Created auth.py
  - Hashes the password for security
- Created jwt.py
  - Creates the JWT tokens and keeps users logged in for 15 minutes (From in-class Demo)
- Created token_data.py
  - Stores the token data in a model (From in-class Demo)
- Updated db.py
  - Connects to the MongoDB database on initialization
- Updated main.py
  - Added CORS error fixes
  - Added router for Auth
- Updated sleep_routes.py
  - Now stores sleep data with tokens
- Updated sleep.py
  - Edited classes for authentication implementation
- Added .gitignore to hide sensitive data



<img width="1511" alt="Screen Shot 2025-04-23 at 5 24 59 PM" src="https://github.com/user-attachments/assets/349f13ee-3a54-429b-bd6c-abe57df18ee8" />
Login Page


<img width="1505" alt="Screen Shot 2025-04-23 at 5 25 25 PM" src="https://github.com/user-attachments/assets/15d2d446-3adc-425d-8bb6-db6b40ba2cf8" />
Home Page once the user is logged in


<img width="1305" alt="Screen Shot 2025-04-23 at 5 37 29 PM" src="https://github.com/user-attachments/assets/b0755abe-8039-4a1b-ba19-0e3102f6cb8d" />
MongoDB User Database


<img width="1318" alt="Screen Shot 2025-04-23 at 5 38 01 PM" src="https://github.com/user-attachments/assets/19003cb9-94d1-4290-b3d3-afdbae5f9fbe" />
MongoDB Sleep Database


<img width="1512" alt="Screen Shot 2025-04-23 at 5 38 52 PM" src="https://github.com/user-attachments/assets/e570ae9f-cdbf-49e9-8db4-e9468ae57b28" />
Fast API Routes



