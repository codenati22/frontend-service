# Loca.Live

<div align="center">
  <img src="./src/assets/logo.png" alt="Loca.Live Logo" width="150" height="150" />
</div>

<pre align="center">
   <strong>Welcome to Loca.Live</strong>
a vibrant live streaming platform that connects creators and viewers
   in real-time with a playful, modern twist!
</pre>

Project Objective
Loca.Live is all about making live streaming effortless, engaging, and scalable. My mission:

Empower streamers to broadcast, resume, and stop streams with a sleek, intuitive UI.
Enable viewers to dive into live action and chat instantly.
Deliver a developer-friendly, modular platform using microservices and serverless tech.
Built with cutting-edge tools, Loca.Live blends WebRTC streaming with a neuromorphic/glassmorphic design, creating a seamless experience for all users.

### Tech Stack

- **Frontend:** React, Axios, CSS (Glassmorphism & Neuromorphism), WebRTC
- **Backend:** Node.js, Express, MongoDB, Mongoose, WebSocket (ws)
- **Infrastructure:** Render (Serverless), Microservices (API Gateway, Auth, Stream, Chat)
- **Dev Tools:** Git, GitHub, npm, ESLint, VS Code
- **External APIs:** STUN/TURN (Google STUN, OpenRelay TURN)
  
## Features 🚀

- **Live Streaming:** Real-time video/audio via WebRTC with low latency.
- **Interactive Chat:** WebSocket-powered messaging for instant viewer engagement.
- **Stunning UI:** Cartoonish, minimalist design with glassmorphic and neuromorphic flair, responsive across devices.
- **Stream Control:** Start, resume, and stop streams with secure user authentication.
- **Scalable Backend:** Microservices architecture for flexibility and growth.
- **Serverless Power:** Deployed on Render for effortless scaling and maintenance.

---

## Microservices Architecture 🏗️

Loca.Live thrives on a modular microservices setup:

- **API Gateway:** Routes all requests (auth, streams, chat) with Express, ensuring secure access.
- **Auth Service:** Handles signup, login, and token verification, powered by MongoDB and JWT.
- **Stream Service:** Manages stream lifecycle (start, stop, list) and WebRTC signaling via WebSocket.
- **Chat Service:** Enables real-time chat with WebSocket and MongoDB persistence.

Each service is a standalone Node.js app, keeping the system decoupled and robust.

---

## Serverless Deployment ☁️

Hosted on Render, Loca.Live leverages serverless magic:

- **Auto-Scaling:** Adapts to traffic spikes seamlessly.
- **Easy Deploys:** GitHub-integrated, one-click deployments.
- **Cost-Smart:** Free tier for microservices, HTTPS included.
- **Real-Time Ready:** Supports WebSocket for streaming and chat.

No server headaches—just pure focus on building an awesome experience!

---

## Live Demo 🎥

**Notice:** If it is not working, it might be in sleep mode (since I'm using Render's free tier). Contact me so I can wake all microservices.

👉 [**loca.live**](https://frontend-service-ykmr.onrender.com/)

## Screenshots 📸

<div align="center">
  <img src="./src/assets/snapshot1.jpg" alt="Sample Snapshot 1" width="800" />
  <p>Live Streaming in Action</p>
</div>

<div align="center">
  <img src="./src/assets/snapshot2.jpg" alt="Sample Snapshot 2" width="800" />
  <p>Real-Time Chat Vibes</p>
</div>

## Developer 💻

<div align="center">
  <p><strong>Crafted with ❤️ by Natnael Girma</strong></p>
  <p>
    <a href="https://github.com/codenati22">GitHub</a> | 
    <a href="https://t.me/n_a_t_n_a_e_l_g_i_r_m_a">Telegram</a> | 
    <a href="[linkdin](https://www.linkedin.com/in/natnael-girma-707a1a326?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)">LinkedIn</a>
  </p>
  <p>Ping me—I’d love to chat about streaming, code, or collabs! 🚀</p>
</div>

<div align="center">
  <img src="./src/assets/image.png" width="200" alt="Telegram QR Code" />
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</div>
