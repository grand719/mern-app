import React, { useState, useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import ImageUploadComponent from "../../shared/components/FormElements/ImageUpload";
import Card from "../../shared/components/UIElement/Card";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const {
    isLoading, error, sendRequest, clearError,
  } = useHttpClient();

  const [formState, InputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false,
  );

  const switchModeHandler = () => {
    if (!isLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid,
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false,
      );
    }
    setIsLogin((prev) => !prev);
  };

  const onSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log(formState.inputs);
    if (isLogin) {
      try {
        const responseData: any = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" },
        );
        // @ts-ignore
        auth.login(responseData.userId, responseData.token);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const responseData: any = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData,
        );
        // @ts-ignore
        auth.login(responseData.userId, responseData.token);
      } catch (e: any) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading ? <LoadingSpinner asOverlay /> : ""}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={onSubmitHandler}>
          {!isLogin && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="pleas enter a name"
              onInput={InputHandler}
            />
          )}
          {!isLogin && (
            <ImageUploadComponent id="image" center onInput={InputHandler} errorText="wrong file type" />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            errorText="Pleas enter a valid email"
            validators={[VALIDATOR_EMAIL(), VALIDATOR_REQUIRE()]}
            onInput={InputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            errorText="Pleas enter a valid password"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
            onInput={InputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLogin ? "Loggin" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {isLogin ? "SIGNUP" : "Loggin"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
