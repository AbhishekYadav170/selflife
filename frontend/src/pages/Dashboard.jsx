import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

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

  const handleChange = (bookId, field, value) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === bookId
          ? {
              ...book,
              [field]:
                field === "currentPage" || field === "rating"
                  ? Number(value)
                  : value,
            }
          : book,
      ),
    );
  };

  //   const saveBook = async (book) => {
  //     setSavingId(book._id);

  //     try {
  //       const response = await api.put(`/books/${book._id}`, {
  //         status: book.status,
  //         currentPage: Number(book.currentPage) || 0,
  //         rating:
  //           book.rating === null ||
  //           book.rating === "" ||
  //           book.rating === undefined
  //             ? null
  //             : Number(book.rating),
  //         review: book.review || "",
  //       });

  //       setBooks((prevBooks) =>
  //         prevBooks.map((item) =>
  //           item._id === book._id
  //             ? response.data.book
  //             : item
  //         )
  //       );

  //       alert("Book updated successfully!");
  //     } catch (error) {
  //       console.error("Update Error:", error);

  //       alert(
  //         error.response?.data?.message ||
  //           "Failed to update book"
  //       );
  //     } finally {
  //       setSavingId(null);
  //     }
  //   };

  const saveBook = async (book) => {
    setSavingId(book._id);

    try {
      const response = await api.patch(`/books/${book._id}`, {
        status: book.status,
        currentPage: Number(book.currentPage) || 0,
        rating:
          book.rating === null ||
          book.rating === "" ||
          book.rating === undefined
            ? null
            : Number(book.rating),
        review: book.review || "",
      });

      setBooks((prevBooks) =>
        prevBooks.map((item) =>
          item._id === book._id ? response.data.book : item,
        ),
      );

      alert("Book updated successfully!");
    } catch (error) {
      console.error("UPDATE ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("DATA:", error.response?.data);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update book",
      );
    } finally {
      setSavingId(null);
    }
  };

  const deleteBook = async (bookId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this book?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/books/${bookId}`);

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error("Delete Error:", error);

      alert(error.response?.data?.message || "Failed to delete book");
    }
  };

  const getProgress = (book) => {
    if (!book.totalPages || book.totalPages <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round((book.currentPage / book.totalPages) * 100),
    );
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">ShelfLife</div>

        <div className="nav-actions">
          <button className="search-btn" onClick={() => navigate("/search")}>
            Search Books
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>My Library</h1>

            <p>Keep track of your reading journey.</p>
          </div>
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
              {books.filter((book) => book.status === "Want to Read").length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Reading</span>
            <strong>
              {books.filter((book) => book.status === "Reading").length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Read</span>
            <strong>
              {books.filter((book) => book.status === "Read").length}
            </strong>
          </div>
        </div>

        {/* Books */}
        <section className="books-section">
          <h2>My Books</h2>

          {loading ? (
            <div className="empty-state">Loading your library...</div>
          ) : books.length === 0 ? (
            <div className="empty-state">
              <h3>Your shelf is empty</h3>

              <p>Search for a book and add it to your library.</p>

              <button
                className="empty-search-btn"
                onClick={() => navigate("/search")}
              >
                Search Books
              </button>
            </div>
          ) : (
            <div className="books-grid">
              {books.map((book) => {
                const progress = getProgress(book);

                return (
                  <div className="book-card" key={book._id}>
                    {/* Cover */}
                    <div className="book-cover">
                      {book.cover ? (
                        <img src={book.cover} alt={book.title} />
                      ) : (
                        <div className="no-cover">No Cover</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="book-info">
                      <h3>{book.title}</h3>

                      <p className="author">
                        {book.authors?.join(", ") || "Unknown Author"}
                      </p>

                      {book.isbn && <p className="isbn">ISBN: {book.isbn}</p>}

                      {/* Status */}
                      <div className="field">
                        <label>Reading Status</label>

                        <select
                          value={book.status}
                          onChange={(e) =>
                            handleChange(book._id, "status", e.target.value)
                          }
                        >
                          <option value="Want to Read">Want to Read</option>

                          <option value="Reading">Reading</option>

                          <option value="Read">Read</option>
                        </select>
                      </div>

                      {/* Progress */}
                      {book.status === "Reading" && (
                        <div className="progress-box">
                          <div className="progress-top">
                            <span>Page Progress</span>

                            <span>{progress}%</span>
                          </div>

                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>

                          <div className="page-input-row">
                            <input
                              type="number"
                              min="0"
                              max={book.totalPages}
                              value={book.currentPage}
                              onChange={(e) =>
                                handleChange(
                                  book._id,
                                  "currentPage",
                                  e.target.value,
                                )
                              }
                            />

                            <span>/ {book.totalPages} pages</span>
                          </div>
                        </div>
                      )}

                      {/* Rating */}
                      {book.status === "Read" && (
                        <div className="review-section">
                          <div className="field">
                            <label>Your Rating</label>

                            <select
                              value={book.rating ?? ""}
                              onChange={(e) =>
                                handleChange(book._id, "rating", e.target.value)
                              }
                            >
                              <option value="">Select rating</option>

                              <option value="1">⭐ 1 / 5</option>

                              <option value="2">⭐⭐ 2 / 5</option>

                              <option value="3">⭐⭐⭐ 3 / 5</option>

                              <option value="4">⭐⭐⭐⭐ 4 / 5</option>

                              <option value="5">⭐⭐⭐⭐⭐ 5 / 5</option>
                            </select>
                          </div>

                          <div className="field">
                            <label>Your Review</label>

                            <textarea
                              value={book.review || ""}
                              onChange={(e) =>
                                handleChange(book._id, "review", e.target.value)
                              }
                              placeholder="Write your review..."
                              rows="4"
                            />
                          </div>
                        </div>
                      )}

                      {/* Save */}
                      <button
                        className="save-btn"
                        onClick={() => saveBook(book)}
                        disabled={savingId === book._id}
                      >
                        {savingId === book._id ? "Saving..." : "Save Changes"}
                      </button>

                      {/* Delete */}
                      <button
                        className="delete-btn"
                        onClick={() => deleteBook(book._id)}
                      >
                        Remove from Shelf
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
