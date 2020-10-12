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
import DateRangeIcon from '@material-ui/icons/DateRange';
import LaunchIcon from '@material-ui/icons/Launch';
import tableIcons from '../tableIcons';
import { Link, NavLink, useHistory, useParams } from 'react-router-dom';
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


function ManageApplications() {
    const classes = useStyles();
    let history = useHistory();
    let { projectResourceId } = useParams();
    
    const [iconLoading, setIconLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        console.log("in effect Manage Applications");
        document.title = "Applications";
        loadAll();
    }, [projectResourceId]);

    function reloadTabularData() {
        loadAll();
    }

    function loadAll() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/project/${projectResourceId}/deployments/basic-spring-boot/list`)
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
                            title="Applications"
                            icons={tableIcons}
                            isLoading={iconLoading}
                            components={{ Container: props => props.children }}
                            columns={[
                                { title: 'Name', field: 'displayName' },
                                { title: 'ID', field: 'id.deploymentResourceId', width: 280},
                                { title: 'Type', field: 'type' },
                                { title: 'Updated On', field: 'lastUpdatedOn', render: (rowData)=> format(new Date(rowData.lastUpdatedOn), "PPpp")}
                            ]}
                            data={dataSource}
                            actions={[
                                {
                                    icon: () => <LaunchIcon color="action" fontSize="small" />,
                                    tooltip: 'View Application',
                                    onClick: (event, rowData) => history.push(`/app/project/${projectResourceId}/application/${rowData.id.deploymentResourceId}/view`)
                                },
                                {
                                    icon: () => <EditIcon color="action" fontSize="small" />,
                                    tooltip: 'Edit Application',
                                    onClick: (event, rowData) => history.push(`/app/project/${projectResourceId}/application/${rowData.id.deploymentResourceId}/edit`)
                                },
                                // {
                                //     icon: () => <DateRangeIcon color="action" fontSize="small" />,
                                //     tooltip: 'History',
                                //     onClick: (event, rowData) => history.push(`/app/project/${projectResourceId}/application/${rowData.id.deploymentResourceId}/history`)
                                // },
                                // {
                                //     icon: () => <DeleteIcon color="action" fontSize="small" />,
                                //     tooltip: 'Delete Application',
                                //     onClick: (event, rowData) => alert("Are you sure you want to delete application " + rowData.displayName)
                                // },
                                {
                                    icon: () => <AddIcon color="action" fontSize="small" />,
                                    tooltip: 'Add Application',
                                    isFreeAction: true,
                                    onClick: () => history.push(`/app/project/${projectResourceId}/application/create`)
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

export default ManageApplications;