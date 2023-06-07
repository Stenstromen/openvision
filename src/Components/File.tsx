import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) return setFile(event.target.files[0]);
  };

  const handleFileSubmit = async () => {
    if (file) return setPredictions(await submitFile(file));
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
            {file && (
              <img src={URL.createObjectURL(file)} alt="file" width={"100%"} />
            )}
            <input type="file" onChange={handleFileChange} />
            {file && <button onClick={handleFileSubmit}>Submit</button>}
            <button
              onClick={() => {
                setShowFile(false);
                setPredictions({});
              }}
            >
              Close
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default File;
