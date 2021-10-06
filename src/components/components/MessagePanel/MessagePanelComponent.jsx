import React, { useContext } from "react";

import { StoreContext } from "../../../store/LoggedAccountStore.jsx";

import Messages from "./components/MessagesComponent.jsx";
import Users from "./components/UsersComponent.jsx";
import Friends from "./components/friendsComponent.jsx";

const MessagePanel = () => {
  const { activeMessagePanelElement } = useContext(StoreContext);
  const { messagesPanel } = useContext(StoreContext);
  const { isNewInvite } = useContext(StoreContext);
  const { setIsNewInvite } = useContext(StoreContext);
  const { fetchUpdateMenuInformation } = useContext(StoreContext);

  let content;

  if (activeMessagePanelElement === "messages") {
    content = <Messages></Messages>;
  } else if (activeMessagePanelElement === "users") {
    content = <Users></Users>;
  } else if (activeMessagePanelElement === "friends") {
    content = <Friends></Friends>;
  }
  return (
    <article
      ref={messagesPanel}
      className="logged__messages messages"
      onClick={() => {
        if (activeMessagePanelElement === "friends" && isNewInvite) {
          setIsNewInvite(false);
          fetchUpdateMenuInformation();
        }
      }}
    >
      {content ? (
        content
      ) : (
        <div className="messages__search">
          <label>
            <input type="text" placeholder="Search" spellCheck="false" />
            <i className="fas fa-search"></i>
          </label>
        </div>
      )}
    </article>
  );
};

export default MessagePanel;
