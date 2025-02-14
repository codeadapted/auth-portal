# Authentication API and Login Portal

## Getting Started
Create two terminal tabs. 

In the first terminal run the following commands:

```
cd backend
npm install
node index.js
```

In the second terminal run the following commands:

```
cd frontend
npm start
```

# User Management
In order to manage users you will need to login using the default admin account.

The initial credentials for this admin account are below.

`Username: admin`
`Password: password`

## User Manager
Once in the Admin Home page click the ***Manage Users*** button to navigate to the User Manager page.

Here you can update user passwords and delete users.

***Note: It is highly recommended to update the admin user password as first order of business to maintain security.***

## Creating Users
In the Admin Home page you will also have the ability to navigate to the User Creation page by clicking on the ***Create New User*** button.

Once here fill out the Username field with a unique username and select the role this use will have. Then ensure a secure password is added and click ***Create User***.

# Recommended Implementation
The best way to integrate this Login Portal and User Manager is to build your app on top of this framework and integrate your app into it.

Use the backend folder to create API endpoints for secure data processing.

Use the frontend folder to integrate your React app components.

SCSS is already integrated into the React framework so you would just need to follow 