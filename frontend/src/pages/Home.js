// src/pages/Home.js
import React, { useEffect, useState } from "react";
import AnimeCard from "../components/AnimeCard";

const Home = () => {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/anime")
      .then((res) => res.json())
      .then((data) => setAnimeList(data));
  }, []);

  return (
    <div>
      <h1>Anime List</h1>
      <div className="anime-list">
        {animeList.map((anime) => (
          <AnimeCard key={anime._id} anime={anime} />
        ))}
      </div>
    </div>
  );
};

export default Home;