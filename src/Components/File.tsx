import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { IPredictions } from "../Types";
import { submitFile } from "../Api";

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

  const handleFileSubmit = async () => {
    if (file) return setPredictions(await submitFile(file));
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
