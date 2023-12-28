import React, { useEffect, useState } from 'react';
import { Card, Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { instance } from '../../api/axios';
import { useAuth } from '../../provider/AuthProvider';
import { jwtDecode } from 'jwt-decode';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { useNotify } from '../../provider/NotificationProvider';

export default function EditProfile() {
  const [profileInfo, setProfileInfo] = useState({
    username: '',
    // password: '',
    // repeatPassword: '',
    surname: '',
    name: '',
    patronymic: '',
    birthDate: '',
    phoneNumber: '',
    email: '',
  });
  const [dateValue, setDateValue] = useState(new Date());
  const { token } = useAuth();
  const { id } = jwtDecode(token);
  const navigate = useNavigate()
  const {onSuccess, onError} = useNotify()

  const handleChange = event => {
    setProfileInfo({
      ...profileInfo,
      [event.target.id]: event.target.value,
    });
  };

  const handleDateChange = date => {
    setDateValue(date);
    setProfileInfo({
      ...profileInfo,
      birthDate: new Date(date).toLocaleDateString('en-GB'),
    });
  };

  const initPageInfo = async () => {
    await instance
      .get(`users/${id}`)
      .catch(err => {
        if (err) {
          console.log(err);
        }
      })
      .then(res => {
        if (res) {
          console.log(res);
          const { data } = res.data;
          const {
            surname,
            name,
            patronymic,
            birth_date,
            phone_number,
            username,
            email,
          } = data;
          console.log(res.data.data);
          setProfileInfo({
            surname,
            name,
            patronymic,
            birthDate: birth_date,
            phoneNumber: phone_number,
            username,
            email,
          });
          console.log(dateValue);
        }
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await instance
      .put(`users/${id}`, profileInfo)
      .catch(err => {
        if (err) console.log(err);
        onError(err?.message)
      })
      .then(res => {
        if (res) {
          console.log(res);
          onSuccess(res.data.message)
          navigate('/profile')
        }
      });
  };

  useEffect(() => {
    initPageInfo();
  }, []);
  return (
    <Card className="mt-5">
      <Card.Header>
        <h3>Edit Profile</h3>
      </Card.Header>
      <Card.Body>
        <Form className="m-5" onSubmit={e => handleSubmit(e)}>
          <Row>
            <Form.Group className="mb-3" as={Col} controlId="phoneNumber">
              <Form.Label>Phone number</Form.Label>
              <Form.Control
                value={profileInfo.phoneNumber}
                placeholder="+375-xx-xxx-xx-xx"
                onChange={e => handleChange(e)}
                required
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              as={Col}
              controlId="username"
            >
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={profileInfo.username}
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
                  dateFormat="MM-dd-yyyy"
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
                value={profileInfo.surname}
              />
              <Form.Control
                aria-label="Name"
                placeholder="Enter your name"
                id="name"
                onChange={e => handleChange(e)}
                required
                value={profileInfo.name}
              />
              <Form.Control
                aria-label="Patronymic"
                placeholder="Enter your patronymic"
                id="patronymic"
                onChange={e => handleChange(e)}
                required
                value={profileInfo.patronymic}
              />
            </InputGroup>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={profileInfo.email}
                type="email"
                placeholder="Enter email"
                onChange={e => handleChange(e)}
                required
              />
            </Form.Group>

            {/* <Form.Group as={Col} controlId="password">
              <Form.Label>Password</Form.Label>

              <Form.Control
                type="password"
                placeholder="Password"
                onChange={e => handleChange(e)}
                required
                value={profileInfo.password}
              />
            </Form.Group> */}

            {/* <Form.Group as={Col} controlId="repeatPassword">
              <Form.Label>Repeat password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repeat password"
                onChange={e => handleChange(e)}
                required
              />
            </Form.Group> */}
          </Row>
          <Row>
            <Button variant="warning" type='submit' className="text-muted">
              Confirm
            </Button>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}
