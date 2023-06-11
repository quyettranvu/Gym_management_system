import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatOnline = ({ currentId, setCurrentChat }) => {
  const [usersystem, setUsersystem] = useState([]);

  useEffect(() => {
    const getUsersystem = async () => {
      try {
        const res = await axios.get("/user/getallusers");
        setUsersystem(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getUsersystem();
  }, [usersystem]);

  const handleClick = async (usersystem) => {
    try {
      const res = await axios.get(
        `/api/conversations/find/${currentId}/${usersystem._id}`
      );

      if (res.data) {
        setCurrentChat(res.data);
      } else {
        const newConversationRes = await axios.post("/api/conversations", {
          senderId: currentId,
          receiverId: usersystem._id,
        });
        setCurrentChat(newConversationRes.data.savedConversation);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      {usersystem.map((usersystem) => (
        <div
          className="chatOnlineFriend"
          key={usersystem._id}
          onClick={() => handleClick(usersystem)}
        >
          <div className="chatOnlineImgContainer">
            <img className="chatOnlineImg" src={usersystem.avatar} alt="" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{usersystem.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatOnline;
