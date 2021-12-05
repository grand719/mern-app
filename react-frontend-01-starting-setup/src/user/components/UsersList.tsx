import React from "react";

import UserItem from "./UserItem";
import Card from "../../shared/components/UIElement/Card";
import "./UsersList.css";

import { UsersType as Users } from "../../types";

const UsersList = ({ users }: Users) => {
  if (users.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {users.map((user) => {
        return <UserItem key={user.id} {...user} placesCount={user.places!.length} />;
      })}
    </ul>
  );
};

export default UsersList;
