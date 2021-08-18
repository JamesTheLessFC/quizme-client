import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#7986cb",
      main: "#3f51b5",
      dark: "#303f9f",
      extraDark: "#242d6a",
      contrastText: "#fff",
      gradient:
        "linear-gradient(90deg, rgba(35,44,103,1) 0%, rgba(63,81,181,1) 100%)",
    },
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
