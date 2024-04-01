const mongoose = require("mongoose");

const schema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    blevel: { type: Number, min: 1, max: 5, default: 1 },
    icon: { type: String, required: true}
  });
  
  
  
  module.exports = mongoose.model("User", schema);