/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/jsx-fragments */

import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElement/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElement/Modal";
import Map from "../../shared/components/UIElement/Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import "./PlaceItem.css";

export type PlaceItemType = {
  id: string;
  image: string;
  title: string;
  description: string;
  address: string;
  creator: string;
  location: { lat: number; lng: number };
  onDelete: any;
};

const PlaceItem = ({
  id,
  image,
  title,
  description,
  address,
  location,
  creator,
  onDelete,
}: //   creatorId,
//   coordinates,
PlaceItemType) => {
  const {
    isLoading, error, sendRequest, clearError,
  } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${id}`,
        "DELETE",
        null,
        { Authorization: `Bearer ${auth.token}` },
      );
      onDelete(id);
    } catch (e) {}
  };

  return (
    <React.Fragment>
      <ErrorModal onClear={clearError} error={error} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-action"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={location} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={(
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        )}
      >
        <p>Do you want to proceed and delete thisplace?</p>
      </Modal>
      <li className="place-item">
        <Card>
          {isLoading ? <LoadingSpinner asOverlay /> : ""}
          <div className="place-item__img">
            <img src={`http://localhost:5000/${image}`} alt={title} />
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.isLoggedIn && auth.userId === creator && (
              <Button to={`/places/${id}`}>EDIT</Button>
            )}
            {auth.isLoggedIn && auth.userId === creator && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
