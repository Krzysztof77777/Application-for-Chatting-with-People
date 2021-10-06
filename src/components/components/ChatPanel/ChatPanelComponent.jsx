import React, { useContext } from "react";

import { StoreContext } from "../../../store/LoggedAccountStore.jsx";

import GlobalChat from "./components/GlobalChat.jsx";
import Settings from "./components/Settings.jsx";
import Chat from "./components/Chat.jsx";
import ShowProfile from "./components/ShowProfile.jsx";

const ChatPanel = () => {
  const { activeChatElement } = useContext(StoreContext);
  const { chatPanel } = useContext(StoreContext);
  const { isNewInvite } = useContext(StoreContext);
  const { setIsNewMessage } = useContext(StoreContext);
  const { objectIDFromMessage } = useContext(StoreContext);
  const { messagesCounter } = useContext(StoreContext);
  const { fetchUpdateCounterOfNewMessages } = useContext(StoreContext);
  const { setCounterOfNewMessagesInMessagePanel } = useContext(StoreContext);
  const { counterOfNewMessagesInMessagePanel } = useContext(StoreContext);

  let content;

  if (activeChatElement === "home") {
    content = <GlobalChat></GlobalChat>;
  } else if (activeChatElement === "settings") {
    content = <Settings></Settings>;
  } else if (activeChatElement === "messages") {
    content = <Chat></Chat>;
  } else if (activeChatElement === "showprofile") {
    content = <ShowProfile></ShowProfile>;
  }

  return (
    <article
      className="logged__chat logged--active"
      ref={chatPanel}
      onClick={() => {
        if (counterOfNewMessagesInMessagePanel) {
          for (const el of messagesCounter) {
            if (el.with === objectIDFromMessage && el.counter) {
              fetchUpdateCounterOfNewMessages(el.with);
              if (counterOfNewMessagesInMessagePanel === 1) {
                setIsNewMessage(false);
              }
              setCounterOfNewMessagesInMessagePanel(
                (prevValue) => prevValue - 1
              );
            }
          }
        }
      }}
    >
      {content}
    </article>
  );
};

export default ChatPanel;
