import React from 'react';
import './App.css';

import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Nomatch from './Nomatch';
import { UserProvider } from './UserContext.js';
import { ProjectProvider } from './ProjectContext.js'
import { SnackbarProvider } from 'notistack';
import {Button} from "@material-ui/core";

function App() {

  const notistackRef = React.createRef();
  const onClickDismiss = key => () => {
    notistackRef.current.closeSnackbar(key);
  }

  return (
    <SnackbarProvider
        anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
        autoHideDuration={4000}
        preventDuplicate={true}
        maxSnack={1}
        ref={notistackRef}
        action={(key) => (
            <Button onClick={onClickDismiss(key)}>
              Dismiss
            </Button>
        )}
    >
      <UserProvider>
        <ProjectProvider>
          <div className="App">
            <Switch>
              <Route path="/" exact component={() => <Home />} />
              <Route path="/app" component={() => <Home />} />
              <Route path="/login" component={Login} />
              <Route component={Nomatch} />
            </Switch>
          </div>
        </ProjectProvider>
      </UserProvider>
    </SnackbarProvider>
  );
}

export default App;
