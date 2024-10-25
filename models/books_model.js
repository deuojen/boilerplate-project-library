const mongoose = require('mongoose');

let bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    comments: [String],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    virtuals: {
      commentcount: {
        get() {
          return this.comments.length;
        },
      },
    },
  }
);

module.exports = mongoose.model('Book', bookSchema);
