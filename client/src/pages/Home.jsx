import React, { useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';
import { useAuth } from '../provider/AuthProvider';
import { jwtDecode } from 'jwt-decode';

export default function Home() {
  const { token } = useAuth();

  let destruct = null;
  if (token) {
    destruct = jwtDecode(token);
  }
  const [phrase, setPhrase] = useState(`Let's join our friendly community!`);

  useEffect(() => {
    if (destruct?.role === 'admin') setPhrase('Simplify management process!');
    else if (destruct?.role === 'client') setPhrase('Simplify car holding!');
    else if (destruct?.role === 'employee') setPhrase('Simplify maintenance!');
  }, []);

  return (
    <Stack className="text-center" style={{ margin: '190px' }}>
      {destruct?.role ? (
        <>
          <h1>Welcome, {destruct?.username}! It's our Service App.</h1>
        </>
      ) : (
        <>
          <h1>Welcome, Guest! It's our Service App.</h1>
        </>
      )}
      <h4>{phrase}</h4>
    </Stack>
  );
}
