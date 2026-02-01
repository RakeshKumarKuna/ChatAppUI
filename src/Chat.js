import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Chat.css"; // styles for Chat component

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState("Rakesh");
  const [input, setInput] = useState("");
  const [type, setType] = useState("text"); // "text", "image", "video", "link"
  const [mediaUrl, setMediaUrl] = useState("");

  // Fetch chat history on mount
  useEffect(() => {
    axios.get("http://localhost:8080/api/messages")
      .then(response => {
        setMessages(response.data);
        console.log("Fetched messages:", response.data);
        //alert(response)
      })
      .catch(error => console.error("Error fetching messages:", error));

    // Establish a WebSocket connection
    const socket = new WebSocket("ws://localhost:8080/chat");
    socket.onopen = () => console.log("Connected to chat server.");
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages(prev => [...prev, msg]);
    };
    socket.onclose = () => console.log("Disconnected from chat server.");
    setWs(socket);

    // Cleanup on unmount
    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (ws && input.trim() && sender.trim()) {
      const message = JSON.stringify({
        sender,
        content: input,
        type,
        mediaUrl: type !== "text" ? mediaUrl : ""
      });
      ws.send(message);
      setInput("");
      setMediaUrl("");
      setType("text");
    }
  };

  const deleteMessage = (id) => {
    axios.delete(`http://localhost:8080/api/messages/${id}`)
      .then(() => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
      })
      .catch(error => console.error("Error deleting message:", error));
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <div>
          <div className="chat__status">
            <span className={`chat__indicator ${(ws && ws.readyState === WebSocket.OPEN) ? 'online' : 'offline'}`}></span>
            <small className="chat__status-text">{(ws && ws.readyState === WebSocket.OPEN) ? 'Connected' : 'Disconnected — HTTP fallback'}</small>
          </div>
        </div>
        <div className="chat__name-wrap">
          <input
            className="chat__name"
            type="text"
            placeholder="Your name"
            value={sender}
            onChange={e => setSender(e.target.value)}
            aria-label="Your name"
          />
        </div>
      </div>

      <div className="chat__panel">
        <div className="chat__messages" role="log" aria-live="polite">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === sender ? 'message--self' : 'message--other'}`}>
              <div className="message__avatar">{msg.sender ? msg.sender.charAt(0).toUpperCase() : 'A'}</div>
              <div className="message__content">
                <div className="message__bubble">
                  {/*<div className="message__from">{msg.sender}</div>*/}
                  {msg.type === "text" && <div className="message__text">{msg.content}</div>}
                  {msg.type === "link" && <a className="message__link" href={msg.content} target="_blank" rel="noopener noreferrer">{msg.content}</a>}
                </div>
                <div className="message__meta">
                  <time className="message__time">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</time>
                  {msg.id && <button className="message__delete" onClick={() => deleteMessage(msg.id)}>Delete</button>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="chat__composer">
          <input
            className="chat__input"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Message input"
            autoFocus
          />

          <div className="chat__controls">
            <select className="chat__select" value={type} onChange={e => setType(e.target.value)} aria-label="Message type">
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="link">Link</option>
            </select>

            {type !== "text" && (
              <input
                className="chat__media"
                type="text"
                placeholder="Media URL"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                aria-label="Media URL"
              />
            )}

            <button className="chat__send" onClick={sendMessage} aria-label="Send message">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
