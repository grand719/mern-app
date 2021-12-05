/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import "./SideDrawer.css";

type SideDrawerTypes = {
  children: React.ReactChild | React.ReactChild[];
  show: boolean;
  onClick: () => void;
};

const SideDrawer = ({ children, show, onClick }: SideDrawerTypes) => {
  const content = (
    <CSSTransition
      in={show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={onClick}>
        {children}
      </aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(
    content,
    document.getElementById("drawer-hook") as HTMLDivElement,
  );
};

export default SideDrawer;
