import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PlayerContext from './PlayerContext'; // Ensure this path is correct
import PlayerDetails from './components/PlayerDetails';

const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api/2412-ftb-et-web-ft/players";

const App = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPlayer, setNewPlayer] = useState({ name: '', owner: '', teamId: '' });

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        console.log('API Response:', data); // Log the response to check its structure

        // Check if the response has players data
        if (data && data.data && Array.isArray(data.data.players)) {
          setPlayers(data.data.players); // Set the players if they exist
        } else {
          setError('Invalid data format');
        }
      } catch (err) {
        setError('Failed to load players');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []); // Empty dependency array to run only once when the component mounts

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePlayer = (e) => {
    e.preventDefault();
    const newPlayerData = { ...newPlayer, id: Date.now() };  // Generate a unique ID
    setPlayers([...players, newPlayerData]);
    setNewPlayer({ name: '', owner: '', teamId: '' });  // Reset form
  };

  const handleDeletePlayer = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
    .then(response => response.json())
    .then(() => {
      setPlayers(players.filter(player => player.id !== id));
    })
    .catch(error => console.error("Error deleting player:", error));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PlayerContext.Provider value={players}>
      <div>
        <input
          type="text"
          placeholder="Search players"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Create Player Form */}
        <form onSubmit={handleCreatePlayer}>
          <input
            type="text"
            placeholder="Name"
            value={newPlayer.name}
            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Owner"
            value={newPlayer.owner}
            onChange={(e) => setNewPlayer({ ...newPlayer, owner: e.target.value })}
          />
          <input
            type="text"
            placeholder="Team ID"
            value={newPlayer.teamId}
            onChange={(e) => setNewPlayer({ ...newPlayer, teamId: e.target.value })}
          />
          <button type="submit">Create Player</button>
        </form>

        {/* Player List */}
        <div className="player-list">
          {filteredPlayers.map(player => (
            <div key={player.id} className="player-card">
              <img src={player.imageUrl} alt={player.name} />
              <h3>{player.name}</h3>
              <p>Owner: {player.owner}</p>
              <p>Team ID: {player.teamId}</p>
              <div className="player-actions">
                <Link to={`/player/${player.id}`}>See Details</Link>
                <button onClick={() => handleDeletePlayer(player.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PlayerContext.Provider>
  );
};

export default App;
