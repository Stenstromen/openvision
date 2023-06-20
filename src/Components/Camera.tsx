/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { useState, useRef, useCallback, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Webcam from "react-webcam";
import { loadModel, getClassLabels } from "../Tf";
import { IPredictions } from "../Types";
import * as tf from "@tensorflow/tfjs";

function Camera({
  setShowCamera,
  setPredictions,
}: {
  setShowCamera: (showCamera: boolean) => void;
  setPredictions: (predictions: IPredictions) => void;
}) {
  const [b64image, setB64image] = useState<string>("");
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [classLabels, setClassLabels] = useState(null);
  const webcamRef = useRef<Webcam>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const captureRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadModel().then((model) => {
      setModel(model);
    });
    getClassLabels().then((classLabels) => {
      setClassLabels(classLabels);
    });
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (webcamRef.current && webcamRef.current.stream) {
        setIsWebcamActive(true);
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (isWebcamActive) {
      setTimeout(() => {
        captureRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 1000);
    }
  }, [isWebcamActive]);

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

  const convertFileToImageElement = async (
    file: File
  ): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          resolve(img);
        };
        img.onerror = reject;
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSubmit = async (file: File) => {
    const imgElement = await convertFileToImageElement(file);
    const topK = tf.tidy(() => {
      const tensorImg = tf.browser
        .fromPixels(imgElement)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();
      const result = model?.predict(tensorImg);
      
      if (result instanceof tf.Tensor) {
        // Get top 5 results
        const topKResults = result.as1D().topk(5);
        const topKIndices = topKResults.indices.dataSync();
        const topKValues = topKResults.values.dataSync();

        return { topKIndices, topKValues };
      }
    });

    const topPredictions: Record<string, number> = {};

    if (classLabels && topK?.topKIndices && topK?.topKValues) {
      for (let i = 0; i < topK.topKIndices.length; i++) {
        topPredictions[classLabels[topK.topKIndices[i]]] = topK.topKValues[i];
      }
    }
    return topPredictions;
  };

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const base64Image = imageSrc.split(",")[1]; // Get the actual base64 string
      const blob = base64ToBlob(base64Image, "image/jpeg");
      const file = new File([blob], "filename.jpg", { type: "image/jpeg" });
      setPredictions(await handleFileSubmit(file));
      setB64image(imageSrc);
    }
  }, [webcamRef, handleFileSubmit, setPredictions]);

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
            <div className="d-grid gap-2 mt-2">
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
            <div ref={captureRef} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Camera;
