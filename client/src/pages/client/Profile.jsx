import React, { useEffect, useState } from 'react';
import {
  Accordion,
  Button,
  Card,
  Col,
  Row,
  Image,
  Badge,
  Table,
  Form,
} from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Stack from 'react-bootstrap/Stack';
import { instance } from '../../api/axios';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../provider/AuthProvider';
import { useNotify } from '../../provider/NotificationProvider';
import FeedbackList from '../../components/FeedbackList';

export default function Profile() {
  const [profileInfo, setProfileInfo] = useState({});
  const [passwordInfo, setPasswordInfo] = useState({
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  });
  const [cars, setCars] = useState([]);
  
  const [requests, setRequests] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const { token, clearToken } = useAuth();
  const { id, clientId} = jwtDecode(token);
  const navigate = useNavigate();
  const { onSuccess, onError } = useNotify();

  const getProfileInfo = async () => {
    await instance
      .get(`/users/${id}`, {})
      .catch(err => {
        if (err) {
          console.log(err);
        }
      })
      .then(res => {
        if (res) {
          const { data } = res.data;
          setProfileInfo(data);
          console.log(res);
        }
      });
  };

  const getCars = async () => {
    await instance
      .get(`/vehicles/profile/${id}`, {})
      .catch(err => {
        if (err) {
          console.log(err);
        }
      })
      .then(res => {
        if (res) {
          const { data } = res.data;
          setCars(data);
          console.log(cars);
        }
      });
  };

  const getRequests = async () => {
    await instance
      .get(`/requests/profile/${id}`, {})
      .catch(err => {
        if (err) {
          console.log(err);
        }
      })
      .then(res => {
        if (res) {
          const { data } = res.data;
          setRequests(data);
          console.log(cars);
        }
      });
  };

  const getFeedback = async () => {
    await instance
    .get(`/feedback/profile/${clientId}`, {})
    .catch(err => {
      if (err) {
        console.log(err);
      }
    })
    .then(res => {
      if (res) {
        console.log(res);
        const { data } = res.data;
        setFeedback(data);
      }
    });
  }

  const deleteCar = async id => {
    await instance
      .delete(`vehicles/${id}`)
      .catch(err => console.log(err))
      .then(res => console.log(res));

    getCars();
  };

  const handleChange = event => {
    setPasswordInfo({
      ...passwordInfo,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    await instance
      .put(`users/${id}`, passwordInfo)
      .catch(err => {
        if (err) {
          const { message } = err.response.data;
          onError(message);
        }
      })
      .then(res => {
        if (res) {
          console.log(res);
          const { message } = res.data;
          clearToken();
          navigate('/login');
          onSuccess(message);
        }
      });
  };

  const deleteRequest = async id => {
    await instance
      .delete(`requests/${id}`)
      .catch(err => console.log(err))
      .then(res => console.log(res));

    getRequests();
  };

  useEffect(() => {
    getProfileInfo();
    getCars();
    getRequests();
    getFeedback()
  }, []);

  return (
    <Card className="mt-5">
      <Card.Header>
        <h3>Profile Information</h3>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col xs={4}>
            <Stack direction="vertical" className="text-center">
              <div className="p-2">
                <Image src="assets/user.png" width={150} />
              </div>
              <div className="p-2">{profileInfo.username}</div>
            </Stack>
          </Col>
          <Col>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  Main Information
                  <Badge
                    bg="success"
                    as={NavLink}
                    to="/editprofile"
                    className="ms-2"
                  >
                    <Image src="assets/edit-icon.png" width={20} />
                  </Badge>
                </Accordion.Header>
                <Accordion.Body>
                  <Table borderless>
                    <thead>
                      <tr>
                        <th>Surname</th>
                        <th>Name</th>
                        <th>Patronymic</th>
                        <th>Username</th>
                        <th>Phone number</th>
                        <th>Email</th>
                        <th>Birth Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{profileInfo.surname}</td>
                        <td>{profileInfo.name}</td>
                        <td>{profileInfo.patronymic}</td>
                        <td>{profileInfo.username}</td>
                        <td>{profileInfo.phone_number}</td>
                        <td>{profileInfo.email}</td>
                        <td>
                          {new Date(profileInfo.birth_date).toLocaleDateString(
                            'GB-en'
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  Cars
                  <Badge
                    bg="success"
                    as={NavLink}
                    to="/addcar"
                    className="ms-2"
                  >
                    <Image src="assets/add-icon.png" width={20} />
                  </Badge>
                </Accordion.Header>
                <Accordion.Body
                  style={{ maxHeight: '250px', overflowY: 'scroll' }}
                >
                  {cars?.length > 0 ? (
                    <Row>
                      {cars.map(item => {
                        return (
                          <Col xs={4}>
                            <Card
                              style={{ position: 'relative', height: '100%' }}
                              className="p-3"
                            >
                              <Card.Img variant="top" src="assets/car.png" />
                              <Card.Body>
                                <Card.Title>Model: {item.model}</Card.Title>
                                <Card.Text>
                                  <Stack>
                                    <div> Year: {item.year}</div>
                                    <div> VIN: {item.vin}</div>
                                  </Stack>
                                </Card.Text>
                                <Button
                                  onClick={() => {
                                    deleteCar(item.id);
                                  }}
                                  variant="danger"
                                  style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                  }}
                                >
                                  <Image src="assets/delete-icon.png" />
                                </Button>
                              </Card.Body>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  ) : (
                    <div className="p-5 text-center">
                      You don't have cars yet!
                      <Link to="/addcar">Do you have car?</Link>
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  Password Change
                  <Image
                    src="assets/password-icon.png"
                    className="ms-2"
                    width={24}
                  />
                </Accordion.Header>
                <Accordion.Body
                  style={{ maxHeight: '250px', overflowY: 'scroll' }}
                >
                  <Form onSubmit={e => handleSubmit(e)}>
                    <Form.Group className="mb-3" controlId="oldPassword">
                      <Form.Label>Old password</Form.Label>
                      <Form.Control
                        required
                        placeholder="Enter old password"
                        type="password"
                        value={passwordInfo.oldPassword}
                        onChange={e => handleChange(e)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="newPassword">
                      <Form.Label>New password</Form.Label>
                      <Form.Control
                        required
                        type="password"
                        placeholder="Enter new password"
                        value={passwordInfo.newPassword}
                        onChange={e => handleChange(e)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="repeatNewPassword">
                      <Form.Label>Repeat new password</Form.Label>
                      <Form.Control
                        required
                        type="password"
                        placeholder="Repeat new password"
                        value={passwordInfo.repeatNewPassword}
                        onChange={e => handleChange(e)}
                      />
                    </Form.Group>

                    <Button variant="success" type="submit" className="w-100">
                      Change
                    </Button>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>Requests</Accordion.Header>
                <Accordion.Body>
                  {requests?.length > 0 ? (
                    <>
                      <Table borderless striped>
                        <thead>
                          <tr>
                            <th>Vehicle</th>
                            <th>Order date</th>
                            <th>State</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests?.map(item => {
                            return (
                              <tr>
                                <td>
                                  {item.model} {item.year}
                                </td>
                                <td>
                                  {new Date(
                                    item?.order_date
                                  ).toLocaleDateString('GB-en')}
                                </td>
                                <td>
                                  <Image
                                    src={`assets/${item.state}.png`}
                                    title={item.state}
                                    style={{ width: '24px' }}
                                  />
                                </td>
                                <td>
                                  {item.state !== 'process' ? (
                                    <></>
                                  ) : (
                                    <>
                                      <Button title='cancel' onClick={e => {deleteRequest(item.request_id)}}>
                                        <Image
                                          src="assets/cancel.png"
                                          width={12}
                                        />
                                      </Button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </>
                  ) : (
                    <div>
                      You don't have requests yet!{' '}
                      <Link to="/client/request">Send one!</Link>
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="4">
                <Accordion.Header>
                  Feedback
                </Accordion.Header>
                <Accordion.Body
                  style={{ maxHeight: '250px', overflowY: 'scroll' }}
                >
                  <FeedbackList feedback={feedback}/>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
