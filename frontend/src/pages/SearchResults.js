import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import MangaCard from "../components/MangaCard";
import "./SearchResults.css";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [animeResults, setAnimeResults] = useState([]);
  const [mangaResults, setMangaResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const query = searchParams.get("query");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const [animeResponse, mangaResponse] = await Promise.all([
          fetch(`http://localhost:3000/api/anime/search?query=${encodeURIComponent(query)}`),
          fetch(`http://localhost:3000/api/manga/search?query=${encodeURIComponent(query)}`)
        ]);

        const animeData = await animeResponse.json();
        const mangaData = await mangaResponse.json();
        
        setAnimeResults(animeData);
        setMangaResults(mangaData);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  // In the loading state return:
if (isLoading) return (
  <div className="loading">
    <div className="loading-dots">
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
    </div>
  </div>
);

  return (
    <div className="search-results-page">
      <h2>Search Results for "{query}"</h2>
      
      {(animeResults.length > 0 || mangaResults.length > 0) ? (
        <div className="results-container">
          {animeResults.length > 0 && (
            <section className="results-section">
              <h3 className="results-category">Anime Results</h3>
              <div className="results-grid">
                {animeResults.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
            </section>
          )}

          {mangaResults.length > 0 && (
            <section className="results-section">
              <h3 className="results-category">Manga Results</h3>
              <div className="results-grid">
                {mangaResults.map((manga) => (
                  <MangaCard key={manga.mal_id} manga={manga} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="no-results"><div className="no-results-text">No results found for "{query}"</div></div>
      )}
    </div>
  );
};

export default SearchResults;