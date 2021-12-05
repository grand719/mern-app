import React, { useEffect, useState } from "react";
import { UserType } from "../../types";
import UsersList from "../components/UsersList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";

const Users: React.FC = () => {
  const {
    isLoading, error, sendRequest, clearError,
  } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5000/api/users",
        );
        setLoadedUsers(response.users);
      } catch (e: any) {
        console.log(e);
      }
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay={false} />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList users={loadedUsers} />}
    </>
  );
};

export default Users;
