import React, { useEffect, useState, useContext } from "react";

import { StoreContext } from "../../../../store/LoggedAccountStore.jsx";
import { SocketStoreContext } from "../../../../store/SocketStore.jsx";

import Loader from "../../../Loader.jsx";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { idUserForChat } = useContext(StoreContext);
  const { setIdUserForChat } = useContext(StoreContext);
  const { setActiveChatElement } = useContext(StoreContext);
  const { setRefreshChat } = useContext(StoreContext);
  const { refreshComponent } = useContext(StoreContext);
  const [inputText, setInputText] = useState("");
  const [inputInfo, setInputInfo] = useState(false);
  const [isFetchDone, setIsFetchDone] = useState(false);
  const { chatPanel } = useContext(StoreContext);
  const { messagesPanel } = useContext(StoreContext);
  const { sendSocketToRefreshUserList } = useContext(SocketStoreContext);

  useEffect(() => {
    fetchUsers();
  }, [inputText, refreshComponent]);

  const fetchUsers = () => {
    setInputInfo(false);
    fetch("/transferUsers", {
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
        setUsers(data.users);
        if (data.users.length === 10) setInputInfo(true);
      });
  };

  const addFriendFetch = (id) => {
    setIsFetchDone(false);
    fetch("/addFriend", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        id,
      }),
    })
      .then((r) => {
        if (r.status === 400) return window.location.reload();
        return r.json();
      })
      .then((data) => {
        if (data.sent) {
          fetchUsers();
          sendSocketToRefreshUserList(id, "add");
          if (id === idUserForChat) {
            setRefreshChat((prevValue) => prevValue + 1);
          }
        }
      });
  };

  const showChatPanel = () => {
    chatPanel.current.classList.add("logged--active");
    messagesPanel.current.classList.remove("logged--active");
  };

  const handleInputText = (e) => {
    setInputText(e.target.value);
  };

  const mapUsers = users.map((e) => {
    const styles =
      e.Avatar !== "" ? { background: `url(/uploads/${e.Avatar})` } : null;
    return (
      <div key={e._id} className="users__user user">
        <div className="user__avatarContainer">
          <div className="user__defaultAvatar" style={styles}></div>
        </div>
        <p
          className="user__name"
          onClick={() => {
            if (idUserForChat !== e._id) {
              setIdUserForChat(e._id);
              setRefreshChat((prevValue) => prevValue + 1);
            }
            showChatPanel();
            setActiveChatElement("showprofile");
          }}
        >
          {e.Name} {e.Surname}
        </p>
        {!e.isFriend && e.isAccepted === false ? (
          <i className="far fa-envelope-open sentinvite"></i>
        ) : null}
        {!e.isFriend && e.isAccepted === null ? (
          <i
            className="fas fa-plus addtofriend"
            onClick={() => addFriendFetch(e._id)}
          ></i>
        ) : null}
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
        {inputInfo && <p className="searchinfo">Only 10 searches</p>}
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
        ) : users.length ? (
          mapUsers
        ) : (
          <p className="users__info">No search results</p>
        )}
      </div>
    </>
  );
};

export default Users;
