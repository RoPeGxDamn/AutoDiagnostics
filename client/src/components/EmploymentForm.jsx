import React, { useEffect, useState } from 'react';
import { Col, Form, Row, Button, InputGroup } from 'react-bootstrap';
import { useNotify } from '../provider/NotificationProvider';
import { instance } from '../api/axios';
import DatePicker from 'react-datepicker';

export default function EmploymentForm() {
  const [employmentInfo, setEmploymentInfo] = useState({
    username: '',
    password: '',
    repeatPassword: '',
    surname: '',
    name: '',
    patronymic: '',
    birthDate: new Date().toLocaleDateString('GB-en'),
    phoneNumber: '',
    email: '',
    address: '',
    employmentDate: new Date().toLocaleDateString('GB-en'),
    specialization: '',
  });
  const [birthDateValue, setBirthDateValue] = useState(new Date());
  const [empDateValue, setEmpDateValue] = useState(new Date());
  const { onError, onSuccess } = useNotify();

  const handleChange = event => {
    console.log(event.target.id);
    setEmploymentInfo({
      ...employmentInfo,
      [event.target.id]: event.target.value,
    });
    console.log({ ...employmentInfo });
  };

  const handleEmpDateChange = date => {
    setEmpDateValue(date);
    setEmploymentInfo({
      ...employmentInfo,
      employmentDate: new Date(date).toLocaleDateString('en-GB'),
    });
  };

  const handleBirthDateChange = date => {
    setBirthDateValue(date);
    setEmploymentInfo({
      ...employmentInfo,
      birthDate: new Date(date).toLocaleDateString('en-GB'),
    });
  };

  const handleEmployment = async event => {
    event.preventDefault();

    await instance
      .post('employees', employmentInfo)
      .catch(err => {
        if (err) {
          console.log(err);
          const { message } = err?.response?.data;
          onError(message);
        }
      })
      .then(res => {
        if (res) {
          console.log(res?.response);
          const { message } = res?.data;
          console.log(res?.data?.message);
          onSuccess(message);
        }
      });
  };

  return (
    <Form className="m-2" onSubmit={e => handleEmployment(e)}>
      <Row>
        <Form.Group className="mb-3" as={Col} controlId="phoneNumber">
          <Form.Label>Phone number</Form.Label>
          <Form.Control
            placeholder="+375-xx-xxx-xx-xx"
            onChange={e => handleChange(e)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" as={Col} controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            placeholder="Must be unique"
            onChange={e => handleChange(e)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" as={Col} controlId="birthDate">
          <Form.Label>Birth Date</Form.Label>
          <Row>
            <Form.Control
              as={DatePicker}
              selected={birthDateValue}
              dateFormat={'dd.MM.yyyy'}
              onChange={date => handleBirthDateChange(date)}
              required
            />
          </Row>
        </Form.Group>
      </Row>

      <Row>
        <InputGroup className="mb-3" as={Col}>
          <InputGroup.Text>Surname / Name / Patronymic</InputGroup.Text>
          <Form.Control
            aria-label="Surname"
            placeholder="Enter your surname"
            id="surname"
            onChange={e => handleChange(e)}
            required
          />
          <Form.Control
            aria-label="Name"
            placeholder="Enter your name"
            id="name"
            onChange={e => handleChange(e)}
            required
          />
          <Form.Control
            aria-label="Patronymic"
            placeholder="Enter your patronymic"
            id="patronymic"
            onChange={e => handleChange(e)}
            required
          />
        </InputGroup>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={e => handleChange(e)}
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={e => handleChange(e)}
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="repeatPassword">
          <Form.Label>Repeat password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Repeat password"
            onChange={e => handleChange(e)}
            required
          />
        </Form.Group>
      </Row>

      <Row>
        <Form.Group className="mb-3" as={Col} controlId="employmentDate">
          <Form.Label>Employment Date</Form.Label>
          <Row>
            <Form.Control
              as={DatePicker}
              selected={empDateValue}
              dateFormat={'dd.MM.yyyy'}
              onChange={date => handleEmpDateChange(date)}
              required
            />
          </Row>
        </Form.Group>
        <Form.Group as={Col} controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            placeholder="Enter address"
            onChange={e => handleChange(e)}
            required
          />
        </Form.Group>
        <Form.Group as={Col} controlId="specialization">
          <Form.Label>Specialization</Form.Label>
          <Form.Select defaultValue="Choose..." onChange={e => handleChange(e)}>
            <option value={'Mechanic'}>Mechanic</option>
            <option value={'Diagnostic'}>Diagnostic</option>
          </Form.Select>
        </Form.Group>
      </Row>

      <Row>
        <Button variant="warning" type="submit" className="text-muted">
          Hire
        </Button>
      </Row>
    </Form>
  );
}
