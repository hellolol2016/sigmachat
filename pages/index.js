import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import {
  Box,
  Center,
  useRadioGroup,
  VStack,
  Text,
  Button,
  HStack,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

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
  const messageClass = uid === auth.currentUser?.uid ? "send" : "received";
  return (
    <Box
      m={3}
      bg={uid === auth.currentUser?.uid ? "#495057" : "#403d39"}
      borderRadius={5}
      boxShadow={
        "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
      }
    >
      <HStack>
        <img src={photoURL}></img>
        <Text className={messageClass}>{text}</Text>
      </HStack>
    </Box>
  );
}
function SignIn() {
  const provider = new GoogleAuthProvider();
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider)
      .then((u) => {
        console.log(u);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <Center>
      <VStack>
        <Text fontSize={"40"}>Sigma Chat</Text>
        <Text>The superior alternative to our competitor, AlphaChat!</Text>
        <Button m={"50"} onClick={signInWithGoogle}>
          Sign in wigh Google
        </Button>
        <Image src={"/smgs.png"} height={"200"} width={"600"} mt={"20"}></Image>
      </VStack>
    </Center>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <Button
        onClick={() =>
          signOut(auth).then(() => {
            console.log("rekt");
          })
        }
      >
        Sign out
      </Button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();

  const [messages, setMessages] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [formValue, setFormValue] = useState("");
  useEffect(() => {
    async function getMessages() {
      const q = query(collection(firestore, "messages"), orderBy("createdAt"));
      onSnapshot(q, (qS) => {
        setMessages(qS.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }

    getMessages();
  }, []);

  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        console.log("Enter key was pressed. Run your function.");
        event.preventDefault();
        document.querySelector('#submit').click();
      
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);


  
  const sendMessage = async (e) => {
if(e){
  e.preventDefault();
  }
    const { uid, photoURL } = auth.currentUser;

    if (formValue.length > 10) {
      await addDoc(collection(firestore, "messages"), {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        photoURL,
      });
    } else {
      alert("Message must be longer than 10 characters")
    }
    setFormValue("");
    dummy?.current.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <>
      <SignOut />

      <VStack>
        <Text fontSize={"30"}>SIGMACHAT</Text>
        <Box
          height={"80vh"}
          width={"60vw"}
          overflow={"scroll"}
          overflowX={"hidden"}
        >
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
          <div ref={dummy}></div>
        </Box>

        <form id="message-form" onSubmit={sendMessage}>
          <HStack>
            <Textarea
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="send a message!"
              width={"40vw"}
              resize={"vertical"}
              id="message-input"

            />
            <Button type="submit" id="submit">GO</Button>
          </HStack>
        </form>
      </VStack>

    </>
  );
}

export default function Home() {
  useAuthState(auth);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Sigmachat - the premiere chatting app"
        />
        <meta name="author" content="Dennis Wang" />
        <link rel="shortcut icon" href="/meagain.jpg" type="image/x-icon" />
        <meta property="og:site_name" content="Sigmachat" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/meagain.jpg" />
        <title>SigmaChat</title>
      </Head>
      <Box>{auth.currentUser ? <ChatRoom /> : <SignIn />}</Box>
    </>
  );
}
