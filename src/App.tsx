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
import { AiOutlineCamera, AiOutlineFileJpg } from "react-icons/ai";
import "./App.css";
import { IPredictions, TSorted } from "./Types";
import Header from "./Components/Navbar";
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

  return (
    <ThemeProvider
      breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
      minBreakpoint="xxs"
    >
      <Header />
      <Collapse in={showCamera}>
        <div>
          {showCamera && (
            <Camera
              setShowCamera={setShowCamera}
              setPredictions={setPredictions}
            />
          )}
        </div>
      </Collapse>
      <Collapse in={showFile}>
        <div>
          {showFile && (
            <File setShowFile={setShowFile} setPredictions={setPredictions} />
          )}
        </div>
      </Collapse>
      <Container className="mt-3">
        <Row className="align-items-center justify-content-center">
          <Col
            xs={8}
            md={4}
            className="d-flex justify-content-center mb-5 mb-md-0"
          >
            {showCamera
              ? null
              : !showFile && (
                  <Button
                    variant="outline-primary"
                    className="p-5"
                    onClick={() => setShowCamera(true)}
                  >
                    <AiOutlineCamera size={50} color="green" />
                  </Button>
                )}
          </Col>
          <Col xs={8} md={4} className="d-flex justify-content-center">
            {showFile
              ? null
              : !showCamera && (
                  <Button
                    variant="outline-primary"
                    className="p-5"
                    onClick={() => setShowFile(true)}
                  >
                    <AiOutlineFileJpg size={50} color="green" />
                  </Button>
                )}
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col
            xs={10}
            md={6}
            className="d-flex flex-column align-items-center justify-content-center mb-md-0"
          >
            <Collapse in={sortedPredictions.length > 0 ? true : false}>
              <div>
                <Card style={{ width: "18rem" }}>
                  <Card.Body>
                    <Card.Title>Confidence</Card.Title>
                    <Card.Subtitle className="mb-1 text-success">
                      High
                    </Card.Subtitle>
                    {sortedPredictions.map((prediction, index) => (
                      <>
                        {index == 0 && (
                          <Card.Text>
                            <strong>
                              {prediction[0]
                                .split(",")[0]
                                .charAt(0)
                                .toUpperCase() +
                                prediction[0].split(",")[0].slice(1)}
                            </strong>
                          </Card.Text>
                        )}
                      </>
                    ))}
                    <Card.Subtitle className="mb-1 text-warning">
                      Low
                    </Card.Subtitle>
                    <Card.Text>
                      {sortedPredictions.map((prediction, index) => (
                        <>
                          {index >= 1 && index <= 4 && (
                            <>
                              <strong>
                                {prediction[0]
                                  .split(",")[0]
                                  .charAt(0)
                                  .toUpperCase() +
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
          </Col>
        </Row>
      </Container>
    </ThemeProvider>
  );
}

export default App;
