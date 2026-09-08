import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShelf = async () => {
    try {
      const response = await api.get("/books/my-shelf");
      setBooks(response.data.books || []);
    } catch (error) {
      console.error("Shelf Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelf();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">ShelfLife</div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>

      {/* Main */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>My Library</h1>
            <p>Keep track of your reading journey.</p>
          </div>

          <button className="search-btn"
            onClick={() => navigate("/search")}
          >
            Search Books
          </button>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <span>Total Books</span>
            <strong>{books.length}</strong>
          </div>

          <div className="stat-card">
            <span>Want to Read</span>
            <strong>
              {books.filter(
                (book) => book.status === "Want to Read"
              ).length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Reading</span>
            <strong>
              {books.filter(
                (book) => book.status === "Reading"
              ).length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Read</span>
            <strong>
              {books.filter(
                (book) => book.status === "Read"
              ).length}
            </strong>
          </div>
        </div>

        {/* Books */}
        <section className="books-section">
          <h2>My Books</h2>

          {loading ? (
            <div className="empty-state">
              Loading your library...
            </div>
          ) : books.length === 0 ? (
            <div className="empty-state">
              <h3>Your shelf is empty</h3>
              <p>
                Search for a book and add it to your library.
              </p>
            </div>
          ) : (
            <div className="books-grid">
              {books.map((book) => (
                <div className="book-card" key={book._id}>
                  <div className="book-cover">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                      />
                    ) : (
                      <div className="no-cover">
                        No Cover
                      </div>
                    )}
                  </div>

                  <div className="book-info">
                    <h3>{book.title}</h3>

                    <p className="author">
                      {book.authors?.join(", ") ||
                        "Unknown Author"}
                    </p>

                    <span
                      className={`status ${book.status
                        ?.toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {book.status}
                    </span>

                    {book.status === "Reading" &&
                      book.totalPages > 0 && (
                        <div className="progress-box">
                          <div className="progress-top">
                            <span>Progress</span>

                            <span>
                              {Math.round(
                                (book.currentPage /
                                  book.totalPages) *
                                  100
                              )}
                              %
                            </span>
                          </div>

                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (book.currentPage /
                                    book.totalPages) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}