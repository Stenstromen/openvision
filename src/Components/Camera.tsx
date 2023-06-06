/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { submitFile } from "../Api";
import { IPredictions } from "../Types";

function Camera({
  setPredictions,
}: {
  setPredictions: (predictions: IPredictions) => void;
}) {
  const [b64image, setB64image] = useState<string>("");
  const webcamRef = useRef<Webcam>(null);

  const base64ToBlob = (
    base64: string,
    contentType: string = "",
    sliceSize: number = 512
  ) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log(imageSrc);
    if (imageSrc) {
      const base64Image = imageSrc.split(",")[1]; // Get the actual base64 string
      const blob = base64ToBlob(base64Image, "image/jpeg");
      const file = new File([blob], "filename.jpg", { type: "image/jpeg" });
      setB64image(imageSrc);
      return setPredictions(await submitFile(file));
    }
  }, [webcamRef]);
  return (
    <div>
      {b64image ? (
        <img src={b64image} alt="webcam" />
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "environment" }}
          width={300}
        />
      )}
      <button onClick={capture}>Capture photo</button>
      {b64image && <button onClick={() => setB64image("")}>Clear photo</button>}
    </div>
  );
}

export default Camera;
