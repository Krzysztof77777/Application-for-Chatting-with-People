import React, { useState, useRef, createContext } from "react";

export const StoreContext = createContext(null);

const LoggedAccountStore = ({ children }) => {
  const [socketFromFriendList, setSocketFromFriendList] = useState(false);
  const [messagesOfChat, setMessagesOfChat] = useState([]);
  const [messagesOfGlobalChat, setMessagesOfGlobalChat] = useState([]);
  const [avatarName, setAvatarName] = useState("");
  const [messagesCounter, setMessagesCounter] = useState([]);
  const [ourObjectID, setOurObjectID] = useState();
  const [ourName, setOurName] = useState();
  const [ourSurname, setOurSurname] = useState();
  const [ourAvatar, setOurAvatar] = useState();
  const [objectIDFromMessage, setObjectIDFromMessage] = useState("");
  const [newMessagesInChatWithUser, setNewMessagesInChatWithUser] = useState(0);
  const [activeChatElement, setActiveChatElement] = useState("home");
  const [idUserForChat, setIdUserForChat] = useState("");
  const [
    counterOfNewMessagesInMessagePanel,
    setCounterOfNewMessagesInMessagePanel,
  ] = useState(0);
  const [activeMenuElement, setActiveMenuElement] = useState("home");
  const [activeMessagePanelElement, setActiveMessagePanelElement] =
    useState("");
  const [chatWithName, setChatWithName] = useState("");
  const [chatWithSurname, setChatWithSurname] = useState("");
  const [refreshComponent, setRefreshComponent] = useState(0);
  const [refreshChat, setRefreshChat] = useState(0);
  const [refreshMenu, setRefreshMenu] = useState(0);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [isNewInvite, setIsNewInvite] = useState(false);
  const messagesPanel = useRef();
  const globalChatPanel = useRef();
  const chatWithUser = useRef();
  const chatPanel = useRef();
  const navigationSpan = useRef();
  const homeMenuElement = useRef();
  const messagesMenuElement = useRef();
  const usersMenuElement = useRef();
  const groupMenuElement = useRef();
  const settingsMenuElement = useRef();
  const menuPanel = useRef();
  const exit = useRef();
  const show = useRef();

  const showHamburger = () => {
    menuPanel.current.classList.add("showed");
    exit.current.className = "fas fa-times activehamburger";
    show.current.className = "fas fa-hamburger hidden";
  };

  const hideHamburger = () => {
    menuPanel.current.classList.remove("showed");
    exit.current.className = "fas fa-times hidden";
    show.current.className = "fas fa-hamburger activehamburger";
  };

  const handleActiveMenuElement = (type) => {
    setActiveMenuElement(type);
    switch (type) {
      case "home":
        setActiveChatElement(type);
        chatPanel.current.classList.add("logged--active");
        messagesPanel.current.classList.remove("logged--active");
        break;
      case "messages":
        chatPanel.current.classList.remove("logged--active");
        messagesPanel.current.classList.add("logged--active");
        setActiveMessagePanelElement("messages");
        break;
      case "friends":
        if (isNewInvite) {
          fetchUpdateMenuInformation();
          setIsNewInvite(false);
        }
        chatPanel.current.classList.remove("logged--active");
        messagesPanel.current.classList.add("logged--active");
        setActiveMessagePanelElement("friends");
        break;
      case "users":
        chatPanel.current.classList.remove("logged--active");
        messagesPanel.current.classList.add("logged--active");
        setActiveMessagePanelElement("users");
        break;
      case "settings":
        setActiveChatElement(type);
        chatPanel.current.classList.add("logged--active");
        messagesPanel.current.classList.remove("logged--active");
        break;
    }
    hideHamburger();
  };

  const fetchUpdateCounterOfNewMessages = (WITH) => {
    fetch("/updateCounterOfNewMessages", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        with: WITH,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.done) return setRefreshComponent((prevValue) => prevValue + 1);
      });
  };

  const fetchUpdateMenuInformation = () => {
    fetch("/updateMenuInformation", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
  };

  const logout = () => {
    fetch("/logout", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "get",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.logout) {
          return window.location.reload();
        }
      });
  };

  const fetchMenuPanelInformation = () => {
    fetch("/transferMenuInformation", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "get",
    })
      .then((r) => r.json())
      .then((data) => {
        setAvatarName(data.avatar);
        setIsNewInvite(data.panel.isNewInvite);
        setIsNewMessage(data.panel.isNewMessage);
      });
  };

  const moveSpanToActiveMenuElement = (element) => {
    let offsetTopMenuElement;

    switch (element) {
      case "home":
        offsetTopMenuElement = homeMenuElement.current.offsetTop;
        break;
      case "messages":
        offsetTopMenuElement = messagesMenuElement.current.offsetTop;
        break;
      case "friends":
        offsetTopMenuElement = groupMenuElement.current.offsetTop;
        break;
      case "users":
        offsetTopMenuElement = usersMenuElement.current.offsetTop;
        break;
      case "settings":
        offsetTopMenuElement = settingsMenuElement.current.offsetTop;
        break;
    }

    navigationSpan.current.style.transform = `translateY(${offsetTopMenuElement}px)`;
  };

  return (
    <StoreContext.Provider
      value={{
        ourObjectID,
        setOurObjectID,
        ourName,
        setOurName,
        ourSurname,
        setOurSurname,
        ourAvatar,
        setOurAvatar,
        activeMenuElement,
        setActiveMenuElement,
        activeMessagePanelElement,
        setActiveMessagePanelElement,
        handleActiveMenuElement,
        logout,
        moveSpanToActiveMenuElement,
        messagesPanel,
        chatPanel,
        navigationSpan,
        homeMenuElement,
        messagesMenuElement,
        usersMenuElement,
        groupMenuElement,
        settingsMenuElement,
        activeChatElement,
        setActiveChatElement,
        objectIDFromMessage,
        setObjectIDFromMessage,
        chatWithName,
        setChatWithName,
        chatWithSurname,
        setChatWithSurname,
        refreshComponent,
        setRefreshComponent,
        refreshChat,
        setRefreshChat,
        fetchMenuPanelInformation,
        isNewInvite,
        setIsNewInvite,
        isNewMessage,
        setIsNewMessage,
        fetchUpdateCounterOfNewMessages,
        fetchMenuPanelInformation,
        messagesCounter,
        setMessagesCounter,
        fetchUpdateMenuInformation,
        idUserForChat,
        setIdUserForChat,
        setAvatarName,
        avatarName,
        refreshMenu,
        setRefreshMenu,
        menuPanel,
        exit,
        show,
        showHamburger,
        hideHamburger,
        globalChatPanel,
        chatWithUser,
        messagesOfChat,
        setMessagesOfChat,
        messagesOfGlobalChat,
        setMessagesOfGlobalChat,
        counterOfNewMessagesInMessagePanel,
        setCounterOfNewMessagesInMessagePanel,
        newMessagesInChatWithUser,
        setNewMessagesInChatWithUser,
        socketFromFriendList,
        setSocketFromFriendList,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default LoggedAccountStore;
