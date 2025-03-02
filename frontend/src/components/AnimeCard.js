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
  const episodes = anime.episodes ?? "-";
  const status = anime.status ?? "N/A";
  const type = anime.type ?? "N/A";
  const rank = anime.rank ?? "N/A";
  const popularity = anime.popularity ?? "N/A";
  const season = anime.season ?? null; // Set to null if season is null or undefined
  const year = anime.year ?? "N/A";

  return (
    <div className="anime-card" ref={cardRef}>
      <Link to={`/anime/${anime._id}`} className="card-link">
        <div className="card-image-container">
          <img
            src={anime.images?.webp?.large_image_url || anime.image}
            alt={anime.title}
            className="card-image"
          />
          <div className="rating-badge">
            ⭐ {score.toFixed(1)}
          </div>
        </div>

        <div className="card-content">
          <h3 className="card-title">{anime.title}</h3>
          
          <div className="metadata-line">
            <span className="metadata-item">
              <span className="metadata-label">Type:</span> 
              <span className="metadata-value">{type}</span>
            </span>
            <span className="metadata-divider">•</span>
            <span className="metadata-item">
              <span className="metadata-label">Episodes:</span> 
              <span className="metadata-value">{episodes}</span>
            </span>
          </div>

          <div className="metadata-line">
            <span className="metadata-item">
              <span className="metadata-label">Status:</span> 
              <span className={`metadata-value ${status === 'Currently Airing' ? 'live-status' : ''}`}>{status}</span>
            </span>
            <span className="metadata-divider">•</span>
            <span className="metadata-item">
              {season && (
                <>
                  <span className="metadata-label">Season:</span> 
                  <span className="metadata-value">{season} {year}</span>
                </>
              )}
            </span>
          </div>

          <div className="metadata-footer">
            <span className="rank-badge">Rank #{rank}</span>
            <span className="popularity-badge">Popularity #{popularity}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnimeCard;