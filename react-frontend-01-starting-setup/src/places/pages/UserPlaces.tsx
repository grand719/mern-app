/* eslint-disable max-len */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { PlaceItemType } from "../components/PlaceItem";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import PlaceList from "../components/PlaceList";

const UserPlaces = () => {
  const { userId } = useParams<{ userId?: string }>();
  const {
    isLoading, error, sendRequest, clearError,
  } = useHttpClient();
  const [userPlaces, setUserPalces] = useState<PlaceItemType[]>([]);

  useEffect(() => {
    const fetchUserPlaces = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`,
        );

        setUserPalces(response.places);
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUserPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (deletePlaceId: string) => {
    setUserPalces((prev) => prev.filter((place) => place.id !== deletePlaceId));
  };

  return (
    <>
      {error && <ErrorModal onClear={clearError} error={error} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && userPlaces && <PlaceList items={userPlaces} onDeletePlace={placeDeleteHandler} />}
    </>
  );
};

export default UserPlaces;
