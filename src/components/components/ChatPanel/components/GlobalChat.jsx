import React, { useEffect, useState, useRef, useContext } from "react";

import { StoreContext } from "../../../../store/LoggedAccountStore.jsx";
import { SocketStoreContext } from "../../../../store/SocketStore.jsx";

import Loader from "../../../Loader.jsx";
import Message from "./Message.jsx";

const abortController = new AbortController();
const { signal } = abortController;

const GlobalChat = () => {
  const { messagesOfGlobalChat } = useContext(StoreContext);
  const { setMessagesOfGlobalChat } = useContext(StoreContext);
  const { newGlobalMessage } = useContext(SocketStoreContext);
  const { sendSocketToRefreshGlobalChat } = useContext(SocketStoreContext);
  const { ourObjectID } = useContext(StoreContext);
  const { ourName } = useContext(StoreContext);
  const { ourSurname } = useContext(StoreContext);
  const { ourAvatar } = useContext(StoreContext);
  const { globalChatPanel } = useContext(StoreContext);
  const { refreshChat } = useContext(StoreContext);
  const [inputText, setInputText] = useState("");
  const [inputInfo, setInputInfo] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(false);
  const [isFetchDone, setIsFetchDone] = useState(false);
  const messagesContainer = useRef();

  useEffect(() => {
    setIsFirstRender(true);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [refreshChat]);

  useEffect(() => {
    if (isFirstRender) {
      setMessagesOfGlobalChat([...messagesOfGlobalChat, newGlobalMessage]);
    }
  }, [newGlobalMessage]);

  useEffect(() => {
    if (isFirstRender) {
      scrollMessagesToNewest();
    }
  }, [messagesOfGlobalChat]);

  const fetchMessages = () => {
    return fetch("/transferMessagesFromGlobalChat", {
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "get",
    })
      .then((r) => r.json())
      .then((data) => {
        if (signal.aborted) return;
        setIsFetchDone(true);
        setMessagesOfGlobalChat(data.messages);
      });
  };

  const sendMessage = () => {
    if (inputText.length < 3) return setInputInfo("min 3 characters");
    if (inputText.length > 300) return setInputInfo("max 300 characters");
    const date = new Date();
    const contentMessage = inputText;
    setInputText("");
    return fetch("/sendMessageToGlobalChat", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputText: contentMessage,
        date,
      }),
    })
      .then((r) => {
        if (r.status === 400) return window.location.reload();
        return r.json();
      })
      .then((data) => {
        if (data.sent) {
          const message = {
            date: date,
            message: {
              from: {
                ObjectID: ourObjectID,
                withName: ourName,
                withSurname: ourSurname,
                withAvatar: ourAvatar,
              },
              text: contentMessage,
            },
          };
          setMessagesOfGlobalChat([...messagesOfGlobalChat, message]);
          sendSocketToRefreshGlobalChat(message);
        }
      });
  };

  const handleState = (e) => {
    setInputText(e.target.value);
    setInputInfo(false);
  };

  const scrollMessagesToNewest = () => {
    if (
      messagesContainer.current === null ||
      messagesContainer.current === undefined
    )
      return;
    messagesContainer.current.scrollTop =
      messagesContainer.current.scrollHeight;
  };

  let dayOfLastMessage;

  const messageContent = messagesOfGlobalChat.map((e, index) => {
    const date = new Date(e.date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const dayInMonth = date.getDate();
    let dayInWeek = date.getDay();
    if (dayInWeek === 0) dayInWeek = 6;
    else dayInWeek--;
    let addDivider = false;
    if (dayOfLastMessage !== day && dayOfLastMessage) {
      addDivider = true;
    }
    dayOfLastMessage = day;
    return (
      <Message
        e={e}
        day={day}
        month={month}
        hour={hour}
        minutes={minutes}
        dayInMonth={dayInMonth}
        dayInWeek={dayInWeek}
        addDivider={addDivider}
        key={index}
      ></Message>
    );
  });

  const content = !isFetchDone ? (
    <Loader styles={{ position: "sticky" }}></Loader>
  ) : (
    <div className="globalchat" ref={globalChatPanel}>
      <div className="globalchat__from">
        <h2>Global Chat Of App</h2>
      </div>
      <div className="globalchat__messages" ref={messagesContainer}>
        <div>
          {messagesOfGlobalChat.length ? (
            messageContent
          ) : (
            <p className="messagesinfo">No messages</p>
          )}
        </div>
      </div>
      <div className="globalchat__send">
        {inputInfo && <p className="inputinfo">{inputInfo}</p>}
        <input
          type="text"
          value={inputText}
          placeholder="Type something to send..."
          onChange={(e) => handleState(e)}
          spellCheck="false"
        />
        <i className="fas fa-share" onClick={sendMessage}></i>
      </div>
    </div>
  );

  return content;
};

export default GlobalChat;
