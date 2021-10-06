import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import "../styles/NotLoggedAccount.scss";

import Loader from "./Loader.jsx";
import Message from "./components/ChatPanel/components/Message.jsx";

const abortController = new AbortController();
const { signal } = abortController;

const NotLoggedAccountComponent = () => {
  const [messages, setMessages] = useState([]);
  const [isFetchDone, setIsFetchDone] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(false);
  const messagesContainer = useRef();

  useEffect(() => {
    setIsFirstRender(true);
  }, []);

  useEffect(() => {
    fetchMessages();
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (isFirstRender) {
      scrollMessagesToNewest();
    }
  }, [messages]);

  const fetchMessages = () => {
    fetch("/transferMessagesFromGlobalChat", {
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((r) => r.json())
      .then((data) => {
        if (signal.aborted) return;
        setIsFetchDone(true);
        setMessages(data.messages);
      });
  };

  const scrollMessagesToNewest = () => {
    messagesContainer.current.scrollTop =
      messagesContainer.current.scrollHeight;
  };

  let dayOfLastMessage;

  const messageContent = messages.map((e, index) => {
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
    <div className="globalchat">
      <div className="globalchat__from">
        <h2>Global Chat Of App</h2>
      </div>
      <div className="globalchat__messages" ref={messagesContainer}>
        <div>
          {messages.length ? (
            messageContent
          ) : (
            <p className="messagesinfo">No messages</p>
          )}
        </div>
      </div>
      <div className="globalchat__send">
        <input
          type="text"
          value=""
          disabled
          placeholder="Type something to send..."
        />
        <i className="fas fa-share disabled"></i>
      </div>
    </div>
  );

  return (
    <main className="notlogged">
      <article className="notlogged__chat">{content}</article>
      <article className="notlogged__login">
        <div>
          <p>To use the application,</p>
          <Link to="/login">Log in</Link>
          <p>If you do not already have an account,</p>
          <Link to="/registration">Register</Link>
        </div>
      </article>
    </main>
  );
};

export default NotLoggedAccountComponent;
