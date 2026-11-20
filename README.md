# Secure Connect and Communication Platform

A secure backend application built using Node.js, Express.js, and MongoDB Atlas. The platform provides user authentication, protected Notes API, role-based access control (RBAC), and real-time communication using Socket.IO.

## Project Overview

The Secure Connect and Communication Platform is designed to demonstrate secure backend development and real-time communication. It allows users to register and log in securely, manage their personal notes, and communicate through real-time messaging.

The project integrates authentication, authorization, database management, event-driven programming, and WebSocket-based communication into one application.

## Features

- **User Registration:** Register new users with name, email, and password.
- **Secure Login:** Authenticate users using bcrypt password hashing.
- **JWT Authentication:** Generate and verify JSON Web Tokens for protected routes.
- **Protected Routes:** Restrict access to authenticated users.
- **Role-Based Access Control (RBAC):** Control access based on user roles, such as user and admin.
- **Notes Management:** Create, read, update, and delete personal notes.
- **Real-Time Chat:** Exchange messages instantly using Socket.IO.
- **Event-Driven Architecture:** Use Node.js EventEmitter to handle application events.
- **MongoDB Atlas:** Store user accounts and notes in a cloud database.

## Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | Backend JavaScript runtime |
| Express.js | REST API development |
| MongoDB Atlas | Cloud database |
| MongoDB Driver | Database connectivity |
| bcrypt | Password hashing |
| JSON Web Token (JWT) | Authentication |
| Socket.IO | Real-time communication |
| EventEmitter | Event-driven programming |
| dotenv | Environment variable management |
| Postman | API testing |

## Project Structure

```text
Secure-Connect-Platform/
│
├── config/
│   └── db.js
│
├── middleware/
│   ├── auth.js
│   └── roleCheck.js
│
├── models/
│   ├── User.js
│   └── Note.js
│
├── routes/
│   ├── authRoutes.js
│   └── noteRoutes.js
│
├── sockets/
│   └── chat.js
│
├── utils/
│   └── eventEmitter.js
│
├── test-chat.js
├── server.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/harsh240707/Secure-Connect-Platform.git
```

### 2. Navigate to the Project Directory

```bash
cd Secure-Connect-Platform
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory using `.env.example` as a template.

Example `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
```

Replace the placeholder values with your own MongoDB Atlas connection string and a strong JWT secret.

**Important:** Never upload your actual `.env` file or credentials to GitHub.

### 5. Start the Server

For development:

```bash
npm run dev
```

For normal execution:

```bash
npm start
```

The server will start at:

```text
http://localhost:5000
```

Successful startup displays messages confirming MongoDB connectivity, authentication, Notes API, Socket.IO Chat, and EventEmitter readiness.

## API Endpoints

Base URL:

```text
http://localhost:5000
```

### Authentication APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | Public |
| POST | `/api/auth/login` | Log in and generate JWT | Public |
| GET | `/api/auth/profile` | Get logged-in user profile | Protected |
| GET | `/api/auth/admin/users` | Access user list | Admin only |

### Notes APIs

All Notes API routes require a valid JWT Bearer Token.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/notes` | Create a new note |
| GET | `/api/notes` | Retrieve personal notes |
| PUT | `/api/notes/:id` | Update an existing note |
| DELETE | `/api/notes/:id` | Delete a note |

### Authentication Header

For protected API requests, include:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Real-Time Communication Using Socket.IO

The application uses Socket.IO to provide real-time communication between connected clients.

### Working Process

1. A client connects to the Socket.IO server.
2. The client provides a valid JWT token during connection.
3. The server verifies the token before allowing the connection.
4. Authenticated clients can send chat messages.
5. The server broadcasts messages to connected clients.
6. Other connected clients receive messages instantly.

### Chat Events

| Event | Description |
|---|---|
| `chatConnected` | Confirms successful connection |
| `chatMessage` | Sends a new message |
| `newMessage` | Receives a broadcast message |
| `chatError` | Reports invalid messages |
| `disconnect` | Handles client disconnection |

## Event-Driven Programming

Node.js EventEmitter is used to handle important application events independently.

The application handles events such as:

- `userRegistered`
- `userLogin`
- `noteCreated`
- `chatMessage`

This helps separate event handling from the main application logic and improves code organization.

## Security Implementation

The project implements several security mechanisms:

- Passwords are hashed using bcrypt before storing them in the database.
- JWT tokens are used to authenticate protected requests.
- JWT verification is performed through authentication middleware.
- Role-based middleware restricts administrative operations.
- Users can access and manage only their own notes.
- User roles are assigned by the backend during registration.
- Chat connections require valid JWT authentication.
- Environment variables protect sensitive configuration values.

## Testing

The application can be tested using Postman and the included Socket.IO test script.

### Authentication Testing

- Register a new user.
- Log in using registered credentials.
- Verify the generated JWT token.
- Access the protected profile endpoint.

### Notes API Testing

- Test note creation.
- Retrieve saved notes.
- Update existing notes.
- Delete notes.
- Verify that requests without a token are rejected.

### Role-Based Access Testing

- Access the admin endpoint using a normal user account.
- Verify that unauthorized access is rejected.

### Real-Time Chat Testing

Run the following commands in a second terminal while the server is running:

```powershell
$env:CHAT_TOKEN = Read-Host "Paste JWT token"
node .\test-chat.js
Remove-Item Env:CHAT_TOKEN
```

The test script connects two Socket.IO clients, sends a message, and verifies that the second client receives it.

## Expected Results

After successful execution:

- MongoDB Atlas connects successfully.
- Users can register and log in.
- JWT authentication works correctly.
- Protected routes reject unauthorized requests.
- Users can perform CRUD operations on their own notes.
- Admin-only routes restrict normal users.
- Real-time messages are delivered to connected clients.
- EventEmitter logs application events.

## Future Improvements

- Private one-to-one messaging.
- Group chat functionality.
- Message history storage.
- Email verification.
- Password reset functionality.
- Enhanced rate limiting and request validation.
- Frontend integration.

## Author

**Harsh Yadav**

B.Tech – Artificial Intelligence and Machine Learning

GitHub: https://github.com/harsh240707

---

**Project:** Secure Connect and Communication Platform

**Purpose:** Web Development III Lab Project
