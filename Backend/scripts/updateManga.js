const mongoose = require('mongoose');
const axios = require('axios');
const Manga = require('../models/Manga'); // Make sure this path is correct

// Connect to MongoDB
mongoose.connect('mongodb+srv://vaporycoder:eyxlIY7lYz2QfKE6@animedatabase.sw9vm.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Fetch latest manga data from Jikan and update MongoDB
const updateMangaData = async () => {
  try {
    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      // Fetch data from the Jikan API for the current page
      const response = await axios.get(`https://api.jikan.moe/v4/manga?page=${page}`);
      const mangaList = response.data.data;

      if (mangaList.length === 0) {
        hasMoreData = false;
        console.log('No more data to fetch.');
        break;
      }

      // Update or add each manga in the database
      for (let i = 0; i < mangaList.length; i++) {
        const manga = mangaList[i];
        const existingManga = await Manga.findOne({ mal_id: manga.mal_id });

        if (existingManga) {
          // Update existing manga entry
          existingManga.title = manga.title;
          existingManga.title_english = manga.title_english;
          existingManga.title_japanese = manga.title_japanese;
          existingManga.type = manga.type;
          existingManga.chapters = manga.chapters;
          existingManga.volumes = manga.volumes;
          existingManga.status = manga.status;
          existingManga.published = {
            from: manga.published.from ? new Date(manga.published.from) : null,
            to: manga.published.to ? new Date(manga.published.to) : null,
          };
          existingManga.score = manga.score;
          existingManga.scored_by = manga.scored_by;
          existingManga.rank = manga.rank;
          existingManga.popularity = manga.popularity;
          existingManga.members = manga.members;
          existingManga.favorites = manga.favorites;
          existingManga.synopsis = manga.synopsis;
          existingManga.background = manga.background;
          existingManga.authors = manga.authors?.map(author => ({
            mal_id: author.mal_id,
            type: author.type,
            name: author.name,
            url: author.url
          }));
          existingManga.serializations = manga.serializations?.map(serialization => ({
            mal_id: serialization.mal_id,
            type: serialization.type,
            name: serialization.name,
            url: serialization.url
          }));
          existingManga.genres = manga.genres?.map(genre => genre.name);
  existingManga.themes = manga.themes?.map(theme => theme.name);
  existingManga.demographics = manga.demographics?.map(demographic => demographic.name);
          existingManga.images = {
            jpg: {
              image_url: manga.images?.jpg?.image_url,
              small_image_url: manga.images?.jpg?.small_image_url,
              large_image_url: manga.images?.jpg?.large_image_url,
            },
            webp: {
              image_url: manga.images?.webp?.image_url,
              small_image_url: manga.images?.webp?.small_image_url,
              large_image_url: manga.images?.webp?.large_image_url,
            },
          };
          existingManga.updated_at = Date.now();

          await existingManga.save();
          console.log(`Updated: ${manga.title}`);
        } else {
          // Add new manga entry
          const newManga = new Manga({
            mal_id: manga.mal_id,
            url: manga.url,
            title: manga.title,
            title_english: manga.title_english,
            title_japanese: manga.title_japanese,
            type: manga.type,
            chapters: manga.chapters,
            volumes: manga.volumes,
            status: manga.status,
            published: {
              from: manga.published.from ? new Date(manga.published.from) : null,
              to: manga.published.to ? new Date(manga.published.to) : null,
            },
            score: manga.score,
            scored_by: manga.scored_by,
            rank: manga.rank,
            popularity: manga.popularity,
            members: manga.members,
            favorites: manga.favorites,
            synopsis: manga.synopsis,
            background: manga.background,
            authors: manga.authors?.map(author => ({
              mal_id: author.mal_id,
              type: author.type,
              name: author.name,
              url: author.url
            })),
            serializations: manga.serializations?.map(serialization => ({
              mal_id: serialization.mal_id,
              type: serialization.type,
              name: serialization.name,
              url: serialization.url
            })),
            genres: manga.genres?.map(genre => genre.name),
  themes: manga.themes?.map(theme => theme.name),
  demographics: manga.demographics?.map(demographic => demographic.name),
            images: {
              jpg: {
                image_url: manga.images?.jpg?.image_url,
                small_image_url: manga.images?.jpg?.small_image_url,
                large_image_url: manga.images?.jpg?.large_image_url,
              },
              webp: {
                image_url: manga.images?.webp?.image_url,
                small_image_url: manga.images?.webp?.small_image_url,
                large_image_url: manga.images?.webp?.large_image_url,
              },
            },
          });

          await newManga.save();
          console.log(`Added: ${manga.title}`);
        }

        // Maintain rate limit (1 request/second)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      page++;
    }

    console.log('Manga data updated successfully!');
  } catch (error) {
    console.error('Error updating manga data:', error.response ? error.response.data : error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
updateMangaData();