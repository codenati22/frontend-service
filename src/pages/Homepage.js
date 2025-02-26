import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStreams, startStream } from "../utils/api";
import { useApiError, ErrorDisplay } from "../utils/errorHandler";
import Button from "../components/common/Button";
import "./Homepage.css";

function Homepage() {
  const [streams, setStreams] = useState([]);
  const [newStreamTitle, setNewStreamTitle] = useState("");
  const { error, handleError } = useApiError();
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
      handleError(err);
    }
  };

  const handleStartStream = async (e) => {
    e.preventDefault();
    if (!token) {
      handleError({ message: "Please log in to start a stream" });
      return navigate("/login");
    }
    try {
      console.log("Starting stream with token:", token);
      const { data } = await startStream(newStreamTitle, token);
      navigate(`/stream/${data.streamId}`);
    } catch (err) {
      console.error("Start stream error:", err);
      handleError(err);
    }
  };

  return (
    <main className="homepage fade-in">
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
          <div key={stream._id} className="stream-card slide-up">
            <h3>{stream.title}</h3>
            <p>By: {stream.owner.username}</p>
            <Button onClick={() => navigate(`/stream/${stream._id}`)}>
              Join
            </Button>
          </div>
        ))}
      </div>
      <ErrorDisplay error={error} />
    </main>
  );
}

export default Homepage;
