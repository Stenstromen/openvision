import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { IPredictions } from "../Types";
import { loadModel, getClassLabels } from "../Tf";
import * as tf from "@tensorflow/tfjs";

function File({
  setShowFile,
  setPredictions,
}: {
  setShowFile: (showFile: boolean) => void;
  setPredictions: (predictions: IPredictions) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [classLabels, setClassLabels] = useState(null);

  useEffect(() => {
    loadModel().then((model) => {
      setModel(model);
    });
    getClassLabels().then((classLabels) => {
      setClassLabels(classLabels);
    });
  }, []);

  useEffect(() => {
    if (file) {
      setTimeout(() => {
        submitRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) return setFile(event.target.files[0]);
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

  const handleFileSubmit = async () => {
    if (file) {
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
      setPredictions(topPredictions);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col
            xs={10}
            md={6}
            className="d-flex flex-column justify-content-center"
          >
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="file"
                width={"100%"}
                onClick={triggerFileInput}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <div
                style={{
                  height: "200px",
                  width: "100%",
                  border: "1px solid",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={triggerFileInput}
              >
                Click here or drag and drop a JPEG File
              </div>
            )}
            <Form.Group controlId="formFileLg" className="mb-3">
              <Form.Control
                type="file"
                accept="image/jpeg"
                onChange={handleFileChange}
                size="lg"
                as={"input"}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </Form.Group>
            {file && (
              <Button
                ref={submitRef}
                className="mt-2"
                variant="primary"
                onClick={handleFileSubmit}
              >
                Submit
              </Button>
            )}
            <Button
              className="mt-2 mb-2"
              variant="secondary"
              onClick={() => {
                setShowFile(false);
                setPredictions({});
              }}
            >
              Close
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default File;
