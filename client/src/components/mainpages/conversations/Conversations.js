import React, { useState, useEffect } from "react";
import axios from "axios";

const Conversations = ({ conversation, currentUser }) => {
  const [anotheruser, setAnotheruser] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    // const userIds = friendId.map((id) => id);
    // console.log(userIds);

    const getUser = async () => {
      try {
        const res = await axios.get("/user/allUsersId?userId=" + friendId);
        setAnotheruser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <img className="conversationImg" src={anotheruser?.avatar} alt="" />
      <span className="conversationName">{anotheruser?.name}</span>
    </div>
  );
};

export default Conversations;
