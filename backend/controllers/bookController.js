import Book from "../models/Book.js";

const GOOGLE_BOOKS_URL =
  "https://www.googleapis.com/books/v1/volumes";

// ===============================
// Search Books
// ===============================
export const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const url =
      `${GOOGLE_BOOKS_URL}?q=${encodeURIComponent(q)}&maxResults=20`;

    const response = await fetch(url, {
      headers: {
        "x-goog-api-key": process.env.GOOGLE_BOOKS_API_KEY,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google Books API Error:", data);

      return res.status(response.status).json({
        message: "Google Books API error",
        error: data,
      });
    }

    const books = (data.items || []).map((item) => {
      const info = item.volumeInfo || {};

      const identifiers = info.industryIdentifiers || [];

      const isbn13 =
        identifiers.find(
          (identifier) => identifier.type === "ISBN_13"
        )?.identifier || "";

      const isbn10 =
        identifiers.find(
          (identifier) => identifier.type === "ISBN_10"
        )?.identifier || "";

      return {
        googleBookId: item.id,
        title: info.title || "Unknown Title",
        authors: info.authors || [],
        cover:
          info.imageLinks?.thumbnail ||
          info.imageLinks?.smallThumbnail ||
          "",
        isbn: isbn13 || isbn10,
        pageCount: info.pageCount || 0,
        description: info.description || "",
      };
    });

    return res.status(200).json({
      total: data.totalItems || 0,
      books,
    });
  } catch (error) {
    console.error("Search Books Error:", error);

    return res.status(500).json({
      message: "Failed to search books",
      error: error.message,
    });
  }
};

// ===============================
// Add Book To User Shelf
// ===============================
export const addBook = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: "Request body is missing",
      });
    }

    const {
      googleBookId,
      title,
      authors,
      cover,
      isbn,
      totalPages,
    } = req.body;

    if (!googleBookId || !title) {
      return res.status(400).json({
        message: "Book information is incomplete",
      });
    }

    // Check whether this book is already
    // present in the logged-in user's shelf
    const existingBook = await Book.findOne({
      user: req.user._id,
      googleBookId,
    });

    if (existingBook) {
      return res.status(409).json({
        message: "Book already exists in your shelf",
      });
    }

    const book = await Book.create({
      user: req.user._id,
      googleBookId,
      title,
      authors: authors || [],
      cover: cover || "",
      isbn: isbn || "",
      totalPages: Number(totalPages) || 0,
      currentPage: 0,
      status: "Want to Read",
    });

    return res.status(201).json({
      message: "Book added to shelf",
      book,
    });
  } catch (error) {
    console.error("Add Book Error:", error);

    return res.status(500).json({
      message: "Failed to add book",
      error: error.message,
    });
  }
};

// ===============================
// Get Logged-in User's Shelf
// ===============================
export const getMyShelf = async (req, res) => {
  try {
    const books = await Book.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      books,
    });
  } catch (error) {
    console.error("Get Shelf Error:", error);

    return res.status(500).json({
      message: "Failed to fetch shelf",
      error: error.message,
    });
  }
};

// ===============================
// Update Reading Status
// ===============================
export const updateBookStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = [
      "Want to Read",
      "Reading",
      "Read",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid reading status",
      });
    }

    const book = await Book.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    book.status = status;

    // If book is marked as Read,
    // set current page to total pages
    if (status === "Read" && book.totalPages > 0) {
      book.currentPage = book.totalPages;
    }

    // If moved back from Read,
    // don't allow current page beyond total pages
    if (
      status !== "Read" &&
      book.currentPage > book.totalPages
    ) {
      book.currentPage = book.totalPages;
    }

    await book.save();

    res.status(200).json({
      message: "Reading status updated",
      book,
    });
  } catch (error) {
    console.error("Update Status Error:", error);

    res.status(500).json({
      message: "Failed to update reading status",
      error: error.message,
    });
  }
};

// ===============================
// Update Reading Progress
// ===============================
export const updateBookProgress = async (req, res) => {
  try {
    const { currentPage } = req.body;
    const { id } = req.params;

    if (
      currentPage === undefined ||
      currentPage === null
    ) {
      return res.status(400).json({
        message: "Current page is required",
      });
    }

    const page = Number(currentPage);

    if (Number.isNaN(page) || page < 0) {
      return res.status(400).json({
        message: "Invalid page number",
      });
    }

    const book = await Book.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    if (book.totalPages > 0 && page > book.totalPages) {
      return res.status(400).json({
        message: `Current page cannot be greater than ${book.totalPages}`,
      });
    }

    book.currentPage = page;

    // Automatically mark as Read
    // when user reaches the last page
    if (
      book.totalPages > 0 &&
      page === book.totalPages
    ) {
      book.status = "Read";
    } else if (page > 0) {
      book.status = "Reading";
    }

    await book.save();

    res.status(200).json({
      message: "Reading progress updated",
      book,
      progress:
        book.totalPages > 0
          ? Math.round(
              (book.currentPage / book.totalPages) * 100
            )
          : 0,
    });
  } catch (error) {
    console.error("Update Progress Error:", error);

    res.status(500).json({
      message: "Failed to update reading progress",
      error: error.message,
    });
  }
};

// ===============================
// Add Rating & Review
// ===============================
export const updateBookReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const { id } = req.params;

    const book = await Book.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Review only allowed for finished books
    if (book.status !== "Read") {
      return res.status(400).json({
        message: "You can review a book only after reading it",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be a whole number between 1 and 5",
      });
    }

    if (typeof review !== "string" || !review.trim()) {
      return res.status(400).json({
        message: "Review is required",
      });
    }

    book.rating = numericRating;
    book.review = review.trim();

    await book.save();

    return res.status(200).json({
      message: "Rating and review updated",
      book,
    });
  } catch (error) {
    console.error("Update Review Error:", error);

    return res.status(500).json({
      message: "Failed to update rating and review",
      error: error.message,
    });
  }
};



// ===============================
// Update Book
// ===============================
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const {
      status,
      currentPage,
      rating,
      review,
    } = req.body;

    // ===============================
    // STATUS VALIDATION
    // ===============================
    if (status !== undefined) {
      const allowedStatuses = [
        "Want to Read",
        "Reading",
        "Read",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid reading status",
        });
      }

      book.status = status;
    }

    // ===============================
    // CURRENT PAGE VALIDATION
    // ===============================
    if (currentPage !== undefined) {
      const page = Number(currentPage);

      if (
        Number.isNaN(page) ||
        page < 0 ||
        !Number.isInteger(page)
      ) {
        return res.status(400).json({
          message: "Current page must be a valid positive number",
        });
      }

      if (
        book.totalPages > 0 &&
        page > book.totalPages
      ) {
        return res.status(400).json({
          message: `Current page cannot be greater than ${book.totalPages}`,
        });
      }

      book.currentPage = page;
    }

    // ===============================
    // RATING VALIDATION
    // ===============================
    if (
      rating !== undefined &&
      rating !== null &&
      rating !== ""
    ) {
      const numericRating = Number(rating);

      if (
        !Number.isInteger(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          message: "Rating must be a whole number between 1 and 5",
        });
      }

      book.rating = numericRating;
    } else if (
      rating === null ||
      rating === ""
    ) {
      book.rating = null;
    }

    // ===============================
    // REVIEW
    // ===============================
    if (review !== undefined) {
      if (typeof review !== "string") {
        return res.status(400).json({
          message: "Review must be text",
        });
      }

      book.review = review.trim();
    }

    // ===============================
    // AUTOMATIC STATUS
    // ===============================

    // Last page reached
    if (
      book.totalPages > 0 &&
      book.currentPage === book.totalPages
    ) {
      book.status = "Read";
    }

    // Started reading
    else if (
      book.currentPage > 0 &&
      book.status === "Want to Read"
    ) {
      book.status = "Reading";
    }

    // If manually marked Read
    if (book.status === "Read" && book.totalPages > 0) {
      book.currentPage = book.totalPages;
    }

    // ===============================
    // REVIEW RULE
    // ===============================
    if (book.status !== "Read") {
      book.rating = null;
      book.review = "";
    }

    await book.save();

    return res.status(200).json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error("Update Book Error:", error);

    return res.status(500).json({
      message: "Failed to update book",
      error: error.message,
    });
  }
};

// ===============================
// Delete Book
// ===============================
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    await Book.deleteOne({
      _id: id,
      user: req.user._id,
    });

    return res.status(200).json({
      message: "Book removed from shelf",
    });
  } catch (error) {
    console.error("Delete Book Error:", error);

    return res.status(500).json({
      message: "Failed to delete book",
      error: error.message,
    });
  }
};