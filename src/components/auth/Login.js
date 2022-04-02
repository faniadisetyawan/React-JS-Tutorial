import React from 'react';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import { useApp } from '../../App';
import { APP_KEY } from '../../services';
import { Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { VscAccount, VscKey } from 'react-icons/vsc';
import AppLogo from '../shared/AppLogo';

export default function Login() {
  const history = useHistory();
  const location = useLocation();
  const { config, user, signin } = useApp();

  const [loading, setLoading] = React.useState(false);
  const [fields, setFields] = React.useState({ username: '', password: '' });

  const { from } = location.state || { from: { pathname: "/" } };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (fields.username && fields.password) {
      setLoading(true);
      localStorage.setItem(APP_KEY, JSON.stringify(fields));

      signin(fields, () => {
        history.replace(from);
        setLoading(false);
      });
    }
  }

  if (!!user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="vh-100 bg-white d-flex flex-column align-items-center justify-content-center">
      <div className="py-5">
        <h1 className="text-center">{config.appName}</h1>

        <div className="my-4 text-center">
          <AppLogo size={100} />
        </div>

        <p>You must log in to view the page at <code>{from.pathname}</code></p>

        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text className="bg-white">
              <VscAccount size={20} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              onChange={(e) => setFields({...fields, username: e.target.value})}
              autoFocus={true}
              placeholder="Username"
              className="bg-white"
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text className="bg-white">
              <VscKey size={20} />
            </InputGroup.Text>
            <Form.Control
              type="password"
              onChange={(e) => setFields({...fields, password: e.target.value})}
              placeholder="Password"
              className="bg-white"
            />
          </InputGroup>

          <Button type="submit" variant="dark">
            {loading && <Spinner animation="border" size="sm" className="me-2" />}{`Log in`}
          </Button>
        </Form>
      </div>
    </div>
  )
}
