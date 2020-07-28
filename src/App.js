import React from 'react';
import './App.css';

import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Nomatch from './Nomatch';
import { UserProvider } from './UserContext.js';
import { ProjectProvider } from './ProjectContext.js'
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right', }}>
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
