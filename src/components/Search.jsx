import React, { useState } from 'react';
import axios from 'axios';
import './Search.css';

// Importing Lucide icons
import {
  Search as SearchIcon,
  MapPin,
  Users,
  BookOpen,
  CalendarDays,
  ExternalLink
} from 'lucide-react';

function Search() {
  const [userName, setUserName] = useState('');
  const [searchMode, setSearchMode] = useState('profile'); // 'profile' or 'project'
  const [profile, setProfile] = useState(null);
  const [lastRepo, setLastRepo] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError("Please enter a search term.");
      return;
    }

    try {
      if (searchMode === 'profile') {
        const profileResponse = await axios.get(`https://api.github.com/users/${userName}`);
        setProfile(profileResponse.data);

        const repoResponse = await axios.get(
          `https://api.github.com/users/${userName}/repos?sort=updated&per_page=1`
        );
        setLastRepo(repoResponse.data.length > 0 ? repoResponse.data[0] : null);
        setRepos([]);
      } else {
        const repoResponse = await axios.get(
          `https://api.github.com/search/repositories?q=${userName}&sort=updated&per_page=10`
        );
        setRepos(repoResponse.data.items);
        setProfile(null);
        setLastRepo(null);
      }

      setError(null);
    } catch (err) {
      setError("No results found");
      setProfile(null);
      setLastRepo(null);
      setRepos([]);
    }
  };

  return (
    <div className="main-container">
      <h1 className="main-heading">GitHub Profile & Project Detective</h1>

      <form onSubmit={handleSubmit} className="search-form">
        <select
          value={searchMode}
          onChange={(e) => setSearchMode(e.target.value)}
          className="search-mode"
        >
          <option value="profile">Search by Username</option>
          <option value="project">Search by Project Keyword</option>
        </select>

        <input
          type="text"
          placeholder={searchMode === 'profile' ? 'Enter GitHub Username' : 'Enter Project Keyword'}
          value={userName}
          className="search-input"
          onChange={(e) => setUserName(e.target.value)}
        />
        <button type="submit" className="search-btn">
          <SearchIcon size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Search
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {/* Profile Mode Output */}
      {profile && (
        <div className="profile-container">
          <img src={profile.avatar_url} alt="Profile" />
          <h2>{profile.name || "No Name Available"}</h2>
          <p>{profile.bio || "No Bio Available"}</p>

          <p><MapPin size={16} /> {profile.location || "Not Available"}</p>
          <p><BookOpen size={16} /> Public Repositories: {profile.public_repos}</p>
          <p><Users size={16} /> Followers: {profile.followers}</p>
          <p><CalendarDays size={16} /> Joined GitHub: {new Date(profile.created_at).toDateString()}</p>

          {lastRepo && (
            <div className="repo-container">
              <h3>Last Repository Added</h3>
              <p><strong>Name:</strong> {lastRepo.name}</p>
              <p><strong>Description:</strong> {lastRepo.description || "No description"}</p>
              <p><strong>Updated At:</strong> {new Date(lastRepo.updated_at).toDateString()}</p>

              <a href={lastRepo.html_url} target="_blank" rel="noopener noreferrer">
                View Full Repository <ExternalLink size={16} style={{ marginLeft: '6px' }} />
              </a>

              <p style={{ marginTop: '10px' }}>
                <strong>Deployed By:</strong>{' '}
                <a href={profile.html_url} target="_blank" rel="noopener noreferrer">
                  {profile.login} <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Project Mode Output */}
   {repos.length > 0 && (
  <div className="project-section">
    <h2 className="project-heading">🔍 Project Search Results</h2>
    <div className="project-grid">
      {repos.map((repo) => (
        <div key={repo.id} className="project-card animate-fadeInUp">
          <h3>{repo.name}</h3>
          <p>{repo.description || "📝 No description available"}</p>
          <p>🌟 Stars: {repo.stargazers_count}</p>
          <p>🧠 Language: {repo.language || "N/A"}</p>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            🔗 Repository Link <ExternalLink size={14} style={{ marginLeft: '6px' }} />
          </a>
          <a
            href={repo.owner.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="owner-link"
          >
            👤 Owner: {repo.owner.login} <ExternalLink size={14} style={{ marginLeft: '4px' }} />
          </a>
        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
}

export default Search;
