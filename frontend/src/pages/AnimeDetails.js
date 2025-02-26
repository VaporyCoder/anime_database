import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AnimeDetails = () => {
  const { id } = useParams(); // Get the anime ID from the URL
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/anime/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setAnime(data))
      .catch((err) => console.error("Error fetching anime details:", err));
  }, [id]);

  if (!anime) return <div>Loading...</div>;

  return (
    <div className="anime-details">
      <h1>{anime.title}</h1>
      <img src={anime.image} alt={anime.title} />
      <p>{anime.description}</p>
      <p>Episodes: {anime.episodes}</p>
      <p>Genre: {anime.genre.join(", ")}</p>
    </div>
  );
};

export default AnimeDetails;