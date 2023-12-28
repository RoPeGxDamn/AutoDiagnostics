import React, { useEffect, useState } from 'react';
import { instance } from '../api/axios';
import { useNotify } from '../provider/NotificationProvider';
import { Form, Button, Stack } from 'react-bootstrap';

export default function ScheduleForm() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [days, setDays] = useState([]);
  const { onError, onSuccess } = useNotify();

  const initForm = async () => {
    await instance
      .get('dayschedule')
      .catch(err => {
        console.log(err);
      })
      .then(res => {
        console.log(res);
        setDays(res.data.data);
      });

    await instance
      .get('employees')
      .catch(err => {
        console.log(err);
        const { message } = err.response.data;
        onError(message);
      })
      .then(res => {
        console.log(res);
        setEmployees(res.data.data);
      });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    await instance
      .post(`employeeschedule`, {
        daysScheduleId: selectedDay,
        employeeId: selectedEmployee,
      })
      .catch(err => {
        console.log(err);
        onError(err.response.message);
      })
      .then(res => {
        console.log(res);
        onSuccess(res.data.message);
      });
  };

  useEffect(() => {
    initForm();
  }, []);

  return (
    <Form onSubmit={e => handleSubmit(e)}>
      <Stack direction="vertical" gap={3}>
        <Form.Group controlId="employees">
          <Form.Label>Employees</Form.Label>
          <Form.Control
            as="select"
            value={selectedEmployee}
            required
            onChange={e => {
              setSelectedEmployee(e.target.value);
            }}
          >
            {employees?.map(item => (
              <option value={item.id}>
                {item.surname} {item.name} {item.patronymic}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="days">
          <Form.Label>Days</Form.Label>
          <Form.Control
            as="select"
            value={selectedDay}
            required
            onChange={e => {
              setSelectedDay(e.target.value);
            }}
          >
            {days?.map(item => (
              <option value={item.id}>{item.day_of_week}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="warning" type="submit" className="w-100 text-muted">
          Set schedule
        </Button>
      </Stack>
    </Form>
  );
}
