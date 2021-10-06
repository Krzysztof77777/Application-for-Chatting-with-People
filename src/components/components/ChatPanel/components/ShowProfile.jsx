import React, { useEffect, useState, useContext, useCallback } from "react";

import { StoreContext } from "../../../../store/LoggedAccountStore.jsx";
import { SocketStoreContext } from "../../../../store/SocketStore.jsx";

import Loader from "../../../Loader.jsx";

const ShowProfile = () => {
  const { idUserForChat } = useContext(StoreContext);
  const { setChatWithName } = useContext(StoreContext);
  const { setChatWithSurname } = useContext(StoreContext);
  const { setObjectIDFromMessage } = useContext(StoreContext);
  const { setActiveChatElement } = useContext(StoreContext);
  const { setRefreshComponent } = useContext(StoreContext);
  const { refreshChat } = useContext(StoreContext);
  const { socketFromFriendList } = useContext(StoreContext);
  const { setSocketFromFriendList } = useContext(StoreContext);
  const { sendSocketToRefreshFriendList } = useContext(SocketStoreContext);
  const [isFetchDone, setIsFetchDone] = useState(true);
  const [name, setName] = useState(false);
  const [surname, setSurname] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [isFriend, setIsFriend] = useState(null);
  const [isAccepted, setIsAccepted] = useState(null);
  const [isIncomingInvite, setIsIncomingInvite] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [refreshChat]);

  useEffect(() => {
    if (socketFromFriendList) {
      if (idUserForChat === socketFromFriendList) fetchProfile();
      setSocketFromFriendList(false);
    }
  }, [socketFromFriendList]);

  const fetchProfile = () => {
    setIsFetchDone(false);
    fetch("/transferUser", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        idUserForChat,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setName(data.Name);
        setSurname(data.Surname);
        setAvatar(data.Avatar);
        setIsFriend(data.isFriend);
        setIsAccepted(data.isAccepted);
        setIsIncomingInvite(data.isIncomingInvite);
        setIsFetchDone(true);
      });
  };

  const addFriendFetch = () => {
    setIsFetchDone(false);
    fetch("/addFriend", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        id: idUserForChat,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sent) {
          sendSocketToRefreshFriendList(idUserForChat, "add");
          fetchProfile();
          return setRefreshComponent((prevValue) => prevValue + 1);
        }
      });
  };

  const fetchAcceptInvitation = () => {
    setIsFetchDone(false);
    fetch("/acceptInvitation", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        WITH: idUserForChat,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sent) {
          sendSocketToRefreshFriendList(idUserForChat, "add");
          fetchProfile();
          return setRefreshComponent((prevValue) => prevValue + 1);
        }
      });
  };

  const fetchRemoveInvitation = () => {
    setIsFetchDone(false);
    fetch("/removeInvitation", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({
        WITH: idUserForChat,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sent) {
          sendSocketToRefreshFriendList(idUserForChat, "remove");
          fetchProfile();
          return setRefreshComponent((prevValue) => prevValue + 1);
        }
      });
  };

  const styles =
    avatar !== "" ? { background: `url(/uploads/${avatar})` } : null;

  const content = !isFetchDone ? (
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
  ) : (
    <div className="showProfile">
      <div className="showProfile__avatarContainer">
        <div className="showProfile__defaultAvatar" style={styles}></div>
      </div>
      <p>
        {name} {surname}
      </p>
      <div className="showProfile__buttons">
        {isFriend ? (
          <>
            <button onClick={() => fetchRemoveInvitation()}>
              Remove from friends
            </button>
            <button
              onClick={() => {
                setChatWithName(name);
                setChatWithSurname(surname);
                setObjectIDFromMessage(idUserForChat);
                setActiveChatElement("messages");
              }}
            >
              Write a message
            </button>
          </>
        ) : null}
        {!isFriend && isAccepted === false && isIncomingInvite === false ? (
          <button onClick={() => fetchRemoveInvitation()}>
            Cancel your friend invitation
          </button>
        ) : null}
        {!isFriend && isAccepted === false && isIncomingInvite ? (
          <>
            <button onClick={() => fetchAcceptInvitation()}>
              Accept invitation
            </button>
            <button onClick={() => fetchRemoveInvitation()}>
              Not accept invitation
            </button>
          </>
        ) : null}
        {isFriend === false && isAccepted === null ? (
          <button onClick={() => addFriendFetch()}>Add to friends</button>
        ) : null}
      </div>
    </div>
  );

  return content;
};

export default ShowProfile;
