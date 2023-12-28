import React, { useEffect, useState } from 'react';
import { instance } from '../api/axios';
import { Table } from 'react-bootstrap';

export default function Schedule() {
  const [week, setWeek] = useState();

  const initPage = async () => {
    await instance
      .get('employeeschedule')
      .catch(err => console.log(err))
      .then(res => {
        console.log(res);
        setWeek(res.data.data);
      });
  };
  useEffect(() => {
    initPage();
  }, {});
  return (
    <Table striped>
      <thead>
        <tr>
          <th>Surname</th>
          <th>Name</th>
          <th>Patronymic</th>
          <th>Specialization</th>
          <th>Weekday</th>
          <th>Start time</th>
          <th>End time</th>
        </tr>
      </thead>
      <tbody>
        {week?.map(item => {
          return (
            <tr>
              <td>{item.surname}</td>
              <td>{item.name}</td>
              <td>{item.patronymic}</td>
              <td>{item.specialization}</td>
              <td>{item.day_of_week}</td>
              <td>{item.start_time}</td>
              <td>{item.end_time}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
