/* eslint-disable @typescript-eslint/no-inferrable-types */
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import Collapse from "react-bootstrap/Collapse";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "./App.css";
import { IPredictions, TSorted } from "./Types";
import File from "./Components/File";
import Camera from "./Components/Camera";

function App() {
  const [predictions, setPredictions] = useState<IPredictions>({});
  const [sortedPredictions, setSortedPredictions] = useState<TSorted>([]);
  const [showFile, setShowFile] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  useEffect(() => {
    setSortedPredictions(
      Object.entries(predictions).sort((a, b) => b[1] - a[1])
    );
  }, [predictions]);

  useEffect(() => {
    console.log(sortedPredictions);
  }, [sortedPredictions]);

  return (
    <ThemeProvider
      breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
      minBreakpoint="xxs"
    >
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={6} md={4}>
            {showFile ? (
              <>
                <File setPredictions={setPredictions} />
                <button onClick={() => setShowFile(false)}>Hide File</button>
              </>
            ) : (
              !showCamera && (
                <Button
                  variant="outline-primary"
                  className="p-5"
                  onClick={() => setShowFile(true)}
                >
                  Show File
                </Button>
              )
            )}
          </Col>
          <Col xs={6} md={4}>
            {showCamera ? (
              <>
                <Camera setPredictions={setPredictions} />
                <button onClick={() => setShowCamera(false)}>
                  Hide Camera
                </button>
              </>
            ) : (
              !showFile && (
                <Button variant="outline-primary" className="p-5" onClick={() => setShowCamera(true)}>Show Camera</Button>
              )
            )}
          </Col>
        </Row>
      </Container>
      <Collapse in={sortedPredictions.length > 0 ? true : false}>
        <div>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Confidence</Card.Title>
              <Card.Subtitle className="mb-1 text-success">High</Card.Subtitle>
              {sortedPredictions.map((prediction, index) => (
                <>
                  {index == 0 && (
                    <Card.Text>
                      <strong>
                        {prediction[0].split(",")[0].charAt(0).toUpperCase() +
                          prediction[0].split(",")[0].slice(1)}
                      </strong>
                    </Card.Text>
                  )}
                </>
              ))}
              <Card.Subtitle className="mb-1 text-warning">Low</Card.Subtitle>
              <Card.Text>
                {sortedPredictions.map((prediction, index) => (
                  <>
                    {index >= 1 && index <= 4 && (
                      <>
                        <strong>
                          {prediction[0].split(",")[0].charAt(0).toUpperCase() +
                            prediction[0].split(",")[0].slice(1)}
                        </strong>
                        <br />
                      </>
                    )}
                  </>
                ))}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Collapse>
    </ThemeProvider>
  );
}

export default App;
