import React, { useEffect, useState } from 'react';
import OrderForm from './OrderForm';
import ServiceTable from './ServiceTable';
import { Accordion, Row, Col } from 'react-bootstrap';
import ManipulateService from './ManipulateService';
import OrderTable from './OrderTable';
import FeedbackList from './FeedbackList';
import { instance } from '../api/axios';
import Statictics from './Statictics';
import DbQueryForm from './DbQueryForm';

export default function MaintenanceTab() {
  const [feedback, setFeedback] = useState();

  const getFeedback = async () => {
    await instance
      .get('feedback')
      .catch(err => console.log(err))
      .then(res => {
        console.log(res);
        setFeedback(res.data.data);
      });
  };

  useEffect(() => {
    getFeedback();
  }, []);

  return (
    <div>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Statistics</Accordion.Header>
          <Accordion.Body>
            <Row style={{ height: '250px', overflowY: 'scroll' }}>
              <Col xs='auto'>
                <DbQueryForm />
              </Col>
              <Col>
                <Statictics />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Services</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col xs={3}>
                <ManipulateService />
              </Col>
              <Col style={{ height: '300px', overflowY: 'scroll' }}>
                <ServiceTable />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Feedback</Accordion.Header>
          <Accordion.Body>
            <FeedbackList feedback={feedback} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>Orders</Accordion.Header>
          <Accordion.Body>
            <OrderTable />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header>Create order</Accordion.Header>
          <Accordion.Body>
            <OrderForm />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
