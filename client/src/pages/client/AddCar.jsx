import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { instance } from '../../api/axios';
import { useNotify } from '../../provider/NotificationProvider';
import { useAuth } from '../../provider/AuthProvider';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export default function AddCar() {
  const [carInfo, setCarInfo] = useState({
    model: '',
    year: '',
    vin: '',
  });
  const { onError, onSuccess } = useNotify();
  const { token } = useAuth();
  const { id } = jwtDecode(token);
  const navigate = useNavigate();

  const handleChange = event => {
    setCarInfo({
      ...carInfo,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    await instance
      .post('vehicles/', { ...carInfo, userId: id })
      .catch(err => {
        if (err) {
          onError(err.message);
        }
      })
      .then(res => {
        if (res) {
          onSuccess(res.data.message);
          navigate('/profile');
        }
      });
  };

  return (
    <Card className="mt-5">
      <Card.Header>
        <h3>Additional Car</h3>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={e => handleSubmit(e)}>
          <Form.Group className="mb-3" controlId="model">
            <Form.Label>Model</Form.Label>
            <Form.Control
              required
              placeholder="Enter model"
              onChange={e => handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="year">
            <Form.Label>Year</Form.Label>
            <Form.Control
              required
              placeholder="Enter year"
              onChange={e => handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="vin">
            <Form.Label>VIN</Form.Label>
            <Form.Control
              required
              placeholder="Enter VIN"
              onChange={e => handleChange(e)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
