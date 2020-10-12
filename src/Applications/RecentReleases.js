import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import {Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import tableIcons from '../tableIcons';
import {Link, NavLink, useHistory, useParams} from 'react-router-dom';
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


function RecentReleases(props) {
    const classes = useStyles();
    let history = useHistory();

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const {projectId} = props;

    useEffect(() => {
        console.log("in effect Recent Releases");
        loadAll();
    }, [projectId]);

    function loadAll() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/pipelines/recent?projectResourceId=${projectId}`)
            .then((response) => {
                setLoading(false);
                setDataSource(response.data);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return (
        <MaterialTable
            title=""
            icons={tableIcons}
            isLoading={loading}
            components={{Container: props => props.children}}
            columns={[
                {title: 'Application ID', field: 'deploymentResourceId', width: 280},
                {title: 'Version', field: 'version'},
                {title: 'Commit Id', field: 'commitId', width: 320},
                {title: 'Status', field: 'status'},
                {title: 'Updated On', field: 'lastUpdatedOn', render: (rowData)=> format(new Date(rowData.lastUpdatedOn), "PPpp")}
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