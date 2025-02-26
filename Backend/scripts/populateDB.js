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
      for (let page = 25; page <= totalPages; page++) {
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
              description: anime.synopsis,
              episodes: anime.episodes,
              genre: anime.genres.map((genre) => genre.name),
              rating: anime.score,
              image: anime.images.jpg.image_url,
              status: anime.status,
              seasons: anime.season,
              rank: anime.rank,
              type: anime.type,

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