import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
  if (!newMsg.trim()) return;

  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      text: newMsg,
      timestamp: serverTimestamp()
    });
    console.log("Message saved with ID:", docRef.id);
    setNewMsg('');
  } catch (error) {
    console.error("Firestore error:", error);
    alert("Failed to send: " + error.message);
  }
};

  return (
    <div style={{ padding: 20 }}>
      <h2>React Chat App</h2>
      <div style={{ marginBottom: '10px' }}>
        {messages.map((msg) => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </div>
      <input
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
