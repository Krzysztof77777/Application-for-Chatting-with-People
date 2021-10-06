import React, { useEffect, useState, useRef, useContext } from "react";

import { StoreContext } from "../../../../store/LoggedAccountStore.jsx";
import { SocketStoreContext } from "../../../../store/SocketStore.jsx";

import Loader from "../../../Loader.jsx";

const Friends = () => {
  const [friendList, setFriendList] = useState([]);
  const { setObjectIDFromMessage } = useContext(StoreContext);
  const { setActiveChatElement } = useContext(StoreContext);
  const { setChatWithName } = useContext(StoreContext);
  const { setChatWithSurname } = useContext(StoreContext);
  const { objectIDFromMessage } = useContext(StoreContext);
  const { idUserForChat } = useContext(StoreContext);
  const { setIdUserForChat } = useContext(StoreContext);
  const { setRefreshChat } = useContext(StoreContext);
  const { refreshComponent } = useContext(StoreContext);
  const { chatWithUser } = useContext(StoreContext);
  const { sendSocketToRefreshFriendList } = useContext(SocketStoreContext);
  const { handleActiveMenuElement } = useContext(StoreContext);
  const [inputText, setInputText] = useState("");
  const [isFetchDone, setIsFetchDone] = useState(false);
  const sentInvitesULRef = useRef();
  const sentInvitesSpanRef = useRef();
  const incomingInvitesULRef = useRef();
  const incomingInvitesSpanRef = useRef();
  const friendListULRef = useRef();
  const friendListSpanRef = useRef();
  const { chatPanel } = useContext(StoreContext);
  const { messagesPanel } = useContext(StoreContext);

  useEffect(() => {
    fetchFriendList();
  }, [inputText, refreshComponent]);

  const fetchFriendList = () => {
    fetch("/transferFriendList", {
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
        setFriendList(data.friendList);
      });
  };

  const fetchAcceptInvitation = (WITH) => {
    setIsFetchDone(false);
    fetch("/acceptInvitation", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        WITH,
      }),
    })
      .then((r) => {
        if (r.status === 400) return window.location.reload();
        return r.json();
      })
      .then((data) => {
        if (data.sent) {
          fetchFriendList();
          sendSocketToRefreshFriendList(WITH, "add");
          if (WITH === idUserForChat) {
            setRefreshChat((prevValue) => prevValue + 1);
          }
        }
      });
  };

  const fetchRemoveInvitation = (WITH) => {
    setIsFetchDone(false);
    fetch("/removeInvitation", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({
        WITH,
      }),
    })
      .then((r) => {
        if (r.status === 400) return window.location.reload();
        return r.json();
      })
      .then((data) => {
        if (data.sent) {
          sendSocketToRefreshFriendList(WITH, "remove");
          fetchFriendList();
          if (WITH === idUserForChat) {
            setRefreshChat((prevValue) => prevValue + 1);
          }
          if (objectIDFromMessage === WITH) {
            if (chatWithUser.current) {
              handleActiveMenuElement("home");
            }
          }
        }
      });
  };

  const handleInputText = (e) => {
    setInputText(e.target.value);
  };

  const handleShowOrHideULElements = (ref) => {
    switch (ref) {
      case "friendlist":
        friendListULRef.current.classList.toggle("none");
        friendListSpanRef.current.classList.toggle("rotate");
        break;
      case "sentinvites":
        sentInvitesULRef.current.classList.toggle("none");
        sentInvitesSpanRef.current.classList.toggle("rotate");
        break;
      case "incominginvites":
        incomingInvitesULRef.current.classList.toggle("none");
        incomingInvitesSpanRef.current.classList.toggle("rotate");
        break;
    }
  };

  const showChatPanel = () => {
    chatPanel.current.classList.add("logged--active");
    messagesPanel.current.classList.remove("logged--active");
  };

  const filterInvitesSent = friendList.filter((e) => {
    if (e.inviteSent && !e.isAccepted) return e;
  });

  const mapInvitesSent = filterInvitesSent.map((e, index) => {
    const styles =
      e.withAvatar !== ""
        ? { background: `url(/uploads/${e.withAvatar})` }
        : null;
    return (
      <li key={index} className="users__user user">
        <div className="user__avatarContainer">
          <div className="user__defaultAvatar" style={styles}></div>
        </div>
        <p
          className="user__name"
          onClick={() => {
            if (idUserForChat !== e.with) {
              setIdUserForChat(e.with);
              setRefreshChat((prevValue) => prevValue + 1);
            }
            showChatPanel();
            setActiveChatElement("showprofile");
          }}
        >
          {e.withName} {e.withSurname}
        </p>
        <i
          className="far fa-times-circle remove"
          onClick={() => fetchRemoveInvitation(e.with)}
        ></i>
      </li>
    );
  });

  const filterIncomingInvites = friendList.filter((e) => {
    if (e.inComingInvite && !e.isAccepted) return e;
  });

  const mapIncomingInvites = filterIncomingInvites.map((e, index) => {
    const styles =
      e.withAvatar !== ""
        ? { background: `url(/uploads/${e.withAvatar})` }
        : null;
    return (
      <li key={index} className="users__user user">
        <div className="user__avatarContainer">
          <div className="user__defaultAvatar" style={styles}></div>
        </div>
        <p
          className="user__name"
          onClick={() => {
            if (idUserForChat !== e.with) {
              setIdUserForChat(e.with);
              setRefreshChat((prevValue) => prevValue + 1);
            }
            showChatPanel();
            setActiveChatElement("showprofile");
          }}
        >
          {e.withName} {e.withSurname}
        </p>
        <i
          className="far fa-check-circle confirm"
          onClick={() => fetchAcceptInvitation(e.with)}
        ></i>
        <i
          className="far fa-times-circle remove"
          onClick={() => fetchRemoveInvitation(e.with)}
        ></i>
      </li>
    );
  });

  const filterFriendList = friendList.filter((e) => {
    if (e.isAccepted) return e;
  });

  const mapFriendList = filterFriendList.map((e, index) => {
    const styles =
      e.withAvatar !== ""
        ? { background: `url(/uploads/${e.withAvatar})` }
        : null;
    return (
      <li key={index} className="users__user user">
        <div className="user__avatarContainer">
          <div className="user__defaultAvatar" style={styles}></div>
        </div>
        <p
          className="user__name"
          onClick={() => {
            if (idUserForChat !== e.with) {
              setIdUserForChat(e.with);
              setRefreshChat((prevValue) => prevValue + 1);
            }
            showChatPanel();
            setActiveChatElement("showprofile");
          }}
        >
          {e.withName} {e.withSurname}
        </p>
        <i
          className="far fa-comment"
          onClick={() => {
            setChatWithName(e.withName);
            setChatWithSurname(e.withSurname);
            if (objectIDFromMessage !== e.with)
              setRefreshChat((prevValue) => prevValue + 1);
            setObjectIDFromMessage(e.with);
            showChatPanel();
            setActiveChatElement("messages");
          }}
        ></i>
        <i
          className="far fa-times-circle remove"
          onClick={() => fetchRemoveInvitation(e.with)}
        ></i>
      </li>
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
      <div className="messages__users users">
        {!isFetchDone ? (
          <Loader
            styles={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              background: "none",
              height: "auto",
            }}
          ></Loader>
        ) : friendList.length ? (
          <>
            <nav>
              {mapInvitesSent.length ? (
                <li>
                  <p>
                    <i
                      ref={sentInvitesSpanRef}
                      onClick={() => handleShowOrHideULElements("sentinvites")}
                      className="fas fa-chevron-down"
                    ></i>
                    Invitations sent
                  </p>
                  <ul ref={sentInvitesULRef}>{mapInvitesSent}</ul>
                </li>
              ) : null}
              {mapIncomingInvites.length ? (
                <li>
                  <p>
                    <i
                      ref={incomingInvitesSpanRef}
                      onClick={() =>
                        handleShowOrHideULElements("incominginvites")
                      }
                      className="fas fa-chevron-down"
                    ></i>
                    Invitations incoming
                  </p>
                  <ul ref={incomingInvitesULRef}>{mapIncomingInvites}</ul>
                </li>
              ) : null}
              {mapFriendList.length ? (
                <li>
                  <p>
                    <i
                      ref={friendListSpanRef}
                      onClick={() => handleShowOrHideULElements("friendlist")}
                      className="fas fa-chevron-down"
                    ></i>
                    Friends list
                  </p>
                  <ul ref={friendListULRef}>{mapFriendList}</ul>
                </li>
              ) : null}
            </nav>
          </>
        ) : (
          <p className="users__info">No search results</p>
        )}
      </div>
    </>
  );
};

export default Friends;
