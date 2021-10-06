import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";

import "../styles/RegisterLoginForm.scss";

import InfoModal from "./Modal/InfoModal.jsx";
import Loader from "./Loader";

const RegisterComponent = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regulationsAccepted, setRegulationsAccepted] = useState(false);
  const [informationText, setInformationText] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageForModal, setMessageForModal] = useState(false);
  const [isShownLoader, setIsShownLoader] = useState(false);

  const history = useHistory();

  const handleState = (e, type) => {
    setInformationText(false);
    switch (type) {
      case "name":
        return setName(e.target.value);
      case "surname":
        return setSurname(e.target.value);
      case "email":
        return setEmail(e.target.value);
      case "password":
        return setPassword(e.target.value);
      case "regulations":
        return setRegulationsAccepted((prevValue) => !prevValue);
    }
  };

  const resetState = () => {
    setName("");
    setSurname("");
    setEmail("");
    setPassword("");
    setRegulationsAccepted(false);
  };

  const handleIsModalOpen = () => {
    setIsModalOpen(false);
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!regulationsAccepted)
      return setInformationText("Confirm Terms & Conditions");
    setIsShownLoader(true);
    fetch("/registration/registration", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        Name: name,
        Surname: surname,
        Email: email,
        Password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsShownLoader(false);
        if (data.register) {
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
      <main className="registration">
        <h1>Sign Up</h1>
        <form
          className="registration__form"
          onSubmit={submitForm}
          noValidate={true}
        >
          <label>
            <i className="fas fa-user"></i>
            <input
              type="text"
              effect="name"
              value={name}
              placeholder="Name"
              spellCheck="false"
              autoComplete="none"
              onChange={(e) => handleState(e, e.target.attributes.effect.value)}
            />
          </label>
          <label>
            <i className="fas fa-user"></i>
            <input
              type="text"
              effect="surname"
              value={surname}
              placeholder="Surname"
              spellCheck="false"
              autoComplete="none"
              onChange={(e) => handleState(e, e.target.attributes.effect.value)}
            />
          </label>
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
          <label className="form__checked">
            <input
              type="checkbox"
              effect="regulations"
              id="regulations"
              checked={regulationsAccepted}
              onChange={(e) => handleState(e, e.target.attributes.effect.value)}
            />
            <label htmlFor="regulations">
              <i className="fas fa-check"></i>
            </label>
            <p>
              i read and agree to
              <Link to="/terms-and-conditions">Terms & Conditions</Link>
            </p>
          </label>
          {informationText && <p className="info">{informationText}</p>}
          <input type="submit" value="Create account" />
        </form>
        <p className="question-about-account">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
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

export default RegisterComponent;
