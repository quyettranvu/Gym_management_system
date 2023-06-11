import React, { useContext, useState, useEffect, useRef } from "react";
import { GloBalState } from "../../../GlobalState";
import ChatOnline from "../chatOnline/ChatOnline";
import Conversations from "../conversations/Conversations";
import Message from "../message/Message";
import axios from "axios";
import { io } from "socket.io-client";

const Messenger = () => {
  const state = useContext(GloBalState);
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = state.userAPI.user;
  const [partnerId, setPartnerId] = useState("");
  const [partner, setPartner] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const [token] = state.token;
  const scrollRef = useRef();

  //Handle arrival private message
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  //Handle updating messages
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  //Handle adding user and get users
  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [user]);

  useEffect(() => {
    if (token) {
      const getConversations = async () => {
        try {
          const res = await axios.get("/api/conversations/" + user._id);
          setConversations(res.data.userConversation);
        } catch (error) {
          console.log(error);
        }
      };

      getConversations();
    }
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChat) {
          const res = await axios.get("/api/messages/" + currentChat._id);
          setMessages(res.data.messages);
          const friendId = currentChat?.members.find((m) => m !== user._id);
          setPartnerId(friendId);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [currentChat]);

  useEffect(() => {
    const getPartnerInfo = async () => {
      try {
        if (partnerId) {
          const res = await axios.get(`/user/partnerinfor/${partnerId}`);
          setPartner(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getPartnerInfo();
  }, [partnerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    //send datas to socket server
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/api/messages", message);
      setMessages([...messages, res.data.savedMessage]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations.map((c) => (
              <div key={c._id} onClick={() => setCurrentChat(c)}>
                <Conversations conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages?.map((m) => (
                    <div key={m._id} ref={scrollRef}>
                      <Message
                        message={m}
                        own={m.sender === user._id}
                        partner={partner}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="Write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Отправлять
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Откройте одну беседу, чтобы начать чат.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline currentId={user._id} setCurrentChat={setCurrentChat} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
