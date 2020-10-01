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


function ManagePipelineRuns() {
    const classes = useStyles();
    let history = useHistory();
    let { projectResourceId } = useParams();
    
    const [iconLoading, setIconLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        console.log("in effect Manage Pipeline Runs");
        document.title = "Pipeline Runs";
        loadAll();
    }, [projectResourceId]);

    function reloadTabularData() {
        loadAll();
    }

    function loadAll() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/pipelines?projectResourceId=${projectResourceId}&status=IN PROGRESS`)
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
                            title="Pipeline Runs"
                            icons={tableIcons}
                            isLoading={iconLoading}
                            components={{ Container: props => props.children }}
                            columns={[
                                { title: 'Release ID', field: 'id.releaseResourceId', width: 280},
                                { title: 'Application ID', field: 'deploymentResourceId', width: 280},
                                { title: 'Commit Id', field: 'commitId' },
                                { title: 'Status', field: 'status' },
                                { title: 'Updation Date', field: 'lastUpdatedOn', type: 'datetime'}
                            ]}
                            data={dataSource}
                            actions={[
                                {
                                    icon: () => <LaunchIcon color="action" fontSize="small" />,
                                    tooltip: 'View Pipeline',
                                    onClick: (event, rowData) => history.push(`/app/project/${projectResourceId}/application/${rowData.deploymentResourceId}/release/${rowData.id.releaseResourceId}`)
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

export default ManagePipelineRuns;