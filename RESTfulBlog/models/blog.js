const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  image: {
    type: String,
    trim: true,
    validate: { validator: (v) => !v || /^https?:\/\//i.test(v), message: 'Image must be an http(s) URL' },
  },
  body: { type: String, required: true },
  created: { type: Date, default: Date.now },
});

/** Form fields a visitor may set. */
blogSchema.statics.fields = ['title', 'image', 'body'];

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
