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
    // 🔁 name ➜ username
    type: String,
    required: true,
  },
  email: String,
  text: {
    type: String,
    required: true,
  },
  avatar: String, // opsiyonel, ileride kullanılabilir
  date: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: [String], // kullanıcı adı listesi
    default: [],
  },
});

module.exports = mongoose.model("Comment", commentSchema);
