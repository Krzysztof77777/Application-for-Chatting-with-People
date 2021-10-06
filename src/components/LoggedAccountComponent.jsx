import React from "react";

import "../styles/LoggedAccout.scss";

import MenuPanel from "./components/MenuPanel/MenuPanelComponent.jsx";
import MessagePanel from "./components/MessagePanel/MessagePanelComponent.jsx";
import ChatPanel from "./components/ChatPanel/ChatPanelComponent.jsx";
import Hamburger from "./Hamburger/Hamburger.jsx";

const bc = new BroadcastChannel("test_channel");

const LoggedAccountComponent = () => {
  bc.onmessage = function (ev) {
    window.location.reload();
  };
  return (
    <>
      <Hamburger></Hamburger>
      <main className="logged">
        <MenuPanel></MenuPanel>
        <MessagePanel></MessagePanel>
        <ChatPanel></ChatPanel>
      </main>
    </>
  );
};

export default LoggedAccountComponent;
