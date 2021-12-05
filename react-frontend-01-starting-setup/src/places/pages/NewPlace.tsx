/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-spacing */
/* eslint-disable object-curly-newline */
/* eslint-disable object-shorthand */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable no-case-declarations */
/* eslint-disable no-restricted-syntax */
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ImageUploadComponent from "../../shared/components/FormElements/ImageUpload";
import "./PlaceForm.css";

const NewPlace: React.FC = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, InputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
    },
    false,
  );

  const placeSumbitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("creator", auth.userId!);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        "http://localhost:5000/api/places",
        "POST",
        formData,
        {Authorization: `Bearer ${auth.token}`},
      );
      history.push("/");
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSumbitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          errorText="Pleas enter a valid title"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={InputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          errorText="Pleas enter a valid description (at least 5 characters)."
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          onInput={InputHandler}
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Addres"
          errorText="Pleas enter a address."
          validators={[VALIDATOR_REQUIRE()]}
          onInput={InputHandler}
        />
        <ImageUploadComponent id="image" onInput={InputHandler} errorText="Pleas provide an image."/>
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
