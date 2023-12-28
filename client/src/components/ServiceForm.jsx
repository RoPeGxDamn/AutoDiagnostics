import React, { useEffect, useState } from 'react';
import { Button, Form, Stack } from 'react-bootstrap';
import { instance } from '../api/axios';

export default function ServiceForm({ id, close }) {
  const [services, setServices] = useState([]);
  const [items, setItems] = useState([]);

  const initPage = async () => {
    await instance
      .get('services')
      .catch(err => console.log(err))
      .then(res => {
        setServices(res.data.data);
        console.log(res);
      });
  };

  const handleAdd = () => {
    setItems([
      ...items,
      {
        service: '',
      },
    ]);
  };

  const handleRemove = index => {
    setItems(items.filter((v,i) => i !== index));
  };

  const handleChange = (e) => {
    // console.log(e.target.id)
    // console.log(e.target.value)
    // console.log(+(String(e.target.id).slice(-1)))
    // console.log(items[+(String(e.target.id).slice(-1))])
    // console.log(items[+(String(e.target.id).slice(-1))].service)
    // console.log([...items])
    console.log([...items, items[+(String(e.target.id).slice(-1))].service = e.target.value])
    setItems([...items, items[+(String(e.target.id).slice(-1))].service = e.target.value].filter(i => typeof i === 'object'))
    console.log([...items])
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    items.map(async item => {
        await instance.post('requestservices', {
            requestId: id,
            serviceId: item.service
        })
        .catch(err => console.log(err))
        .then(res => console.log(res))
    })
    close()

  }

  useEffect(() => {
    initPage();
  }, []);

  return (
    <div>
      <Button onClick={handleAdd}>+</Button>
      <Form onSubmit={e => handleSubmit(e)}>
        <Form.Group className="mb-3 mt-3">
          {items.map((item, i) => {
            return (
              <Stack direction="horizontal" gap={3} key={i} className='mb-2'>
                <div>
                  <span>{i + 1})</span>
                </div>
                <div>
                  <Form.Select id={`select-${i}`} onChange={e => handleChange(e)} value={item.service}>
                    {services.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <div>
                  <Button variant='danger' onClick={() => handleRemove(i)}><span>-</span></Button>
                </div>
              </Stack>
            );
          })}
        </Form.Group>
        <Button type='submit'>Apply</Button>
      </Form>
    </div>
  );
}
