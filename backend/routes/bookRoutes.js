// import express from "express";

// import {
//   searchBooks,
//   addBook,
//   getMyShelf,
//   updateBookStatus,
//   updateBookProgress,
//   updateBookReview,
//   updateBook,
//   deleteBook,
// } from "../controllers/bookController.js";

// import protect from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/search", protect, searchBooks);

// router.post("/", protect, addBook);

// router.get("/my-shelf", protect, getMyShelf);

// router.patch("/:id/status", protect, updateBookStatus);

// router.patch("/:id/progress", protect, updateBookProgress);

// router.patch("/:id/review", protect, updateBookReview);

// router.patch("/:id", protect, updateBook);

// router.delete("/:id", protect, deleteBook);

// export default router;




import express from "express";

import {
  searchBooks,
  addBook,
  getMyShelf,
  updateBookStatus,
  updateBookProgress,
  updateBookReview,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", protect, searchBooks);

router.post("/", protect, addBook);

router.get("/my-shelf", protect, getMyShelf);

router.patch("/:id/status", protect, updateBookStatus);

router.patch("/:id/progress", protect, updateBookProgress);

router.patch("/:id/review", protect, updateBookReview);

router.patch("/:id", protect, updateBook);

router.delete("/:id", protect, deleteBook);

export default router;