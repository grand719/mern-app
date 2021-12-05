/* eslint-disable react/jsx-fragments */
/* eslint-disable react/jsx-boolean-value */
import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

// import { PlaceItemType } from "../components/PlaceItem";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/components/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElement/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";

const UpdatePlace = () => {
  const {
    isLoading, error, sendRequest, clearError,
  } = useHttpClient();
  const { placeID } = useParams<{ placeID?: string }>();
  const [loadedPlace, setLoadedPlace] = useState<{title: string, description: string}>();
  const history = useHistory();
  const auth = useContext(AuthContext);

  const [formState, InputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false,
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/places/${placeID}`,
        );
        setLoadedPlace(response.place);
        setFormData(
          {
            title: {
              value: response.place.title,
              isValid: true,
            },
            description: {
              value: response.place.description,
              isValid: true,
            },
          },
          true,
        );
      } catch (e) {
        console.log(e);
      }
    };
    fetchPlace();
  }, [sendRequest, placeID, setFormData]);

  const placeUpdateSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await sendRequest(`http://localhost:5000/api/places/${placeID}`, "PATCH", JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
      }), {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      });
      history.push(`/${auth.userId}/places`);
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }
  if (!loadedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
      <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Pleas enter a valid title"
          onInput={InputHandler}
          value={loadedPlace.title}
          valid={true}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          errorText="Pleas enter a valid description"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          onInput={InputHandler}
          value={loadedPlace.description}
          valid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
