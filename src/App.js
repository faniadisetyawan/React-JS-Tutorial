import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useHistory
} from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Index';
import { APP_KEY } from './services';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <main>
          <AuthButton />

          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute path="/dashboard">
              <Dashboard />
            </PrivateRoute>

            <Redirect to="/dashboard" />
          </Switch>
        </main>
      </BrowserRouter>
    </AppProvider>
  );
}

const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const AppContext = React.createContext();

export function useApp() {
  return React.useContext(AppContext);
}

function AppProvider({ children }) {
  const [loadingConfig, setLoadingConfig] = React.useState(true);
  const [loadingUser, setLoadingUser] = React.useState(false);
  const [config, setConfig] = React.useState(null);
  const [user, setUser] = React.useState(null);

  const signin = (newUser, callback) => {
    return fakeAuth.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  const signout = callback => {
    return fakeAuth.signout(() => {
      localStorage.removeItem(APP_KEY);
      setUser(null);
      callback();
    });
  };

  const fetchConfig = async () => {
    setLoadingConfig(true);
    await setTimeout(() => {
      setConfig({
        appName: 'ReactApp'
      });
      setLoadingConfig(false);
    }, 1000);
  }
  
  const fetchUser = async () => {
    setLoadingUser(true);
    await setTimeout(() => {
      const findUser = JSON.parse(localStorage.getItem(APP_KEY));
      setUser(findUser);
      setLoadingUser(false);
    }, 2000);
  }

  React.useEffect(() => {
    fetchConfig();

    const token = !!localStorage.getItem(APP_KEY);
    if (token) {
      fetchUser();
    }
  }, []);

  if (loadingConfig) {
    return "Loading config...";
  }

  if (loadingUser) {
    return "Loading user...";
  }

  const value = {
    config,
    user,
    signin,
    signout,
    fetchConfig,
    fetchUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

function AuthButton() {
  const history = useHistory();
  const { config, user, signout } = useApp();

  return !!user ? (
    <React.Fragment>
      <h1>{config.appName}</h1>
      <div
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <p>Welcome {user.username}!</p>

        <button onClick={() => signout(() => history.push("/"))}>
          Sign out
        </button>
      </div>

    </React.Fragment>
  ) : false
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export function PrivateRoute({ children, ...rest }) {
  const { user } = useApp();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !!user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default App;
