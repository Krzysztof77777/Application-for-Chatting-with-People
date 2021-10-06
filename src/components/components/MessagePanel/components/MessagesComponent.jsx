import React, { useContext, useEffect, useState } from "react";

import { StoreContext } from "../../../../store/LoggedAccountStore.jsx";

import Loader from "../../../Loader.jsx";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const { counterOfNewMessagesInMessagePanel } = useContext(StoreContext);
  const { setCounterOfNewMessagesInMessagePanel } = useContext(StoreContext);
  const [isFetchDone, setIsFetchDone] = useState(false);
  const { setObjectIDFromMessage } = useContext(StoreContext);
  const { setActiveChatElement } = useContext(StoreContext);
  const { setChatWithName } = useContext(StoreContext);
  const { setChatWithSurname } = useContext(StoreContext);
  const { refreshComponent } = useContext(StoreContext);
  const { setRefreshChat } = useContext(StoreContext);
  const { objectIDFromMessage } = useContext(StoreContext);
  const { fetchUpdateCounterOfNewMessages } = useContext(StoreContext);
  const { setMessagesCounter } = useContext(StoreContext);
  const { chatPanel } = useContext(StoreContext);
  const { messagesPanel } = useContext(StoreContext);
  const { isNewInvite } = useContext(StoreContext);
  const { isNewMessage } = useContext(StoreContext);
  const { setIsNewMessage } = useContext(StoreContext);

  useEffect(() => {
    fetchMessages();
  }, [inputText, refreshComponent]);

  const handleInputText = (e) => {
    setInputText(e.target.value);
  };

  const fetchMessages = () => {
    fetch("/transferMessages", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputText,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setIsFetchDone(true);
        setMessages(data.messages);
        const messages = [];
        let counterOfNewMessages = 0;
        for (const el of data.messages) {
          if (el.isNewMessageCounter) counterOfNewMessages++;
          messages.push({
            with: el.with,
            counter: el.isNewMessageCounter,
          });
        }
        setMessagesCounter(messages);
        setCounterOfNewMessagesInMessagePanel(counterOfNewMessages);
        if (isNewMessage && !counterOfNewMessages) setIsNewMessage(false);
      });
  };

  const showChatPanel = () => {
    chatPanel.current.classList.add("logged--active");
    messagesPanel.current.classList.remove("logged--active");
  };

  const mapMessages = messages.map((e) => {
    const styles =
      e.withAvatar !== ""
        ? { background: `url(/uploads/${e.withAvatar})` }
        : null;
    return (
      <div
        key={e.with}
        className="messagewith"
        onClick={() => {
          setChatWithName(e.withName);
          setChatWithSurname(e.withSurname);
          if (objectIDFromMessage !== e.with)
            setRefreshChat((prevValue) => prevValue + 1);
          setObjectIDFromMessage(e.with);
          if (e.isNewMessageCounter) {
            if (counterOfNewMessagesInMessagePanel === 1) {
              setIsNewMessage(false);
            }
            setCounterOfNewMessagesInMessagePanel((prevValue) => prevValue - 1);
          }
          showChatPanel();
          fetchUpdateCounterOfNewMessages(e.with);
          setActiveChatElement("messages");
        }}
      >
        <div className="messagewith__avatarContainer">
          <div className="messagewith__defaultAvatar" style={styles}></div>
        </div>
        <div className="messagewith__main">
          <p>
            {e.withName} {e.withSurname}
          </p>
          <p>
            {e.lastmessage.length < 20
              ? e.lastmessage
              : e.lastmessage.slice(0, 20) + "..."}
          </p>
        </div>
        {e.isNewMessageCounter ? <span>{e.isNewMessageCounter}</span> : null}
      </div>
    );
  });

  return (
    <>
      <div className="messages__search">
        <label>
          <input
            value={inputText}
            onChange={(e) => handleInputText(e)}
            type="text"
            placeholder="Search"
            spellCheck="false"
          />
          <i className="fas fa-search"></i>
        </label>
      </div>
      <div className="messages__main">
        {!isFetchDone ? (
          <Loader styles={{ position: "sticky", background: "none" }}></Loader>
        ) : messages.length ? (
          mapMessages
        ) : (
          <p className="messages__info">No search results</p>
        )}
      </div>
    </>
  );
};

export default Messages;
