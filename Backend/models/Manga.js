// models/Manga.js
const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  mal_id: Number,
  type: String,
  name: String,
  url: String,
});

const serializationSchema = new mongoose.Schema({
  mal_id: Number,
  type: String,
  name: String,
  url: String,
});

const mangaSchema = new mongoose.Schema(
  {
    mal_id: {
      type: Number,
      required: true,
      unique: true,
    },
    url: String,
    images: {
      jpg: {
        image_url: String,
        small_image_url: String,
        large_image_url: String,
      },
      webp: {
        image_url: String,
        small_image_url: String,
        large_image_url: String,
      },
    },
    title: {
      type: String,
      required: true,
    },
    title_english: String,
    title_japanese: String,
    type: String, // Manga, Novel, Lightnovel, etc.
    chapters: Number,
    volumes: Number,
    status: String, // Publishing, Finished, Hiatus, etc.
    publishing: {
      type: Boolean,
      default: false,
    },
    published: {
      from: Date,
      to: Date,
      prop: {
        string: String,
      },
    },
    score: Number,
    scored_by: Number,
    rank: Number,
    popularity: Number,
    members: Number,
    favorites: Number,
    synopsis: String,
    background: String,
    authors: [authorSchema],
    serializations: [serializationSchema],
    genres: [
      {
        mal_id: Number,
        type: String,
        name: String,
        url: String,
      },
    ],
    themes: [
      {
        mal_id: Number,
        type: String,
        name: String,
        url: String,
      },
    ],
    demographics: [
      {
        mal_id: Number,
        type: String,
        name: String,
        url: String,
      },
    ],
    relations: [
      {
        relation: String,
        entry: [
          {
            mal_id: Number,
            type: String,
            name: String,
            url: String,
          },
        ],
      },
    ],
    external: [
      {
        name: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for common query fields
mangaSchema.index({
  title: "text",
  title_english: "text",
  title_japanese: "text",
});
mangaSchema.index({ score: -1 });
mangaSchema.index({ rank: 1 });
mangaSchema.index({ genres: 1 });
mangaSchema.index({ type: 1 });

// Virtual for formatted publication date
mangaSchema.virtual("published_period").get(function () {
  if (!this.published) return "";
  return `${
    this.published.from.toISOString().split("T")[0]
  } to ${this.published.to ? this.published.to.toISOString().split("T")[0] : "Present"}`;
});

module.exports = mongoose.model("Manga", mangaSchema);
