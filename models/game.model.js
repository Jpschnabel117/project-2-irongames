const { Schema, model } = require("mongoose");

const gameSchema = new Schema({
  title: {
    type: String,
    unique: true,
  },
  gitPage: String,
  gitRep: String,
  rating: Number,
  description: { type: String },
  techDescription: String,
  plays: Number,
  datePublised: Date,
  pending: Boolean,
  imageUrl: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }], // we will update this field a bit later when we create review model
});

const Game = model("Game", gameSchema);

module.exports = Game;
