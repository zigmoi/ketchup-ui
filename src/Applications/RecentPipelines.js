import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import {Typography} from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import tableIcons from '../tableIcons';
import {format} from 'date-fns';
import {useHistory} from "react-router-dom";

function RecentPipelines(props) {
    let history = useHistory();
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const {projectResourceId} = props;

    useEffect(() => {
        console.log("in effect Recent Releases");
        loadAll();
    }, [projectResourceId]);

    function loadAll() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/pipelines/recent`)
            .then((response) => {
                setLoading(false);
                setDataSource(response.data);
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
            return <Typography style={{fontWeight: "bold"}} variant="inherit">{rowData?.status}</Typography>
        }
    }

    return (
        <MaterialTable
            title=""
            icons={tableIcons}
            isLoading={loading}
            components={{Container: props => props.children}}
            columns={[
                {title: 'Application ID', field: 'id.applicationResourceId', width: 280},
                {title: 'Version', field: 'version'},
                {title: 'Commit Id', field: 'commitId', render: (rowData) => rowData?.commitId?.substring(0, 8)},
                {title: 'Status', field: 'status', render: (rowData) => renderStatus(rowData)},
                {
                    title: 'Updated On',
                    field: 'lastUpdatedOn',
                    render: (rowData) => format(new Date(rowData.lastUpdatedOn), "PPpp")
                }
            ]}
            data={dataSource}
            actions={[
                {
                    icon: () => <LaunchIcon color="action" fontSize="small"/>,
                    tooltip: 'View Pipeline',
                    onClick: (event, rowData) => history.push(`/app/project/${projectResourceId}/application/${rowData.deploymentResourceId}/release/${rowData.id.releaseResourceId}`)
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

export default RecentPipelines;