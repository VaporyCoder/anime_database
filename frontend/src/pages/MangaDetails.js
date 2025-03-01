import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MangaDetails.css";

const MangaDetails = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    fetch(`http://localhost:3000/api/manga/${id}`)
      .then((res) => res.json())
      .then((data) => setManga(data))
      .catch((err) => console.error("Error:", err));
  }, [id]);

  if (!manga) return <div className="loading">Loading...</div>;

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
    <div className="manga-details">
      {/* Hero Section */}
      <div className="manga-hero" style={{ backgroundImage: `url(${manga.images?.webp?.large_image_url})` }}>
        <div className="manga-hero-content">
          <div className="manga-poster">
            <img src={manga.images?.webp?.large_image_url} alt={manga.title} />
          </div>
          <div className="manga-info">
            <div className="manga-titles">
              <h1>{manga.title}</h1>
              {manga.title_english && <h2>{manga.title_english}</h2>}
              {manga.title_japanese && <h3>{manga.title_japanese}</h3>}
            </div>

            <div className="manga-quick-stats">
              <div className="manga-stat">
                <span className="manga-label">Score</span>
                <span className="manga-value">{manga.score || 'N/A'}</span>
              </div>
              <div className="manga-stat">
                <span className="manga-label">Rank</span>
                <span className="manga-value">#{formatNumber(manga.rank)}</span>
              </div>
              <div className="manga-stat">
                <span className="manga-label">Popularity</span>
                <span className="manga-value">#{formatNumber(manga.popularity)}</span>
              </div>
              <div className="manga-stat">
                <span className="manga-label">Members</span>
                <span className="manga-value">{formatNumber(manga.members)}</span>
              </div>
              <div className="manga-stat">
                <span className="manga-label">Chapters</span>
                <span className="manga-value">{manga.chapters || 'N/A'}</span>
              </div>
              <div className="manga-stat">
                <span className="manga-label">Volumes</span>
                <span className="manga-value">{manga.volumes || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="manga-content-wrapper">
        <nav className="manga-tabs">
          <button onClick={() => setActiveTab('about')} className={activeTab === 'about' ? 'active' : ''}>
            About
          </button>
          <button onClick={() => setActiveTab('publication')} className={activeTab === 'publication' ? 'active' : ''}>
            Publication
          </button>
          <button onClick={() => setActiveTab('creators')} className={activeTab === 'creators' ? 'active' : ''}>
            Creators
          </button>
        </nav>

        {activeTab === 'about' && (
          <div className="manga-tab-content">
            <div className="manga-left-column">
              <div className="manga-synopsis">
                <h3>Synopsis</h3>
                <p>{manga.synopsis || 'No synopsis available.'}</p>
                {manga.background && (
                  <div className="manga-background-info">
                    <h4>Background</h4>
                    <p>{manga.background}</p>
                  </div>
                )}
              </div>

              <div className="manga-details-grid">
                <div className="manga-detail-section">
                  <h4>General Information</h4>
                  <div className="manga-detail-item">
                    <span className="manga-label">Type</span>
                    <span className="manga-value">{manga.type}</span>
                  </div>
                  <div className="manga-detail-item">
                    <span className="manga-label">Status</span>
                    <span className="manga-value">{manga.status}</span>
                  </div>
                  <div className="manga-detail-item">
                    <span className="manga-label">Demographics</span>
                    <span className="manga-value">
                      {manga.demographics?.join(', ') || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="manga-right-column">
              <div className="manga-content-tags">
                <div className="manga-tag-group">
                  <h4>Genres</h4>
                  <div className="manga-tags">
                    {manga.genres?.map((genre, index) => (
                      <span key={index} className="manga-tag">{genre}</span>
                    ))}
                  </div>
                </div>

                <div className="manga-tag-group">
                  <h4>Themes</h4>
                  <div className="manga-tags">
                    {manga.themes?.length > 0 ? (
                      manga.themes.map((theme, index) => (
                        <span key={index} className="manga-tag">{theme}</span>
                      ))
                    ) : <span className="manga-na">N/A</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'publication' && (
          <div className="manga-tab-content">
            <div className="manga-publication-info">
              <div className="manga-pub-section">
                <h4>Publication Details</h4>
                <div className="manga-pub-item">
                  <span className="manga-label">Start Date</span>
                  <span className="manga-value">{formatDate(manga.published?.from)}</span>
                </div>
                <div className="manga-pub-item">
                  <span className="manga-label">End Date</span>
                  <span className="manga-value">{formatDate(manga.published?.to) || 'Ongoing'}</span>
                </div>
                <div className="manga-pub-item">
                  <span className="manga-label">Serialization</span>
                  <span className="manga-value">
                    {manga.serializations?.join(', ') || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'creators' && (
          <div className="manga-tab-content">
            <div className="manga-creators-grid">
              <div className="manga-creator-group">
                <h4>Authors</h4>
                <div className="manga-creator-tags">
                  {manga.authors?.map((author, index) => (
                    <span key={index} className="manga-creator-tag">
                      {author.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information Footer */}
      <div className="manga-additional-info">
        <span>Added: {new Date(manga.createdAt).toLocaleDateString()}</span>
        <span>Last updated: {new Date(manga.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default MangaDetails;