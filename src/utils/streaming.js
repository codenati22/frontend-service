const createPeerConnection = () => {
  return new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });
};

const initializeStreaming = (streamId, isStreamer, videoElement) => {
  const pc = createPeerConnection();
  const ws = new WebSocket(
    `wss://stream-service-t29h.onrender.com/${streamId}${
      isStreamer ? "?role=streamer" : "?role=viewer"
    }`
  );

  ws.onopen = () => {
    console.log(`${isStreamer ? "Streamer" : "Viewer"} WebSocket opened`);
    if (isStreamer) {
      navigator.mediaDevices
        .getUserMedia({
          video: { width: 640, height: 360, frameRate: 15 },
          audio: true,
        })
        .then((stream) => {
          console.log("Streamer stream acquired:", stream);
          stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
            console.log(`Streamer added track: ${track.kind}`);
          });
          videoElement.srcObject = stream;
          pc.createOffer()
            .then((offer) => pc.setLocalDescription(offer))
            .then(() => {
              if (ws.readyState === WebSocket.OPEN) {
                console.log("Streamer sending offer:", pc.localDescription);
                ws.send(
                  JSON.stringify({ type: "offer", offer: pc.localDescription })
                );
              }
            })
            .catch((err) => console.error("Streamer offer error:", err));
        })
        .catch((err) => console.error("Streamer media error:", err));
    }
  };

  ws.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    console.log(`${isStreamer ? "Streamer" : "Viewer"} received:`, data);
    try {
      if (data.type === "offer" && !isStreamer) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log("Viewer sending answer:", answer);
        ws.send(JSON.stringify({ type: "answer", answer }));
      } else if (data.type === "answer" && isStreamer) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        console.log("Streamer set remote answer");
      } else if (data.type === "candidate") {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
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

  pc.onicecandidate = (event) => {
    if (event.candidate && ws.readyState === WebSocket.OPEN) {
      console.log(
        `${isStreamer ? "Streamer" : "Viewer"} sending ICE candidate:`,
        event.candidate
      );
      ws.send(
        JSON.stringify({ type: "candidate", candidate: event.candidate })
      );
    }
  };

  if (!isStreamer) {
    pc.ontrack = (event) => {
      console.log("Viewer received track:", event.streams[0]);
      videoElement.srcObject = event.streams[0];
    };
  }

  pc.oniceconnectionstatechange = () => {
    console.log(
      `${isStreamer ? "Streamer" : "Viewer"} ICE state:`,
      pc.iceConnectionState
    );
  };

  ws.onerror = (err) =>
    console.error(
      `${isStreamer ? "Streamer" : "Viewer"} WebSocket error:`,
      err
    );
  ws.onclose = () =>
    console.log(`${isStreamer ? "Streamer" : "Viewer"} WebSocket closed`);

  return () => {
    console.log(`${isStreamer ? "Streamer" : "Viewer"} cleaning up`);
    pc.close();
    ws.close();
    if (videoElement.srcObject) {
      videoElement.srcObject.getTracks().forEach((track) => track.stop());
    }
  };
};

export default initializeStreaming;
