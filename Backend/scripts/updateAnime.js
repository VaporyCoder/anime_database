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
    // Fetch the latest anime data from Jikan
    const response = await axios.get('https://api.jikan.moe/v4/anime');
    const animeList = response.data.data;

    // Update or add each anime in the database
    for (let i = 0; i < animeList.length; i++) {
      const anime = animeList[i];
      const existingAnime = await Anime.findOne({ mal_id: anime.mal_id });

      if (existingAnime) {
        // Update existing anime entry
        existingAnime.title = anime.title;
        existingAnime.title_english = anime.title_english;
        existingAnime.description = anime.synopsis;
        existingAnime.episodes = anime.episodes;
        existingAnime.genre = anime.genres.map((genre) => genre.name);
        existingAnime.rating = anime.score;
        existingAnime.image = anime.images.jpg.image_url;
        existingAnime.status = anime.status;
        existingAnime.season = anime.season
        existingAnime.type = anime.type
        existingAnime.rank = anime.rank
        existingAnime.aired = {
          from: new Date(anime.aired.from),
          to: new Date(anime.aired.to),
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
          description: anime.synopsis,
          episodes: anime.episodes,
          genre: anime.genres.map((genre) => genre.name),
          rating: anime.score,
          image: anime.images.jpg.image_url,
          status: anime.status,
          season: anime.season,
          type: anime.type,
          rank: anime.rank,
          aired: {
            from: new Date(anime.aired.from),
            to: new Date(anime.aired.to),
          },
        });

        await newAnime.save();
        console.log(`Added: ${anime.title}`);
      }

      // Add a delay of 1 second between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
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