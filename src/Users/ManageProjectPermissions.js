import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import {AppBar, Button, CircularProgress, Grid, Toolbar, Typography, TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import tableIcons from '../tableIcons';
import {useParams, useHistory} from 'react-router-dom';
import {useSnackbar} from "notistack";
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
    content: {
        fontSize: '12px',
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        backgroundColor: 'white'
    },
    container: {
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(1),
        fontSize: '12px',
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        backgroundColor: 'white'
    },
    button: {
        marginLeft: theme.spacing(0.5),
    },
}));


function ManageProjectPermissions() {
    const classes = useStyles();
    let history = useHistory();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const {projectResourceId, userId} = useParams();

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [userName, setUserName] = useState(userId || "");
    const [projectResourceIdentifier, setProjectResourceIdentifier] = useState(projectResourceId || "");
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        document.title = "Permissions";
        setProjectResourceIdentifier(projectResourceId || "");
        setUserName(userId || "");
        loadAllUsers();
        loadAllProjects();
        if (projectResourceId && userId) {
            loadPermissions();
        } else {
            setDataSource([]);
        }
    }, [projectResourceId, userId]);

    function loadPermissions() {
        if (userName === "") {
            enqueueSnackbar('Please select a User!', {variant: 'error'});
            return;
        }
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/project/${projectResourceIdentifier}/user/${userName}/permissions`)
            .then((response) => {
                setLoading(false);
                setDataSource(response.data);
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    function assignSelectedPermissions() {
        if (userName === "") {
            enqueueSnackbar('Please provide a valid userName!', {variant: 'error'});
            return;
        }
        if (projectResourceIdentifier === "") {
            enqueueSnackbar('Please provide a valid project ID!', {variant: 'error'});
            return;
        }
        if (selectedPermissions.length < 1) {
            enqueueSnackbar('Please select a permission to revoke!', {variant: 'error'});
            return;
        }
        if ((selectedPermissions.indexOf("create-project") > -1 || selectedPermissions.indexOf("assign-create-project") > -1)
            && projectResourceIdentifier != "*") {
            enqueueSnackbar('create-project and assign-create-project permissions can be assigned for ALL projects and not for specific project!', {variant: 'error'});
            return;
        }

        setLoading(true);
        var data = {
            identity: userName,
            projectResourceId: projectResourceIdentifier,
            permissions: selectedPermissions.map(p => p.permission)
        };
        console.log(data);
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1/project/assign/permissions`, data)
            .then((response) => {
                setLoading(false);
                loadPermissions();
                enqueueSnackbar('Permission assigned successfully.', {variant: 'success'});
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    function revokeSelectedPermissions() {
        if (userName === "") {
            enqueueSnackbar('Please provide a valid userName!', {variant: 'error'});
            return;
        }
        if (projectResourceIdentifier === "") {
            enqueueSnackbar('Please provide a valid project ID!', {variant: 'error'});
            return;
        }
        if (selectedPermissions.length < 1) {
            enqueueSnackbar('Please select a permission to revoke!', {variant: 'error'});
            return;
        }
        if ((selectedPermissions.indexOf("create-project") > -1 || selectedPermissions.indexOf("assign-create-project") > -1)
            && projectResourceIdentifier != "*") {
            enqueueSnackbar('create-project and assign-create-project permissions can be revoked for ALL projects and not for specific project!', {variant: 'error'});
            return;
        }
        setLoading(true);
        var data = {
            identity: userName,
            projectResourceId: projectResourceIdentifier,
            permissions: selectedPermissions.map(p => p.permission)
        };
        console.log(data);
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1/project/revoke/permissions`, data)
            .then((response) => {
                setLoading(false);
                loadPermissions();
                enqueueSnackbar('Permission revoked successfully.', {variant: 'success'});
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    function loadAllUsers() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/users`)
            .then((response) => {
                setLoading(false);
                setUsers(response.data);
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    function loadAllProjects() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/projects`)
            .then((response) => {
                setLoading(false);
                let allProjects = response.data;
                allProjects.push({id: {resourceId: "*"}})
                setProjects(allProjects);
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    return (
        <Container maxWidth="xl" className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Permissions</Typography>
                    {loading ? <CircularProgress size={15} className={classes.circularProgress}/> : null}
                </Toolbar>
            </AppBar>
            <Grid container>
                <Autocomplete
                    id="projects"
                    size="small"
                    //freeSolo
                    options={projects}
                    value={{id: {resourceId: projectResourceIdentifier}}}
                    onChange={(e, newValue) => setProjectResourceIdentifier(newValue.id.resourceId)}
                    // inputValue={projectResourceIdentifier}
                    // onInputChange={(e, newValue) => setProjectResourceIdentifier(newValue)}
                    getOptionLabel={(option) => option.id.resourceId}
                    getOptionSelected={(option, value) => option.id.resourceId === value.id.resourceId}
                    style={{width: 300}}
                    disableClearable="false"
                    renderInput={(params) => <TextField {...params} label="Projects" variant="outlined"/>}
                />
                <Autocomplete
                    id="users"
                    size="small"
                    //freeSolo
                    options={users}
                    value={{userName: userName}}
                    onChange={(e, newValue) => setUserName(newValue.userName)}
                    // inputValue={userName}
                    // onInputChange={(e, newValue) => setUserName(newValue)}
                    getOptionLabel={(option) => option.userName}
                    getOptionSelected={(option, value) => option.userName === value.userName}
                    style={{width: 300}}
                    disableClearable="false"
                    renderInput={(params) => <TextField {...params} label="Users" variant="outlined"/>}
                />
                <Button
                    className={classes.button}
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={loadPermissions}
                    disabled={loading}>Load</Button>
                <Button
                    className={classes.button}
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={assignSelectedPermissions}
                    disabled={loading}>Assign</Button>
                <Button
                    className={classes.button}
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={revokeSelectedPermissions}
                    disabled={loading}>Revoke</Button>
            </Grid>
            <br />
            <Grid>
                <MaterialTable
                    icons={tableIcons}
                    isLoading={loading}
                    components={{Container: props => props.children}}
                    columns={[
                        {title: 'Permission', field: 'permission'},
                        {
                            title: 'Status', field: 'status',
                            render: rowData => rowData.status ? "ALLOWED" : "NOT ALLOWED"
                        },
                    ]}
                    data={dataSource}
                    options={{
                        actionsColumnIndex: -1,
                        padding: "dense",
                        headerStyle: {fontSize: '12px', fontWeight: 'bold', backgroundColor: '#eeeeee'},
                        cellStyle: {fontSize: '12px'},
                        selection: true,
                        search: false,
                        paging: false,
                        toolbar: false
                    }}
                    onSelectionChange={(rows) => setSelectedPermissions(rows)}
                />

            </Grid>
        </Container>
    );
}

export default ManageProjectPermissions;