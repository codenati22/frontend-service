import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStreams, startStream } from "../utils/api";
import Button from "../components/common/Button";
import "./Homepage.css";

function Homepage() {
  const [streams, setStreams] = useState([]);
  const [newStreamTitle, setNewStreamTitle] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const { data } = await getStreams();
      setStreams(data);
    } catch (err) {
      console.error("Fetch streams error:", err);
    }
  };

  const handleStartStream = async (e) => {
    e.preventDefault();
    if (!token) return navigate("/login");
    try {
      const { data } = await startStream(newStreamTitle, token);
      navigate(`/stream/${data.streamId}`, { state: { isStreamer: true } });
    } catch (err) {
      console.error("Start stream error:", err);
    }
  };

  const handleJoinStream = (streamId) => {
    navigate(`/stream/${streamId}`, { state: { isStreamer: false } });
  };

  return (
    <main className="homepage">
      <h1>Live Streams</h1>
      {token && (
        <form onSubmit={handleStartStream} className="start-stream-form">
          <input
            type="text"
            placeholder="Stream Title"
            value={newStreamTitle}
            onChange={(e) => setNewStreamTitle(e.target.value)}
            required
          />
          <Button type="submit">Start Stream</Button>
        </form>
      )}
      <div className="stream-list">
        {streams.map((stream) => (
          <div key={stream._id} className="stream-card">
            <h3>{stream.title}</h3>
            <p>By: {stream.owner.username}</p>
            <Button onClick={() => handleJoinStream(stream._id)}>Join</Button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Homepage;
