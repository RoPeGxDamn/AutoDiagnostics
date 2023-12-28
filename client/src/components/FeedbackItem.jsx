import React from 'react';
import { Card, Col, Image, Row, Stack } from 'react-bootstrap';

export default function FeedbackItem({ item }) {
  let rateArray = [];
  for (let i = 1; i <= item.rate; i++) {
    rateArray.push(<Image src="assets/star.png" width={20} />);
  }
  return (
    <Card>
      <Card.Body as={Row}>
        <Col xs={2}>
          <Stack>
            <Image src="assets/user.png" style={{width: '100%'}} />
            <div className='text-center'>{item?.username}</div>
          </Stack>
        </Col>
        <Col>
          <Stack gap={2}>
            <div>{rateArray.map(item => item)}</div>
            <div>{new Date(item.created_at).toLocaleDateString('gb-en')}</div>
            <div>{item.description}</div>
          </Stack>
        </Col>
      </Card.Body>
    </Card>
  );
}
