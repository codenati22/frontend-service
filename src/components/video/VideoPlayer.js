import React, { useEffect, useRef, useState } from "react";
import { useApiError, ErrorDisplay } from "../../utils/errorHandler";
import "./VideoPlayer.css";

const VideoPlayer = ({ streamId }, ref) => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { error, handleError } = useApiError();
  const ws = useRef(null);
  const pc = useRef(null);
  const isMounted = useRef(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const initializePeerConnection = () => {
    if (pc.current && pc.current.signalingState !== "closed") return;
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pc.current.onicecandidate = (event) => {
      if (event.candidate && ws.current?.readyState === WebSocket.OPEN) {
        console.log("Sending ICE candidate:", event.candidate);
        ws.current.send(
          JSON.stringify({ type: "candidate", candidate: event.candidate })
        );
      }
    };
    pc.current.ontrack = (event) => {
      console.log("Received remote track:", event.streams[0]);
      videoRef.current.srcObject = event.streams[0];
      setLoading(false);
    };
    pc.current.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", pc.current.iceConnectionState);
      if (pc.current.iceConnectionState === "failed") {
        handleError({ message: "ICE connection failed" });
      }
    };
    pc.current.onsignalingstatechange = () => {
      console.log("Signaling State:", pc.current.signalingState);
      if (pc.current.signalingState === "closed") {
        handleError({ message: "RTCPeerConnection closed" });
      }
    };
  };

  const connectWebSocket = () => {
    if (retryCount >= maxRetries) {
      handleError({
        message: "Failed to connect to signaling server after retries",
      });
      return;
    }

    ws.current = new WebSocket(
      `wss://stream-service-t29h.onrender.com/${streamId}`
    );

    ws.current.onopen = () => {
      console.log("WebSocket connected for signaling");
      setRetryCount(0);
      const token = localStorage.getItem("token");
      if (token && !isStreaming) {
        setIsStreaming(true);
        startStream();
      }
    };

    ws.current.onmessage = handleSignaling;
    ws.current.onerror = () => {
      console.error("Signaling WebSocket error");
      handleError({ message: "Signaling WebSocket failed" });
    };
    ws.current.onclose = () => {
      console.log("Signaling WebSocket closed");
      if (isMounted.current && retryCount < maxRetries) {
        setTimeout(connectWebSocket, 2000 * (retryCount + 1));
        setRetryCount((prev) => prev + 1);
      }
    };
  };

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    initializePeerConnection();
    connectWebSocket();

    return () => {
      isMounted.current = false;
      if (pc.current && pc.current.signalingState !== "closed") {
        pc.current.close();
      }
      if (ws.current) {
        ws.current.close();
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [streamId]);

  const startStream = async () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      handleError({ message: "WebSocket not ready for signaling" });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      stream.getTracks().forEach((track) => {
        if (pc.current.signalingState !== "closed") {
          pc.current.addTrack(track, stream);
        }
      });
      videoRef.current.srcObject = stream;
      console.log("Local stream added:", stream);

      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      console.log("Sending offer:", offer);
      ws.current.send(JSON.stringify({ type: "offer", offer }));
    } catch (err) {
      handleError({ message: `Failed to start stream: ${err.message}` });
    }
  };

  const handleSignaling = async (event) => {
    const data = JSON.parse(event.data);
    console.log("Received signaling message:", data);
    try {
      if (data.type === "offer") {
        await pc.current.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        console.log("Sending answer:", answer);
        ws.current.send(JSON.stringify({ type: "answer", answer }));
      } else if (data.type === "answer" && isStreaming) {
        await pc.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      } else if (data.type === "candidate") {
        await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        console.log("Added ICE candidate");
      }
    } catch (err) {
      handleError({ message: `Signaling error: ${err.message}` });
    }
  };

  const toggleScreenShare = async () => {
    if (!isStreaming || pc.current.signalingState === "closed") return;
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];
        const sender = pc.current
          .getSenders()
          .find((s) => s.track.kind === "video");
        sender.replaceTrack(screenTrack);
        screenTrack.onended = () => toggleScreenShare();
        setIsScreenSharing(true);
      } else {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const videoTrack = videoStream.getVideoTracks()[0];
        const sender = pc.current
          .getSenders()
          .find((s) => s.track.kind === "video");
        sender.replaceTrack(videoTrack);
        setIsScreenSharing(false);
      }
    } catch (err) {
      handleError({ message: `Screen share error: ${err.message}` });
    }
  };

  return (
    <div className="video-player">
      {loading && <div className="loading">Loading stream...</div>}
      <video ref={videoRef} autoPlay playsInline muted={isStreaming} />
      {isStreaming && (
        <div className="controls">
          <button onClick={toggleScreenShare}>
            {isScreenSharing ? "Stop Screen Share" : "Share Screen"}
          </button>
        </div>
      )}
      <ErrorDisplay error={error} />
    </div>
  );
};

export default React.forwardRef(VideoPlayer);
