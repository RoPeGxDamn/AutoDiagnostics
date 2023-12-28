import React, { useEffect, useState } from 'react';
import { instance } from '../api/axios';
import { Table } from 'react-bootstrap';

export default function EmployeeTab() {
  const [employees, setEmployees] = useState([]);

  const initPage = async () => {
    await instance
      .get('employees')
      .catch(err => console.log(err))
      .then(res => {
        console.log(res);
        setEmployees(res.data.data);
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
            <th>Address</th>
            <th>Employment date</th>
            <th>Specialization</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(item => {
            return (
              <tr>
                <td>{item.surname}</td>
                <td>{item.name}</td>
                <td>{item.patronymic}</td>
                <td>{item.phone_number}</td>
                <td>{new Date(item.birth_date).toLocaleDateString('Gb-en')}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>
                  <span title={item.password}>...</span>
                </td>
                <td>{item.address}</td>
                <td>{item.employment_date}</td>
                <td>{item.specialization}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
