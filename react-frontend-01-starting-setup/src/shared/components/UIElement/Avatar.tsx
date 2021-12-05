import React, { CSSProperties } from "react";

import "./Avatar.css";

type AvatarType = {
  className?: string,
  style?: CSSProperties | undefined,
  width?: number,
  image: string,
  alt: string,
}

const Avatar = ({
  className, style, width, image, alt,
}: AvatarType) => {
  return (
    <div className={`avatar ${className}`} style={style}>
      <img src={image} alt={alt} style={{ width, height: width }} />
    </div>
  );
};

export default Avatar;
