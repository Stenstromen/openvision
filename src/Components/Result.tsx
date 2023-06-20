import { Fragment } from "react";
import { Container, Row, Col, Collapse, Card } from "react-bootstrap";
import { TSorted } from "../Types";

function Result({ sortedPredictions }: { sortedPredictions: TSorted }) {
  return (
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
                    <Fragment key={index}>
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
                    </Fragment>
                  ))}
                  <Card.Subtitle className="mb-1 text-warning">
                    &lt;Low&gt;
                  </Card.Subtitle>
                  <Card.Text>
                    {sortedPredictions.map((prediction, index) => (
                      <Fragment key={index}>
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
                      </Fragment>
                    ))}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </Collapse>
        </Col>
      </Row>
    </Container>
  );
}

export default Result;
