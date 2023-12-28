import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Container from 'react-bootstrap/esm/Container';
import { Outlet } from 'react-router-dom';
import { Toast } from 'react-bootstrap';
import { useNotify } from '../provider/NotificationProvider';

export default function Layout() {
  const {isOpen, message, isSuccess} = useNotify()

  const messageType = isSuccess ? 'success': 'danger';

  return (
    <div style={{position: 'relative', height: '100vh'}}>
      <NavBar />
      <Container>
        <Outlet/>
            <Toast style={{position: 'absolute', bottom: '70px', left: 'calc(40%)'}}  show={isOpen} bg={messageType}>
              <Toast.Header>
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto">AutoDiagnostics</strong>
              </Toast.Header>
              <Toast.Body className={'Dark' && 'text-white'}>{message}</Toast.Body>
            </Toast>
      </Container>
      <Footer />
    </div>
  );
}
