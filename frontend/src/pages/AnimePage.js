import React, { useEffect, useState } from "react";
import AnimeCard from "../components/AnimeCard";
import "./AnimePage.css";

const AnimePage = () => {
  const [sections, setSections] = useState({
    trending: [],
    topRated: [],
    currentlyAiring: [],
    upcoming: [],
    movies: [],
    genres: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_BASE_URL;

        // Define endpoints array with name and URL pairs
        const endpoints = [
          { name: "trending", url: `${API_BASE}/api/anime/sections/trending` },
          { name: "topRated", url: `${API_BASE}/api/anime/sections/top-rated` },
          {
            name: "currentlyAiring",
            url: `${API_BASE}/api/anime/sections/currently-airing`,
          },
          { name: "upcoming", url: `${API_BASE}/api/anime/sections/upcoming` },
          { name: "movies", url: `${API_BASE}/api/anime/sections/movies` },
          { name: "genres", url: `${API_BASE}/api/anime/genres` },
        ];

        // Fetch all endpoints
        const results = await Promise.all(
          endpoints.map(async (endpoint) => {
            try {
              console.log(`Fetching ${endpoint.name}...`);
              const response = await fetch(endpoint.url);
              
              if (!response.ok) {
                console.error(`${endpoint.name} failed:`, response.status);
                // For trending specifically
                if (endpoint.name === 'trending') {
                  console.error('Trending data unavailable, using fallback');
                }
                return { name: endpoint.name, data: null, error: response.statusText };
              }
              
              const data = await response.json();
              return { name: endpoint.name, data, error: null };
            } catch (error) {
              console.error(`${endpoint.name} error:`, error);
              // For trending specifically
              if (endpoint.name === 'trending') {
                console.error('Trending data fetch failed completely');
              }
              return { name: endpoint.name, data: null, error: error.message };
            }
          })
        );

        // Transform results into state object
        const sectionData = results.reduce((acc, curr) => {
          acc[curr.name] = curr.data || [];
          return acc;
        }, {});

        console.log("Final section data:", sectionData);
        setSections(sectionData);
        setLoading(false);
      } catch (error) {
        console.error("Global fetch error:", error);
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, []);

  const renderSection = (items, title, route) => (
    <section className="anime-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <a href={`/anime/${route}`} className="see-more">
          See More →
        </a>
      </div>
      <div className="anime-grid">
        {items.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </section>
  );

  const renderGenreSection = (genre) => (
    <section className="genre-section" key={genre}>
      <div className="section-header">
        <h2 className="section-title">{genre} Anime</h2>
        <a href={`/anime/genre/${genre.toLowerCase()}`} className="see-more">
          Explore Genre →
        </a>
      </div>
      <div className="anime-grid">
        {sections.genres[genre]?.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Anime Universe...</p>
      </div>
    );
  }

  console.log('Trending data:', sections.trending);
console.log('Top Rated data:', sections.topRated);

const HeroSection = () => {
  // Fallback priority: trending -> topRated -> currentlyAiring -> movies
  const featuredAnime = sections.trending[0] || 
                       sections.topRated[0] || 
                       sections.currentlyAiring[0] || 
                       sections.movies[0];

  if (!featuredAnime) {
    return (
      <section className="anime-hero-section">
        <div className="anime-hero-content">
          <div className="anime-hero-text">
            <h1 className="anime-hero-title">Welcome to Anime Universe</h1>
            <p className="anime-hero-synopsis">
              Explore our collection of amazing anime series and movies
            </p>
            <div className="anime-hero-metadata">
              <span>⭐ Start Exploring</span>
            </div>
            <a href="/anime" className="anime-hero-cta">
              Browse All
            </a>
          </div>
          <div className="anime-hero-image-container">
            <img
              src="/default-hero.jpg"
              alt="Anime Universe"
              className="anime-hero-image"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="anime-hero-section">
      <div className="anime-hero-content">
        <div className="anime-hero-text">
          <h1 className="anime-hero-title">{featuredAnime.title}</h1>
          <p className="anime-hero-synopsis">
            {featuredAnime.synopsis?.substring(0, 150) || 'Explore this amazing anime series'}...
          </p>
          <div className="anime-hero-metadata">
            <span>⭐ {featuredAnime.score || 'N/A'}</span>
            <span>{featuredAnime.episodes || '?'} Episodes</span>
            <span>{featuredAnime.status || 'Currently Airing'}</span>
          </div>
          <a href={`/anime/${featuredAnime._id}`} className="anime-hero-cta">
            Watch Now
          </a>
        </div>
        <div className="anime-hero-image-container">
          <img
            src={featuredAnime.images?.webp?.large_image_url || '/default-hero.jpg'}
            alt={featuredAnime.title}
            className="anime-hero-image"
            onError={(e) => {
              e.target.src = '/default-hero.jpg';
            }}
          />
        </div>
      </div>
    </section>
  );
};

  return (
    <div className="anime-page">
      <HeroSection />

      {/* Main Content Sections */}
      <main className="anime-main">
        {renderSection(sections.topRated, "All-Time Top Rated", "top-rated")}
        {renderSection(
          sections.currentlyAiring,
          "Currently Airing",
          "currently-airing"
        )}
        {renderSection(sections.upcoming, "Upcoming Anime", "upcoming")}
        {renderSection(sections.movies, "Anime Movies", "movies")}

        {/* Genre Sections */}
        {Object.keys(sections.genres).map((genre) => renderGenreSection(genre))}
      </main>
    </div>
  );
};

export default AnimePage;
