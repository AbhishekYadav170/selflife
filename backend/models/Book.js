import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    googleBookId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    authors: {
      type: [String],
      default: [],
    },

    cover: {
      type: String,
      default: "",
    },

    isbn: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Want to Read", "Reading", "Read"],
      default: "Want to Read",
    },

    currentPage: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPages: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    review: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.index(
  { user: 1, googleBookId: 1 },
  { unique: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;