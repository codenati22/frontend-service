import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStreams, startStream } from "../utils/api";
import Button from "../components/common/Button";
import "./Homepage.css";

import StreamIcon from "../assets/stream-icon.png";

function Homepage() {
  const [streams, setStreams] = useState([]);
  const [newStreamTitle, setNewStreamTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

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
    setIsLoading(true);
    try {
      const { data } = await startStream(newStreamTitle, token);
      navigate(`/stream/${data.streamId}`, { state: { isStreamer: true } });
    } catch (err) {
      console.error("Start stream error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamClick = (streamId, ownerUsername) => {
    const isOwnStream = token && username && username === ownerUsername;
    console.log("Stream clicked:", {
      streamId,
      ownerUsername,
      isOwnStream,
      token,
    });
    if (isOwnStream) {
      navigate(`/stream/${streamId}`, { state: { isStreamer: true } });
    } else if (!token) {
      navigate("/login");
    } else {
      navigate(`/stream/${streamId}`, { state: { isStreamer: false } });
    }
  };

  return (
    <main className="homepage fade-in">
      <h1 className="cartoonish-title">Live Streams</h1>
      {token && (
        <form
          onSubmit={handleStartStream}
          className="start-stream-form glassmorphic"
        >
          <input
            type="text"
            placeholder="Stream Title"
            value={newStreamTitle}
            onChange={(e) => setNewStreamTitle(e.target.value)}
            required
            className="glassmorphic-input"
          />
          <Button
            type="submit"
            className="neuromorphic-button"
            disabled={isLoading}
          >
            {isLoading ? "Starting..." : "Start Stream"}
          </Button>
        </form>
      )}
      <div className="stream-list">
        {streams.length === 0 ? (
          <p className="cartoonish-text">No streams yet—start one!</p>
        ) : (
          streams.map((stream) => (
            <div key={stream._id} className="stream-card glassmorphic">
              <img src={StreamIcon} alt="Stream Icon" className="stream-icon" />
              <h3 className="cartoonish-text">{stream.title}</h3>
              <p className="cartoonish-text">By: {stream.owner.username}</p>
              <Button
                onClick={() =>
                  handleStreamClick(stream._id, stream.owner.username)
                }
                className="neuromorphic-button"
              >
                {token && username === stream.owner.username
                  ? "Resume"
                  : "Join"}
              </Button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default Homepage;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getStreams, startStream } from "../utils/api";
// import Button from "../components/common/Button";
// import "./Homepage.css";

// import StreamIcon from "../assets/stream-icon.png";

// function Homepage() {
//   const [streams, setStreams] = useState([]);
//   const [newStreamTitle, setNewStreamTitle] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchStreams();
//   }, []);

//   const fetchStreams = async () => {
//     try {
//       const { data } = await getStreams();
//       setStreams(data);
//     } catch (err) {
//       console.error("Fetch streams error:", err);
//     }
//   };

//   const handleStartStream = async (e) => {
//     e.preventDefault();
//     if (!token) return navigate("/login");
//     setIsLoading(true);
//     try {
//       const { data } = await startStream(newStreamTitle, token);
//       navigate(`/stream/${data.streamId}`, { state: { isStreamer: true } });
//     } catch (err) {
//       console.error("Start stream error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleJoinStream = (streamId) => {
//     navigate(`/stream/${streamId}`, { state: { isStreamer: false } });
//   };

//   return (
//     <main className="homepage fade-in">
//       <h1 className="cartoonish-title">Live Streams</h1>
//       {token && (
//         <form
//           onSubmit={handleStartStream}
//           className="start-stream-form glassmorphic"
//         >
//           <input
//             type="text"
//             placeholder="Stream Title"
//             value={newStreamTitle}
//             onChange={(e) => setNewStreamTitle(e.target.value)}
//             required
//             className="glassmorphic-input"
//           />
//           <Button
//             type="submit"
//             className="neuromorphic-button"
//             disabled={isLoading}
//           >
//             {isLoading ? "Starting..." : "Start Stream"}
//           </Button>
//         </form>
//       )}
//       <div className="stream-list">
//         {streams.length === 0 ? (
//           <p className="cartoonish-text">No streams yet—start one!</p>
//         ) : (
//           streams.map((stream) => (
//             <div key={stream._id} className="stream-card glassmorphic">
//               <img src={StreamIcon} alt="Stream Icon" className="stream-icon" />
//               <h3 className="cartoonish-text">{stream.title}</h3>
//               <p className="cartoonish-text">By: {stream.owner.username}</p>
//               <Button
//                 onClick={() => handleJoinStream(stream._id)}
//                 className="neuromorphic-button"
//               >
//                 Join
//               </Button>
//             </div>
//           ))
//         )}
//       </div>
//     </main>
//   );
// }

// export default Homepage;
