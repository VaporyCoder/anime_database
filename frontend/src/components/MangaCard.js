import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./AnimeCard.css"; // Using same CSS as anime cards

const MangaCard = ({ manga }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--border-x", `${x}px`);
    card.style.setProperty("--border-y", `${y}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    card.style.setProperty("--border-x", "-100%");
    card.style.setProperty("--border-y", "-100%");
  };

  // Handle null/undefined values
  const score = manga.score ?? 0;
  const chapters = manga.chapters ?? "N/A";
  const volumes = manga.volumes ?? "N/A";
  const status = manga.status ?? "N/A";
  const type = manga.type ?? "N/A";
  const rank = manga.rank ?? "N/A";
  const popularity = manga.popularity ?? "N/A";
  const demographic = manga.demographics?.[0]?.name ?? "N/A";

  return (
    <div
      className="anime-card" // Using same class names
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/manga/${manga._id}`} className="card-link">
        <div className="card-border-highlight"></div>

        <div className="card-image-container">
          <img
            src={manga.images?.webp?.large_image_url || manga.image}
            alt={manga.title}
            className="card-image"
          />
          <div className="image-gradient"></div>

          {manga.score !== null && manga.score !== undefined && (
            <div className="rating-badge">
              ⭐ {score.toFixed(1)}
            </div>
          )}
        </div>

        <div className="card-content">
          <h3 className="card-title">{manga.title}</h3>
          <div className="metadata-grid">
            <div className="metadata-item">
              <span className="metadata-label">Type</span>
              <span className="metadata-value">{type}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Chapters</span>
              <span className="metadata-value">{chapters}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Volumes</span>
              <span className="metadata-value">{volumes}</span>
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
            <div className="metadata-item">
              <span className="metadata-label">Demographic</span>
              <span className="metadata-value">{demographic}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MangaCard;