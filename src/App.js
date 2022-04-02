import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useHistory
} from 'react-router-dom';
import classNames from 'classnames';
import { APP_KEY } from './services';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Index';
import AppSidebar from './components/shared/layouts/AppSidebar';
const FormsComponent = React.lazy(() => import('./components/forms/Index'));

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <AuthButton />

          <Switch>
            <Route path="/login">
              <Login />
            </Route>

            <PrivateRoute path="/dashboard">
              <Dashboard />
            </PrivateRoute>

            <PrivateRoute path="/forms">
              <React.Suspense fallback="...">
                <FormsComponent />
              </React.Suspense>
            </PrivateRoute>

            <Redirect to="/dashboard" />
          </Switch>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

function Layout({ children }) {
  const { hideSidebar } = useApp();

  return (
    <main className={classNames({'hide-sidebar': hideSidebar})}>
      {children}
    </main>
  )
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
  const [hideSidebar, setHideSidebar] = React.useState(false);
  const [config, setConfig] = React.useState(null);
  const [user, setUser] = React.useState(null);

  const toggleSidebar = () => setHideSidebar(!hideSidebar);

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
    await new Promise(resolve => setTimeout(() => {
      setConfig({
        appName: 'ReactApp'
      });
      setLoadingConfig(false);
      resolve();
    }), 1000);
  }
  
  const fetchUser = async () => {
    setLoadingUser(true);
    await new Promise(resolve => setTimeout(() => {
      const findUser = JSON.parse(localStorage.getItem(APP_KEY));
      setUser(findUser);
      setLoadingUser(false);
      resolve();
    }), 1000);
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
    hideSidebar,
    config,
    user,
    toggleSidebar,
    signin,
    signout,
    fetchConfig,
    fetchUser
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

function AuthButton() {
  const history = useHistory();
  const { user, signout } = useApp();

  return !!user ? (
    <AppSidebar signout={() => signout(() => history.push("/"))} />
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
