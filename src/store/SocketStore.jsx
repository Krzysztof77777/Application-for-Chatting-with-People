import React, { useEffect, useState, createContext, useContext } from "react";
import { io } from "socket.io-client";

import { StoreContext } from "./LoggedAccountStore.jsx";

export const SocketStoreContext = createContext(null);

let socket;

const audioOfNewMessage = new Audio("mixkit-message-pop-alert-2354.mp3");

const SocketStore = ({ children }) => {
  const { ourObjectID } = useContext(StoreContext);
  const { globalChatPanel } = useContext(StoreContext);
  const { chatPanel } = useContext(StoreContext);
  const { chatWithUser } = useContext(StoreContext);
  const { objectIDFromMessage } = useContext(StoreContext);
  const { messagesPanel } = useContext(StoreContext);
  const { setRefreshComponent } = useContext(StoreContext);
  const { setIsNewMessage } = useContext(StoreContext);
  const { setIsNewInvite } = useContext(StoreContext);
  const { setSocketFromFriendList } = useContext(StoreContext);
  const [firstRenderDone, setFirstRenderDone] = useState(false);
  const [newGlobalMessage, setNewGlobalMessage] = useState({});
  const [newChatMessage, setNewChatMessage] = useState({});
  const { fetchMenuPanelInformation } = useContext(StoreContext);

  useEffect(() => {
    setFirstRenderDone(true);
  }, [firstRenderDone]);

  useEffect(() => {
    if (firstRenderDone) {
      socket = io(`${window.location.origin}`, {
        auth: {
          user: ourObjectID,
        },
      });

      socket.on("message", (data) => {
        switch (data.event) {
          case "refreshGlobalChat":
            if (globalChatPanel.current) {
              setNewGlobalMessage(data.message);
              audioOfNewMessage.play();
            }
            break;
          case "refreshChat":
            if (
              chatWithUser.current &&
              data.objectIDFromMessage === ourObjectID
            ) {
              setNewChatMessage(data.message);
              audioOfNewMessage.play();
            }
            setIsNewMessage(true);
            if (messagesPanel.current.querySelector(".messages__main")) {
              setRefreshComponent((prevValue) => prevValue + 1);
            }
            break;
          case "refreshFriendList":
            if (chatPanel.current) {
              if (chatPanel.current.querySelector(".showProfile")) {
                setSocketFromFriendList(data.ourObjectID);
              }
            }
            if (!messagesPanel.current.querySelector(".messages__main")) {
              setRefreshComponent((prevValue) => prevValue + 1);
            }
            if (data.action === "remove" && chatWithUser.current) {
              setSocketFromFriendList(data.ourObjectID);
              if (messagesPanel.current.querySelector(".messages__main")) {
                setRefreshComponent((prevValue) => prevValue + 1);
              }
            }
            if (data.action === "remove") {
              fetchMenuPanelInformation();
              if (messagesPanel.current.querySelector(".messages__main")) {
                setRefreshComponent((prevValue) => prevValue + 1);
              }
            }
            break;
          case "refreshUserList":
            if (chatPanel.current) {
              if (chatPanel.current.querySelector(".showProfile")) {
                setSocketFromFriendList(data.ourObjectID);
              }
            }
            if (!messagesPanel.current.querySelector(".messages__main")) {
              setRefreshComponent((prevValue) => prevValue + 1);
            }
            if (data.action === "add") {
              setIsNewInvite(true);
            }
            break;
        }
      });
    }
  }, [ourObjectID]);

  const sendSocketToRefreshGlobalChat = (message) => {
    socket.emit("message", {
      event: "refreshGlobalChat",
      message,
      ourObjectID,
    });
  };

  const sendSocketToRefreshChat = (message) => {
    socket.emit("message", {
      event: "refreshChat",
      objectIDFromMessage,
      message,
    });
  };

  const sendSocketToRefreshFriendList = (id, action) => {
    socket.emit("message", {
      event: "refreshFriendList",
      action,
      id,
      ourObjectID,
    });
  };

  const sendSocketToRefreshUserList = (id, action) => {
    socket.emit("message", {
      event: "refreshUserList",
      action,
      id,
      ourObjectID,
    });
  };

  return (
    <SocketStoreContext.Provider
      value={{
        newGlobalMessage,
        newChatMessage,
        sendSocketToRefreshGlobalChat,
        sendSocketToRefreshChat,
        sendSocketToRefreshFriendList,
        sendSocketToRefreshUserList,
      }}
    >
      {children}
    </SocketStoreContext.Provider>
  );
};

export default SocketStore;
