import React, { useContext } from "react";
import { GloBalState } from "../../../GlobalState";
// import axios from "axios";
import TimeAgo from "timeago-react";

const Message = ({ message, own, partner }) => {
  const state = useContext(GloBalState);
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = state.userAPI.user;

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={own ? user.avatar : partner?.avatar}
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">
        <TimeAgo datetime={message.createdAt} />
      </div>
    </div>
  );
};

export default React.memo(Message);
