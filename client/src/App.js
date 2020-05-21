import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// CSS
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Component
import MenuBar from "./components/MenuBar";

import { AuthProvider } from "./context/Auth";
import AuthRoute from "./util/AuthRoute";

function App() {
  return (
    <AuthProvider>
      <Container>
        <Router>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
        </Router>
      </Container>
    </AuthProvider>
  );
}

export default App;
