import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import tableIcons from '../tableIcons';
import { useHistory } from 'react-router-dom';
import VpnKey from "@material-ui/icons/VpnKey";
import useCurrentProject from "../useCurrentProject";
import {format} from "date-fns";
import {useSnackbar} from "notistack";

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
}));


function ManageUsers() {
    const classes = useStyles();
    let history = useHistory();

    const currentProject = useCurrentProject();
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        console.log("in effect Users");
        document.title = "Users";
        loadAll();
    }, []);

    function reloadTabularData() {
        loadAll();
    }

    function loadAll() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/users`)
            .then((response) => {
                setLoading(false);
                setDataSource(response.data);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function deleteUser(userName) {
        setLoading(true);
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/users/${userName}`)
            .then((response) => {
                setLoading(false);
                reloadTabularData();
                enqueueSnackbar('User deleted successfully.', { variant: 'success' });
            })
            .catch((error) => {
                setLoading(false);
            });
    }





    return (
            <Container maxWidth="xl" className={classes.container}>
                    <Grid>
                        <MaterialTable
                            title="Users"
                            icons={tableIcons}
                            isLoading={loading}
                            components={{ Container: props => props.children }}
                            columns={[
                                { title: 'Name', field: 'displayName' },
                                { title: 'User Name', field: 'userName' },
                                { title: 'Email', field: 'email' },
                                {
                                    title: 'Status', field: 'enabled',
                                    //   render: rowData => rowData.enabled ? <Chip variant="outlined" size="small" label="Active" color="primary" /> : <Chip variant="outlined" size="small" label="Disabled" />
                                    render: rowData => rowData.enabled ? "Active" : "Disabled"
                                },
                                { title: 'Created On', field: 'createdOn', render: (rowData)=> format(new Date(rowData.createdOn), "PPpp")}
                            ]}
                            data={dataSource}
                            actions={[
                                {
                                    icon: () => <VpnKey color="action" fontSize="small" />,
                                    tooltip: 'User Permissions',
                                    onClick: (event, rowData) => history.push(`/app/project/${currentProject}/permissions/${rowData.userName}`)
                                },
                                {
                                    icon: () => <EditIcon color="action" fontSize="small" />,
                                    tooltip: 'Edit User',
                                    onClick: (event, rowData) => history.push(`/app/user/${rowData.userName}/edit`)
                                },
                                {
                                    icon: () => <DeleteIcon color="action" fontSize="small" />,
                                    tooltip: 'Delete User',
                                    onClick: (event, rowData) => deleteUser(rowData.userName)
                                },
                                {
                                    icon: () => <AddIcon color="action" fontSize="small" />,
                                    tooltip: 'Add User',
                                    isFreeAction: true,
                                    onClick: () => history.push('/app/create-user')
                                },
                                {
                                    icon: () => <RefreshIcon color="action" fontSize="small" />,
                                    tooltip: 'Refresh',
                                    isFreeAction: true,
                                    onClick: loadAll
                                }
                            ]}
                            options={{
                                actionsColumnIndex: -1,
                                padding: "dense",
                                headerStyle: { fontSize: '12px', fontWeight: 'bold', backgroundColor: '#eeeeee', },
                                cellStyle: { fontSize: '12px'},
                                pageSize: 20,
                                pageSizeOptions: [20, 30, 40, 50],
                            }}
                        />

                    </Grid>
            </Container>
    );
}

export default ManageUsers;