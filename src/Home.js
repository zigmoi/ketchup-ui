import React, {useState, useContext, useEffect} from 'react';
import './App.css';
import {Switch, useHistory, Route, Link, useLocation, Redirect} from 'react-router-dom';

import UserContext from './UserContext';
import useCurrentProject from './useCurrentProject';
import ProtectedRoute from './ProtectedRoute';

import useValidateUserHasAnyRole from './useValidateUserHasAnyRole';
import useValidateUserHasAllRoles from './useValidateUserHasAllRoles';

import Nomatch from './Nomatch';
import Dashboard from './Projects/Dashboard';

import clsx from 'clsx';
import {fade, makeStyles} from '@material-ui/core/styles';
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
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import DvrIcon from '@material-ui/icons/Dvr';
import AssessmentIcon from '@material-ui/icons/Assessment';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import CloudIcon from '@material-ui/icons/Cloud';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import BugReportIcon from '@material-ui/icons/BugReport';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import MemoryIcon from '@material-ui/icons/Memory';
import LoopIcon from '@material-ui/icons/Loop';
import SettingsIcon from '@material-ui/icons/Settings';
import WifiOffIcon from '@material-ui/icons/WifiOff';

import CreateUser from './Users/CreateUser';
import EditUser from './Users/EditUser';
import ManageUsers from './Users/ManageUsers';

import CreateTenant from './Tenants/CreateTenant';
import ManageTenants from './Tenants/ManageTenants';

import AddK8sCluster from './K8sClusters/AddK8sCluster';
import EditK8sCluster from './K8sClusters/EditK8sCluster';
import ManageK8sClusters from './K8sClusters/ManageK8sClusters';

import AddContainerRegistry from './ContainerRegistries/AddContainerRegistry';
import EditContainerRegistry from './ContainerRegistries/EditContainerRegistry';
import ManageContainerRegistries from './ContainerRegistries/ManageContainerRegistries';

import AddBuildTool from './BuildTools/AddBuildTool';
import EditBuildTool from './BuildTools/EditBuildTool';
import ManageBuildTools from './BuildTools/ManageBuildTools';

import CreateApplication from './Applications/CreateApplication';
import EditApplication from "./Applications/EditApplication";
import ViewApplication from './Applications/ViewApplication';
import ViewApplicationLogs from './Applications/ViewApplicationLogs';
import ManageApplications from './Applications/ManageApplications';
import ManageApplicationRevisions from './Applications/ManageApplicationRevisions';
import ViewApplicationRevision from "./Applications/ViewApplicationRevision";

import CreateProject from './Projects/CreateProject';
import EditProject from "./Projects/EditProject";
import LoadProject from './Projects/LoadProject';
import ManageProjectPermissions from "./Users/ManageProjectPermissions";

import ViewRevisionPipeline from './Applications/ViewRevisionPipeline';
import ManageDeployments from "./Applications/ManageDeployments";
import GenerateGitWebHookUrl from "./Applications/GenerateGitWebHookUrl";
import GetStarted from "./Projects/GetStarted";


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
    let history = useHistory();
    const userContext = useContext(UserContext);

    const projectId = useCurrentProject();

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


    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="absolute" className={classes.appBar}>
                <Toolbar variant="dense" className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleDrawerOpen}
                        className={classes.menuButton}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Ketchup
                    </Typography>
                    {userContext?.currentUser?.tenantId === "zigmoi.com" ? null :
                        <React.Fragment>
                            <Button
                                startIcon={<DynamicFeedIcon/>}
                                endIcon={<ArrowDropDownIcon/>}
                                className={classes.button}
                                onClick={handleClickOpen}
                            >
                                 {projectId ? projectId : "Select Project"}
                            </Button>
                            {/*<div className={classes.search}>*/}
                            {/*    <div className={classes.searchIcon}>*/}
                            {/*        <SearchIcon/>*/}
                            {/*    </div>*/}
                            {/*    <InputBase*/}
                            {/*        placeholder="Search applications and resources."*/}
                            {/*        classes={{*/}
                            {/*            root: classes.inputRoot,*/}
                            {/*            input: classes.inputInput,*/}
                            {/*        }}*/}
                            {/*        inputProps={{'aria-label': 'search'}}*/}
                            {/*    />*/}
                            {/*</div>*/}
                        </React.Fragment>}
                    <div className={classes.grow}/>
                    <div>
                        {/* <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
                        {/*{ navigator.onLine ? null :*/}
                        {/*    <Button*/}
                        {/*        startIcon={<WifiOffIcon/>}*/}
                        {/*        className={classes.button}*/}
                        {/*    >*/}
                        {/*        OFFLINE*/}
                        {/*    </Button>}*/}
                        <Button
                            color="inherit"
                            startIcon={<AccountCircle/>}
                            style={{textTransform: 'none'}}
                        >{userContext?.currentUser?.displayName}</Button>
                        <Button
                            color="inherit"
                            startIcon={<ExitToAppIcon/>}
                            style={{textTransform: 'none'}}
                            onClick={() => {
                                // projectContext.clearCurrentProject();
                                userContext.clearCurrentUser();
                                history.push(`/login`);
                                //not passing location because if user logouts he should go to default route.
                                //setting location can redirect different users to route set by previous users.
                            }}
                        >Logout</Button>
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
                <div className={classes.appBarSpacer}/>
                <List dense={true}>
                    {useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']) === false ? null :
                        <React.Fragment>
                            {projectId ?
                                <React.Fragment>
                                    <ListItem button component={Link} to={`/app/project/${projectId}/dashboard`}>
                                        <ListItemIcon>
                                            <AssessmentIcon className={classes.drawerMenuIcon}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Dashboard"/>
                                    </ListItem>
                                    <ListItem button component={Link} to={`/app/project/${projectId}/applications`}>
                                        <ListItemIcon>
                                            <AppsIcon className={classes.drawerMenuIcon}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Applications"/>
                                    </ListItem>
                                    <ListItem button component={Link} to={`/app/project/${projectId}/deployments`}>
                                        <ListItemIcon>
                                            <LoopIcon className={classes.drawerMenuIcon}/>
                                        </ListItemIcon>
                                        <ListItemText primary=" Active Deployments"/>
                                    </ListItem>
                                    <ListItem button component={Link} to={`/app/project/${projectId}/application/logs`}>
                                        <ListItemIcon>
                                            <BugReportIcon className={classes.drawerMenuIcon}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Logs"/>
                                    </ListItem>
                                    <ListItem button component={Link}
                                              to={`/app/project/${projectId}/kubernetes-clusters`}>
                                        <ListItemIcon>
                                            <CloudIcon className={classes.drawerMenuIcon}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Kubernetes Clusters"/>
                                    </ListItem>
                                    <ListItem button component={Link}
                                              to={`/app/project/${projectId}/container-registries`}>
                                        <ListItemIcon>
                                            <LineWeightIcon className={classes.drawerMenuIcon}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Container Registries"/>
                                    </ListItem>
                                    <ListItem button component={Link} to={`/app/project/${projectId}/build-tools`}>
                                        <ListItemIcon>
                                            <MemoryIcon className={classes.drawerMenuIcon}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Build Tools"/>
                                    </ListItem>
                                    <ListItem button component={Link} to={`/app/project/${projectId}/permissions/`}>
                                        <ListItemIcon>
                                            <VpnKeyIcon className={classes.drawerMenuIcon}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Permissions"/>
                                    </ListItem>
                                </React.Fragment> :
                                <ListItem button component={Link} to="/app/get-started">
                                    <ListItemIcon>
                                        <AssessmentIcon className={classes.drawerMenuIcon}/>
                                    </ListItemIcon>
                                    <ListItemText primary="Get Started"/>
                                </ListItem>}
                        </React.Fragment>
                    }
                    {useValidateUserHasAllRoles(['ROLE_SUPER_ADMIN']) === false ? null :
                        <ListItem button component={Link} to="/app/manage-tenants">
                            <ListItemIcon>
                                <AccountTreeIcon className={classes.drawerMenuIcon}/>
                            </ListItemIcon>
                            <ListItemText primary="Tenants"/>
                        </ListItem>
                    }
                    {useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER']) === false ? null :
                        <ListItem button component={Link} to="/app/manage-users">
                            <ListItemIcon>
                                <PeopleIcon className={classes.drawerMenuIcon}/>
                            </ListItemIcon>
                            <ListItemText primary="Users"/>
                        </ListItem>
                    }
                    {useValidateUserHasAnyRole(['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']) === false ? null :
                        <React.Fragment>
                            {projectId ?
                                <ListItem button component={Link} to={`/app/project/${projectId}/settings/`}>
                                    <ListItemIcon>
                                        <SettingsIcon className={classes.drawerMenuIcon}/>
                                    </ListItemIcon>
                                    <ListItemText primary="Settings"/>
                                </ListItem> : null}
                        </React.Fragment>
                    }
                    {/* <ListItem button>
            <ListItemIcon>
              <PortraitIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Members" />
          </ListItem> */}
                    {/*
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem> */}
                    {/* <ListItem button>
            <ListItemIcon>
              <LayersIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="CI/CD Pipelines" />
          </ListItem> */}
                    {/* <ListItem button>
            <ListItemIcon>
              <AppsIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Host Aliases" />
          </ListItem> */}
                    {/* <ListItem button>
            <ListItemIcon>
              <TimerIcon className={classes.drawerMenuIcon}  />
            </ListItemIcon>
            <ListItemText primary="Alerts" />
          </ListItem> */}
                </List>
            </Drawer>
            <Switch>
                <Route path="/" exact><Redirect to={projectId ? `/app/project/${projectId}/dashboard` : `/app/get-started`} /></Route>
                <Route path="/app" exact><Redirect to={projectId ? `/app/project/${projectId}/dashboard` : `/app/get-started`} /></Route>
                <Route path="/app/get-started" render={() => <ProtectedRoute component={GetStarted}
                                                                           roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/create-tenant"
                       render={() => <ProtectedRoute component={CreateTenant} roles={['ROLE_SUPER_ADMIN']}/>}/>
                <Route path="/app/manage-tenants"
                       render={() => <ProtectedRoute component={ManageTenants} roles={['ROLE_SUPER_ADMIN']}/>}/>
                <Route path="/app/create-user" render={() => <ProtectedRoute component={CreateUser}
                                                                             roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']}/>}/>
                <Route path="/app/user/:userName/edit" render={() => <ProtectedRoute component={EditUser}
                                                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']}/>}/>
                <Route path="/app/manage-users" render={() => <ProtectedRoute component={ManageUsers}
                                                                              roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN']}/>}/>
                <Route path="/app/project/create" render={() => <ProtectedRoute component={CreateProject}
                                                                                roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/dashboard" render={() => <ProtectedRoute component={Dashboard}
                                                                           roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/settings"
                       render={() => <ProtectedRoute component={EditProject}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/permissions/:userId?"
                       render={() => <ProtectedRoute component={ManageProjectPermissions}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/kubernetes-cluster/add"
                       render={() => <ProtectedRoute component={AddK8sCluster}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/kubernetes-cluster/:settingResourceId/edit"
                       render={() => <ProtectedRoute component={EditK8sCluster}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/kubernetes-clusters"
                       render={() => <ProtectedRoute component={ManageK8sClusters}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/container-registry/add"
                       render={() => <ProtectedRoute component={AddContainerRegistry}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/container-registry/:settingResourceId/edit"
                       render={() => <ProtectedRoute component={EditContainerRegistry}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/container-registries"
                       render={() => <ProtectedRoute component={ManageContainerRegistries}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/build-tool/add"
                       render={() => <ProtectedRoute component={AddBuildTool}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/build-tool/:settingResourceId/edit"
                       render={() => <ProtectedRoute component={EditBuildTool}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/build-tools"
                       render={() => <ProtectedRoute component={ManageBuildTools}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/application/create"
                       render={() => <ProtectedRoute component={CreateApplication}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/application/:applicationResourceId/revisions"
                       render={() => <ProtectedRoute component={ManageApplicationRevisions}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/application/:applicationResourceId/revision/:revisionResourceId/view"
                       render={() => <ProtectedRoute component={ViewApplicationRevision}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route
                    path="/app/project/:projectResourceId/application/:applicationResourceId/revision/:revisionResourceId/pipeline"
                    render={() => <ProtectedRoute component={ViewRevisionPipeline}
                                                  roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/application/:applicationResourceId/edit"
                       render={() => <ProtectedRoute component={EditApplication}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/application/:applicationResourceId/view"
                       render={() => <ProtectedRoute component={ViewApplication}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/application/:applicationResourceId/git-web-hook/generate"
                       render={() => <ProtectedRoute component={GenerateGitWebHookUrl}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/application/:applicationResourceId?/logs"
                       render={() => <ProtectedRoute component={ViewApplicationLogs}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/applications"
                       render={() => <ProtectedRoute component={ManageApplications}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route path="/app/project/:projectResourceId/deployments"
                       render={() => <ProtectedRoute component={ManageDeployments}
                                                     roles={['ROLE_TENANT_ADMIN', 'ROLE_USER_ADMIN', 'ROLE_USER_READER', 'ROLE_USER']}/>}/>
                <Route render={() => <ProtectedRoute component={Nomatch}/>}/>
            </Switch>
            {openProjectLoader ?
                <LoadProject activeProjectId={projectId} open={openProjectLoader} onClose={handleClose}/> : null}
        </div>
    );
}

export default Home;