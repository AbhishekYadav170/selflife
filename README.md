📚 ShelfLife

A personal library and reading tracker built with the MERN stack. Search books via the Google Books API, track your reading progress, and keep ratings/reviews for everything you've finished — all on your own private shelf.



✨ Features
🔐 JWT Authentication — Secure signup/login with hashed passwords and token-based sessions.
🔍 Google Books Search — Search books by title/author/ISBN; adding a book auto-fills cover image, author(s), and ISBN from the Google Books API.
📖 Reading Status Tracking — Mark each book as Want to Read, Reading, or Read.
📊 Progress Bar — For books marked "Reading", track current page vs. total pages with a visual progress bar.
⭐ Ratings & Reviews — Give a 1–5 star rating and write a personal review for any book you've finished.
🛡️ Protected Routes — Every shelf, book entry, rating, and review is scoped to the logged-in user. No one can view or edit another user's data.


🧱 Tech Stack
Layer	Technology
Frontend	React.js, Tailwind CSS
Backend	Node.js, Express.js
Database	MongoDB (Mongoose)
Auth	JWT (JSON Web Tokens), bcrypt
External API	Google Books API



📁 Project Structure
shelflife/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── bookController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Book.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── bookRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── api/
    │   └── App.jsx
    ├── .env
    └── package.json
⚙️ Environment Variables

backend/.env



PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_BOOKS_API_KEY=your_google_books_api_key   # optional, works without key too (rate-limited)



frontend/.env

VITE_API_BASE_URL=http://localhost:5000/api


🚀 Getting Started
1. Clone the repo
bash
git clone https://github.com/your-username/shelflife.git
cd shelflife

2. Backend setup
bash
cd backend
npm install
npm run dev


3. Frontend setup
bash
cd frontend
npm install
npm run dev


4. Open the app

Visit http://localhost:5173 (or your Vite dev port) in your browser.

🔑 API Endpoints (Overview)
Auth
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login, returns JWT
Books (all protected — require Bearer token)
Method	Endpoint	Description
GET	/api/books/search?q=	Search Google Books API
POST	/api/books	Add a book to user's shelf
GET	/api/books	Get all books on user's shelf
PUT	/api/books/:id	Update status/progress/rating/review
DELETE	/api/books/:id	Remove a book from shelf
🛡️ Security Notes
Passwords hashed with bcrypt before storing.
JWT sent via Authorization: Bearer <token> header.
Middleware verifies token and attaches req.user on every protected route.
All book queries are filtered by userId — a user can never fetch, update, or delete another user's book entries, even by guessing an ID.


📌 Roadmap / Ideas
 Reading streaks & stats dashboard
 Public/shareable profile (opt-in)
 Genre tags & filtering
 Export shelf as CSV/PDF
👤 Author

Abhishek Yadav Full Stack MERN Developer

📄 License

MIT