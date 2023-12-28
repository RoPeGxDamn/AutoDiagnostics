import React from 'react';
import { Button, Image, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Stack gap={2} className="text-center">
      <div>
        <Image src="assets/logo.png" width={'230'} />
      </div>
      <h4 className="text-warning">Join our company</h4>
      <h5 className="text-muted">Sign in to continue access</h5>

      <div>
        <Button variant="light" className="w-40" as={Link} to="/about">
          About
        </Button>
      </div>
    </Stack>
  );
}
