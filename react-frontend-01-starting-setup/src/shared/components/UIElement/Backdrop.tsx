/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import ReactDOM from "react-dom";

import "./Backdrop.css";

type BackdropType = {
  onClick: () => void;
}

const Backdrop = ({ onClick }: BackdropType) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={onClick} />,
    document.getElementById("backdrop-hook") as HTMLDivElement,
  );
};

export default Backdrop;
