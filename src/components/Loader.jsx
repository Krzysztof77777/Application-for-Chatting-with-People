import React from "react";

const Loader = ({ styles }) => {
  return (
    <div className="loader" style={styles}>
      <i className="fas fa-spinner"></i>
    </div>
  );
};

export default Loader;
