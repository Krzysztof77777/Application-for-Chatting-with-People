import React, { useState } from "react";
import { useHistory } from "react-router";

import "../styles/RegisterLoginForm.scss";

import InfoModal from "./Modal/InfoModal.jsx";
import Loader from "./Loader.jsx";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [informationText, setInformationText] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageForModal, setMessageForModal] = useState(false);
  const [isShownLoader, setIsShownLoader] = useState(false);

  const history = useHistory();

  const handleState = (e, type) => {
    setInformationText(false);
    switch (type) {
      case "email":
        return setEmail(e.target.value);
    }
  };

  const resetState = () => {
    setEmail("");
  };

  const handleIsModalOpen = () => {
    setIsModalOpen(false);
  };

  const submitForm = (e) => {
    e.preventDefault();
    setIsShownLoader(true);
    fetch("/reset/password/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        Email: email,
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

  return (
    <>
      <main className="resetpassword">
        <h1>Reset your password</h1>
        <p className="resetinfo">
          To reset your password, enter your email below and submit. An email
          will be sent to you with instructions about how to complete the
          process.
        </p>
        <form
          onSubmit={submitForm}
          noValidate={true}
          className="resetpassword__form form"
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
          {informationText && <p className="info">{informationText}</p>}
          <input type="submit" value="Reset password" />
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
};

export default ResetPassword;
