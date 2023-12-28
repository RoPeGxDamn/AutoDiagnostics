import React, { useEffect, useState } from 'react';
import { Form, Button, Row } from 'react-bootstrap';
import { instance } from '../api/axios';
import { useNotify } from '../provider/NotificationProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';

export default function DismissalForm() {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employees, setEmployees] = useState([]);
  const { onError, onSuccess } = useNotify();

  const initForm = async () => {
    await instance
      .get('employees')
      .catch(err => {
        if (err) {
          console.log(err.response);
          const { message } = err.response.data;
          onError(message);
        }
      })
      .then(res => {
        if (res) {
          setEmployees(res.data.data);
        }
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    await instance
      .delete(`employees/${selectedEmployee}`)
      .catch(err => console.log(err))
      .then(res => {
        console.log(res)
        onSuccess(res.data.message);
      });
  };

  useEffect(() => {
    initForm();
  }, []);

  return (
    <Form onSubmit={e => handleSubmit(e)}>
      <Row>
        <Form.Group className="mb-3" controlId="">
          <Form.Label>Employees</Form.Label>
          <Form.Control
            as="select"
            value={selectedEmployee}
            required
            onChange={e => {
              setSelectedEmployee(e.target.value);
            }}
          >
            {employees.map(item => (
              <option value={item.user_id}>
                {item.surname} {item.name} {item.patronymic}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="warning" type="submit" className="w-100 text-muted">
          Dismiss
        </Button>
      </Row>
    </Form>
  );
}
