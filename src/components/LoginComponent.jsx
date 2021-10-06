import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";

import "../styles/RegisterLoginForm.scss";

import InfoModal from "./Modal/InfoModal.jsx";
import Loader from "./Loader.jsx";

const bc = new BroadcastChannel("test_channel");

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [informationText, setInformationText] = useState(false);
  const [
    isOpenModalAboutNotVerifyAccount,
    setIsOpenModalAboutNotVerifyAccount,
  ] = useState(false);
  const [
    emailFromModalAboutNotVerifyAccount,
    setEmailFromModalAboutNoVerifyAccount,
  ] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageForModal, setMessageForModal] = useState(false);
  const [isShownLoader, setIsShownLoader] = useState(false);

  const history = useHistory();

  const handleState = (e, type) => {
    setInformationText(false);
    switch (type) {
      case "email":
        return setEmail(e.target.value);
      case "password":
        return setPassword(e.target.value);
    }
  };

  const resetState = () => {
    setEmail("");
    setPassword("");
    setEmailFromModalAboutNoVerifyAccount(false);
    setIsOpenModalAboutNotVerifyAccount(false);
  };

  const handleIsModalOpen = () => {
    setIsModalOpen(false);
    setIsOpenModalAboutNotVerifyAccount(false);
    setEmailFromModalAboutNoVerifyAccount(false);
  };

  const resendActivationLink = () => {
    setIsShownLoader(true);
    setIsOpenModalAboutNotVerifyAccount(false);
    setIsModalOpen(false);
    setMessageForModal(false);
    fetch("/login/reset/verify/link", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        Email: emailFromModalAboutNotVerifyAccount,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setIsShownLoader(false);
        if (data.sendMessage) {
          setEmailFromModalAboutNoVerifyAccount(false);
          setMessageForModal("An Email sent to your account please verify");
          setIsModalOpen(true);
          return setTimeout(() => {
            setMessageForModal(false);
            setIsModalOpen(false);
            history.push({ pathname: "/login" });
          }, 4000);
        }
      });
  };

  const submitForm = (e) => {
    e.preventDefault();
    setIsShownLoader(true);
    fetch("/login/login", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        Email: email,
        Password: password,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setIsShownLoader(false);
        if (data.modalOpenWithVerify) {
          resetState();
          setEmailFromModalAboutNoVerifyAccount(data.email);
          setIsOpenModalAboutNotVerifyAccount(true);
          setMessageForModal(data.message);
          return setIsModalOpen(true);
        }
        if (data.logined) {
          resetState();
          setMessageForModal(data.message);
          setIsModalOpen(true);
          bc.postMessage("Refresh all");
          return setTimeout(() => {
            setMessageForModal(false);
            setIsModalOpen(false);
            history.push({ pathname: "/" });
          }, 4000);
        }
        if (data.message) return setInformationText(data.message);
      });
  };

  return (
    <>
      <main className="login">
        <h1>Sign In</h1>
        <form
          className="login__form form"
          onSubmit={submitForm}
          noValidate={true}
        >
          <label>
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              effect="email"
              value={email}
              placeholder="E-mail"
              spellCheck="false"
              autoComplete="none"
              onChange={(e) => handleState(e, e.target.attributes.effect.value)}
            />
          </label>
          <label>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              effect="password"
              value={password}
              placeholder="Password"
              spellCheck="false"
              autoComplete="none"
              onChange={(e) => handleState(e, e.target.attributes.effect.value)}
            />
          </label>
          {informationText && <p className="info">{informationText}</p>}
          <Link className="confirm" to="/reset/password">
            Forgot password ?
          </Link>
          <input type="submit" value="Login" />
        </form>
        <p className="question-about-account">
          Don't have an account? <Link to="/registration">Sign Up</Link>
        </p>
      </main>
      <InfoModal
        handleOnClose={handleIsModalOpen}
        isOpen={isModalOpen}
        shouldBeCloseOnOutsideClick={isOpenModalAboutNotVerifyAccount}
      >
        {!isOpenModalAboutNotVerifyAccount ? (
          <div className="modal__container">
            <p>{messageForModal}</p>
          </div>
        ) : (
          <>
            <div className="modal__container">
              <p>{messageForModal}</p>
              <button onClick={resendActivationLink} className="modal__resend">
                Resend the activation link
              </button>
              <button className="modal__exit" onClick={handleIsModalOpen}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </>
        )}
      </InfoModal>
      {isShownLoader && <Loader></Loader>}
    </>
  );
};

export default LoginComponent;
