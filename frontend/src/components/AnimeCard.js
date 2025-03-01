import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./AnimeCard.css";

const AnimeCard = ({ anime }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate border highlight position
    card.style.setProperty("--border-x", `${x}px`);
    card.style.setProperty("--border-y", `${y}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    card.style.setProperty("--border-x", "-100%");
    card.style.setProperty("--border-y", "-100%");
  };

  // Handle null or undefined values
  const score = anime.score ?? 0; // Default to 0 if score is null or undefined
  const episodes = anime.episodes ?? "N/A";
  const status = anime.status ?? "N/A";
  const type = anime.type ?? "N/A";
  const rank = anime.rank ?? "N/A";
  const popularity = anime.popularity ?? "N/A";
  const season = anime.season ?? null; // Set to null if season is null or undefined
  const year = anime.year ?? "N/A";

  return (
    <div
      className="anime-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/anime/${anime._id}`} className="card-link">
        <div className="card-border-highlight"></div>

        <div className="card-image-container">
          <img
            src={anime.images?.webp?.large_image_url || anime.image}
            alt={anime.title}
            className="card-image"
          />
          <div className="image-gradient"></div>

          {anime.score !== null && anime.score !== undefined && (
            <div className="rating-badge">
              ⭐ {score.toFixed(1)}
            </div>
          )}
        </div>

        <div className="card-content">
          <h3 className="card-title">{anime.title}</h3>
          <div className="metadata-grid">
            <div className="metadata-item">
              <span className="metadata-label">Type</span>
              <span className="metadata-value">{type}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Episodes</span>
              <span className="metadata-value">{episodes}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Status</span>
              <span className="metadata-value electric-blue">{status}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Rank</span>
              <span className="metadata-value">#{rank}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Popularity</span>
              <span className="metadata-value">#{popularity}</span>
            </div>
            {season !== null && season !== undefined && (
              <div className="metadata-item">
                <span className="metadata-label">Season</span>
                <span className="metadata-value">{season} {year}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnimeCard;