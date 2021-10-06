import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import "../styles/RegisterLoginForm.scss";

import InfoModal from "./Modal/InfoModal.jsx";
import Loader from "./Loader.jsx";

const VerifyResetPassword = () => {
  const [email, setEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [informationText, setInformationText] = useState(false);
  const [isValidLink, setIsValidLink] = useState(false);
  const [isLinkChecked, setIsLinkChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageForModal, setMessageForModal] = useState(false);
  const [isShownLoader, setIsShownLoader] = useState(true);

  const history = useHistory();

  useEffect(() => {
    checkCorrectLink();
  }, []);

  const handleState = (e, type) => {
    setInformationText(false);
    switch (type) {
      case "password":
        return setPassword(e.target.value);
      case "confirmpassword":
        return setConfirmPassword(e.target.value);
    }
  };

  const resetState = () => {
    setPassword("");
    setConfirmPassword("");
  };

  const handleIsModalOpen = () => {
    setIsModalOpen(false);
  };

  const checkCorrectLink = () => {
    fetch(window.location.pathname, {
      method: "HEAD",
    })
      .then((r) => r.json())
      .then((data) => {
        setIsLinkChecked(true);
        setIsShownLoader(false);
        setIsValidLink(data.isValidLink);
        if (data.isValidLink) {
          setEmail(data.email);
        }
      });
  };

  const submitForm = (e) => {
    e.preventDefault();
    setIsShownLoader(true);
    fetch(window.location.pathname + "/change", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        Email: email,
        Password: password,
        ConfirmPassword: confirmPassword,
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
            history.push({ pathname: "/login" });
          }, 4000);
        }
        if (data.message) return setInformationText(data.message);
      });
  };

  const content = !isValidLink ? (
    <p>Invalid link</p>
  ) : (
    <>
      <main className="verifyresetpassword">
        <h1>Reset your password</h1>
        <form
          onSubmit={(e) => submitForm(e)}
          noValidate={true}
          className="verifyresetpassword__form form"
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
              effect="password"
              value={password}
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
              effect="confirmpassword"
              value={confirmPassword}
              placeholder="Confirm password"
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

  return <>{isLinkChecked ? content : <Loader></Loader>}</>;
};

export default VerifyResetPassword;
