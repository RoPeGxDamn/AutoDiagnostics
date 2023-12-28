import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { instance } from '../../api/axios';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../provider/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { useNotify } from '../../provider/NotificationProvider';

export default function Request() {
  const [carItems, setCarItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCar, setSelectedCar] = useState();
  const [isDisabled, setIsDisabled] = useState(true);
  const { onError, onSuccess } = useNotify();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { id } = jwtDecode(token);

  const initComponent = async () => {
    await instance
      .get(`vehicles/profile/${id}`)
      .catch(err => {
        console.log(err);
      })
      .then(res => {
        console.log(res);
        const { data } = res.data;
        setCarItems(data);
        setSelectedCar(data[0]?.id);
        if (data?.length > 0) {
          setIsDisabled(false);
        }
      });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    await instance
      .post('requests', { vehicleId: selectedCar, orderDate: selectedDate })
      .catch(err => {
        if (err) {
          onError('You already have request on this vehicle!');
        }
      })
      .then(res => {
        if (res) {
          console.log(res);
          onSuccess(res?.data?.message);
          navigate('/profile');
        }
      });
  };

  useEffect(() => {
    initComponent();
  }, []);

  return (
    <Card className="mt-5">
      <Card.Header>
        <h3>Request</h3>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={e => handleSubmit(e)} className="p-3">
          <Form.Group className="mb-3" as={Col} controlId="birthDate">
            <Form.Label>Birth Date</Form.Label>
            <Row>
              <Form.Control
                as={DatePicker}
                selected={selectedDate}
                dateFormat="MM.dd.yyyy"
                onChange={date => setSelectedDate(date)}
                required
              />
            </Row>
          </Form.Group>

          {carItems?.length > 0 ? (
            <>
              <Form.Group className="mb-3">
                <Form.Select
                  value={selectedCar}
                  style={{ margin: 0 }}
                  onChange={e => setSelectedCar(e.target.value)}
                >
                  {carItems?.map(item => (
                    <option key={item?.id} value={item?.id}>
                      {item?.model}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          ) : (
            <div className="m-5 text-center">
              You don't have cars! <Link to="/addcar">Add one!</Link>
            </div>
          )}

          <Button
            variant="warning"
            type="submit"
            className="w-100 text-muted"
            disabled={isDisabled}
          >
            Send
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
