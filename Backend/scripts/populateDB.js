const mongoose = require('mongoose');
const axios = require('axios');
const Anime = require('../models/Anime');

// Connect to MongoDB
mongoose.connect('mongodb+srv://vaporycoder:eyxlIY7lYz2QfKE6@animedatabase.sw9vm.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Fetch data from Jikan and save to MongoDB
const fetchAndSaveAnime = async () => {
  try {
    const totalPages = 100; // Fetch data from how ever many pages
    for (let page = 1; page <= totalPages; page++) {
      const response = await axios.get(`https://api.jikan.moe/v4/anime?page=${page}`);
      const animeList = response.data.data;

      for (let i = 0; i < animeList.length; i++) {
        const anime = animeList[i];
        const existingAnime = await Anime.findOne({ mal_id: anime.mal_id });

        if (!existingAnime) {
          const newAnime = new Anime({
            mal_id: anime.mal_id,
            title: anime.title,
            title_english: anime.title_english,
            title_japanese: anime.title_japanese,
            title_synonyms: anime.title_synonyms,
            type: anime.type,
            source: anime.source,
            episodes: anime.episodes,
            status: anime.status,
            aired: {
              from: anime.aired.from ? new Date(anime.aired.from) : null,
              to: anime.aired.to ? new Date(anime.aired.to) : null,
            },
            duration: anime.duration,
            rating: anime.rating,
            score: anime.score,
            scored_by: anime.scored_by,
            rank: anime.rank,
            popularity: anime.popularity,
            members: anime.members,
            favorites: anime.favorites,
            synopsis: anime.synopsis,
            background: anime.background,
            season: anime.season,
            year: anime.year,
            broadcast: {
              day: anime.broadcast?.day,
              time: anime.broadcast?.time,
              timezone: anime.broadcast?.timezone,
              string: anime.broadcast?.string,
            },
            producers: anime.producers?.map((producer) => producer.name),
            licensors: anime.licensors?.map((licensor) => licensor.name),
            studios: anime.studios?.map((studio) => studio.name),
            genres: anime.genres?.map((genre) => genre.name),
            themes: anime.themes?.map((theme) => theme.name),
            demographics: anime.demographics?.map((demographic) => demographic.name),
            trailer: {
              youtube_id: anime.trailer?.youtube_id,
              url: anime.trailer?.url,
              embed_url: anime.trailer?.embed_url,
              images: {
                small: anime.trailer?.images?.small_image_url,
                medium: anime.trailer?.images?.medium_image_url,
                large: anime.trailer?.images?.large_image_url,
                maximum: anime.trailer?.images?.maximum_image_url,
              },
            },
            images: {
              jpg: {
                image_url: anime.images?.jpg?.image_url,
                small_image_url: anime.images?.jpg?.small_image_url,
                large_image_url: anime.images?.jpg?.large_image_url,
              },
              webp: {
                image_url: anime.images?.webp?.image_url,
                small_image_url: anime.images?.webp?.small_image_url,
                large_image_url: anime.images?.webp?.large_image_url,
              },
            },
          });

          await newAnime.save();
          console.log(`Saved: ${anime.title}`);
        } else {
          console.log(`Already exists: ${anime.title}`);
        }

        // Add a delay of 1 second between requests to respect Jikan API rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log('Database populated successfully!');
  } catch (error) {
    console.error('Error fetching or saving data:', error.response ? error.response.data : error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
fetchAndSaveAnime();