import { Row, InputGroup, Stack, Button, Col, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Link, useNavigate } from 'react-router-dom';
import { instance } from '../api/axios';
import { useState } from 'react';
import { useNotify } from '../provider/NotificationProvider';
import Logo from '../components/Logo';

export default function Register() {
  const [regInfo, setRegInfo] = useState({
    username: '',
    password: '',
    repeatPassword: '',
    surname: '',
    name: '',
    patronymic: '',
    birthDate: new Date().toLocaleDateString('en-GB'),
    phoneNumber: '',
    email: '',
  });

  const [dateValue, setDateValue] = useState(new Date());
  const navigate = useNavigate();
  const { onError, onSuccess } = useNotify();

  const handleChange = event => {
    console.log(event.target.id);
    setRegInfo({
      ...regInfo,
      [event.target.id]: event.target.value,
    });
    console.log({ ...regInfo });
  };

  const handleDateChange = date => {
    setDateValue(date);
    setRegInfo({
      ...regInfo,
      birthDate: new Date(date).toLocaleDateString('en-GB'),
    });
  };

  const handleRegister = async event => {
    event.preventDefault();

    await instance
      .post('users/register', regInfo)
      .catch(err => {
        if (err) {
          console.log(err?.response);
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
          navigate('/login');
        }
      });
  };

  return (
    <Stack direction="horizontal" className="mt-5">
      <Logo />
      <Form className="m-5" onSubmit={handleRegister}>
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
                selected={dateValue}
                dateFormat={'dd.MM.yyyy'}
                onChange={date => handleDateChange(date)}
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
          <Button variant="warning" type="submit" className="text-muted">
            Sign up
          </Button>
        </Row>

        <Row className="mt-3 text-center">
          <span>Already have account?</span>
          <Link className="text-center" to="/login">
            Sign in!
          </Link>
        </Row>
      </Form>
    </Stack>
  );
}
