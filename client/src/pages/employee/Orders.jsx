import React from 'react';
import { Accordion } from 'react-bootstrap';
import OrderForm from '../../components/OrderForm';
import OrderTable from '../../components/OrderTable';

export default function Orders() {
  return (
    <div>
      <Accordion defaultActiveKey="0" className="mt-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Orders</Accordion.Header>
          <Accordion.Body>
            <OrderTable/>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Create order</Accordion.Header>
          <Accordion.Body>
            <OrderForm />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div></div>
    </div>
  );
}
