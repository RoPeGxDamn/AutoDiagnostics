import React from 'react';
import { Button, Row, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';
import ServiceTable from '../components/ServiceTable';

export default function Services() {
  const { token } = useAuth();

  return (
    <Stack className="mt-3" gap={3}>
      <Row>
        {token ? (
          <Button as={Link} to="/client/request" variant="warning">
            Send request
          </Button>
        ) : (
          <></>
        )}
      </Row>
      <ServiceTable />
    </Stack>
  );
}
