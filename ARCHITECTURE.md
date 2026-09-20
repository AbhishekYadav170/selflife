# ShelfLife — System Architecture

## 1. Project Overview

ShelfLife is a full-stack book and reading management application.

It allows users to:

- Register and log in securely
- Search books using Google Books API
- Add books to their personal shelf
- Track reading status
- Track reading progress
- Add ratings and reviews
- View detailed book information
- Update and remove books from their shelf

---

# 2. High-Level Architecture

```text
                    ┌──────────────────────┐
                    │      User / Client   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │                      │
                    │  Login / Register    │
                    │  Search Books        │
                    │  Dashboard           │
                    │  Book Details        │
                    └──────────┬───────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │      Backend         │
                    │                      │
                    │  Auth Routes         │
                    │  Book Routes         │
                    │  Controllers         │
                    │  JWT Middleware      │
                    └───────┬───────┬──────┘
                            │       │
                 ┌──────────┘       └──────────────┐
                 ▼                                 ▼
        ┌──────────────────┐              ┌──────────────────┐
        │     MongoDB      │              │ Google Books API │
        │                  │              │                  │
        │ Users            │              │ Book Search      │
        │ Books            │              │ Book Metadata    │
        └──────────────────┘              └──────────────────┘


3. Frontend Architecture

The frontend is built using React.js.

Main Responsibilities
User interface
Routing
Authentication state
Book searching
Shelf management
Reading progress
Ratings and reviews
API communication
Frontend Structure
frontend/
│
├── src/
│   │
│   ├── components/
│   │   └── BookDetails.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── SearchBooks.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
└── package.json
4. Backend Architecture

The backend is built using Node.js and Express.js.

Main Responsibilities
REST API
Authentication
Authorization
Book management
Database operations
Google Books API integration
Request validation
Backend Structure
backend/
│
├── controllers/
│   ├── authController.js
│   └── bookControllers.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── User.js
│   └── Book.js
│
├── routes/
│   ├── authRoutes.js
│   └── bookRoutes.js
│
├── server.js
├── .env
└── package.json
5. Authentication Flow

ShelfLife uses JWT-based authentication.

User
 │
 ▼
Register / Login
 │
 ▼
Backend Authentication
 │
 ▼
JWT Token Generated
 │
 ▼
Token Stored by Frontend
 │
 ▼
Authenticated API Requests
 │
 ▼
JWT Middleware
 │
 ▼
User Identified
 │
 ▼
Protected Resource

Protected operations include:

My Shelf
Add Book
Update Book
Update Reading Progress
Update Rating/Review
Delete Book
6. Book Search Flow

Book searching uses the Google Books API.

User enters search query
          │
          ▼
React Search Page
          │
          ▼
Express Backend
          │
          ▼
Google Books API
          │
          ▼
Book Data Received
          │
          ▼
Backend formats required data
          │
          ▼
Frontend displays results

The application extracts information such as:

Google Book ID
Title
Authors
Cover
ISBN
Page Count
Description
7. Add Book Flow
Search Result
     │
     ▼
Add to Shelf
     │
     ▼
Authenticated API Request
     │
     ▼
JWT Middleware
     │
     ▼
Check Duplicate Book
     │
     ▼
MongoDB
     │
     ▼
Book Added to User Shelf

A unique compound index prevents the same user from adding the same Google Book multiple times.

user + googleBookId
8. Reading Management

Each book can have one of three statuses:

Want to Read
      │
      ▼
   Reading
      │
      ▼
     Read

Users can also update:

Current page
Reading progress
Rating
Review

When the user reaches the final page, the application can automatically mark the book as:

Read
9. Reading Progress Calculation

Progress is calculated using:

Progress =
(Current Page / Total Pages) × 100

Example:

Current Page = 150
Total Pages  = 300

Progress = (150 / 300) × 100
         = 50%

The frontend displays this value using a progress bar.

10. Rating and Review Flow

Rating and review are available after a book is completed.

Book Status
     │
     ▼
    Read
     │
     ▼
Rating 1–5
     │
     ▼
Write Review
     │
     ▼
Backend Validation
     │
     ▼
MongoDB
11. Database Architecture

ShelfLife uses MongoDB with Mongoose.

User Collection

Stores user authentication information.

User
├── name
├── email
└── password
Book Collection

Stores books belonging to users.

Book
├── user
├── googleBookId
├── title
├── authors
├── cover
├── isbn
├── status
├── currentPage
├── totalPages
├── rating
├── review
├── createdAt
└── updatedAt
12. API Architecture
Authentication APIs
POST /api/auth/register
POST /api/auth/login
Book APIs
GET    /api/books/search
GET    /api/books/my-shelf
POST   /api/books
PATCH  /api/books/:id
DELETE /api/books/:id

The backend uses protected routes for operations that require an authenticated user.

13. Security

The application implements:

JWT authentication
Protected API routes
User-specific database queries
Password authentication
Duplicate book prevention
Input validation
Ownership verification before updating/deleting books

For book operations, the backend checks:

book.user === authenticated user

This prevents one user from modifying another user's books.

14. Data Flow

The overall data flow is:

React UI
   │
   ▼
Axios API Request
   │
   ▼
Express Route
   │
   ▼
Authentication Middleware
   │
   ▼
Controller
   │
   ├──────────────► Google Books API
   │
   ▼
Mongoose Model
   │
   ▼
MongoDB
   │
   ▼
Controller Response
   │
   ▼
React UI Update
15. Technology Stack
Frontend
React.js
React Router
Axios
CSS
Backend
Node.js
Express.js
JWT
Database
MongoDB
Mongoose
External API
Google Books API
16. Architecture Summary

ShelfLife follows a client-server architecture.

The React frontend handles the user interface and communicates with the Express.js backend through REST APIs.

The Express backend handles authentication, authorization, business logic and database operations.

MongoDB stores users and personal book shelves, while the Google Books API provides external book information.