import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Footer() {
  return (
    <Row className="bg-body-tertiary p-3 fixed-bottom">
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">2023 - Petrov Production</Col>
        </Row>
      </Container>
    </Row>
  );
}
