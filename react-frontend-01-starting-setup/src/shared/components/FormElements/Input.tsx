/* eslint-disable no-unused-vars */
import React, { useReducer, useEffect } from "react";

import { validate } from "../util/validators";
import "./Input.css";

type InputType = {
  id?: string;
  label?: string;
  element: "input" | "textarea";
  type?: string;
  placeholder?: string;
  rows?: number;
  validators: any;
  errorText?: string;
  value?: string;
  valid?: boolean;
  onInput: (id?: string, value?: string, isValid?: boolean) => void;
};

type InputStateType = {
  value: string;
  isValid: boolean;
  isTouched?: boolean;
};

type InputStateActionType = {
  type: "CHANGE" | "TOUCH";
  val: string;
  validators: any;
  isTouched?: boolean;
};

const inputReducer = (state: InputStateType, action: InputStateActionType) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = ({
  id,
  label,
  element,
  type,
  placeholder,
  rows,
  errorText,
  validators,
  value,
  valid,
  onInput,
}: InputType) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: value || "",
    isTouched: false,
    isValid: valid || false,
  });

  useEffect(() => {
    onInput(id, inputState.value, inputState.isValid);
  }, [id, onInput, inputState.value, inputState.isValid]);

  const changeHandler = (event: React.ChangeEvent) => {
    dispatch({
      type: "CHANGE",
      val: (event.target as HTMLInputElement).value,
      validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
      val: "",
      validators: [],
    });
  };

  const elementValue = element === "input" ? (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      onChange={changeHandler}
      onBlur={touchHandler}
      value={inputState.value}
    />
  ) : (
    <textarea
      id={id}
      rows={rows || 3}
      onChange={changeHandler}
      onBlur={touchHandler}
      value={inputState.value}
    />
  );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={id}>{label}</label>
      {elementValue}
      {!inputState.isValid && inputState.isTouched && <p>{errorText}</p>}
    </div>
  );
};

export default Input;
