import {Grid} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import {makeStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import RefreshIcon from '@material-ui/icons/Refresh';
import axios from 'axios';
import MaterialTable from 'material-table';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import tableIcons from '../tableIcons';
import {format} from "date-fns";

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


function ManageTenants() {
    const classes = useStyles();
    let history = useHistory();

    const [iconLoading, setIconLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        console.log("in effect Tenants");
        document.title = "Tenants";
        loadAll();
    }, []);


    function loadAll() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/tenants`)
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
            })
            .catch(() => {
                setIconLoading(false);
            });
    }

    return (
        <Container maxWidth="xl" className={classes.container}>
            <Grid>
                <MaterialTable
                    title="Tenants"
                    icons={tableIcons}
                    isLoading={iconLoading}
                    components={{Container: props => props.children}}
                    columns={[
                        {title: 'Name', field: 'displayName'},
                        {title: 'ID', field: 'id'},
                        {title: 'Status', field: 'enabled', render: rowData => rowData.enabled ? "Active" : "Disabled"},
                        {
                            title: 'Creation Date',
                            field: 'createdOn',
                            render: (rowData) => format(new Date(rowData.createdOn), "PPpp")
                        }
                    ]}
                    data={dataSource}
                    actions={[
                        {
                            icon: () => <EditIcon color="action" fontSize="small"/>,
                            tooltip: 'Edit Tenant',
                            onClick: (event, rowData) => alert("You saved " + rowData.name)
                        },
                        {
                            icon: () => <AddIcon color="action" fontSize="small"/>,
                            tooltip: 'Add Tenant',
                            isFreeAction: true,
                            onClick: () => history.push('/app/create-tenant')
                        },
                        {
                            icon: () => <RefreshIcon color="action" fontSize="small"/>,
                            tooltip: 'Refresh',
                            isFreeAction: true,
                            onClick: loadAll
                        }
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                        padding: "dense",
                        headerStyle: {fontSize: '12px', fontWeight: 'bold', backgroundColor: '#eeeeee',},
                        cellStyle: {fontSize: '12px'},
                        pageSize: 20,
                        pageSizeOptions: [20, 30, 40, 50],
                    }}
                />

            </Grid>
        </Container>
    );
}

export default ManageTenants;