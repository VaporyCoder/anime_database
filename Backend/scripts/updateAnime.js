const mongoose = require('mongoose');
const axios = require('axios');
const Anime = require('../models/Anime');

// Connect to MongoDB
mongoose.connect('mongodb+srv://vaporycoder:eyxlIY7lYz2QfKE6@animedatabase.sw9vm.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Fetch latest data from Jikan and update MongoDB
const updateAnimeData = async () => {
  try {
    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      // Fetch data from the Jikan API for the current page
      const response = await axios.get(`https://api.jikan.moe/v4/anime?page=${page}`);
      const animeList = response.data.data;

      if (animeList.length === 0) {
        // No more data to fetch
        hasMoreData = false;
        console.log('No more data to fetch.');
        break;
      }

      // Update or add each anime in the database
      for (let i = 0; i < animeList.length; i++) {
        const anime = animeList[i];
        const existingAnime = await Anime.findOne({ mal_id: anime.mal_id });

        if (existingAnime) {
          // Update existing anime entry
          existingAnime.title = anime.title;
          existingAnime.title_english = anime.title_english;
          existingAnime.title_japanese = anime.title_japanese;
          existingAnime.title_synonyms = anime.title_synonyms;
          existingAnime.type = anime.type;
          existingAnime.source = anime.source;
          existingAnime.episodes = anime.episodes;
          existingAnime.status = anime.status;
          existingAnime.aired = {
            from: anime.aired.from ? new Date(anime.aired.from) : null,
            to: anime.aired.to ? new Date(anime.aired.to) : null,
          };
          existingAnime.duration = anime.duration;
          existingAnime.rating = anime.rating;
          existingAnime.score = anime.score;
          existingAnime.scored_by = anime.scored_by;
          existingAnime.rank = anime.rank;
          existingAnime.popularity = anime.popularity;
          existingAnime.members = anime.members;
          existingAnime.favorites = anime.favorites;
          existingAnime.synopsis = anime.synopsis;
          existingAnime.background = anime.background;
          existingAnime.season = anime.season;
          existingAnime.year = anime.year;
          existingAnime.broadcast = {
            day: anime.broadcast?.day,
            time: anime.broadcast?.time,
            timezone: anime.broadcast?.timezone,
            string: anime.broadcast?.string,
          };
          existingAnime.producers = anime.producers?.map((producer) => producer.name);
          existingAnime.licensors = anime.licensors?.map((licensor) => licensor.name);
          existingAnime.studios = anime.studios?.map((studio) => studio.name);
          existingAnime.genres = anime.genres?.map((genre) => genre.name);
          existingAnime.themes = anime.themes?.map((theme) => theme.name);
          existingAnime.demographics = anime.demographics?.map((demographic) => demographic.name);
          existingAnime.trailer = {
            youtube_id: anime.trailer?.youtube_id,
            url: anime.trailer?.url,
            embed_url: anime.trailer?.embed_url,
            images: {
              small: anime.trailer?.images?.small_image_url,
              medium: anime.trailer?.images?.medium_image_url,
              large: anime.trailer?.images?.large_image_url,
              maximum: anime.trailer?.images?.maximum_image_url,
            },
          };
          existingAnime.images = {
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
          };
          existingAnime.updated_at = Date.now();

          await existingAnime.save();
          console.log(`Updated: ${anime.title}`);
        } else {
          // Add new anime entry
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
          console.log(`Added: ${anime.title}`);
        }

        // Add a delay of 1 second between requests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Move to the next page
      page++;
    }

    console.log('Anime data updated successfully!');
  } catch (error) {
    console.error('Error updating anime data:', error.response ? error.response.data : error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
updateAnimeData();