import React, { useContext } from "react";

import { StoreContext } from "../../store/LoggedAccountStore";

const Hamburger = () => {
  const { show } = useContext(StoreContext);
  const { exit } = useContext(StoreContext);
  const { showHamburger } = useContext(StoreContext);
  const { hideHamburger } = useContext(StoreContext);

  return (
    <div className="hamburger">
      <i
        className="fas fa-hamburger activehamburger"
        ref={show}
        onClick={() => showHamburger()}
      ></i>
      <i
        className="fas fa-times hidden"
        ref={exit}
        onClick={() => hideHamburger()}
      ></i>
    </div>
  );
};

export default Hamburger;
