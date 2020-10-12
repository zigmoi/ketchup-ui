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
import { useHistory, useParams } from 'react-router-dom';
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


function ManageContainerRegistries() {
    const classes = useStyles();
    let history = useHistory();
    let { projectResourceId } = useParams();
    
    const [iconLoading, setIconLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        console.log("in effect Manage Container Registries");
        document.title = "Container Registries";
        loadAll();
    }, []);

    function reloadTabularData() {
        loadAll();
    }

    function loadAll() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/list-all-container-registry/${projectResourceId}`)
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
            })
            .catch(() => {
                setIconLoading(false);
            });
    }

    function deleteItem(selectedRecord) {
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
                            title="Container Registries"
                            icons={tableIcons}
                            isLoading={iconLoading}
                            components={{ Container: props => props.children }}
                            columns={[
                                { title: 'Name', field: 'displayName', width: 160 },
                                { title: 'ID', field: 'settingId', width: 280 },
                                { title: 'Type', field: 'type', width: 102 },
                                { title: 'URL', field: 'registryUrl'},
                                { title: 'Updated On', field: 'lastUpdatedOn', render: (rowData)=> format(new Date(rowData.lastUpdatedOn), "PPpp")}
                            ]}
                            data={dataSource}
                            actions={[
                                {
                                    icon: () => <EditIcon color="action" fontSize="small" />,
                                    tooltip: 'Edit Registry',
                                    onClick: (event, rowData) => history.push(`/app/project/${projectResourceId}/container-registry/${rowData.settingId}/edit`)
                                },
                                {
                                    icon: () => <DeleteIcon color="action" fontSize="small" />,
                                    tooltip: 'Delete Registry',
                                    onClick: (event, rowData) => alert("Are you sure you want to delete registry " + rowData.displayName)
                                },
                                {
                                    icon: () => <AddIcon color="action" fontSize="small" />,
                                    tooltip: 'Add Registry',
                                    isFreeAction: true,
                                    onClick: () => history.push(`/app/project/${projectResourceId}/container-registry/add`)
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
                                cellStyle: {fontSize: '12px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 100},
                                pageSize: 20,
                                pageSizeOptions: [20, 30, 40, 50],
                            }}
                        />

                    </Grid>
            </Container>
    );
}

export default ManageContainerRegistries;