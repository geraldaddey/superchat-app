import React, { useState } from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  //config
  apiKey: "AIzaSyDGreFnjKdg5k8IuGHzUN4KZmN-F_g7MtI",
  authDomain: "superchat-42e45.firebaseapp.com",
  projectId: "superchat-42e45",
  storageBucket: "superchat-42e45.appspot.com",
  messagingSenderId: "267479339516",
  appId: "1:267479339516:web:0af2db71dc7f28aa7ae279",
  measurementId: "G-2R4Y6M66VJ",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <>
      <div className="App">
        {/* <header className="App-header"></header> */}
        <section>{user ? <ChatRoom /> : <SignIn />}</section>
      </div>
    </>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <Button variant="contained" onClick={signInWithGoogle}>
      Sign In With Google
    </Button>
  );
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.SignOut()}>Sign Out</button>
  );
}

function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
  };

  return (
    <>
      <div className="room-body">
        {messages &&
          messages.map((msg) => (
            <ChatMessage key={msg.uniqueId} message={msg} />
          ))}
      </div>

      <form onSubmit={sendMessage}>
        <TextField
          id="outlined-basic"
          label="Gerald"
          variant="outlined"
          value={formValue}
          style={{ color: "white", padding: "10px" }}
          onChange={(e) => setFormValue(e.target.value)}
        />

        <Button type="submit" variant="contained" color="primary">
          🔥{" "}
        </Button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="" />
      <p>{text}</p>
    </div>
  );
}

export default App;
