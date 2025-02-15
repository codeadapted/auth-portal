# Authentication API and Login Portal

## Getting Started

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) (if deploying to Heroku)

### Installation & Running the Project

#### 1. Backend Setup
In the first terminal, run the following commands:
```sh
cd backend
npm install
node index.js
```
This will install all dependencies and start the backend server.

#### 2. Frontend Setup
In the second terminal, run:
```sh
cd frontend
npm install
npm start
```
This will install dependencies and start the frontend React application.

## User Management
To manage users, you must log in using the default admin account.

**Default Admin Credentials:**
```
Username: admin
Password: password
```

### User Manager
Once logged in, click the ***Manage Users*** button to navigate to the User Manager page.
Here, you can update user passwords and delete users.

> **Security Note:** Update the admin user password as a priority to maintain security.

### Creating Users
On the Admin Home page, click ***Create New User*** to navigate to the User Creation page.

1. Enter a unique username.
2. Select a user role.
3. Set a secure password.
4. Click ***Create User*** to add the new user.

---

## API Endpoints

### **Authentication & Authorization**

#### 1. **Authenticate User**
**Endpoint:**
```
POST /api/user/auth
```
**Description:**
Verifies user credentials and returns a JWT token upon successful authentication.

**Request Body:**
```json
{
  "username": "user123",
  "password": "password123"
}
```
**Response:**
```json
{
  "authenticated": true,
  "token": "<JWT_TOKEN>"
}
```

#### 2. **Verify JWT Token**
**Endpoint:**
```
GET /api/user/verify-token
```
**Description:**
Checks if the provided JWT token is valid.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```
**Response:**
```json
{
  "valid": true
}
```

#### 3. **Verify User Role**
**Endpoint:**
```
GET /api/user/verify-role?username=user123
```
**Description:**
Returns the role of a specific user.

**Response:**
```json
{
  "role": "user_role"
}
```

### **User Management**

#### 4. **Create New User**
**Endpoint:**
```
POST /api/user/create
```
**Description:**
Creates a new user account with a hashed password.

**Request Body:**
```json
{
  "username": "newuser",
  "password": "securepass",
  "role": "editor"
}
```
**Response:**
```json
{
  "created": true
}
```

#### 5. **Delete User**
**Endpoint:**
```
POST /api/user/delete
```
**Description:**
Deletes an existing user.

**Request Body:**
```json
{
  "username": "user123"
}
```
**Response:**
```json
{
  "deleted": true
}
```

#### 6. **Get List of Users**
**Endpoint:**
```
GET /api/user/list
```
**Description:**
Retrieves a list of all users and their roles.

**Response:**
```json
{
  "user123": {
    "role": "admin"
  },
  "user456": {
    "role": "editor"
  }
}
```

#### 7. **Update User Password**
**Endpoint:**
```
POST /api/user/update-password
```
**Description:**
Updates a user's password by hashing the new password and saving it.

**Request Body:**
```json
{
  "username": "user123",
  "password": "newsecurepassword"
}
```
**Response:**
```json
{
  "updated": true
}
```

---

## Generating a JWT Secret
To generate a secure JWT secret for your `.env` file, use the following command:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated string and store it in your `.env` file:
```
JWT_SECRET=your_generated_secret_here
```

## Static File Handling

### **Serving React Frontend**

The backend serves the compiled React frontend using:
```js
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});
```
This ensures that any non-API request is routed to the frontend.

---

## Recommended Implementation
The best way to integrate this Login Portal and User Manager is to build your app on top of this framework and integrate your app components within it.

- **Backend:** Extend the backend folder to add additional API endpoints for secure data processing.
- **Frontend:** Integrate your React app components within the existing frontend folder.
- **Styling:** SCSS is already integrated, so you can follow the existing styles for consistency.

## Deploying to Heroku
To deploy this project to Heroku:

1. Ensure the **Heroku CLI** is installed and authenticated.
2. Create a **Procfile** in the root directory with the following content:
   ```sh
   web: node backend/index.js
   ```
3. Initialize a git repository and push to Heroku:
   ```sh
   git init
   heroku create your-app-name
   heroku config:set JWT_SECRET=<your_secret_key>
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```
4. Scale the app (optional) and open it:
   ```sh
   heroku ps:scale web=1
   heroku open
   ```

## License
This project is open-source. Feel free to modify and improve as needed!