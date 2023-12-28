import { Form, Row, Stack, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { instance } from '../api/axios';
import { useAuth } from '../provider/AuthProvider';
import { useNotify } from '../provider/NotificationProvider';
import Logo from '../components/Logo';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { onError, onSuccess } = useNotify();
  const navigate = useNavigate();

  const { setToken } = useAuth();

  const handleLogin = async event => {
    event.preventDefault();

    await instance
      .post('users/login', {
        username,
        password,
      })
      .catch(err => {
        if (err) {
          console.log(err.response);
          const { message } = err.response.data;
          onError(message);
        }
      })
      .then(res => {
        if (res) {
          console.log(res.response);
          const { message, accessToken } = res.data;
          console.log(res.data.message);
          onSuccess(message);
          setToken(accessToken);
          navigate('/home');
        }
      });
  };

  return (
    <Stack direction="horizontal" className="mt-5">
      <Logo />
      <Stack>
        <Form className="mt-5" onSubmit={e => handleLogin(e)}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="warning" type="submit" className="w-100 text-muted">
            Sign in
          </Button>

          <Row className="mt-3 text-center">
            <span>Don't have account yet?</span>
            <Link to="/register">Sign up!</Link>
          </Row>
        </Form>
      </Stack>
    </Stack>
  );
}
