const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    rating: Number,
    comment: { type: String, maxlength: 300 },
  },
  {
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
