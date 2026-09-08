export default function BookDetails({ book, onClose }) {
  if (!book) return null;

  const totalPages = Number(book.totalPages) || 0;
  const currentPage = Number(book.currentPage) || 0;

  const progress =
    totalPages > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round((currentPage / totalPages) * 100)
          )
        )
      : 0;

  return (
    <div
      className="book-details-overlay"
      onClick={onClose}
    >
      <div
        className="book-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="book-details-close"
          onClick={onClose}
          aria-label="Close book details"
        >
          ×
        </button>

        {/* Left Side - Cover */}
        <div className="book-details-cover-section">
          {book.cover ? (
            <img
              className="book-details-cover"
              src={book.cover}
              alt={book.title || "Book cover"}
            />
          ) : (
            <div className="book-details-no-cover">
              No Cover
            </div>
          )}
        </div>

        {/* Right Side - Information */}
        <div className="book-details-content">
          <div className="book-details-header">
            <h2>{book.title || "Untitled Book"}</h2>

            <p className="book-details-author">
              {book.authors?.join(", ") || "Unknown Author"}
            </p>
          </div>

          <div className="book-details-divider" />

          {/* Book Information */}
          <div className="book-details-info">

            {/* ISBN */}
            <div className="book-detail-row">
              <span className="book-detail-label">
                ISBN
              </span>

              <strong className="book-detail-value">
                {book.isbn || "Not available"}
              </strong>
            </div>

            {/* Status */}
            <div className="book-detail-row">
              <span className="book-detail-label">
                Status
              </span>

              <strong className="book-detail-value">
                {book.status || "Want to Read"}
              </strong>
            </div>

            {/* Total Pages */}
            <div className="book-detail-row">
              <span className="book-detail-label">
                Total Pages
              </span>

              <strong className="book-detail-value">
                {totalPages || "Unknown"}
              </strong>
            </div>

            {/* Current Page */}
            <div className="book-detail-row">
              <span className="book-detail-label">
                Current Page
              </span>

              <strong className="book-detail-value">
                {currentPage}
              </strong>
            </div>
          </div>

          {/* Reading Progress */}
          {book.status === "Reading" && (
            <div className="book-details-progress-section">
              <div className="book-details-progress-header">
                <span>Reading Progress</span>

                <strong>{progress}%</strong>
              </div>

              <div className="book-details-progress-bar">
                <div
                  className="book-details-progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="book-details-progress-text">
                {currentPage} of {totalPages || 0} pages read
              </p>
            </div>
          )}

          {/* Rating */}
          {book.status === "Read" && (
            <div className="book-details-review">

              <div className="book-details-rating">
                <span className="book-detail-label">
                  Your Rating
                </span>

                <strong>
                  {book.rating
                    ? `${"⭐".repeat(Number(book.rating))} ${book.rating} / 5`
                    : "Not rated"}
                </strong>
              </div>

              {/* Review */}
              <div className="book-details-review-box">
                <span className="book-detail-label">
                  Your Review
                </span>

                <p>
                  {book.review?.trim()
                    ? book.review
                    : "No review written yet."}
                </p>
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            type="button"
            className="book-details-close-btn"
            onClick={onClose}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}