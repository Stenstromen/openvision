import { Container, Navbar, Collapse } from "react-bootstrap";
import logo from "../logo.svg";

function Header({ keras }: { keras: boolean }) {
  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-3">
        <Container>
          <Navbar.Brand>
            <img
              alt="logo"
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            OpenVision
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <h1 className="text-center">OpenVision</h1>
        <p className="mb-4 text-center">
          OpenVision is a web application that allows you to detect objects in
          images, using <strong>Keras MobileNetV3.</strong>
        </p>
        {/* <br />{" "} */}
        <Collapse in={!keras}>
          <p className="text-center">
            You can either upload JPEG or use your camera to take a picture.
          </p>
        </Collapse>
      </Container>
    </>
  );
}

export default Header;
