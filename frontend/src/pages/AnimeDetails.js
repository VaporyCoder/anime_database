import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AnimeDetails.css";

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    fetch(`http://localhost:3000/api/anime/${id}`)
      .then((res) => res.json())
      .then((data) => setAnime(data))
      .catch((err) => console.error("Error:", err));
  }, [id]);

  if (!anime) return <div className="loading">Loading...</div>;

  // Formatting helpers
  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (num) => num?.toLocaleString() ?? 'N/A';

  return (
    <div className="anime-details">
      {/* Hero Section */}
      <div className="hero" style={{ backgroundImage: `url(${anime.images?.webp?.large_image_url})` }}>
        <div className="hero-content">
          <div className="poster">
            <img src={anime.images?.webp?.large_image_url} alt={anime.title} />
          </div>
          <div className="info">
            <div className="titles">
              <h1>{anime.title}</h1>
              {anime.title_english && <h2>{anime.title_english}</h2>}
              {anime.title_japanese && <h3>{anime.title_japanese}</h3>}
              {anime.title_synonyms?.length > 0 && (
                <div className="alt-titles">
                  Also known as: {anime.title_synonyms.join(', ')}
                </div>
              )}
            </div>

            <div className="quick-stats">
              <div className="stat">
                <span className="label">Score</span>
                <span className="value">{anime.score || 'N/A'}</span>
              </div>
              <div className="stat">
                <span className="label">Rank</span>
                <span className="value">#{formatNumber(anime.rank)}</span>
              </div>
              <div className="stat">
                <span className="label">Popularity</span>
                <span className="value">#{formatNumber(anime.popularity)}</span>
              </div>
              <div className="stat">
                <span className="label">Members</span>
                <span className="value">{formatNumber(anime.members)}</span>
              </div>
              <div className="stat">
                <span className="label">Favorites</span>
                <span className="value">{formatNumber(anime.favorites)}</span>
              </div>
              <div className="stat">
                <span className="label">MAL ID</span>
                <span className="value">{anime.mal_id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        <nav className="tabs">
          <button onClick={() => setActiveTab('about')} className={activeTab === 'about' ? 'active' : ''}>
            About
          </button>
          <button onClick={() => setActiveTab('trailer')} className={activeTab === 'trailer' ? 'active' : ''}>
            Trailer
          </button>
          <button onClick={() => setActiveTab('production')} className={activeTab === 'production' ? 'active' : ''}>
            Production
          </button>
        </nav>

        {activeTab === 'about' && (
          <div className="tab-content">
            <div className="left-column">
              <div className="synopsis">
                <h3>Synopsis</h3>
                <p>{anime.synopsis || 'No synopsis available.'}</p>
                {anime.background && (
                  <div className="background-info">
                    <h4>Background</h4>
                    <p>{anime.background}</p>
                  </div>
                )}
              </div>

              <div className="details-grid">
                <div className="detail-section">
                  <h4>General Information</h4>
                  <div className="detail-item">
                    <span className="label">Type</span>
                    <span className="value">{anime.type}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Source</span>
                    <span className="value">{anime.source || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Episodes</span>
                    <span className="value">{anime.episodes || 'TBA'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status</span>
                    <span className="value">{anime.status}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Duration</span>
                    <span className="value">{anime.duration}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Rating</span>
                    <span className="value">{anime.rating}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Broadcast</h4>
                  <div className="detail-item">
                    <span className="label">Day</span>
                    <span className="value">{anime.broadcast?.day || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Time</span>
                    <span className="value">{anime.broadcast?.time || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Timezone</span>
                    <span className="value">{anime.broadcast?.timezone || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Schedule</span>
                    <span className="value">{anime.broadcast?.string || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="right-column">
              <div className="content-tags">
                <div className="tag-group">
                  <h4>Genres</h4>
                  <div className="tags">
                    {anime.genres?.map((genre, index) => (
                      <span key={index} className="tag">{genre}</span>
                    ))}
                  </div>
                </div>

                <div className="tag-group">
                  <h4>Themes</h4>
                  <div className="tags">
                    {anime.themes?.length > 0 ? (
                      anime.themes.map((theme, index) => (
                        <span key={index} className="tag">{theme}</span>
                      ))
                    ) : <span className="na">N/A</span>}
                  </div>
                </div>

                <div className="tag-group">
                  <h4>Demographics</h4>
                  <div className="tags">
                    {anime.demographics?.length > 0 ? (
                      anime.demographics.map((demo, index) => (
                        <span key={index} className="tag">{demo}</span>
                      ))
                    ) : <span className="na">N/A</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trailer' && anime.trailer && (
          <div className="tab-content trailer-content">
            <div className="trailer-player">
              {anime.trailer.embed_url ? (
                <iframe
                  src={anime.trailer.embed_url}
                  title="Official Trailer"
                  allowFullScreen
                />
              ) : (
                <div className="no-trailer">No trailer available</div>
              )}
            </div>
            {anime.trailer.images && (
              <div className="trailer-thumbnails">
                {Object.entries(anime.trailer.images).map(([size, url]) => (
                  <a key={size} href={anime.trailer.url} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt={`Trailer ${size} thumbnail`} />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'production' && (
          <div className="tab-content production-content">
            <div className="production-grid">
              <div className="production-group">
                <h4>Studios</h4>
                <div className="tags">
                  {anime.studios?.map((studio, index) => (
                    <span key={index} className="tag">{studio}</span>
                  ))}
                </div>
              </div>

              <div className="production-group">
                <h4>Producers</h4>
                <div className="tags">
                  {anime.producers?.length > 0 ? (
                    anime.producers.map((producer, index) => (
                      <span key={index} className="tag">{producer}</span>
                    ))
                  ) : <span className="na">N/A</span>}
                </div>
              </div>

              <div className="production-group">
                <h4>Licensors</h4>
                <div className="tags">
                  {anime.licensors?.length > 0 ? (
                    anime.licensors.map((licensor, index) => (
                      <span key={index} className="tag">{licensor}</span>
                    ))
                  ) : <span className="na">None listed</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information Footer */}
      <div className="additional-info">
        <span>Added: {formatDate(anime.created_at)}</span>
        <span>Last updated: {formatDate(anime.updated_at)}</span>
      </div>
    </div>
  );
};

export default AnimeDetails;