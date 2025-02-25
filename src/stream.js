const STREAM_WS_URL = "wss://stream-service-t29h.onrender.com";
const CHAT_WS_URL = "wss://chat-service-1u5f.onrender.com";
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const streamId = urlParams.get("id");
  if (!streamId) return alert("No stream ID provided");

  const localVideo = document.getElementById("local-video");
  const remoteVideo = document.getElementById("remote-video");
  const screenshareBtn = document.getElementById("screenshare-btn");
  const chatMessages = document.getElementById("chat-messages");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const backBtn = document.getElementById("back-btn");

  let localStream, peerConnection;
  const ws = new WebSocket(`${STREAM_WS_URL}/${streamId}`);

  const startStream = async (isScreen = false) => {
    try {
      localStream = await navigator.mediaDevices.getUserMedia(
        isScreen
          ? { video: { mediaSource: "screen" } }
          : { video: true, audio: true }
      );
      localVideo.srcObject = localStream;

      peerConnection = new RTCPeerConnection();
      localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));

      peerConnection.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          ws.send(
            JSON.stringify({ type: "candidate", candidate: event.candidate })
          );
        }
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      ws.send(JSON.stringify({ type: "offer", offer }));
    } catch (error) {
      console.error("Stream error:", error);
    }
  };

  ws.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "offer") {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      ws.send(JSON.stringify({ type: "answer", answer }));
    } else if (data.type === "answer") {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    } else if (data.type === "candidate") {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  startStream();

  screenshareBtn.onclick = () => {
    localStream.getTracks().forEach((track) => track.stop());
    startStream(true);
  };

  const chatWs = new WebSocket(`${CHAT_WS_URL}/${streamId}?token=${token}`);
  chatWs.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    const div = document.createElement("div");
    div.textContent = `${msg.user}: ${msg.content}`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  chatForm.onsubmit = (e) => {
    e.preventDefault();
    const content = chatInput.value;
    chatWs.send(JSON.stringify({ content }));
    chatInput.value = "";
  };

  backBtn.onclick = () => (location.href = "/");
});
