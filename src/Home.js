import React, { useState, useContext, useEffect } from 'react';
import './App.css';
import { Switch, useHistory, Route, Link } from 'react-router-dom';

import UserContext from './UserContext';
import ProjectContext from './ProjectContext';
import useCurrentProject from './useCurrentProject';
import ProtectedRoute from './ProtectedRoute';

import Nomatch from './Nomatch';
import Dashboard from './Dashboard';

import clsx from 'clsx';
import { fade, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import LayersIcon from '@material-ui/icons/Layers';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import AppsIcon from '@material-ui/icons/Apps';
import TimerIcon from '@material-ui/icons/Timer';
import SettingsIcon from '@material-ui/icons/Settings';
import LoopIcon from '@material-ui/icons/Loop';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import DvrIcon from '@material-ui/icons/Dvr';
import AssessmentIcon from '@material-ui/icons/Assessment';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import BuildIcon from '@material-ui/icons/Build';
import CloudIcon from '@material-ui/icons/Cloud';
import WallpaperIcon from '@material-ui/icons/Wallpaper';

import CreateUser from './Users/CreateUser';
import ManageUsers from './Users/ManageUsers';

import ManageTenants from './Tenants/ManageTenants';

import AddK8sCluster from './K8sClusters/AddK8sCluster';
import ManageK8sClusters from './K8sClusters/ManageK8sClusters';

import ManageContainerRegistries from './ContainerRegistries/ManageContainerRegistries';

import AddBuildTool from './BuildTools/AddBuildTool';
import ManageBuildTools from './BuildTools/ManageBuildTools';

import ManageApplications from './Applications/ManageApplications';
import ManageApplicationHistory from './Applications/ManageApplicationHistory';
import LoadProject from './Projects/LoadProject';
import CreateProject from './Projects/CreateProject';
import CreateTenant from './Tenants/CreateTenant';
import AddContainerRegistry from './ContainerRegistries/AddContainerRegistry';
import AddContainerRegistry1 from './ContainerRegistries/AddContainerRegistry1';

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100%)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    display: 'none',
    paddingRight: theme.spacing(10),
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50ch',
    },
  },
  button: {
    padding: theme.spacing(1, 2, 1, 1),
    color: 'white',
    textTransform: 'none',
    maxWidth: '200px',
  },
  drawerMenuIcon: {
    fontSize: 'default'
  }
}));


function Home() {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  let history = useHistory();

  const projectContext = useContext(ProjectContext);
  const currentProject = useCurrentProject();
  const [projectId, setProjectId] = useState("");

  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const [openProjectLoader, setOpenProjectLoader] = React.useState(false);
  const handleClickOpen = () => {
    setOpenProjectLoader(true);
  };

  const handleClose = () => {
    setOpenProjectLoader(false);
  };


  useEffect(() => {
    console.log("in effect home, project: ", currentProject);
    setProjectId(currentProject ? currentProject.projectId : "a1");
  }, [currentProject]);


  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar variant="dense" className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Ketchup
          </Typography>
          <Button
            startIcon={<DynamicFeedIcon />}
            endIcon={<ArrowDropDownIcon />}
            className={classes.button}
            onClick={handleClickOpen}
          >
            <Typography variant="subtitle1" noWrap>{projectId}</Typography>
          </Button>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search applications and resources."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {/* <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
            <IconButton
              edge="end"
              aria-label="account of current user"
              color="inherit"
            >
              <Tooltip title={userContext.currentUser ? userContext.currentUser.displayName : ""} aria-label="User">
                <AccountCircle />
              </Tooltip>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              color="inherit"
              onClick={() => {
                projectContext.clearCurrentProject();
                userContext.clearCurrentUser();
                history.push(`/login`);
              }}
            >
              <Tooltip title="Logout" aria-label="logout">
                <ExitToAppIcon />
              </Tooltip>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.appBarSpacer} />
        <List dense={true}>
          <ListItem button component={Link} to="/app/dashboard" >
            <ListItemIcon>
              <AssessmentIcon className={classes.drawerMenuIcon} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to={`/app/project/${projectId}/applications`}>
            <ListItemIcon>
              <AppsIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Applications" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <LoopIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Build Jobs" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <DvrIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Logs" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <TimerIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Alerts" />
          </ListItem>
          <ListItem button component={Link} to={`/app/project/${projectId}/kubernetes-clusters`}>
            <ListItemIcon>
              <CloudIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Kubernetes Clusters" />
          </ListItem>
          <ListItem button component={Link} to={`/app/project/${projectId}/container-registries`}>
            <ListItemIcon>
              <WallpaperIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Container Registries" />
          </ListItem>
          <ListItem button component={Link} to={`/app/project/${projectId}/build-tools`}>
            <ListItemIcon>
              <BuildIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Build Tools" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <LayersIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="CI/CD Pipelines" />
          </ListItem>
          {/* <ListItem button>
            <ListItemIcon>
              <AppsIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Host Aliases" />
          </ListItem> */}
          <ListItem button component={Link} to="/app/manage-tenants">
            <ListItemIcon>
              <AccountTreeIcon className={classes.drawerMenuIcon} />
            </ListItemIcon>
            <ListItemText primary="Tenants" />
          </ListItem>
          <ListItem button component={Link} to="/app/manage-users">
            <ListItemIcon>
              <PeopleIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          {/* <ListItem button>
            <ListItemIcon>
              <PortraitIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Members" />
          </ListItem> */}
          <ListItem button>
            <ListItemIcon>
              <VpnKeyIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Permissions" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>
      <Switch>
        <Route path="/" exact render={() => <ProtectedRoute component={Dashboard} />} />
        <Route path="/app" exact render={() => <ProtectedRoute component={Dashboard} />} />
        <Route path="/app/dashboard" render={() => <ProtectedRoute component={Dashboard} />} />
        <Route path="/app/create-tenant" render={() => <ProtectedRoute component={CreateTenant} roles={['ROLE_SUPER_ADMIN']} />} />
        <Route path="/app/manage-tenants" render={() => <ProtectedRoute component={ManageTenants} roles={['ROLE_SUPER_ADMIN']} />} />
        <Route path="/app/manage-users" render={() => <ProtectedRoute component={ManageUsers} />} />
        <Route path="/app/create-user" render={() => <ProtectedRoute component={CreateUser} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']} />} />
        <Route path="/app/project/create" render={() => <ProtectedRoute component={CreateProject} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} />
        <Route path="/app/project/:projectResourceId/kubernetes-cluster/add" render={() => <ProtectedRoute component={AddK8sCluster} />} />
        <Route path="/app/project/:projectResourceId/kubernetes-clusters" render={() => <ProtectedRoute component={ManageK8sClusters} />} />
        <Route path="/app/project/:projectResourceId/container-registry/add" render={() => <ProtectedRoute component={AddContainerRegistry1} />} />
        <Route path="/app/project/:projectResourceId/container-registries" render={() => <ProtectedRoute component={ManageContainerRegistries} />} />
        <Route path="/app/project/:projectResourceId/build-tool/add" render={() => <ProtectedRoute component={AddBuildTool} />} />
        <Route path="/app/project/:projectResourceId/build-tools" render={() => <ProtectedRoute component={ManageBuildTools} />} />
        <Route path="/app/project/:projectResourceId/applications" render={() => <ProtectedRoute component={ManageApplications} />} />
        <Route path="/app/project/:projectResourceId/application/:deploymentResourceId/history" render={() => <ProtectedRoute component={ManageApplicationHistory} />} />
        <Route render={() => <ProtectedRoute component={Nomatch} />} />
      </Switch>
      <LoadProject activeProjectId={projectId} open={openProjectLoader} onClose={handleClose} />
    </div >


    //     <Layout style={{
    //       borderLeft: '1px solid #e9e9e9',
    //       height: 'calc(100vh- 48px)',
    //       backgroundColor: '#fff',
    //       paddingLeft: '5px, 5px, 0px,0px',
    //       overflow: 'auto'
    //     }}>
    //       <Content style={{ backgroundColor: '#fff' }}>
    //         <Row>
    //           <Col span={24}>
    //             <Switch>
    //               <Route path="/" exact render={() => <ProtectedRoute component={Dashboard} />} />
    //               <Route path="/app" exact render={() => <ProtectedRoute component={Dashboard} />} />
    //               <Route path="/app/dashboard" render={() => <ProtectedRoute component={Dashboard} />} />
    //               {/* <Route path="/app/create-tenant" render={() => <ProtectedRoute component={CreateTenant} roles={['ROLE_SUPER_ADMIN']} />} />
    //               <Route path="/app/manage-tenants" render={() => <ProtectedRoute component={ManageTenants} roles={['ROLE_SUPER_ADMIN']} />} />
    //               <Route path="/app/create-user" render={() => <ProtectedRoute component={CreateUser} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']} />} />
    //               <Route path="/app/manage-users" render={() => <ProtectedRoute component={ManageUsers} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER']} />} />
    //               <Route path="/app/user/:userName/view" render={() => <ProtectedRoute component={ViewUser} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} />
    //               <Route path="/app/user/:userName/edit" render={() => <ProtectedRoute component={EditUser} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']} />} />
    //               <Route path="/app/user/:userName/roles" render={() => <ProtectedRoute component={ManageRoles} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']} />} />
    //               <Route path="/app/project/create" render={() => <ProtectedRoute component={CreateProject} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} />
    //               <Route path="/app/projects" render={() => <ProtectedRoute component={ManageProjects} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} />
    //               <Route path="/app/project/:projectResourceId/view" render={() => <ProtectedRoute component={ViewProject} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} />
    //               <Route path="/app/project/:projectResourceId/edit" render={() => <ProtectedRoute component={EditProject} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} />
    //               <Route path="/app/project/:projectResourceId/members" render={() => <ProtectedRoute component={ManageProjectMembers} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} />
    //               <Route path="/app/project/:projectResourceId/permissions/:userId?" render={() => <ProtectedRoute component={ManageProjectPermissions} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} />
    //               <Route path="/app/project/:projectResourceId/settings/:settingId" render={() => <ProtectedRoute component={ManageSettings} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} />
    //               <Route path="/app/project/:projectResourceId/deployments" render={() => <ProtectedRoute component={ManageDeployments} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} />
    //               <Route path="/app/project/:projectResourceId/deployment/select-type" render={() => <ProtectedRoute component={DeploymentTypes} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} />
    //               <Route path="/app/project/:projectResourceId/deployment/create" render={() => <ProtectedRoute component={CreateDeployment} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} />
    //               <Route path="/app/project/:projectResourceId/deployment/:deploymentResourceId/releases" render={() => <ProtectedRoute component={ManageReleases} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} />
    //               <Route path="/app/project/:projectResourceId/deployment/:deploymentResourceId/release/:releaseResourceId/view" render={() => <ProtectedRoute component={ViewRelease} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} />
    //               <Route path="/app/project/:projectResourceId/deployment/:deploymentResourceId/release/:releaseResourceId/pipeline" render={() => <ProtectedRoute component={ViewReleasePipeline} roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']} />} /> */}
    //               <Route render={() => <ProtectedRoute component={Nomatch} />} />
    //             </Switch>
    //           </Col>
    //         </Row>
    //       </Content>
    //     </Layout>
    //   </Layout>
    // </Layout>
  );
}

export default Home;