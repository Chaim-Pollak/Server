# Construction Issue Manager - Server

This is the **backend** for the **Construction Issue Manager**, a system designed to manage and track issues in construction projects. The backend handles user authentication, issue management, role-based access control, and database interactions.

## Technologies

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for handling API routes.
- **MongoDB**: NoSQL database for storing users, issues, and project data.
- **Mongoose**: ODM for interacting with MongoDB.
- **JWT (JSON Web Token)**: Authentication and authorization.
- **bcrypt.js**: Password hashing for security.
- **Cors**: Middleware for handling Cross-Origin Resource Sharing.
- **Dotenv**: Environment variable management.
- **Multer**: For handling file uploads.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Chaim-Pollak/Server.git
   ```

2. Navigate to the server directory:

   ```bash
   cd construction-issue-manager-server
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## API Routes

### Authentication

- `POST /users/register` - Register a new user
- `POST /users/login` - User login
- `GET /users/auth` - Get authenticated user details

### Issues Management

- `GET /issues` - Get all issues
- `POST /issues` - Create a new issue
- `PUT /issues/:id` - Update an issue
- `DELETE /issues/:id` - Delete an issue

### User Management

- `GET /users` - Get all users
- `PUT /users/employee/update/:id` - Update employee details
- `DELETE /users/:id` - Delete a user

## Features

- **User Authentication**: Secure login using JWT.
- **Role-Based Access Control**: Different access levels for admins, managers, and employees.
- **Issue Tracking**: CRUD operations for managing construction issues.
- **File Uploads**: Supports image uploads for issue documentation.
- **Database Management**: Uses MongoDB for efficient data storage.

## Contributions

If you’d like to contribute, feel free to fork the repository and submit a pull request.

## License

This project is licensed under the **MIT License**.
