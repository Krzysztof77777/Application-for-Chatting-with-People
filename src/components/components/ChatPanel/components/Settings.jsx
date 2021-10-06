import React, { useEffect, useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";

import { StoreContext } from "../../../../store/LoggedAccountStore.jsx";

import Loader from "../../../Loader.jsx";
import InfoModal from "../../../Modal/InfoModal.jsx";

const Settings = () => {
  const { idUserForChat } = useContext(StoreContext);
  const { setRefreshMenu } = useContext(StoreContext);
  const [isFetchDone, setIsFetchDone] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(false);
  const [surname, setSurname] = useState(false);
  const [image, setImage] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarIsChanged, setAvatarIsChanged] = useState(false);
  const [informationText, setInformationText] = useState(false);
  const backgroundImage = useRef();
  const inputFile = useRef();

  const history = useHistory();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    fetch("/transferProfile", {
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
        setAvatar(data.Avatar);
        setName(data.Name);
        setSurname(data.Surname);
        setIsFetchDone(true);
      });
  };

  const readURL = (file) => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = (e) => res(e.target.result);
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(file);
    });
  };

  const loadNewPhoto = async (e) => {
    setInformationText(false);
    const maxAllowedSize = 0.5 * 1024 * 1024;
    if (e.target.files.length) {
      if (e.target.files[0].size > maxAllowedSize) {
        e.target.value = "";
        setAvatarIsChanged(false);
        return setInformationText("The maximum size of the photo is 0.5mb");
      }
      if (
        e.target.files[0].type === "image/png" ||
        e.target.files[0].type === "image/jpeg" ||
        e.target.files[0].type === "image/svg+xml"
      ) {
        const file = e.target.files[0];
        const url = await readURL(file);
        setImage(file);
        backgroundImage.current.style.background = `url(${url})`;
        setAvatarIsChanged(true);
      } else {
        setAvatarIsChanged(false);
        return setInformationText("Not the correct photo type");
      }
    } else setAvatarIsChanged(false);
  };

  const handleIsModalOpen = () => {
    setIsModalOpen(false);
  };

  const updateChanges = async (e) => {
    e.preventDefault();
    if (avatarIsChanged) {
      await changeAvatarForAccount();
    }
    fetch("/updateChanges", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        name,
        surname,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.info) {
          return setInformationText(data.info);
        }
        if (data.done) {
          setIsModalOpen(true);
          return setTimeout(() => {
            setIsModalOpen(false);
          }, 4000);
        }
      });
  };

  const changeAvatarForAccount = () => {
    const formData = new FormData();
    formData.append("avatar", image);
    setAvatarIsChanged(false);
    setImage("");
    fetch("/changeAvatar", {
      method: "PATCH",
      body: formData,
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.done) setRefreshMenu((prevValue) => prevValue + 1);
      });
  };

  const handleState = (e, type) => {
    setInformationText(false);
    switch (type) {
      case "name":
        return setName(e.target.value);
      case "surname":
        return setSurname(e.target.value);
    }
  };

  const styles =
    avatar !== "" ? { background: `url(/uploads/${avatar})` } : null;

  const content = !isFetchDone ? (
    <Loader styles={{ position: "sticky" }}></Loader>
  ) : (
    <>
      <div className="settings">
        <div className="settings__avatarContainer">
          <div
            className="settings__defaultAvatar"
            ref={backgroundImage}
            style={styles}
          >
            <label>
              <input
                type="file"
                accept="image/*"
                ref={inputFile}
                onChange={(e) => loadNewPhoto(e)}
              />
              Choose photo
            </label>
          </div>
        </div>
        <form className="settings__buttons" onSubmit={(e) => updateChanges(e)}>
          <input
            type="text"
            effect="name"
            value={name}
            spellCheck="false"
            autoComplete="none"
            onChange={(e) => handleState(e, e.target.attributes.effect.value)}
          />
          <input
            type="text"
            effect="surname"
            value={surname}
            spellCheck="false"
            autoComplete="none"
            onChange={(e) => handleState(e, e.target.attributes.effect.value)}
          />
          <button
            onClick={() => {
              history.push({ pathname: "/account/change/password" });
            }}
          >
            Change password
          </button>
          <input type="submit" value="Confirm changes" />
          {informationText && <p className="info">{informationText}</p>}
        </form>
      </div>
      <InfoModal
        handleOnClose={handleIsModalOpen}
        isOpen={isModalOpen}
        shouldBeCloseOnOutsideClick={false}
      >
        <div className="modal__container">
          <p>Profile has been updated</p>
        </div>
      </InfoModal>
    </>
  );

  return content;
};

export default Settings;
