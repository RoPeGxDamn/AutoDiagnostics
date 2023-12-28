import React, { useState } from 'react';
import { Button, Form, Stack } from 'react-bootstrap';
import { instance } from '../api/axios';
import { useNotify } from '../provider/NotificationProvider';

export default function ManipulateService() {
  const [serviceInfo, setServiceInfo] = useState({
    name: '',
    description: '',
    cost: ''
  })
  const { onError, onSuccess } = useNotify();

  const handleChange = (event) => {
    setServiceInfo({...serviceInfo, [event.target.id]: event.target.value})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await instance
      .post(`services`, serviceInfo)
      .catch(err => {
        if(err) {
          console.log(err);
          onError("Check values! Number should be positive!");
        } 
      })
      .then(res => {
        if(res) {
          console.log(res);
          onSuccess(res?.data?.message);
        }
      });
  };

  return (
    <Form onSubmit={e => handleSubmit(e)} className='pt-2'>
      <Stack direction="vertical" gap={2}>
      <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              placeholder="Enter name"
              onChange={e => handleChange(e)}
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
            as='textarea'
              required
              placeholder="Enter description"
              onChange={e => handleChange(e)}
            />
          </Form.Group>
          <Form.Group controlId="cost">
            <Form.Label>Cost</Form.Label>
            <Form.Control
              required
              placeholder="Enter cost"
              onChange={e => handleChange(e)}
            />
          </Form.Group>

        <Button variant="warning" type="submit" className="w-100 text-muted">
          Add service
        </Button>
      </Stack>
    </Form>
    )
}
