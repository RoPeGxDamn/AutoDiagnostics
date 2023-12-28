import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { instance } from '../api/axios';

export default function ServiceTable() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    instance
      .get('services')
      .catch(err => console.log(err))
      .then(res => setServices(res.data.data));
  }, []);
  
  return (
    <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {services.map(item => {
            return (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.cost}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
  );
}
