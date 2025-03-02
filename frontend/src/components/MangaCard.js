import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./AnimeCard.css";

const MangaCard = ({ manga }) => {
  const cardRef = useRef(null);

  // Handle null/undefined values
  const score = manga.score ?? 0;
  const chapters = manga.chapters ?? "-";
  const volumes = manga.volumes ?? "-";
  const status = manga.status ?? "N/A";
  const type = manga.type ?? "N/A";
  const rank = manga.rank ?? "N/A";
  const popularity = manga.popularity ?? "N/A";
  const demographic = manga.demographics?.[0]?.name ?? null;

  return (
    <div className="anime-card" ref={cardRef}>
      <Link to={`/manga/${manga._id}`} className="card-link">
        <div className="card-image-container">
          <img
            src={manga.images?.webp?.large_image_url || manga.image}
            alt={manga.title}
            className="card-image"
          />
          <div className="rating-badge">
            ⭐ {score.toFixed(1)}
          </div>
        </div>

        <div className="card-content">
          <h3 className="card-title">{manga.title}</h3>
          
          <div className="metadata-line">
            <span className="metadata-item">
              <span className="metadata-label">Type:</span> 
              <span className="metadata-value">{type}</span>
            </span>
            <span className="metadata-divider">•</span>
            <span className="metadata-item">
              <span className="metadata-label">Chapters:</span> 
              <span className="metadata-value">{chapters}</span>
            </span>
          </div>

          <div className="metadata-line">
            <span className="metadata-item">
              <span className="metadata-label">Volumes:</span> 
              <span className="metadata-value">{volumes}</span>
            </span>
            <span className="metadata-divider">•</span>
            <span className="metadata-item">
              <span className="metadata-label">Status:</span> 
              <span className={`metadata-value ${status === 'Publishing' ? 'live-status' : ''}`}>
                {status}
              </span>
            </span>
          </div>

          <div className="metadata-footer">
            <span className="rank-badge">Rank #{rank}</span>
            <span className="popularity-badge">Popularity #{popularity}</span>
            {demographic && (
              <span className="demographic-badge">{demographic}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MangaCard;