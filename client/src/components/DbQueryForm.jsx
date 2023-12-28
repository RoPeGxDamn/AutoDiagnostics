import React, { useState } from 'react';
import { Button, Form, Stack, Table } from 'react-bootstrap';
import { instance } from '../api/axios';
import { useNotify } from '../provider/NotificationProvider';

export default function DbQueryForm() {
  const [sqlQuery, setSqlQuery] = useState(null);
  const [result, setResult] = useState(null);
  const { onSuccess, onError } = useNotify()

  const handleSubmit = async event => {
    event.preventDefault();

    await instance
      .post('db/query', { sqlQuery })
      .catch(err => {
        if(err) {
          // const {} = err.response.data.message
          console.log(err.response.data.message)
          onError(`Position error: ${err.response.data.message.position}`)
        }

      })
      .then(res => {
        if(res) {
          onSuccess('Query completed!')
          setResult(res.data);
        }

      });
  };

  return (
    <Stack>
      <Form onSubmit={e => handleSubmit(e)}>
        <Form.Group className="mb-3" controlId="sqlQuery">
          <Form.Label>SQL query</Form.Label>
          <Form.Control
            required
            placeholder="Write SQL-query"
            as='textarea'
            value={sqlQuery}
            onChange={e => setSqlQuery(e.target.value)}
          />
        </Form.Group>
        <Button variant="warning" type="submit" className="w-100 text-muted">
          Send
        </Button>
      </Form>
      {result === null || result === undefined ? (
        <></>
      ) : (
        <Table bordered className="mt-3 mb-3">
          <thead>
            <tr>
              {Object.keys(result[0])?.map(item => (
                <th>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result?.map(item => {
              return (
                <tr>
                  {Object.values(item)?.map(item => (
                    <td>{item}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Stack>
  );
}
