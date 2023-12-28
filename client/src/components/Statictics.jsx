import React, { useEffect, useState } from 'react';
import { Row, Col, Stack, Table } from 'react-bootstrap';
import { instance } from '../api/axios';

export default function Statictics() {
  const [MVclient, setMVClient] = useState(null);
  const [MRVehicle, setMRVehicle] = useState(null);
  const [MPService, setMPService] = useState(null);
  const [MEOrder, setMEOrder] = useState(null);
  const [AVGService, setAVGService] = useState(null);
  const [servBySpec, setServBySpec] = useState(null);

  const initComponent = async () => {
    await instance
      .get('statistics/mvclient')
      .catch(err => console.log(err))
      .then(res => {
        if (res) {
          console.log(res);
          setMVClient(res?.data[0]);
        }
      });
    await instance
      .get('statistics/mrvehicle')
      .catch(err => console.log(err))
      .then(res => {
        if (res) {
          console.log(res);
          setMRVehicle(res?.data[0]);
        }
      });
    await instance
      .get('statistics/mpservice')
      .catch(err => console.log(err))
      .then(res => {
        if (res) {
          console.log(res);
          setMPService(res?.data[0]);
        }
      });
    await instance
      .get('statistics/meorder')
      .catch(err => console.log(err))
      .then(res => {
        if (res) {
          console.log(res);
          setMEOrder(res?.data[0]);
        }
      });
    await instance
      .get('statistics/avgservice')
      .catch(err => console.log(err))
      .then(res => {
        if (res) {
          console.log(res);
          setAVGService(res?.data);
        }
      });
    await instance
      .get('statistics/servbyspec')
      .catch(err => console.log(err))
      .then(res => {
        if (res) {
          console.log(res);
          setServBySpec(res?.data);
        }
      });
  };

  useEffect(() => {
    initComponent();
  }, []);

  return (
    <Row>
      
      <Col xs="6">
        <h5>Most valuable client</h5>
        <div>
          {MVclient?.surname} {MVclient?.name} - {MVclient?.sum}
        </div>
      </Col>
      <Col xs="6">
        <h5>Most repairable vehicle</h5>
        <div>
          {MRVehicle?.model} {MRVehicle?.year} ({MRVehicle?.count})
        </div>
      </Col>
      <Col xs="6">
        <h5>Most popular service</h5>
        <div>
          {MPService?.name} ({MPService?.count})
        </div>
      </Col>
      <Col xs="6">
        <h5>Most expensive order</h5>
        <div>
          {MEOrder?.model} {MEOrder?.year} - {MEOrder?.sum}
        </div>
      </Col>
      <Col className="mt-3" xs='6'>
        <h5>Service higher average</h5>
        <div>
          <Table bordered>
            <thead>
              <tr>
                <th>Name</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {AVGService?.map(item => {
                return (
                  <tr>
                    <td>{item?.name}</td>
                    <td>{item?.cost}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Col>
      <Col className="mt-3" xs='6'>
        <h5>Specialization table</h5>
        <div>
          <Table bordered>
            <thead>
              <tr>
                <th>Specialization</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {servBySpec?.map(item => {
                return (
                  <tr>
                    <td>{item?.specialization}</td>
                    <td>{item?.count}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Col>
    </Row>
  );
}
