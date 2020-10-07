import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import {Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import DateRangeIcon from '@material-ui/icons/DateRange';
import LaunchIcon from '@material-ui/icons/Launch';
import tableIcons from '../tableIcons';
import {Link, NavLink, useHistory, useParams} from 'react-router-dom';
import useCurrentProject from "../useCurrentProject";
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


function RecentReleases() {
    const classes = useStyles();
    let history = useHistory();
    let currentProject = useCurrentProject();

    const [iconLoading, setIconLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [projectId, setProjectId] = useState("");

    useEffect(() => {
        console.log("in effect home, project: ", currentProject);
        setProjectId(currentProject ? currentProject.projectId : "a1");
    }, [currentProject]);

    useEffect(() => {
        console.log("in effect Recent Releases");
        loadAll();
    }, [projectId]);

    function reloadTabularData() {
        loadAll();
    }

    function loadAll() {
        setIconLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/pipelines/recent?projectResourceId=${projectId}`)
            .then((response) => {
                setIconLoading(false);
                setDataSource(response.data);
            })
            .catch(() => {
                setIconLoading(false);
            });
    }

    return (
        <MaterialTable
            title=""
            icons={tableIcons}
            isLoading={iconLoading}
            components={{Container: props => props.children}}
            columns={[
                {title: 'Release ID', field: 'id.releaseResourceId', width: 280},
                {title: 'Application ID', field: 'deploymentResourceId', width: 280},
                {title: 'Commit Id', field: 'commitId'},
                {title: 'Status', field: 'status'},
                {title: 'Updation Date', field: 'lastUpdatedOn', render: (rowData)=> format(new Date(rowData.lastUpdatedOn), "PPpp")}
            ]}
            data={dataSource}
            actions={[
                {
                    icon: () => <LaunchIcon color="action" fontSize="small"/>,
                    tooltip: 'View Pipeline',
                    onClick: (event, rowData) => history.push(`/app/project/${projectId}/application/${rowData.deploymentResourceId}/release/${rowData.id.releaseResourceId}`)
                },
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
                paging: false,
                toolbar: false,
                search: false
            }}
        />
    );
}

export default RecentReleases;