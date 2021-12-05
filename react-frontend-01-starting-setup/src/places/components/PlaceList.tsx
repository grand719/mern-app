/* eslint-disable react/button-has-type */
import React from "react";

import Card from "../../shared/components/UIElement/Card";
import PlaceItem, { PlaceItemType } from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceList.css";

type PlaceListType = {
  items: PlaceItemType[];
  onDeletePlace: any;
};

const PlaceList = ({ items, onDeletePlace }: PlaceListType) => {
  if (items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share palce</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {items.map((place) => {
        return <PlaceItem key={place.id} {...place} onDelete={onDeletePlace} />;
      })}
    </ul>
  );
};

export default PlaceList;
