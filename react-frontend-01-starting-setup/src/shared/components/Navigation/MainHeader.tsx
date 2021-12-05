import React from "react";

import "./MainHeader.css";

type MainHeaderType = {
  children?: React.ReactChild | React.ReactChild[];
};

const MainHeader = ({ children }: MainHeaderType) => {
  return <header className="main-header">{children}</header>;
};

export default MainHeader;
