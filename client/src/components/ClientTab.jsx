import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { instance } from '../api/axios';

export default function ClientTab() {
  const [users, setUsers] = useState([]);

  const initPage = async () => {
    await instance
      .get('clients')
      .catch(err => console.log(err))
      .then(res => {
        console.log(res)
        setUsers(res.data.data)
    });
  };

  useEffect(() => {
    initPage();
  }, []);
  return (
    <div>
      <Table striped>
        <thead>
          <tr>
            <th>Surname</th>
            <th>Name</th>
            <th>Patronymic</th>
            <th>Phone number</th>
            <th>Birth date</th>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>Car count</th>
          </tr>
        </thead>
        <tbody>
          {users.map(item => {
            return (
              <tr>
                <td>{item.surname}</td>
                <td>{item.name}</td>
                <td>{item.patronymic}</td>
                <td>{item.phone_number}</td>
                <td>{new Date(item.birth_date).toLocaleDateString('Gb-en')}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td><span title={item.password}>...</span></td>
                <td>{item.car_count}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
