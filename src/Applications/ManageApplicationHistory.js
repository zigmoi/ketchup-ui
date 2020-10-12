import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import {Grid, Typography, Box, IconButton} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useSnackbar} from 'notistack';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import DateRangeIcon from '@material-ui/icons/DateRange';
import LoopIcon from '@material-ui/icons/Loop';
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import tableIcons from '../tableIcons';
import {useHistory, useParams} from 'react-router-dom';
import {format} from 'date-fns';

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
    const {projectResourceId, deploymentResourceId} = useParams();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/releases?deploymentId=${deploymentResourceId}`)
            .then((response) => {
                setLoading(false);
                setDataSource(response.data);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function deleteItem(selectedRecord) {
        setLoading(true);
        let userName = selectedRecord.userName;
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/v1/user/${userName}`)
            .then((response) => {
                setLoading(false);
                reloadTabularData();
                // message.success('User deleted successfully.');
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    function deployApplication() {
        setLoading(true);
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/release?deploymentId=${deploymentResourceId}`, null, {timeout: 60000})
            .then((response) => {
                console.log(response);
                setLoading(false);
                enqueueSnackbar('Deployment started successfully!', {variant: 'success'});
                history.push(`/app/project/${projectResourceId}/application/${deploymentResourceId}/release/${response.data.releaseResourceId}`);
            })
            .catch((error) => {
                setLoading(false);
                enqueueSnackbar('Deployment failed!', {variant: 'error'});
            });
    }

    function cleanupPipelineResource(releaseResourceId) {
        setLoading(true);
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/v1/release/pipeline/cleanup?releaseId=${releaseResourceId}`)
            .then((response) => {
                setLoading(false);
                enqueueSnackbar('Pipeline resources successfully cleaned up!', {variant: 'success'});
            })
            .catch((error) => {
                setLoading(false);
                enqueueSnackbar('Pipeline resources cleaned up failed!', {variant: 'error'});
            });
    }

    function refreshReleaseStatus(releaseResourceId) {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/release/refresh?releaseResourceId=${releaseResourceId}`)
            .then((response) => {
                setLoading(false);
                reloadTabularData();
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function renderStatus(rowData) {
        if (rowData?.status === "SUCCESS" || rowData?.status === "FAILED") {
            return rowData.status;
        } else {
            return (
                <React.Fragment>
                    <Typography variant="inherit">{rowData?.status}</Typography> &nbsp;
                    <RefreshIcon onClick={() => refreshReleaseStatus(rowData.id.releaseResourceId)} color="action" fontSize="inherit"/>
                </React.Fragment>);
        }
    }

    return (
        <Container maxWidth="xl" className={classes.container}>
            <Grid>
                <MaterialTable
                    title={
                        <Typography variant="h6">
                            Application History
                            <Typography variant="caption">
                                &nbsp; {deploymentResourceId}
                            </Typography>
                        </Typography>}
                    icons={tableIcons}
                    isLoading={loading}
                    components={{Container: props => props.children}}
                    columns={[
                        {title: 'ID', field: 'id.releaseResourceId', width: 280},
                        {title: 'Version', field: 'version', width: 50},
                        {title: 'Commit', field: 'commitId', width: 320},
                        {title: 'Status', field: 'status', render: (rowData) => renderStatus(rowData)},
                        {
                            title: 'Created On',
                            field: 'createdOn',
                            render: (rowData) => format(new Date(rowData.lastUpdatedOn), "PPpp")
                        },
                    ]}
                    data={dataSource}
                    actions={[
                        {
                            icon: () => <LowPriorityIcon color="action" fontSize="small"/>,
                            tooltip: 'Pipeline',
                            onClick: (event, rowData) => history.push(`/app/project/${projectResourceId}/application/${deploymentResourceId}/release/${rowData.id.releaseResourceId}`)
                        },
                        {
                            icon: () => <PlayCircleOutlineIcon color="action" fontSize="small"/>,
                            tooltip: 'Deploy Now',
                            isFreeAction: true,
                            onClick: () => deployApplication()
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
                        cellStyle: {
                            fontSize: '12px',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            maxWidth: 100
                        },
                        pageSize: 20,
                        pageSizeOptions: [20, 30, 40, 50],
                    }}
                />

            </Grid>
        </Container>
    );
}

export default ManageApplicationHistory;
