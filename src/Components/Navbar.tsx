import { Container, Navbar, Collapse } from "react-bootstrap";

function Header({ keras }: { keras: boolean }) {
  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-3">
        <Container>
          <Navbar.Brand>
            <img
              alt="logo"
              src="/logo.svg"
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
        <p className="text-center">
          OpenVision is a web application that allows you to detect objects in
          images, using <strong>Keras MobileNetV3.</strong>
          <br />{" "}
          <Collapse in={!keras}>
            <p className="mt-4">
              You can either upload JPEG or use your camera to take a picture.
            </p>
          </Collapse>
        </p>
      </Container>
    </>
  );
}

export default Header;
