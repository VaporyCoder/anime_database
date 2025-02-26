// src/components/AnimeCard.js
import React from "react";
import { Link } from "react-router-dom";

const AnimeCard = ({ anime }) => {
  return (
    <div className="anime-card">
      <Link to={`/anime/${anime._id}`}>
        <img src={anime.image} alt={anime.title} />
        <h2>{anime.title}</h2>
      </Link>
      <p>{anime.rating} Stars</p>
      <p>{anime.description}</p>
      <p>Episodes: {anime.episodes}</p>
      <p>Genre: {anime.genre.join(", ")}</p>
    </div>
  );
};

export default AnimeCard;