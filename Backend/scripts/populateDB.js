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
    // Fetch top anime from Jikan (page 1, limit 50)
    const response = await axios.get('https://api.jikan.moe/v4/top/anime');
    const animeList = response.data.data;

    // Save each anime to MongoDB with a delay
    for (let i = 0; i < animeList.length; i++) {
      const anime = animeList[i];
      const existingAnime = await Anime.findOne({ mal_id: anime.mal_id });

      if (!existingAnime) {
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
          aired: {
            from: new Date(anime.aired.from),
            to: new Date(anime.aired.to),
          },
        });

        await newAnime.save();
        console.log(`Saved: ${anime.title}`);
      } else {
        console.log(`Already exists: ${anime.title}`);
      }

      // Add a delay of 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('Database populated successfully!');
  } catch (error) {
    console.error('Error fetching or saving data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
fetchAndSaveAnime();