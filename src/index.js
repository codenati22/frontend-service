const API_BASE_URL = "https://api-gateway-kxzj.onrender.com";
let token = localStorage.getItem("token") || null;

document.addEventListener("DOMContentLoaded", () => {
  const streamsContainer = document.getElementById("streams-container");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const startStreamBtn = document.getElementById("start-stream-btn");
  const authModal = document.getElementById("auth-modal");
  const closeModal = document.getElementById("close-modal");
  const authForm = document.getElementById("auth-form");
  const modalTitle = document.getElementById("modal-title");

  const fetchStreams = async () => {
    const response = await fetch(`${API_BASE_URL}/streams`);
    const streams = await response.json();
    streamsContainer.innerHTML = streams
      .map(
        (stream) => `
      <div class="stream-card" onclick="location.href='/stream.html?id=${stream._id}'">
        <h3>${stream.title}</h3>
        <p>By: ${stream.owner.username}</p>
      </div>
    `
      )
      .join("");
  };
  fetchStreams();

  const showModal = (type) => {
    modalTitle.textContent = type === "login" ? "Login" : "Signup";
    document.getElementById("username").style.display =
      type === "login" ? "none" : "block";
    authModal.style.display = "block";
  };

  loginBtn.onclick = () => showModal("login");
  signupBtn.onclick = () => showModal("signup");
  closeModal.onclick = () => (authModal.style.display = "none");

  authForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const endpoint = modalTitle.textContent === "Login" ? "login" : "signup";

    const body =
      endpoint === "login"
        ? { email, password }
        : { username, email, password };
    const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (data.token) {
      token = data.token;
      localStorage.setItem("token", token);
      authModal.style.display = "none";
      alert(
        `Successfully ${endpoint === "login" ? "logged in" : "signed up"}!`
      );
    } else {
      alert(data.error);
    }
  };

  startStreamBtn.onclick = async () => {
    if (!token) return alert("Please log in first!");
    const title = prompt("Enter stream title:");
    if (!title) return;

    const response = await fetch(`${API_BASE_URL}/streams/start-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });
    const data = await response.json();

    if (data.streamId) {
      location.href = `/stream.html?id=${data.streamId}`;
    } else {
      alert(data.error);
    }
  };
});
