import React, { useContext } from "react";

import { StoreContext } from "../../../../store/LoggedAccountStore";

const MessageFromRight = ({ element, day, month, hour, minutes }) => {
  const { idUserForChat } = useContext(StoreContext);
  const { setIdUserForChat } = useContext(StoreContext);
  const { setActiveChatElement } = useContext(StoreContext);
  const { setRefreshChat } = useContext(StoreContext);

  const styles =
    element.message.from.withAvatar !== ""
      ? { background: `url(/uploads/${element.message.from.withAvatar})` }
      : null;

  return (
    <div className="message message--fromRight">
      <div className="message__main main--fromRight">
        <div className="message__text text--fromRight">
          <p>{element.message.text}</p>
          <span className="span--fromRight"></span>
        </div>
        <div className="message__date">
          <div className="div--fromRight">
            <p>
              {month < 10 ? "0" + month : month}-{day < 10 ? "0" + day : day}
            </p>
            <p>
              {hour < 10 ? "0" + hour : hour}:
              {minutes < 10 ? "0" + minutes : minutes}
              {hour < 10 ? " AM" : " PM"}
            </p>
          </div>
        </div>
      </div>
      <div
        className="message__avatarContainer"
        onClick={() => {
          if (idUserForChat !== element.message.from.ObjectID) {
            setIdUserForChat(element.message.from.ObjectID);
            setRefreshChat((prevValue) => prevValue + 1);
          }
          setActiveChatElement("showprofile");
        }}
      >
        <div className="message__defaultAvatar" style={styles}></div>
      </div>
    </div>
  );
};

export default MessageFromRight;
