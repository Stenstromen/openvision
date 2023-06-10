/* eslint-disable @typescript-eslint/no-inferrable-types */
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useRef } from "react";
import { ThemeProvider, Collapse, Container, Row, Col } from "react-bootstrap";
import { IPredictions, TSorted } from "./Types";
import logo from "./logo.svg";
import Header from "./Components/Navbar";
import CameraSection from "./Components/CameraSection";
import FileSection from "./Components/FileSection";
import IconButton from "./Components/IconButton";
import Result from "./Components/Result";

function App() {
  const [predictions, setPredictions] = useState<IPredictions>({});
  const [sortedPredictions, setSortedPredictions] = useState<TSorted>([]);
  const [showFile, setShowFile] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const SCROLL_DELAY_MS = 300;
  const endRef = useRef<HTMLDivElement | null>(null);

  const shouldDisplayButton = (current: boolean, other: boolean) => {
    return !current && !other;
  };

  useEffect(() => {
    if (sortedPredictions.length > 0) {
      setTimeout(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      }, SCROLL_DELAY_MS);
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
                <img src={logo} alt="logo" className="d-none d-md-block" />
                <img src={logo} alt="logo" className="d-none d-md-block" />
              </Col>
            </Row>
          </Container>
        </Collapse>
        <CameraSection
          showCamera={showCamera}
          setShowCamera={setShowCamera}
          setPredictions={setPredictions}
        />
        <FileSection
          showFile={showFile}
          setShowFile={setShowFile}
          setPredictions={setPredictions}
        />
        <Container>
          <Row className="align-items-center justify-content-center">
            <Col
              xs={8}
              md={4}
              className="d-flex justify-content-center mb-5 mb-md-0"
            >
              <IconButton
                variant="outline-info"
                ariaLabel="camera"
                onClick={() => setShowCamera(true)}
                iconType="camera"
                hidden={!shouldDisplayButton(showCamera, showFile)}
              />
            </Col>
            <Col xs={8} md={4} className="d-flex justify-content-center">
              <IconButton
                variant="outline-info"
                ariaLabel="file"
                onClick={() => setShowFile(true)}
                iconType="file"
                hidden={!shouldDisplayButton(showFile, showCamera)}
              />
            </Col>
          </Row>
        </Container>
        <Result sortedPredictions={sortedPredictions} />
      </ThemeProvider>
      <div ref={endRef} />
    </>
  );
}

export default App;
