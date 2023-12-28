import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { instance } from '../api/axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../provider/AuthProvider';
import { jwtDecode } from 'jwt-decode';

export default function OrderForm() {
  const { token } = useAuth();
  const {employeeId} = jwtDecode(token)
  const [comment, setComment] = useState('');
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dateValue, setDateValue] = useState(new Date());

  const initPage = async () => {
    await instance
      .get('requestservices')
      .catch(err => console.log(err))
      .then(res => {
        console.log(res);
        setRequests(res.data.data);
      });
  };
  const handleSubmit = async () => {
    await instance.post('results', {
        employeeId,
        comment,
        completeDate: dateValue,
        requestId: selectedRequest,
    })
    .catch(err => console.log(err))
    .then(res => {
        console.log(res)
        
    })
  };

  useEffect(() => {
    initPage();
  }, []);

  return (
    <Form className='m-1' onSubmit={handleSubmit}>
      <Row>
        <Form.Group as={Col} className="mb-3" controlId="orderDate">
          <Form.Label>Complete date</Form.Label>
          <Row>
            <Form.Control
              as={DatePicker}
              selected={dateValue}
              dateFormat={'dd.MM.yyyy'}
              onChange={date => setDateValue(date)}
              required
            />
          </Row>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Comment</Form.Label>
          <Form.Control
            as="textarea"
            value={comment}
            aria-label="With textarea"
            onChange={e => setComment(e.target.value)}
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} controlId="requests" className="mb-3">
          <Form.Label>Requests</Form.Label>
          <Form.Select
            value={selectedRequest}
            onChange={e => setSelectedRequest(e.target.value)}
          >
            {requests?.map(item => {
              return (
                <option key={item.request_id} value={item.request_id}>
                  {item.phone_number} - {item.name}({item.service_count}) -{' '}
                  {item.model} {item.year} -{' '}
                  {new Date(item.order_date).toLocaleDateString('Gb-en')}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
      </Row>
      <Row>
        <Button variant="warning" type="submit" className="text-muted">
          Create
        </Button>
      </Row>
    </Form>
  );
}
