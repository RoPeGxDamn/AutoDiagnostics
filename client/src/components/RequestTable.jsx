import React, { useEffect, useState } from 'react';
import { instance } from '../api/axios';
import { Button, Stack, Table } from 'react-bootstrap';

export default function RequestTable({ handleShow, handleIdChange }) {
  const [requests, setRequests] = useState([]);

  const initComponent = async () => {
    await instance
      .get('requests')
      .catch(err => console.log(err))
      .then(res => {
        console.log(res.data.data);
        setRequests(res.data.data);
      });
  };

  useEffect(() => {
    initComponent();
  }, []);

  return (
    <div>
      {requests?.length > 0 ? (
        <>
          <Table striped>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Phone number</th>
                <th>Order date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requests.map(item => {
                return (
                  <tr key={item.id}>
                    <td>
                      {item.model} {item.year}
                    </td>
                    <td>{item.phone_number}</td>
                    <td>
                      {new Date(item.order_date).toLocaleDateString('GB-en')}
                    </td>
                    <td>
                      {item.state === 'process' ? (
                        <Stack
                          direction="horizontal"
                          gap={2}
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button
                            variant="success"
                            type="submit"
                            onClick={() => {
                              handleIdChange(item.id);
                              handleShow();
                            }}
                          >
                            Accept
                          </Button>
                        </Stack>
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      ) : (
        <div className="mt-5 text-center">We don't have requests yet!</div>
      )}
    </div>
  );
}
