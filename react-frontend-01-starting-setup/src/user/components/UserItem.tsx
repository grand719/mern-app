import React from "react";
import { Link } from "react-router-dom";

import "./UserItem.css";

import Avatar from "../../shared/components/UIElement/Avatar";
import Card from "../../shared/components/UIElement/Card";

import { UserType as User } from "../../types";

const UserItem = ({
  id, name, image, placesCount,
}: User) => {
  return (
    <div>
      <li className="user-item">
        <Card className="user-item__content">
          <Link to={`/${id}/places`}>
            <div className="user-item__image">
              <Avatar image={`http://localhost:5000/${image}`} alt={name} />
            </div>
            <div className="user-item__info">
              <h2>{name}</h2>
              <h3>
                {placesCount}
                {placesCount === 1 ? "Place" : "Places"}
              </h3>
            </div>
          </Link>
        </Card>
      </li>
    </div>
  );
};

export default UserItem;
