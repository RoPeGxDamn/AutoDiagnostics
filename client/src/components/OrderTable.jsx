import React, { useEffect, useState } from 'react';
import { instance } from '../api/axios';
import { Button, Image, Table } from 'react-bootstrap';

export default function OrderTable() {
  const [orders, setOrders] = useState([]);

  const initPage = async () => {
    await instance
      .get('results')
      .catch(err => console.log(err))
      .then(res => {
        console.log(res);
        setOrders(res.data.data);
      });
  };

  const handlePrint = async id => {
    await instance
      .get(`db/report/${id}`, { responseType: 'blob' })
      .catch(err => console.log(err))
      .then(res => {
        console.log(res)
      // Создание URL для скачивания
      const url = window.URL.createObjectURL(new Blob([res.data]));
      console.log(id)
      // Создание виртуальной ссылки и эмуляция клика для скачивания
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${id}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Освобождение URL
      window.URL.revokeObjectURL(url);
      });
  };

  useEffect(() => {
    initPage();
  }, []);
  return (
    <div>
      {orders?.length > 0 ? (
        <>
          <Table striped>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Employee</th>
                <th>Complete date</th>
                <th>Comment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(item => {
                return (
                  <tr key={item?.id}>
                    <td>
                      {item?.model} {item?.year}
                    </td>
                    <td>
                      {item?.surname} {item?.name}
                    </td>
                    <td>
                      {new Date(item?.complete_date).toLocaleDateString(
                        'GB-en'
                      )}
                    </td>
                    <td>{item?.comment}</td>
                    <td>
                      <Button onClick={() => handlePrint(item?.id)}>
                        <Image src='/assets/report.png' width={18} title='Report'/>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      ) : (
        <div className="text-center m-5">You don't have orders yet!</div>
      )}
    </div>
  );
}
