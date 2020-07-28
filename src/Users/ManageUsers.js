import React, { useState, useEffect } from 'react';
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
    
    const [iconLoading, setIconLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        console.log("in effect Users");
        document.title = "Users";
        loadAll();
    }, []);

    //             <span>
    //                 <Button type="primary" size="small"><Link to={`/app/user/${record.userName}/view`}>View</Link></Button>
    //                 <Divider type="vertical" />
    //                 <Button type="primary" size="small"><Link to={`/app/user/${record.userName}/edit`}>Edit</Link></Button>
    //                 <Divider type="vertical" />
    //                 {/* <Button type="primary" size="small"><Link to={`/app/user/${record.userName}/roles`}>Roles</Link></Button>
    //                 <Divider type="vertical" /> */}
    //                 <Popconfirm title="Confirm operation?"
    //                     okText="Go Ahead" cancelText="Cancel" onConfirm={() => toggleStatus(record)}>
    //                     <Button type="danger" size="small">{record.enabled ? 'Disable' : 'Enable'}</Button>
    //                 </Popconfirm>
    //                 <Divider type="vertical" />
    //                 <Popconfirm title="Confirm operation?"
    //                     okText="Go Ahead" cancelText="Cancel" onConfirm={() => deleteUser(record)}>
    //                     <Button type="danger" size="small">Delete</Button>
    //                 </Popconfirm>
    //             </span>
    //         )
    //     }];

    //     setColumns(columns);
    // }

    function reloadTabularData() {
        loadAll();
    }

    function loadAll() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/users`)
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
            })
            .catch(() => {
                setIconLoading(false);
            });
    }

    function deleteUser(selectedRecord) {
        setIconLoading(true);
        let userName = selectedRecord.userName;
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/v1/user/${userName}`)
            .then((response) => {
                setIconLoading(false);
                reloadTabularData();
                // message.success('User deleted successfully.');
            })
            .catch((error) => {
                setIconLoading(false);
            });
    }





    return (
            <Container maxWidth="xl" className={classes.container}>
                    <Grid>
                        <MaterialTable
                            title="Users"
                            icons={tableIcons}
                            isLoading={iconLoading}
                            components={{ Container: props => props.children }}
                            columns={[
                                { title: 'Display Name', field: 'displayName' },
                                { title: 'User Name', field: 'userName' },
                                { title: 'Email', field: 'email' },
                                {
                                    title: 'Status', field: 'enabled',
                                    //   render: rowData => rowData.enabled ? <Chip variant="outlined" size="small" label="Active" color="primary" /> : <Chip variant="outlined" size="small" label="Disabled" />
                                    render: rowData => rowData.enabled ? "Active" : "Disabled"
                                },
                                { title: 'Creation Date', field: 'createdOn', type: 'date'},
                            ]}
                            data={dataSource}
                            actions={[
                                {
                                    icon: () => <EditIcon color="action" fontSize="small" />,
                                    tooltip: 'Edit User',
                                    onClick: (event, rowData) => alert("You saved " + rowData.name)
                                },
                                {
                                    icon: () => <DeleteIcon color="action" fontSize="small" />,
                                    tooltip: 'Delete User',
                                    onClick: (event, rowData) => alert("Are you sure you want to delete user " + rowData.userName)
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