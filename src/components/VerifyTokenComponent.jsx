import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import Loader from "./Loader.jsx";

const VerifyToken = () => {
  const [content, setContent] = useState(false);
  const [isShownLoader, setIsShownLoader] = useState(true);

  const history = useHistory();

  useEffect(() => {
    checkCorrectLink();
  }, []);

  const checkCorrectLink = () => {
    fetch(window.location.pathname, {
      method: "HEAD",
    })
      .then((r) => r.json())
      .then((data) => {
        setIsShownLoader(false);
        setContent(data.message);
        if (data.isConfirmed) {
          return setTimeout(() => {
            history.push({ pathname: "/" });
          }, 4000);
        }
      });
  };

  return (
    <>
      {content && <p>{content}</p>}
      {isShownLoader && <Loader></Loader>}
    </>
  );
};

export default VerifyToken;
