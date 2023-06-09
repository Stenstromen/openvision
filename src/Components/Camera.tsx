/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { useState, useRef, useCallback, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Webcam from "react-webcam";
import { submitFile } from "../Api";
import { IPredictions } from "../Types";

function Camera({
  setShowCamera,
  setPredictions,
}: {
  setShowCamera: (showCamera: boolean) => void;
  setPredictions: (predictions: IPredictions) => void;
}) {
  const [b64image, setB64image] = useState<string>("");
  const webcamRef = useRef<Webcam>(null);
  const captureRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (webcamRef) {
      setTimeout(() => {
        captureRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [webcamRef]);

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
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col
            xs={10}
            md={8}
            className="d-flex flex-column justify-content-center mb-md-0"
          >
            {b64image ? (
              <img src={b64image} alt="webcam" />
            ) : (
              <Webcam
                className="rounded gap-2"
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                width={"100%"}
              />
            )}
            <div ref={captureRef} className="d-grid gap-2 mt-2">
              <Button variant="primary" onClick={capture} size="lg">
                Capture
              </Button>
            </div>
            {b64image && (
              <>
                <div className="d-grid gap-2 mt-2">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => {
                      setB64image("");
                      setShowCamera(false);
                      setPredictions({});
                    }}
                  >
                    Close
                  </Button>
                </div>
                <div className="d-grid gap-2 mt-2 mb-2">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => {
                      setB64image("");
                      setPredictions({});
                    }}
                  >
                    Retake
                  </Button>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Camera;
