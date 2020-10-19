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
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/releases?deploymentId=${deploymentResourceId}`)
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
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/release?deploymentId=${deploymentResourceId}`, null, {timeout: 60000})
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

    function refreshReleaseStatus(releaseResourceId) {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/release/refresh?releaseResourceId=${releaseResourceId}`)
            .then((response) => {
                setLoading(false);
                reloadTabularData();
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function rollbackRelease(releaseResourceId) {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/release/rollback?releaseResourceId=${releaseResourceId}`)
            .then((response) => {
                setLoading(false);
                enqueueSnackbar('Rollback successful!', {variant: 'success'});
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function renderStatus(rowData) {
        if (rowData?.status === "SUCCESS") {
            return <Typography style={{ fontWeight: "bold", color: 'green'}} variant="inherit">{rowData?.status}</Typography>
        } else if (rowData?.status === "FAILED") {
            return <Typography style={{ fontWeight: "bold", color: '#f44336'}} variant="inherit">{rowData?.status}</Typography>
        } else {
            return (
                <React.Fragment>
                    <Typography style={{ fontWeight: "bold"}} variant="inherit">{rowData?.status}</Typography> &nbsp;
                    <Tooltip title="Refresh Status">
                        <RefreshIcon
                            onClick={() => refreshReleaseStatus(rowData.id.releaseResourceId)}
                            color="action"
                            fontSize="inherit"/>
                    </Tooltip>
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
                        {
                            title: 'Actions', width: 100, render: (rowData) => <ActionMenu rowData={rowData} refreshReleaseStatus={refreshReleaseStatus} rollbackRelease={rollbackRelease} />
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

                <MenuItem
                    style={{fontSize: 12}}
                    key="pipeline"
                    onClick={() => {
                        setAnchorEl(null);
                        history.push(`/app/project/${props.rowData.projectResourceId}/application/${props.rowData.deploymentResourceId}/release/${props.rowData.id.releaseResourceId}`);
                    }}>
                    View Pipeline
                </MenuItem>
                <MenuItem
                    style={{fontSize: 12}}
                    key="rollback"
                    onClick={() => {
                        setAnchorEl(null);
                        props.rollbackRelease(props.rowData.id.releaseResourceId);
                    }}>
                    Rollback
                </MenuItem>
                {props.rowData?.status === "SUCCESS" || props.rowData?.status === "FAILED" ? null :
                    <MenuItem
                        style={{fontSize: 12}}
                        key="refresh-status"
                        onClick={() => {
                            setAnchorEl(null);
                            props.refreshReleaseStatus(props.rowData.id.releaseResourceId);
                        }}>
                        Refresh Status
                    </MenuItem>}
            </Menu>
        </div>
    );
}

export default ManageApplicationHistory;
