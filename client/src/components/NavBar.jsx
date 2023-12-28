import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import { useAuth } from '../provider/AuthProvider';
import { useNotify } from '../provider/NotificationProvider';
import { jwtDecode } from 'jwt-decode';

export default function NavBar() {
  const { token, clearToken } = useAuth();
  const navigate = useNavigate();
  const { onSuccess } = useNotify();
  let destruct;
  if (token) destruct = jwtDecode(token);

  console.log(destruct?.role);

  const handleLogout = () => {
    clearToken();
    onSuccess('You successfully sign out!');
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/home">
          AutoDiagnostics
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>
            {destruct?.role === 'admin' ? (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
              </>
            ) : (
              <></>
            )}
            {destruct?.role === 'employee' ? (
              <>
                <Nav.Link as={Link} to="/employee/requests">
                  Requests
                </Nav.Link>
                <Nav.Link as={Link} to="/employee/orders">
                  Orders
                </Nav.Link>
              </>
            ) : (
              <></>
            )}
            {destruct?.role === 'client' ? (
              <>
                <Nav.Link as={Link} to="/services">
                  Services
                </Nav.Link>
                <Nav.Link as={Link} to="/about">
                  About
                </Nav.Link>
                <Nav.Link as={Link} to="/client/request">
                  Request
                </Nav.Link>
                <Nav.Link as={Link} to="/client/feedback">
                  Feedback
                </Nav.Link>

              </>
            ) : (
              <></>
            )}
            {destruct?.role === undefined ? (
              <>
                <Nav.Link as={Link} to="/services">
                  Services
                </Nav.Link>
                <Nav.Link as={Link} to="/about">
                  About
                </Nav.Link>
              </>
            ) : (
              <></>
            )}
          </Nav>
          <Nav>
            <NavDropdown title="Account" id="collapsible-nav-dropdown">
              {token ? (
                <>
                  {destruct?.role === 'client' ? (
                    <>
                      <NavDropdown.Item as={Link} to="/profile">
                        Profile
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </>
                  ) : (
                    <></>
                  )}
                  <NavDropdown.Item onClick={handleLogout}>
                    Sign Out
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item as={Link} to="/login">
                    Sign In
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/register">
                    Sign Up
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
