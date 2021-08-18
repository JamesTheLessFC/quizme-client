import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Redirect, useHistory } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Avatar,
  AppBar,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Icon,
  useMediaQuery,
} from "@material-ui/core";
import {
  AccountCircle,
  Bookmark,
  BubbleChart,
  ContactSupport,
  Create,
  ExitToApp,
  Person,
  Search,
  Star,
} from "@material-ui/icons";
import { authMiddleware } from "../util/auth";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, fetchUser, logOut } from "../features/user/userSlice";
import Quizzes from "../features/quizzes/Quizzes";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import CreateQuizForm from "../components/CreateQuizForm";
import QuizCategories from "../components/QuizCategories";
import QuizSearch from "../components/QuizSearch";
import Account from "../components/Account";
import PageNotFound from "../components/PageNotFound";
import Quiz from "../features/Quiz/Quiz";
import SnackbarMessage from "../features/snackbar/SnackbarMessage";
import backgroundImage from "../images/quizme-bg-blue.png";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    backgroundColor: theme.palette.primary.main,
    background: theme.palette.primary.gradient,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.dark,
    background: theme.palette.primary.gradient,
    color: theme.palette.primary.contrastText,
    boxShadow: "0px 5px 7px rgba(0,0,0,0.75)",
    borderRight: 0,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.grey[300],
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: "repeat",
    backgroundSize: "7rem",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
  },
  content_xs: {
    flexGrow: 1,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[300],
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: "repeat",
    backgroundSize: "7rem",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
  },
  mainContent: {
    flexBasis: "100%",
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    boxShadow: theme.shadows[8],
  },
  divider: {
    backgroundColor: theme.palette.text.hint,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  icon: {
    color: theme.palette.primary.contrastText,
  },
  listItem: {
    "&:hover": {
      backgroundColor: theme.palette.primary.extraDark,
    },
  },
  username: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    fontWeight: theme.typography.fontWeightBold,
  },
  brand: {
    fontWeight: theme.typography.fontWeightBold,
  },
  drawerBrandContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

function ListItemLink(props) {
  const classes = useStyles();
  return (
    <ListItem button component="a" {...props} className={classes.listItem} />
  );
}

function Home(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const history = useHistory();
  const user = useSelector(selectUser);
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const dispatch = useDispatch();

  useEffect(() => {
    authMiddleware(history);
    dispatch(fetchUser());
  }, [history, dispatch]);

  useEffect(() => {
    if (user.error === "invalid token") {
      dispatch(logOut());
      localStorage.removeItem("AuthToken");
      history.push("/login");
    }
  }, [user.error, history, dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logOut());
    localStorage.removeItem("AuthToken");
    history.push("/login");
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        <center>
          <Avatar
            className={classes.avatar}
            src={user ? user.imageUrl : null}
          />
          <Typography className={classes.username}>
            {user ? user.username : null}
          </Typography>
        </center>
        <Divider className={classes.divider} />
        <ListItemLink button href="/quizzes">
          <ListItemIcon>
            <Star className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="New Quizzes" />
        </ListItemLink>
        <ListItemLink button href="/quizzes/categories">
          <ListItemIcon>
            <BubbleChart className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Quiz Categories" />
        </ListItemLink>
        <ListItemLink button href="/quizzes/saved">
          <ListItemIcon>
            <Bookmark className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Saved Quizzes" />
        </ListItemLink>
        <ListItemLink button href="/quizzes/search">
          <ListItemIcon>
            <Search className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Search Quizzes" />
        </ListItemLink>
        <ListItemLink button href={`/quizzes/author/${user.username}`}>
          <ListItemIcon>
            <Person className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="My Quizzes" />
        </ListItemLink>
        <Divider className={classes.divider} />
        <ListItemLink href="/create-quiz-form">
          <ListItemIcon>
            <Create className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Create Quiz Form" />
        </ListItemLink>
        <Divider className={classes.divider} />
        <ListItemLink href="/account">
          <ListItemIcon>
            <AccountCircle className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="My Account" />
        </ListItemLink>
        <Divider className={classes.divider} />
        <ListItem button onClick={handleLogout} className={classes.listItem}>
          <ListItemIcon>
            <ExitToApp className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
        <Divider className={classes.divider} />
      </List>
      <br />
      <br />
      <div className={classes.drawerBrandContainer}>
        <Icon>
          <ContactSupport />
        </Icon>
        <Typography variant="h6" className={classes.brand} noWrap>
          QuizMe
        </Typography>
      </div>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Icon>
              <ContactSupport />
            </Icon>
            <Typography variant="h6" className={classes.brand} noWrap>
              QuizMe
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={matches ? classes.content : classes.content_xs}>
          <div className={classes.toolbar} />
          <div className={classes.mainContent}>
            <Switch>
              <Route exact path="/quizzes">
                <Quizzes filter="" />
              </Route>
              <Route exact path="/quizzes/categories">
                <QuizCategories />
              </Route>
              <Route path="/quizzes/categories/:category">
                <Quizzes filter="category" />
              </Route>
              <Route exact path="/quizzes/saved">
                <Quizzes filter="saved" />
              </Route>
              <Route exact path="/quizzes/search">
                <QuizSearch />
              </Route>
              <Route path="/quizzes/author/:username">
                <Quizzes filter="author" />
              </Route>
              <Route exact path="/create-quiz-form">
                <CreateQuizForm />
              </Route>
              <Route path="/quiz/:quizid/edit">
                <CreateQuizForm />
              </Route>
              <Route exact path="/account">
                <Account history={history} />
              </Route>
              <Route path="/quiz/:quizid">
                <Quiz />
              </Route>
              <Route exact path="/">
                <Redirect to="/quizzes" />
              </Route>
              <Route path="*">
                <PageNotFound history={history} />
              </Route>
            </Switch>
          </div>
          <SnackbarMessage />
        </main>
      </div>
    </Router>
  );
}

Home.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Home;
