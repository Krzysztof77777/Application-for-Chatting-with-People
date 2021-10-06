import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import "../styles/RegisterLoginForm.scss";

import InfoModal from "./Modal/InfoModal.jsx";
import Loader from "./Loader.jsx";

const ChangePassword = () => {
  const [email, setEmail] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [informationText, setInformationText] = useState(false);
  const [isLoginedChecked, setIsLoginedChecked] = useState(false);
  const [isLogined, setIsLogined] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageForModal, setMessageForModal] = useState(false);
  const [isShownLoader, setIsShownLoader] = useState(false);

  const history = useHistory();

  useEffect(() => {
    checkLoginedAccount();
  }, []);

  const handleState = (e, type) => {
    setInformationText(false);
    switch (type) {
      case "currentpassword":
        return setCurrentPassword(e.target.value);
      case "newpassword":
        return setNewPassword(e.target.value);
      case "confirmnewpassword":
        return setConfirmNewPassword(e.target.value);
    }
  };

  const resetState = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleIsModalOpen = () => {
    setIsModalOpen(false);
  };

  const checkLoginedAccount = () => {
    fetch("/account/change/password/check/logined", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "get",
    })
      .then((r) => r.json())
      .then((data) => {
        setIsLoginedChecked(true);
        setIsLogined(data.logined);
        if (data.logined) setEmail(data.email);
      });
  };

  const submitForm = (e) => {
    e.preventDefault();
    setIsShownLoader(true);
    fetch("/account/change/password/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        Email: email,
        CurrentPassword: currentPassword,
        NewPassword: newPassword,
        ConfirmNewPassword: confirmNewPassword,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setIsShownLoader(false);
        if (data.done) {
          resetState();
          setMessageForModal(data.message);
          setIsModalOpen(true);
          return setTimeout(() => {
            setMessageForModal(false);
            setIsModalOpen(false);
            history.push({ pathname: "/" });
          }, 4000);
        }
        if (data.message) return setInformationText(data.message);
      });
  };

  const content = !isLogined ? (
    <p>Invalid link</p>
  ) : (
    <>
      <main className="changepassword">
        <h1>Change your password</h1>
        <form
          onSubmit={(e) => submitForm(e)}
          noValidate={true}
          className="changepassword__form form"
        >
          <label>
            <i className="fas fa-envelope"></i>
            <input
              style={{ textAlign: "center", padding: "15px 10px" }}
              type="email"
              value={email}
              disabled={true}
              spellCheck="false"
              autoComplete="none"
            />
          </label>
          <label>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              effect="currentpassword"
              value={currentPassword}
              placeholder="Current password"
              spellCheck="false"
              autoComplete="none"
              onChange={(e) => handleState(e, e.target.attributes.effect.value)}
            />
          </label>
          <label>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              effect="newpassword"
              value={newPassword}
              placeholder="New password"
              spellCheck="false"
              autoComplete="none"
              onChange={(e) => handleState(e, e.target.attributes.effect.value)}
            />
          </label>
          <label>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              effect="confirmnewpassword"
              value={confirmNewPassword}
              placeholder="Confirm new password"
              spellCheck="false"
              autoComplete="none"
              onChange={(e) => handleState(e, e.target.attributes.effect.value)}
            />
          </label>
          {informationText && <p className="info">{informationText}</p>}
          <input type="submit" value="Change password" />
        </form>
      </main>
      <InfoModal
        handleOnClose={handleIsModalOpen}
        isOpen={isModalOpen}
        shouldBeCloseOnOutsideClick={false}
      >
        <div className="modal__container">
          <p>{messageForModal}</p>
        </div>
      </InfoModal>
      {isShownLoader && <Loader></Loader>}
    </>
  );
  return <>{isLoginedChecked ? content : <Loader></Loader>}</>;
};

export default ChangePassword;
