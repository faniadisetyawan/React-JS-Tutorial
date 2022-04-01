import React from 'react';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import { useApp } from '../../App';
import { APP_KEY } from '../../services';

export default function Login() {
  const history = useHistory();
  const location = useLocation();
  const { config, user, signin } = useApp();

  const [fields, setFields] = React.useState({ username: '', password: '' });

  const { from } = location.state || { from: { pathname: "/" } };

  const handleSubmit = () => {
    if (fields.username && fields.password) {
      localStorage.setItem(APP_KEY, JSON.stringify(fields));

      signin(fields, () => {
        history.replace(from);
      });
    }
  }

  if (!!user) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>{config.appName}</h1>
      <p>You must log in to view the page at {from.pathname}</p>

      <table>
        <tbody>
          <tr>
            <td>Username</td>
            <td>:</td>
            <td>
              <input
                type="text"
                onChange={(e) => setFields({...fields, username: e.target.value})}
                autoFocus={true}
                placeholder="Username"
              />
            </td>
          </tr>
          <tr>
            <td>Password</td>
            <td>:</td>
            <td>
              <input
                type="password"
                onChange={(e) => setFields({...fields, password: e.target.value})}
                placeholder="Password"
              />
            </td>
          </tr>

          <tr>
            <td></td>
            <td></td>
            <td>
              <button onClick={handleSubmit}>Log in</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
