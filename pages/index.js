import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Box, Center, useRadioGroup, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useCollectionOnce,
} from "react-firebase-hooks/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQn6G5L2UHoe464ABRlpfy7ea9EBfXOfs",
  authDomain: "sigmachat-630af.firebaseapp.com",
  projectId: "sigmachat-630af",
  storageBucket: "sigmachat-630af.appspot.com",
  messagingSenderId: "992483407325",
  appId: "1:992483407325:web:5bd326c61a6e6ab0b67234",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'send' : 'received';
  return <Box>
   <img src={photoURL} ></img>
 <Text className={messageClass}>
      {text}
</Text>   
  </Box>;
}
function SignIn() {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
      .then((u) => {
        user = u;
      })
      .catch((error) => {});
  };
  return <button onClick={signInWithGoogle}>Sign in wigh Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign out</button>
  );
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    async function getMessages() {
      const q = query(collection(firestore, "messages"));
      onSnapshot(q, (qS) => {
        setMessages(qS.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      }
      );
    }

    getMessages();
  }, []);

  console.log(messages);
  return (
    <Box>
      {user ? (
        <Box>
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        </Box>
      ) : (
        <SignIn />
      )}
    </Box>
  );
}
