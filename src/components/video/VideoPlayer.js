import React, { useRef, useEffect } from "react"; // Added useEffect import
import { useLocation } from "react-router-dom";
import "./VideoPlayer.css";

// Move WebSocket and WebRTC logic outside React lifecycle
const createPeerConnection = () => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });
  return pc;
};

const VideoPlayer = ({ streamId }) => {
  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const pcRef = useRef(createPeerConnection());
  const { state } = useLocation();
  const isStreamer = state?.isStreamer || false;

  const connectWebSocket = () => {
    const wsUrl = `wss://stream-service-t29h.onrender.com/${streamId}${
      isStreamer ? "?role=streamer" : "?role=viewer"
    }`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log(`${isStreamer ? "Streamer" : "Viewer"} WebSocket opened`);
      if (isStreamer) startStreaming();
    };

    wsRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log(`${isStreamer ? "Streamer" : "Viewer"} received:`, data);
      try {
        if (data.type === "offer" && !isStreamer) {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          console.log("Viewer sending answer:", answer);
          wsRef.current.send(JSON.stringify({ type: "answer", answer }));
        } else if (data.type === "answer" && isStreamer) {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
          console.log("Streamer set remote answer");
        } else if (data.type === "candidate") {
          await pcRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
          console.log(
            `${isStreamer ? "Streamer" : "Viewer"} added ICE candidate`
          );
        }
      } catch (err) {
        console.error(
          `${isStreamer ? "Streamer" : "Viewer"} signaling error:`,
          err
        );
      }
    };

    wsRef.current.onerror = (err) =>
      console.error(
        `${isStreamer ? "Streamer" : "Viewer"} WebSocket error:`,
        err
      );
    wsRef.current.onclose = () =>
      console.log(`${isStreamer ? "Streamer" : "Viewer"} WebSocket closed`);
  };

  const startStreaming = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 640, height: 360, frameRate: 15 },
        audio: true,
      })
      .then((stream) => {
        console.log("Streamer stream acquired:", stream);
        stream.getTracks().forEach((track) => {
          pcRef.current.addTrack(track, stream);
          console.log(`Streamer added track: ${track.kind}`);
        });
        videoRef.current.srcObject = stream;
        pcRef.current
          .createOffer()
          .then((offer) => pcRef.current.setLocalDescription(offer))
          .then(() => {
            if (wsRef.current.readyState === WebSocket.OPEN) {
              console.log(
                "Streamer sending offer:",
                pcRef.current.localDescription
              );
              wsRef.current.send(
                JSON.stringify({
                  type: "offer",
                  offer: pcRef.current.localDescription,
                })
              );
            }
          })
          .catch((err) => console.error("Streamer offer error:", err));
      })
      .catch((err) => console.error("Streamer media error:", err));
  };

  // Initialize outside useEffect to avoid Strict Mode double-mount
  if (!wsRef.current) {
    console.log(
      `${
        isStreamer ? "Streamer" : "Viewer"
      } initializing for stream ${streamId}`
    );
    pcRef.current.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        console.log(
          `${isStreamer ? "Streamer" : "Viewer"} sending ICE candidate:`,
          event.candidate
        );
        wsRef.current.send(
          JSON.stringify({ type: "candidate", candidate: event.candidate })
        );
      }
    };

    if (!isStreamer) {
      pcRef.current.ontrack = (event) => {
        console.log("Viewer received track:", event.streams[0]);
        videoRef.current.srcObject = event.streams[0];
      };
    }

    pcRef.current.oniceconnectionstatechange = () => {
      console.log(
        `${isStreamer ? "Streamer" : "Viewer"} ICE state:`,
        pcRef.current.iceConnectionState
      );
    };

    connectWebSocket();
  }

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      console.log(`${isStreamer ? "Streamer" : "Viewer"} unmounting`);
      if (pcRef.current) pcRef.current.close();
      if (wsRef.current) wsRef.current.close();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      wsRef.current = null; // Reset for next mount
      pcRef.current = null; // Reset for next mount
    };
  }, [streamId, isStreamer]);

  return (
    <div className="video-player">
      <video ref={videoRef} autoPlay playsInline muted={isStreamer} controls />
    </div>
  );
};

export default VideoPlayer;
// import React, { useEffect, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { useApiError, ErrorDisplay } from "../../utils/errorHandler";
// import "./VideoPlayer.css";

// const VideoPlayer = ({ streamId }, ref) => {
//   const videoRef = useRef(null);
//   const [isStreaming, setIsStreaming] = useState(false);
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const { error, handleError } = useApiError();
//   const ws = useRef(null);
//   const pc = useRef(null);
//   const isMounted = useRef(false);
//   const hasStartedStream = useRef(false); // Prevent multiple startStream calls
//   const [retryCount, setRetryCount] = useState(0);
//   const maxRetries = 3;
//   const token = localStorage.getItem("token");
//   const { state } = useLocation();
//   const isStreamer = state?.isStreamer || false;

//   const initializePeerConnection = () => {
//     if (pc.current && pc.current.signalingState !== "closed") return;
//     pc.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });
//     pc.current.onicecandidate = (event) => {
//       if (event.candidate && ws.current?.readyState === WebSocket.OPEN) {
//         console.log("Sending ICE candidate:", event.candidate);
//         ws.current.send(
//           JSON.stringify({ type: "candidate", candidate: event.candidate })
//         );
//       }
//     };
//     pc.current.ontrack = (event) => {
//       console.log("Received remote track:", event.streams[0]);
//       videoRef.current.srcObject = event.streams[0];
//       setLoading(false);
//     };
//     pc.current.oniceconnectionstatechange = () => {
//       console.log("ICE Connection State:", pc.current.iceConnectionState);
//       if (pc.current.iceConnectionState === "failed") {
//         handleError({ message: "ICE connection failed" });
//       }
//     };
//     pc.current.onsignalingstatechange = () => {
//       console.log("Signaling State:", pc.current.signalingState);
//       if (pc.current.signalingState === "closed") {
//         handleError({ message: "RTCPeerConnection closed" });
//       }
//     };
//   };

//   const connectWebSocket = async () => {
//     if (retryCount >= maxRetries) {
//       handleError({
//         message: "Failed to connect to signaling server after retries",
//       });
//       return;
//     }

//     ws.current = new WebSocket(
//       `wss://stream-service-t29h.onrender.com/${streamId}`
//     );

//     ws.current.onopen = async () => {
//       console.log("WebSocket connected for signaling");
//       setRetryCount(0);
//       if (token) {
//         if (isStreamer && !hasStartedStream.current) {
//           console.log("User is streamer, starting broadcast...");
//           setIsStreaming(true);
//           hasStartedStream.current = true;
//           await startStream();
//         } else if (!isStreamer) {
//           console.log("User is viewer, waiting for stream...");
//         } else {
//           console.log(
//             "Stream already started, skipping duplicate broadcast..."
//           );
//         }
//       } else {
//         console.log("No token, treating as viewer...");
//       }
//     };

//     ws.current.onmessage = handleSignaling;
//     ws.current.onerror = () => {
//       console.error("Signaling WebSocket error");
//       handleError({ message: "Signaling WebSocket failed" });
//     };
//     ws.current.onclose = () => {
//       console.log("Signaling WebSocket closed");
//       if (isMounted.current && retryCount < maxRetries) {
//         setTimeout(connectWebSocket, 2000 * (retryCount + 1));
//         setRetryCount((prev) => prev + 1);
//       }
//     };
//   };

//   useEffect(() => {
//     if (isMounted.current) return;
//     isMounted.current = true;

//     initializePeerConnection();
//     connectWebSocket();

//     return () => {
//       isMounted.current = false;
//       if (pc.current && pc.current.signalingState !== "closed") {
//         pc.current.close();
//       }
//       if (ws.current) {
//         ws.current.close();
//       }
//       if (videoRef.current?.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [streamId]);

//   const startStream = async () => {
//     if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
//       handleError({ message: "WebSocket not ready for signaling" });
//       return;
//     }
//     try {
//       console.log("Requesting media devices...");
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       console.log("Media stream acquired:", stream);
//       stream.getTracks().forEach((track) => {
//         if (pc.current.signalingState !== "closed") {
//           pc.current.addTrack(track, stream);
//           console.log(`Added track: ${track.kind}`);
//         }
//       });
//       videoRef.current.srcObject = stream;
//       console.log("Local stream set to video element");

//       const offer = await pc.current.createOffer();
//       console.log("Created offer:", offer);
//       await pc.current.setLocalDescription(offer);
//       console.log("Set local description with offer");
//       ws.current.send(JSON.stringify({ type: "offer", offer }));
//       console.log("Sent offer to signaling server");
//     } catch (err) {
//       handleError({ message: `Failed to start stream: ${err.message}` });
//     }
//   };

//   const handleSignaling = async (event) => {
//     const data = JSON.parse(event.data);
//     console.log("Received signaling message:", data);
//     try {
//       if (data.type === "offer" && !isStreaming) {
//         console.log("Processing offer...");
//         await pc.current.setRemoteDescription(
//           new RTCSessionDescription(data.offer)
//         );
//         console.log("Set remote description with offer");
//         const answer = await pc.current.createAnswer();
//         console.log("Created answer:", answer);
//         await pc.current.setLocalDescription(answer);
//         console.log("Set local description with answer");
//         ws.current.send(JSON.stringify({ type: "answer", answer }));
//         console.log("Sent answer to signaling server");
//       } else if (data.type === "answer" && isStreaming) {
//         console.log("Processing answer...");
//         if (pc.current.signalingState === "have-local-offer") {
//           await pc.current.setRemoteDescription(
//             new RTCSessionDescription(data.answer)
//           );
//           console.log("Set remote description with answer");
//         } else {
//           console.log("Ignoring answer: not in correct signaling state");
//         }
//       } else if (data.type === "candidate") {
//         console.log("Processing ICE candidate...");
//         if (pc.current.remoteDescription) {
//           await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//           console.log("Added ICE candidate successfully");
//         } else {
//           console.log("Ignoring ICE candidate: remote description not set");
//         }
//       }
//     } catch (err) {
//       console.error("Signaling error details:", err);
//       handleError({ message: `Signaling error: ${err.message}` });
//     }
//   };

//   const toggleScreenShare = async () => {
//     if (!isStreaming || pc.current.signalingState === "closed") return;
//     try {
//       if (!isScreenSharing) {
//         const screenStream = await navigator.mediaDevices.getDisplayMedia({
//           video: true,
//         });
//         const screenTrack = screenStream.getVideoTracks()[0];
//         const sender = pc.current
//           .getSenders()
//           .find((s) => s.track.kind === "video");
//         sender.replaceTrack(screenTrack);
//         screenTrack.onended = () => toggleScreenShare();
//         setIsScreenSharing(true);
//       } else {
//         const videoStream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//         });
//         const videoTrack = videoStream.getVideoTracks()[0];
//         const sender = pc.current
//           .getSenders()
//           .find((s) => s.track.kind === "video");
//         sender.replaceTrack(videoTrack);
//         setIsScreenSharing(false);
//       }
//     } catch (err) {
//       handleError({ message: `Screen share error: ${err.message}` });
//     }
//   };

//   return (
//     <div className="video-player">
//       {loading && <div className="loading">Loading stream...</div>}
//       <video ref={videoRef} autoPlay playsInline muted={isStreaming} />
//       {isStreaming && (
//         <div className="controls">
//           <button onClick={toggleScreenShare}>
//             {isScreenSharing ? "Stop Screen Share" : "Share Screen"}
//           </button>
//         </div>
//       )}
//       <ErrorDisplay error={error} />
//     </div>
//   );
// };

// export default React.forwardRef(VideoPlayer);
