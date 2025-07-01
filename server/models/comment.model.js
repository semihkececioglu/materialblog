const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Post",
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  username: {
    type: String,
    required: true,
  },
  email: String,
  text: {
    type: String,
    required: true,
  },
  avatar: String,
  date: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Comment", commentSchema);
