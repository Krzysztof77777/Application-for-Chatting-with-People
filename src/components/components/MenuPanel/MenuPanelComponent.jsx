import React, { useEffect, useContext } from "react";
import { debounce } from "throttle-debounce";

import { StoreContext } from "../../../store/LoggedAccountStore.jsx";

let activeElement = "home";

const MenuPanel = () => {
  const { activeMenuElement } = useContext(StoreContext);
  const { handleActiveMenuElement } = useContext(StoreContext);
  const { moveSpanToActiveMenuElement } = useContext(StoreContext);
  const { logout } = useContext(StoreContext);
  const { navigationSpan } = useContext(StoreContext);
  const { homeMenuElement } = useContext(StoreContext);
  const { messagesMenuElement } = useContext(StoreContext);
  const { usersMenuElement } = useContext(StoreContext);
  const { groupMenuElement } = useContext(StoreContext);
  const { settingsMenuElement } = useContext(StoreContext);
  const { isNewInvite } = useContext(StoreContext);
  const { isNewMessage } = useContext(StoreContext);
  const { avatarName } = useContext(StoreContext);
  const { refreshMenu } = useContext(StoreContext);
  const { fetchMenuPanelInformation } = useContext(StoreContext);
  const { menuPanel } = useContext(StoreContext);

  useEffect(() => {
    window.addEventListener("resize", debounce(500, moveSpan));

    return window.removeEventListener("resize", moveSpanToActiveMenuElement);
  }, []);

  useEffect(() => {
    moveSpanToActiveMenuElement(activeMenuElement);
    activeElement = activeMenuElement;
  }, [activeMenuElement]);

  useEffect(() => {
    fetchMenuPanelInformation();
  }, [refreshMenu]);

  const moveSpan = () => {
    moveSpanToActiveMenuElement(activeElement);
  };

  const styles =
    avatarName !== "" ? { background: `url(/uploads/${avatarName})` } : null;

  return (
    <article className="logged__menu menu" ref={menuPanel}>
      <div className="menu__profile profile">
        <div className="profile__container">
          <div className="profile__defaultAvatar" style={styles}></div>
          <div className="profile__status">
            <div className="profile__icon"></div>
          </div>
        </div>
      </div>
      <nav className="menu__navigation navigation">
        <span ref={navigationSpan} className="navigation__span"></span>
        <li
          type="home"
          ref={homeMenuElement}
          className={
            activeMenuElement === "home"
              ? "navigation__element navigation__element--active"
              : "navigation__element"
          }
          onClick={(e) =>
            handleActiveMenuElement(e.target.attributes.type.value)
          }
        >
          <i className="fas fa-home active"></i>
        </li>
        <li
          type="messages"
          ref={messagesMenuElement}
          className={
            activeMenuElement === "messages"
              ? "navigation__element navigation__element--active"
              : "navigation__element"
          }
          onClick={(e) =>
            handleActiveMenuElement(e.target.attributes.type.value)
          }
        >
          <i className="fas fa-comment-dots"></i>
          {isNewMessage && <span></span>}
        </li>
        <li
          type="friends"
          ref={groupMenuElement}
          className={
            activeMenuElement === "friends"
              ? "navigation__element navigation__element--active"
              : "navigation__element"
          }
          onClick={(e) =>
            handleActiveMenuElement(e.target.attributes.type.value)
          }
        >
          <i className="fas fa-user-friends"></i>
          {isNewInvite && <span></span>}
        </li>
        <li
          type="users"
          ref={usersMenuElement}
          className={
            activeMenuElement === "users"
              ? "navigation__element navigation__element--active"
              : "navigation__element"
          }
          onClick={(e) =>
            handleActiveMenuElement(e.target.attributes.type.value)
          }
        >
          <i className="fas fa-users"></i>
        </li>
        <li
          type="settings"
          ref={settingsMenuElement}
          className={
            activeMenuElement === "settings"
              ? "navigation__element navigation__element--active"
              : "navigation__element"
          }
          onClick={(e) =>
            handleActiveMenuElement(e.target.attributes.type.value)
          }
        >
          <i className="fas fa-cog"></i>
        </li>
      </nav>
      <div className="menu__logout">
        <i className="fas fa-sign-out-alt" onClick={logout}></i>
      </div>
    </article>
  );
};

export default MenuPanel;
