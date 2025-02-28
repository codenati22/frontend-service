Loca.Live
<p align="center"> <img src="./src/assets/logo.png" alt="Loca.Live Logo" width="150" height="150" /> </p> <p align="center"> <strong>Welcome to Loca.Live</strong>—a vibrant live streaming platform that connects creators and viewers in real-time with a playful, modern twist! </p>
Project Objective
Loca.Live is designed to make live streaming effortless, engaging, and scalable. Our mission is to:

Empower streamers to broadcast, resume, and stop streams with an intuitive UI.
Enable viewers to join live broadcasts and chat instantly.
Provide a developer-friendly, modular platform leveraging microservices and serverless technology.
Built with cutting-edge tools, Loca.Live combines WebRTC streaming with a neuromorphic and glassmorphic design for a seamless user experience.

Tools and Technologies
Frontend: React, Axios, CSS (Glassmorphism & Neuromorphism), WebRTC
Backend: Node.js, Express, MongoDB, Mongoose, WebSocket (ws)
Infrastructure: Render (Serverless), Microservices (API Gateway, Auth, Stream, Chat)
Dev Tools: Git, GitHub, npm, ESLint, VS Code
External APIs: STUN/TURN (Google STUN, OpenRelay TURN)
Features
Live Streaming: Real-time video and audio via WebRTC with low latency.
Interactive Chat: WebSocket-powered messaging for instant engagement.
Stunning UI: Cartoonish, minimalist design with responsive glassmorphic and neuromorphic elements.
Stream Control: Start, resume, and stop streams with secure authentication.
Scalable Backend: Microservices architecture for flexibility and growth.
Serverless Power: Deployed on Render for effortless scaling.
Microservices Architecture
Loca.Live thrives on a modular microservices setup:

API Gateway: Central routing for auth, stream, and chat requests using Express.
Auth Service: Manages signup, login, and token verification with MongoDB and JWT.
Stream Service: Oversees stream lifecycle and WebRTC signaling via WebSocket.
Chat Service: Powers real-time chat with WebSocket and MongoDB persistence.
Each service is a standalone Node.js application, ensuring scalability and maintainability.

Serverless Deployment
Hosted on Render, Loca.Live leverages serverless benefits:

Auto-Scaling: Dynamically adjusts to traffic demands.
Easy Deployment: GitHub-integrated, one-click deploys.
Cost-Effective: Free tier with HTTPS support.
Real-Time: WebSocket compatibility for streaming and chat.
This setup eliminates server management, focusing resources on feature development.

Live Demo
<p><b>Notice:</b> If it’s not working, it might be in sleep mode due to Render’s free tier. Contact me to wake the microservices!</p> <p>Click here: <a href="https://frontend-service-ykmr.onrender.com/">Loca.Live</a></p>
Screenshots
<div> <p align="center"> <img src="./src/assets/snapshot1.jpg" alt="Sample Snapshot 1" width="800" height="415" /> <br>Live Streaming in Action </p> <p align="center"> <img src="./src/assets/snapshot2.jpg" alt="Sample Snapshot 2" width="800" height="415" /> <br>Real-Time Chat Vibes </p> </div>
Upload your snapshots to ./src/assets/ and ensure paths match or use external URLs.

Developer
<p align="center"> <strong>Crafted by Natnael Girma</strong><br> <a href="https://github.com/codenati22">GitHub</a> | <a href="https://t.me/n_a_t_n_a_e_l_g_i_r_m_a">Telegram</a> | <a href="https://www.linkedin.com/in/natnael-girma-707a1a326">LinkedIn</a><br> <em>Contact me—I’d love to discuss streaming, code, or collaborations!</em><br> <img src="./src/assets/image.png" alt="Telegram QR Code" width="200" /> </p>
Social links updated with your provided handles—adjust if needed!

Getting Started
Clone the Repository:
```bash
Wrap
Copy
git clone https://github.com/natnaelgirma22/frontend-service.git
cd frontend-service
Install Dependencies:
Frontend: cd live-stream-frontend && npm install
API Gateway: Clone api-gateway repo, then cd api-gateway && npm install
Stream Service: cd stream-service && npm install
Chat Service: cd chat-service && npm install
Set Environment Variables:
Create .env files in each service folder (refer to .env.example).
Include MONGO_URI, JWT_SECRET, and service URLs.
Run Locally:
Frontend: cd live-stream-frontend && npm start
API Gateway: cd api-gateway && npm start
Stream Service: cd stream-service && npm start
Chat Service: cd chat-service && npm start
Deploy:
Push to GitHub and connect to Render for each service.
```
Contributing
Enjoy Loca.Live? Want to enhance it?

Fork the repo, create a branch, and submit a pull request.
Report issues or suggest features at Issues.
License
This project is licensed under the MIT License—free to use, modify, and distribute.

<p align="center"> <strong>Loca.Live</strong>—Stream local, connect global. Let’s make waves together! </p>
