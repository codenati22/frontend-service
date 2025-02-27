import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";

function Chat({ streamId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const wsRef = useRef(null);
  const chatRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    wsRef.current = new WebSocket(
      `wss://chat-service-1u5f.onrender.com/${streamId}?token=${token}`
    );

    wsRef.current.onopen = () => console.log("Chat WebSocket connected");
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [
        ...prev,
        { user: data.user, content: data.content, timestamp: data.timestamp },
      ]);
    };
    wsRef.current.onerror = (err) =>
      console.error("Chat WebSocket error:", err);
    wsRef.current.onclose = () => console.log("Chat WebSocket closed");

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [streamId, token]);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (
      !message.trim() ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    )
      return;
    wsRef.current.send(JSON.stringify({ user: "me", content: message }));
    setMessage("");
  };

  return (
    <div className="chat">
      {!token && (
        <div>
          Please <a href="/login">login</a> to chat
        </div>
      )}
      <div className="chat-messages" ref={chatRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-message">
            <span className="chat-user">{msg.user}</span>: {msg.content}
          </div>
        ))}
      </div>
      {token && (
        <form onSubmit={sendMessage} className="chat-form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
}

export default Chat;
// import React, { useState, useEffect, useRef } from "react";
// import { useApiError, ErrorDisplay } from "../../utils/errorHandler";
// import "./Chat.css";

// function Chat({ streamId }) {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const { error, handleError } = useApiError();
//   const ws = useRef(null);
//   const chatRef = useRef(null);
//   const token = localStorage.getItem("token");
//   const [retryCount, setRetryCount] = useState(0);
//   const maxRetries = 5;

//   const connectWebSocket = () => {
//     if (!token || retryCount >= maxRetries) {
//       handleError({ message: "Chat unavailable after retries" });
//       return;
//     }

//     ws.current = new WebSocket(
//       `wss://chat-service-1u5f.onrender.com/${streamId}?token=${token}`
//     );

//     ws.current.onopen = () => {
//       console.log("Chat WebSocket connected");
//       setRetryCount(0);
//     };

//     ws.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setMessages((prev) => [
//         ...prev,
//         { user: data.user, content: data.content, timestamp: data.timestamp },
//       ]);
//     };

//     ws.current.onerror = () => {
//       console.error("Chat WebSocket error");
//     };

//     ws.current.onclose = () => {
//       console.log("Chat WebSocket closed");
//       if (retryCount < maxRetries) {
//         handleError({ message: "Chat connection failed. Retrying..." });
//         setTimeout(connectWebSocket, 2000 * Math.pow(2, retryCount));
//         setRetryCount((prev) => prev + 1);
//       }
//     };
//   };

//   useEffect(() => {
//     connectWebSocket();
//     return () => {
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, [streamId, token]);

//   useEffect(() => {
//     chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
//   }, [messages]);

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (
//       !message.trim() ||
//       !ws.current ||
//       ws.current.readyState !== WebSocket.OPEN
//     )
//       return;
//     ws.current.send(JSON.stringify({ user: "me", content: message }));
//     setMessage("");
//   };

//   return (
//     <div className="chat">
//       {!token && (
//         <div className="chat-login">
//           Please <a href="/login">login</a> to chat
//         </div>
//       )}
//       <div className="chat-messages" ref={chatRef}>
//         {messages.map((msg, idx) => (
//           <div key={idx} className="chat-message slide-up">
//             <span className="chat-user">{msg.user}</span>: {msg.content}
//           </div>
//         ))}
//       </div>
//       {token && (
//         <form onSubmit={sendMessage} className="chat-form">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Type a message..."
//             disabled={retryCount >= maxRetries}
//           />
//           <button type="submit" disabled={retryCount >= maxRetries}>
//             Send
//           </button>
//         </form>
//       )}
//       <ErrorDisplay error={error} />
//     </div>
//   );
// }

// export default Chat;
