/* eslint-disable react/jsx-fragments */
/* eslint-disable react/destructuring-assignment */
import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";
import "./Modal.css";

type ModalOverlayType = {
  className?: string;
  headerClass?: string;
  contentClass?: string;
  footerClass?: string;
  header?: string;
  style?: React.CSSProperties;
  children: React.ReactChild | React.ReactChild[];
  footer?: any;
  onSubmit?: () => void;
};

const ModalOverlay = ({
  className,
  style,
  headerClass,
  header,
  contentClass,
  children,
  footerClass,
  footer,
  onSubmit,
}: ModalOverlayType) => {
  const content = (
    <div className={`modal ${className}`} style={style}>
      <header className={`modal__header ${headerClass}`}>
        <h2>{header}</h2>
      </header>
      <form onSubmit={onSubmit || ((event) => event.preventDefault())}>
        <div className={`modal__content ${contentClass}`}>{children}</div>
        <footer className={`modal__footer ${footerClass}`}>{footer}</footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(
    content,
    document.getElementById("modal-hook") as HTMLDivElement,
  );
};

type ModalType = ModalOverlayType & {
  show?: boolean;
  onCancel: () => void;
};

const Modal: React.FC<ModalType> = (props) => {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
