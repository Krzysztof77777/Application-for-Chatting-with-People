import React from "react";
import { Link } from "react-router-dom";

import "../styles/Error404.scss";

const Error404 = () => {
  return (
    <main className="error">
      <h1>Error 404</h1>
      <p>Oops! We can't find the page you were looking for</p>
      <Link to="/">Back to main page</Link>
    </main>
  );
};

export default Error404;
