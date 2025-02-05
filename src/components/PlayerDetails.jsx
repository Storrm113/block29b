import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api/2412-ftb-et-web-ft/players";

const PlayerDetails = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();

        if (data?.data?.player) {
          setPlayer(data.data.player);
        } else {
          setError("Player not found");
        }
      } catch (err) {
        setError("Failed to load player details");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerDetails();
  }, [id]);

  if (loading) return <div>Loading player details...</div>;
  if (error) return <div>{error}</div>;
  if (!player) return <div>Player not found</div>;

  return (
    <div>
      <h2>{player.name}</h2>
      <p>Breed: {player.breed}</p>
      <p>Status: {player.status}</p>
      <img src={player.imageUrl} alt={player.name} width="200" />
    </div>
  );
};

export default PlayerDetails;
