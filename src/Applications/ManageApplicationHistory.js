import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import { Grid, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useSnackbar } from 'notistack';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import DateRangeIcon from '@material-ui/icons/DateRange';
import LoopIcon from '@material-ui/icons/Loop';
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import tableIcons from '../tableIcons';
import { useHistory, useParams } from 'react-router-dom';

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


function ManageApplicationHistory() {
    const classes = useStyles();
    let history = useHistory();
    const { projectResourceId, deploymentResourceId } = useParams();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [iconLoading, setIconLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        console.log("in effect Manage Application History");
        document.title = "Application History";
        loadAll();
    }, []);

    function reloadTabularData() {
        loadAll();
    }

    function loadAll() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/releases?deploymentId=${deploymentResourceId}`)
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

    function createDeployment() {
        setIconLoading(true);
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/release?deploymentId=${deploymentResourceId}`, null, {timeout: 60000})
            .then((response) => {
                console.log(response);
                setIconLoading(false);
                enqueueSnackbar('Deployment started successfully!', {variant: 'success'});
                history.push(`/app/project/${projectResourceId}/application/${deploymentResourceId}/release/${response.data.releaseResourceId}`);
            })
            .catch((error) => {
                setIconLoading(false);
                enqueueSnackbar('Deployment failed!', {variant: 'error'});
            });
    }

    function cleanupPipelineResource(releaseResourceId) {
        setIconLoading(true);
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/v1/release/pipeline/cleanup?releaseId=${releaseResourceId}`)
            .then((response) => {
                setIconLoading(false);
                enqueueSnackbar('Pipeline resources successfully cleaned up!', {variant: 'success'});
            })
            .catch((error) => {
                setIconLoading(false);
                enqueueSnackbar('Pipeline resources cleaned up failed!', {variant: 'error'});
            });
    }

    return (
        <Container maxWidth="xl" className={classes.container}>
            <Grid>
                <MaterialTable
                    title={
                        <Typography variant="h6">
                            Application History
                                <Typography variant="caption" >
                                    &nbsp; {deploymentResourceId}
                                </Typography>
                        </Typography>}
                    icons={tableIcons}
                    isLoading={iconLoading}
                    components={{ Container: props => props.children }}
                    columns={[
                        { title: 'ID', field: 'id.releaseResourceId', width: 280 },
                        { title: 'Version', field: 'version' },
                        { title: 'Commit', field: 'commitId' },
                        { title: 'Status', field: 'status' },
                        { title: 'Creation Date', field: 'createdOn', type: 'datetime' },
                    ]}
                    data={dataSource}
                    actions={[
                        {
                            icon: () => <LowPriorityIcon color="action" fontSize="small" />,
                            tooltip: 'Pipeline',
                            onClick: (event, rowData) => history.push(`/app/project/${projectResourceId}/application/${deploymentResourceId}/release/${rowData.id.releaseResourceId}`)
                        },
                        // {
                        //     icon: () => <DeleteIcon color="action" fontSize="small" />,
                        //     tooltip: 'Cleanup Pipeline Resources',
                        //     onClick: (event, rowData) => cleanupPipelineResource(rowData.id.releaseResourceId)
                        // },
                        {
                            icon: () => <PlayCircleOutlineIcon color="action" fontSize="small" />,
                            tooltip: 'Deploy Now',
                            isFreeAction: true,
                            onClick: () => createDeployment()
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
                        cellStyle: { fontSize: '12px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 100 },
                        pageSize: 20,
                        pageSizeOptions: [20, 30, 40, 50],
                    }}
                />

            </Grid>
        </Container>
    );
}

export default ManageApplicationHistory;
