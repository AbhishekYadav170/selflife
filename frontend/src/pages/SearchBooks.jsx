import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SearchBooks() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [error, setError] = useState("");

  const searchBooks = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        `/books/search?q=${encodeURIComponent(query)}`
      );

      setBooks(response.data.books || []);
    } catch (error) {
      console.error("Search Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to search books"
      );
    } finally {
      setLoading(false);
    }
  };

  const addToShelf = async (book) => {
    setAddingId(book.googleBookId);
    setError("");

    try {
      await api.post("/books", {
        googleBookId: book.googleBookId,
        title: book.title,
        authors: book.authors,
        cover: book.cover,
        isbn: book.isbn,
        totalPages: book.pageCount,
      });

      alert("Book added to your shelf!");

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add book"
      );
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="search-page">
      <nav className="navbar">
        <div className="logo">ShelfLife</div>

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          My Library
        </button>
      </nav>

      <main className="search-main">
        <div className="search-header">
          <h1>Search Books</h1>

          <p>
            Find books and add them to your personal library.
          </p>
        </div>

        <form
          className="search-form"
          onSubmit={searchBooks}
        >
          <input
            type="text"
            placeholder="Search by title, author or ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <div className="search-error">
            {error}
          </div>
        )}

        {loading && (
          <div className="search-message">
            Searching books...
          </div>
        )}

        {!loading && books.length === 0 && query && (
          <div className="search-message">
            No books found.
          </div>
        )}

        <div className="search-results">
          {books.map((book) => (
            <div
              className="search-book-card"
              key={book.googleBookId}
            >
              <div className="search-book-cover">
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

              <div className="search-book-info">
                <h2>{book.title}</h2>

                <p>
                  <strong>Author:</strong>{" "}
                  {book.authors?.join(", ") ||
                    "Unknown Author"}
                </p>

                <p>
                  <strong>ISBN:</strong>{" "}
                  {book.isbn || "Not available"}
                </p>

                <p>
                  <strong>Pages:</strong>{" "}
                  {book.pageCount || "Unknown"}
                </p>

                <button
                  className="add-book-btn"
                  onClick={() => addToShelf(book)}
                  disabled={addingId === book.googleBookId}
                >
                  {addingId === book.googleBookId
                    ? "Adding..."
                    : "Add to Shelf"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}