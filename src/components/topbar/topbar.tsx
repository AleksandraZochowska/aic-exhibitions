import React from "react";
import "./topbar.scss";

const Topbar: React.FC = () => {
  return (
    <div className="topbar">
      <a className="topbar__link" href="/" rel="noopener noreferrer">
        <h1 className="topbar__link-text">The Art Institute of Chicago - Exhibitions</h1>
      </a>
    </div>
  );
};

export default Topbar;
