import React from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/video/VideoPlayer";
import Chat from "../components/chat/Chat";
import "./LivestreamRoom.css";

function LivestreamRoom() {
  const { streamId } = useParams();

  return (
    <main className="stream-room">
      <div className="video-container">
        <VideoPlayer streamId={streamId} />
      </div>
      <div className="chat-container">
        <Chat streamId={streamId} />
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
