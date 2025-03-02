import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const { user, loading, updateUser } = useAuth(); // Destructure updateUser
  const navigate = useNavigate();

  const socialPlatforms = [
    { key: "website", name: "Website" },
    { key: "twitter", name: "Twitter" },
    { key: "instagram", name: "Instagram" },
    { key: "mal", name: "MyAnimeList" },
    { key: "anilist", name: "AniList" },
  ];

  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        updateUser(response.data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    if (user?._id && !user?.address) {
      fetchProfile();
    }
  }, [user, updateUser]);

  if (loading || !user) {
    return <div className="loading-spinner">🌀</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="cover-photo" />
        <div className="profile-photo">
          <img src={user.profilePicture} alt={user.username} />
        </div>
        <div className="profile-username">
    <h1>{user.username}</h1>
  </div>
      </div>
      <div className="profile-content">
        <div className="profile-main">
          <div className="info-card">
            <h2>Profile Details</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="icon">📧</span>
                <span className="value">{user.email}</span>
              </div>

              {user?.phoneNumber && (
                <div className="info-item">
                  <span className="icon">📱</span>
                  <span className="value">{user.phoneNumber}</span>
                </div>
              )}

              {user.address?.street && (
                <>
                  <div className="info-item">
                    <span className="icon">🏠</span>
                    <span className="value">{user.address.street}</span>
                  </div>
                  <div className="info-item">
                    <span className="icon">📍</span>
                    <span className="value">
                      {user.address.city}, {user.address.state}{" "}
                      {user.address.zipCode}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="info-card">
            <h2>Social Connections</h2>
            <div className="social-links">
              {socialPlatforms.map(
                (platform) =>
                  user.socialLinks?.[platform.key] && (
                    <a
                      key={platform.key}
                      href={user.socialLinks[platform.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <div className={`social-icon ${platform.key}-icon`}></div>
                      <span className="platform-name">{platform.name}</span>
                    </a>
                  )
              )}
            </div>
          </div>

          <div className="info-card">
            <h2>Activity Stats</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">1.2K</span>
                <span className="stat-label">Anime Watched</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">356</span>
                <span className="stat-label">Manga Read</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">58</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
