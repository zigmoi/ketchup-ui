import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import {Grid, Typography, Box, IconButton} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useSnackbar} from 'notistack';
import RefreshIcon from '@material-ui/icons/Refresh';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import tableIcons from '../tableIcons';
import {useHistory, useParams} from 'react-router-dom';
import {format} from 'date-fns';
import Tooltip from "@material-ui/core/Tooltip";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

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


function ManageApplicationRevisions() {
    const classes = useStyles();
    let history = useHistory();
    const {projectResourceId, applicationResourceId} = useParams();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        console.log("in effect Manage Application Revisions");
        document.title = "Application Revisions";
        loadAll();
    }, []);

    function reloadTabularData() {
        loadAll();
    }

    function loadAll() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}/revisions`)
            .then((response) => {
                setLoading(false);
                setDataSource(response.data);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function deployApplication() {
        setLoading(true);
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}/revisions?commit-id=latest`, null, {timeout: 60000})
            .then((response) => {
                console.log(response);
                setLoading(false);
                enqueueSnackbar('Application deployment started successfully!', {variant: 'success'});
                history.push(`/app/project/${projectResourceId}/application/${applicationResourceId}/revision/${response.data.revisionResourceId}`);
            })
            .catch((error) => {
                setLoading(false);
                enqueueSnackbar('Application deployment failed!', {variant: 'error'});
            });
    }

    function refreshRevisionStatus(revisionResourceId) {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}/revisions/${revisionResourceId}/pipeline/status/refresh`)
            .then((response) => {
                setLoading(false);
                reloadTabularData();
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function rollbackRevision(revisionResourceId) {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}/revisions/${revisionResourceId}/rollback`)
            .then((response) => {
                setLoading(false);
                enqueueSnackbar('Rollback successful!', {variant: 'success'});
                reloadTabularData();
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function renderStatus(rowData) {
        if (rowData?.status === "SUCCESS") {
            return <Typography style={{fontWeight: "bold", color: 'green'}}
                               variant="inherit">{rowData?.status}</Typography>
        } else if (rowData?.status === "FAILED") {
            return <Typography style={{fontWeight: "bold", color: '#f44336'}}
                               variant="inherit">{rowData?.status}</Typography>
        } else {
            return (
                <React.Fragment>
                    <Typography style={{fontWeight: "bold"}} variant="inherit">{rowData?.status}</Typography> &nbsp;
                    {rowData?.rollback ? null :
                        <Tooltip title="Refresh Status">
                            <RefreshIcon
                                onClick={() => refreshRevisionStatus(rowData.id.revisionResourceId)}
                                color="action"
                                fontSize="inherit"/>
                        </Tooltip>}
                </React.Fragment>);
        }
    }

    return (
        <Container maxWidth="xl" className={classes.container}>
            <Grid>
                <MaterialTable
                    title={
                        <Typography variant="h6">
                            Application Revisions
                            <Typography variant="caption">
                                &nbsp; {applicationResourceId}
                            </Typography>
                        </Typography>}
                    icons={tableIcons}
                    isLoading={loading}
                    components={{Container: props => props.children}}
                    columns={[
                        {
                            title: 'ID',
                            field: 'id.revisionResourceId',
                            width: 280},
                        {
                            title: 'Version',
                            field: 'version',
                            width: 50},
                        {
                            title: 'Commit',
                            field: 'commitId',
                            width: 100,
                            render: (rowData) => rowData?.commitId?.substring(0, 8)
                        },
                        {
                            title: 'Status',
                            field: 'status',
                            width: 120,
                            render: (rowData) => renderStatus(rowData)},
                        {
                            title: 'Rollback',
                            field: 'rollback',
                            width: 100,
                            render: (rowData) => rowData?.rollback ? `Rollback to ${rowData?.originalRevisionVersionId}` : "No"
                        },
                        {
                            title: 'Created On',
                            field: 'createdOn',
                            width: 200,
                            render: (rowData) => format(new Date(rowData.createdOn), "PPpp")
                        },
                        {
                            title: 'Actions',
                            width: 100,
                            render: (rowData) => <ActionMenu rowData={rowData}
                                                             refreshRevisionStatus={refreshRevisionStatus}
                                                             rollbackRevision={rollbackRevision}/>
                        },
                    ]}
                    data={dataSource}
                    actions={[
                        // {
                        //     icon: () => <LowPriorityIcon color="action" fontSize="small"/>,
                        //     tooltip: 'Pipeline',
                        //     onClick: (event, rowData) => history.push(`/app/project/${projectResourceId}/application/${deploymentResourceId}/release/${rowData.id.releaseResourceId}`)
                        // },
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


const ITEM_HEIGHT = 30;

function ActionMenu(props) {
    console.log(props);
    let history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const useStyles = makeStyles((theme) => ({
        actionIcon: {
            '& svg': {
                fontSize: 17,
            },
            margin: 0,
            padding: 0,
            paddingInline: 0,
            marginInline: 0,
        },
    }));

    const classes = useStyles();
    return (
        <div style={{display: "flex"}}>
            <IconButton onClick={handleClick} className={classes.actionIcon}>
                <MoreVertIcon/>
            </IconButton>

            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5 + 1,
                        width: '15ch',
                    },
                }}
            >

                {props?.rowData?.rollback ? null :
                    <MenuItem
                        style={{fontSize: 12}}
                        key="pipeline"
                        onClick={() => {
                            setAnchorEl(null);
                            history.push(`/app/project/${props.rowData.id.projectResourceId}/application/${props.rowData.id.applicationResourceId}/revision/${props.rowData.id.revisionResourceId}`);
                        }}>
                        View Pipeline
                    </MenuItem>}
                <MenuItem
                    style={{fontSize: 12}}
                    key="rollback"
                    onClick={() => {
                        setAnchorEl(null);
                        props.rollbackRevision(props.rowData.id.revisionResourceId);
                    }}>
                    Rollback
                </MenuItem>
                {(props.rowData?.status === "SUCCESS" || props.rowData?.status === "FAILED" || props?.rowData?.rollback) ? null :
                    <MenuItem
                        style={{fontSize: 12}}
                        key="refresh-status"
                        onClick={() => {
                            setAnchorEl(null);
                            props.refreshRevisionStatus(props.rowData.id.revisionResourceId);
                        }}>
                        Refresh Status
                    </MenuItem>}
            </Menu>
        </div>
    );
}

export default ManageApplicationRevisions;
