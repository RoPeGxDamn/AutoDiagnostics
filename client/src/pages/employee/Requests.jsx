import React, { useEffect, useState } from 'react';
import ModalWindow from '../../components/ModalWindow';
import ServiceForm from '../../components/ServiceForm';
import RequestTable from '../../components/RequestTable';

export default function Requests() {
  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <ModalWindow
        show={show}
        handleClose={handleClose}
        title="Services choice"
      >
        <ServiceForm id={selectedId} close={handleClose} />
      </ModalWindow>
      <RequestTable handleShow={handleShow} handleIdChange={setSelectedId}/>
    </div>
  );
}
