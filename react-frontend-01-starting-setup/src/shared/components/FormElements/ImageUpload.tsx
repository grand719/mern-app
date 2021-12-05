/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";
import "./ImageUpload.css";

type imgUpload = {
  id: string;
  center?: boolean;
  onInput: any;
  errorText: string;
}

const ImageUploadComponent = ({
  id, center, onInput, errorText,
}: imgUpload) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      // @ts-ignore
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event: React.ChangeEvent) => {
    let pickedFile;
    let fileIsValid = isValid;
    const target = event.target as HTMLInputElement;
    if (target.files && target.files!.length === 1) {
      pickedFile = target.files[0];
      // @ts-ignore
      setFile(pickedFile);
      fileIsValid = true;
    } else {
      fileIsValid = false;
    }
    onInput(id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input ref={filePickerRef} onChange={pickedHandler} id={id} style={{ display: "none" }} type="file" accept=".jpg,.png,.jpeg" />
      <div className={`image-upload ${center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="preview" />}
          {!previewUrl && <p>Pleas pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>Pick image</Button>
      </div>
      {!isValid && <p>{errorText}</p>}
    </div>
  );
};

export default ImageUploadComponent;
