import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    profilePicture: "",
    socialLinks: {
      website: "",
      twitter: "",
      instagram: "",
      mal: "",
      anilist: "",
    },
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else if (name.startsWith("socialLinks.")) {
      const platform = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [platform]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validatePhone = (number) => {
    return /^\+([0-9] ?){6,14}[0-9]$/.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Only validate if phone number is provided
  if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
    setError("Please enter a valid international phone number (+country code) or leave blank");
    return;
  }

    try {
      const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup">
      <h1>Create Account</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            minLength="3"
            maxLength="30"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength="8"
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone (optional, +1234567890)"
            pattern="^\+[0-9 ]{6,14}[0-9]$"
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <h3>Address Information</h3>
          <input
            type="text"
            name="address.street"
            placeholder="Street Address"
            onChange={handleChange}
          />
          <input
            type="text"
            name="address.city"
            placeholder="City"
            onChange={handleChange}
          />
          <input
            type="text"
            name="address.state"
            placeholder="State/Province"
            onChange={handleChange}
          />
          <input
            type="text"
            name="address.zipCode"
            placeholder="Zip/Postal Code"
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <h3>Social Profiles</h3>
          <div className="social-links-group">
            <input
              type="url"
              name="socialLinks.website"
              placeholder="Website URL"
              pattern="https?://.*"
              onChange={handleChange}
            />
            <input
              type="url"
              name="socialLinks.twitter"
              placeholder="Twitter/X Profile URL"
              pattern="https?://(www\.)?x\.com/.*"
              onChange={handleChange}
            />
            <input
              type="url"
              name="socialLinks.instagram"
              placeholder="Instagram Profile URL"
              pattern="https?://(www\.)?instagram\.com/.*"
              onChange={handleChange}
            />
            <input
              type="url"
              name="socialLinks.mal"
              placeholder="MyAnimeList Profile URL"
              pattern="https?://(www\.)?myanimelist\.net/profile/.*"
              onChange={handleChange}
            />
            <input
              type="url"
              name="socialLinks.anilist"
              placeholder="AniList Profile URL"
              pattern="https?://(www\.)?anilist\.co/user/.*"
              onChange={handleChange}
            />
          </div>
        </div>

        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Signup;
