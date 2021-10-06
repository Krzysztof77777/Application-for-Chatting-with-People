import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import LoggedAccountStore from "../store/LoggedAccountStore.jsx";
import SocketStore from "../store/SocketStore.jsx";

import HomePage from "./HomePage.jsx";
import RegisterComponent from "./RegisterComponent.jsx";
import VerifyToken from "./VerifyTokenComponent.jsx";
import LoginComponent from "./LoginComponent.jsx";
import ResetPassword from "./ResetPasswordComponent.jsx";
import VerifyResetPassword from "./VerifyResetPasswordComponent.jsx";
import ChangePassword from "./ChangePasswordComponent.jsx";
import TermsConditions from "./TermsConditionsComponent.jsx";
import Error404 from "./Error404Component.jsx";

function App() {
  return (
    <LoggedAccountStore>
      <SocketStore>
        <Router>
          <Switch>
            <Route path="/" exact component={HomePage}></Route>
            <Route
              path="/registration"
              exact
              component={RegisterComponent}
            ></Route>
            <Route
              path="/registration/verify/:id/:token"
              exact
              component={VerifyToken}
            ></Route>
            <Route path="/login" exact component={LoginComponent}></Route>
            <Route
              path="/reset/password"
              exact
              component={ResetPassword}
            ></Route>
            <Route
              path="/reset/password/verify/:id/:token"
              exact
              component={VerifyResetPassword}
            ></Route>
            <Route
              path="/account/change/password"
              exact
              component={ChangePassword}
            ></Route>
            <Route
              path="/terms-and-conditions"
              exact
              component={TermsConditions}
            ></Route>
            <Route component={Error404}></Route>
          </Switch>
        </Router>
      </SocketStore>
    </LoggedAccountStore>
  );
}

export default App;
