import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import VideoPlayer from "../components/video/VideoPlayer";
import Chat from "../components/chat/Chat";
import Button from "../components/common/Button";
import { stopStream } from "../utils/api";
import "./LivestreamRoom.css";

function LivestreamRoom() {
  const { streamId } = useParams();
  const { state } = useLocation();
  const isStreamer = state?.isStreamer || false;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleStopStream = async () => {
    if (!token) {
      console.error("No token available for stop stream");
      navigate("/login");
      return;
    }
    try {
      await stopStream(streamId, token);
      console.log("Stream stopped:", streamId);
      navigate("/");
    } catch (error) {
      console.error("Stop stream error:", error.response?.data || error);
    }
  };

  return (
    <main className="livestream-room">
      <div className="chat-container glassmorphic">
        <Chat streamId={streamId} />
      </div>
      <div className="video-container">
        <VideoPlayer streamId={streamId} />
        {isStreamer && (
          <div className="stream-controls">
            <Button
              onClick={handleStopStream}
              className="neuromorphic-button stop-button"
            >
              Stop Stream
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

export default LivestreamRoom;
// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import VideoPlayer from "../components/video/VideoPlayer";
// import Chat from "../components/chat/Chat";
// import { useApiError, ErrorDisplay } from "../utils/errorHandler";
// import "./LivestreamRoom.css";

// function LivestreamRoom() {
//   const { streamId } = useParams();
//   const videoRef = useRef(null);
//   const { error, handleError } = useApiError();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 5000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <main className="livestream-room fade-in">
//       {loading && <div className="room-loading">Connecting to stream...</div>}
//       <div className="video-container">
//         <VideoPlayer streamId={streamId} ref={videoRef} />
//       </div>
//       <div className="chat-container">
//         <Chat streamId={streamId} />
//       </div>
//       <ErrorDisplay error={error} />
//     </main>
//   );
// }

// export default LivestreamRoom;
