import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Stack } from 'react-bootstrap';
import { instance } from '../../api/axios';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../provider/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { useNotify } from '../../provider/NotificationProvider';

export default function Feedback() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [description, setDescription] = useState('');
  const [rate, setRate] = useState(5);
  const [isDisabled, setIsDisabled] = useState(true);
  const { onError, onSuccess } = useNotify();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { id, clientId } = jwtDecode(token);

  const initComponent = async () => {
    await instance
      .get(`results/feedback/${id}`)
      .catch(err => {
        console.log(err);
      })
      .then(res => {
        console.log(res);
        const { data } = res.data;
        setRequests(data);
        setSelectedRequest(data[0]?.request_id);
        if (data?.length > 0) {
          setIsDisabled(false);
        }
      });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    await instance
      .post('feedback', {
        clientId: clientId,
        requestId: selectedRequest,
        rate: rate,
        description: description,
      })
      .catch(err => {
        if (err) {
          onError(err);
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
        <h3>Feedback</h3>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={e => handleSubmit(e)} className="p-3">
            <Stack gap={3}>
            {requests?.length > 0 ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Orders</Form.Label>
                <Form.Select
                  value={selectedRequest}
                  style={{ margin: 0 }}
                  onChange={e => setSelectedRequest(e.target.value)}
                >
                  {requests?.map(item => (
                    <option key={item?.request_id} value={item?.request_id}>
                      {item?.model} {item?.year} - {' '}
                      {new Date(item?.complete_date).toLocaleDateString(
                        'Gb-en'
                      )}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          ) : (
            <div className="m-5 text-center">
              You don't have requests! <Link to="/request">Send one!</Link>
            </div>
          )}
          <Form.Group>
            <Form.Label>Rate ({rate})</Form.Label>
            <Form.Range
              value={rate}
              onChange={e => setRate(e.target.value)}
              max={5}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
            as={'textarea'}
              value={description}
              onChange={e => setDescription(e.target.value)}
              max={5}
            />
          </Form.Group>

          <Button
            variant="warning"
            type="submit"
            className="w-100 text-muted"
            disabled={isDisabled}
          >
            Send
          </Button>
            </Stack>
        </Form>
      </Card.Body>
    </Card>
  );
}
