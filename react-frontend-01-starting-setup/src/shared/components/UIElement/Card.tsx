/* eslint-disable react/require-default-props */
import React, { CSSProperties } from "react";

import "./Card.css";

type CardType = {
  className?: string;
  style?: CSSProperties | undefined;
  children?: React.ReactChild | React.ReactChild[];
};

const Card = ({ className, style, children }: CardType) => {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Card;
