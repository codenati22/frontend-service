import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";

function Chat({ streamId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const chatRef = useRef(null);
  const token = localStorage.getItem("token");
  const processedMessages = useRef(new Set());
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connectWebSocket = () => {
    if (!token) return;

    const wsUrl = `wss://chat-service-1u5f.onrender.com/${streamId}?token=${token}`;
    console.log(`Attempting to connect to chat WebSocket: ${wsUrl}`);
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("Chat WebSocket connected successfully");
      setIsConnecting(false);
      setError(null);
      reconnectAttempts.current = 0;
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const messageKey = data.timestamp;
      if (!processedMessages.current.has(messageKey)) {
        processedMessages.current.add(messageKey);
        setMessages((prev) => [
          ...prev,
          {
            userId: data.userId,
            user: data.user,
            content: data.content,
            timestamp: data.timestamp,
          },
        ]);
      } else {
        console.log("Filtered duplicate message with timestamp:", messageKey);
      }
    };

    wsRef.current.onerror = (err) => {
      console.error("Chat WebSocket error:", err);
      setError("Chat connection failed");
    };

    wsRef.current.onclose = (event) => {
      console.log("Chat WebSocket closed:", event.code, event.reason);
      setIsConnecting(true);
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current += 1;
        console.log(
          `Chat reconnecting attempt ${reconnectAttempts.current}/${maxReconnectAttempts}`
        );
        setTimeout(connectWebSocket, 1000 * reconnectAttempts.current);
      } else {
        setError("Chat connection lost");
        console.log("Max reconnect attempts reached");
      }
    };
  };

  useEffect(() => {
    console.log(
      "Chat component mounting with streamId:",
      streamId,
      "token:",
      token
    );
    connectWebSocket();

    return () => {
      console.log("Chat component unmounting");
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
    ) {
      console.log("Cannot send message: invalid state or empty message");
      return;
    }
    const messageData = { content: message };
    console.log("Sending chat message:", messageData);
    wsRef.current.send(JSON.stringify(messageData));
    setMessage("");
  };

  return (
    <div className="chat glassmorphic">
      {!token && (
        <div className="chat-login cartoonish-text">
          Please <a href="/login">login</a> to chat
        </div>
      )}
      {isConnecting && (
        <div className="chat-loading cartoonish-text">
          Connecting to chat...
        </div>
      )}
      {error && <div className="chat-error cartoonish-text">{error}</div>}
      <div className="chat-messages" ref={chatRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-message">
            <span className="chat-user cartoonish-text">{msg.user}</span>:{" "}
            <span className="chat-content">{msg.content}</span>
          </div>
        ))}
      </div>
      {token && (
        <form onSubmit={sendMessage} className="chat-form glassmorphic">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="chat-input"
          />
          <button
            type="submit"
            className="chat-send-button neuromorphic-button"
          >
            Send
          </button>
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
