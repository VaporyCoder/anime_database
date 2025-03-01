import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import MangaCard from "../components/MangaCard";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [topRatedAnime, setTopRatedAnime] = useState([]);
  const [currentlyAiringAnime, setCurrentlyAiringAnime] = useState([]);
  const [topRatedManga, setTopRatedManga] = useState([]);
  const [currentlyPublishingManga, setCurrentlyPublishingManga] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [liveSearchResults, setLiveSearchResults] = useState([]);
  const [isLiveSearching, setIsLiveSearching] = useState(false);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          topRatedAnimeRes,
          currentlyAiringRes,
          topRatedMangaRes,
          currentlyPublishingRes
        ] = await Promise.all([
          fetch("http://localhost:3000/api/anime/sections/top-rated"),
          fetch("http://localhost:3000/api/anime/sections/currently-airing"),
          fetch("http://localhost:3000/api/manga/sections/top-rated"),
          fetch("http://localhost:3000/api/manga/sections/currently-publishing")
        ]);
  
        // Process anime data
        const topRatedAnimeData = await topRatedAnimeRes.json();
        const currentlyAiringData = await currentlyAiringRes.json();
        
        setTopRatedAnime(topRatedAnimeData);
        setCurrentlyAiringAnime(
          currentlyAiringData.filter(anime => (
            anime.type?.toUpperCase() === "TV" &&
            !["R+ - Mild Nudity", "Rx - Hentai"].includes(anime.rating)
          ))
        );
  
        // Process manga data
        const topRatedMangaData = await topRatedMangaRes.json();
        const currentlyPublishingData = await currentlyPublishingRes.json();
        
        setTopRatedManga(topRatedMangaData);
        setCurrentlyPublishingManga(currentlyPublishingData);
  
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const fetchLiveSearchResults = async (query) => {
    if (!query.trim()) {
      setLiveSearchResults([]);
      return;
    }

    setIsLiveSearching(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/anime/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setLiveSearchResults(data);
    } catch (error) {
      console.error("Error fetching live search results:", error);
    } finally {
      setIsLiveSearching(false);
    }
  };

  const debouncedFetchLiveSearchResults = debounce(fetchLiveSearchResults, 300);

  const renderStaticSection = (items, title, componentType = 'anime') => (
    <section className="media-section">
      <h2 className="section-title">
        <span>{title}</span>
      </h2>
      <div className="media-grid">
        {items.length > 0 ? (
          items.slice(0, 10).map((item) => 
            componentType === 'manga' ? (
              <MangaCard key={item.mal_id} manga={item} />
            ) : (
              <AnimeCard key={item.mal_id} anime={item} />
            )
          )
        ) : (
          <div className="no-data-card">No {componentType} found</div>
        )}
      </div>
    </section>
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Anime & Manga Collection...</p>
      </div>
    );
  }

  return (
    <main className="home">
      <div className="hero-section">
        <h2 className="hero-heading">Your Gateway to Anime & Manga</h2>
        <p className="hero-text">
          Discover, track, and explore your favorite anime and manga in one
          modern platform
        </p>
      </div>

      <section className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search for anime..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                debouncedFetchLiveSearchResults(e.target.value);
              }}
              className="search-input"
            />
            {isLiveSearching && (
              <div className="live-search-loading">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Loading...
              </div>
            )}
            {liveSearchResults.length > 0 && (
              <div className="live-search-dropdown">
                {liveSearchResults.map((anime) => (
                  <div
                    key={anime.mal_id}
                    className="live-search-item"
                    onClick={() => {
                      setSearchQuery(anime.title);
                      setLiveSearchResults([]);
                    }}
                  >
                    {anime.title}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </section>

      {/* Content Sections */}
      {renderStaticSection(topRatedAnime, "Top-Rated Anime")}
      {renderStaticSection(currentlyAiringAnime, "Currently Airing Anime")}
      {renderStaticSection(topRatedManga, "Top-Rated Manga", 'manga')}
      {renderStaticSection(currentlyPublishingManga, "Currently Publishing Manga", 'manga')}
    </main>
  );
};

export default Home;