import React, { useEffect, useState, useContext } from "react";

import { StoreContext } from "../store/LoggedAccountStore.jsx";

import LoggedAccountComponent from "./LoggedAccountComponent.jsx";
import NotLoggedAccountComponent from "./NotLoggedAccountComponent.jsx";
import Loader from "./Loader.jsx";

const HomePage = () => {
  const { setOurObjectID } = useContext(StoreContext);
  const { setOurName } = useContext(StoreContext);
  const { setOurSurname } = useContext(StoreContext);
  const { setOurAvatar } = useContext(StoreContext);
  const [isLoginedChecked, setIsLoginedChecked] = useState(false);
  const [isLogined, setIsLogined] = useState(false);

  useEffect(() => {
    checkLoginedAccount();
  }, []);

  const checkLoginedAccount = () => {
    fetch("/check/logined", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "get",
    })
      .then((r) => r.json())
      .then((data) => {
        setIsLogined(data.logined);
        if (data.logined) {
          setOurObjectID(data.objectID);
          setOurName(data.name);
          setOurSurname(data.surname);
          setOurAvatar(data.avatar);
        }
        setIsLoginedChecked(true);
      });
  };

  const content = isLogined ? (
    <LoggedAccountComponent></LoggedAccountComponent>
  ) : (
    <NotLoggedAccountComponent></NotLoggedAccountComponent>
  );
  return <>{isLoginedChecked ? content : <Loader></Loader>}</>;
};

export default HomePage;
