import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ClientTab from '../../components/ClientTab';
import EmployeeTab from '../../components/EmployeeTab';
import MaintenanceTab from '../../components/MaintenanceTab';
import EmploymentForm from '../../components/EmploymentForm';
import { Accordion, Col, Row } from 'react-bootstrap';
import DismissalForm from '../../components/DismissalForm';
import ScheduleForm from '../../components/ScheduleForm';
import Schedule from '../../components/Schedule';

export default function Dashboard() {
  return (
    <Tabs defaultActiveKey="clients" className="mt-3">
      <Tab eventKey="clients" title="Clients">
        <ClientTab />
      </Tab>
      <Tab
        eventKey="employees"
        title="Employees"
        style={{ height: '500px', overflow: 'scroll' }}
      >
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Members</Accordion.Header>
            <Accordion.Body>
              <EmployeeTab />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Recruitment</Accordion.Header>
            <Accordion.Body>
              <EmploymentForm />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Dismissal</Accordion.Header>
            <Accordion.Body>
              <DismissalForm />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>Schedule</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col xs={4}>
                  <ScheduleForm />
                </Col>
                <Col>
                  <Schedule />
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Tab>
      <Tab eventKey="maintenance" title="Maintenance">
        <MaintenanceTab />
      </Tab>
    </Tabs>
  );
}
