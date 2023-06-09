/* eslint-disable @typescript-eslint/no-inferrable-types */
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useRef } from "react";
import {
  ThemeProvider,
  Collapse,
  Card,
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { AiOutlineCamera, AiOutlineFileJpg } from "react-icons/ai";
import { IPredictions, TSorted } from "./Types";
import Header from "./Components/Navbar";
import File from "./Components/File";
import Camera from "./Components/Camera";

function App() {
  const [predictions, setPredictions] = useState<IPredictions>({});
  const [sortedPredictions, setSortedPredictions] = useState<TSorted>([]);
  const [showFile, setShowFile] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sortedPredictions.length > 0) {
      setTimeout(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [sortedPredictions.length]);

  useEffect(() => {
    setSortedPredictions(
      Object.entries(predictions).sort((a, b) => b[1] - a[1])
    );
  }, [predictions]);

  return (
    <>
      <ThemeProvider
        breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
        minBreakpoint="xxs"
      >
        <Header keras={showCamera || showFile ? true : false} />
        <Collapse in={!showCamera && !showFile}>
          <Container>
            <Row className="align-items-center justify-content-center">
              <Col md={4} className="d-flex justify-content-center">
                <img src="/logo.svg" alt="logo" className="d-none d-md-block" />
                <img src="/logo.svg" alt="logo" className="d-none d-md-block" />
              </Col>
            </Row>
          </Container>
        </Collapse>
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
        <Container>
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
                      variant="outline-info"
                      className="p-5"
                      onClick={() => setShowCamera(true)}
                    >
                      <AiOutlineCamera size={70} color="green" />
                    </Button>
                  )}
            </Col>
            <Col xs={8} md={4} className="d-flex justify-content-center">
              {showFile
                ? null
                : !showCamera && (
                    <Button
                      variant="outline-info"
                      className="p-5"
                      onClick={() => setShowFile(true)}
                    >
                      <AiOutlineFileJpg size={70} color="green" />
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
              <Collapse
                className="mb-2"
                in={sortedPredictions.length > 0 ? true : false}
              >
                <div>
                  <Card style={{ width: "18rem" }}>
                    <Card.Body>
                      <Card.Title>MobileNetV3 Confidence</Card.Title>
                      <Card.Subtitle className="mb-1 text-success">
                        &lt;High&gt;
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
                        &lt;Low&gt;
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
      <div ref={endRef} />
    </>
  );
}

export default App;
