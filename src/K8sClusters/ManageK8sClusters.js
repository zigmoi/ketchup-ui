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
import {useSnackbar} from "notistack";

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


function ManageK8sCusters() {
    const classes = useStyles();
    let history = useHistory();
    let { projectResourceId } = useParams();
    
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        console.log("in effect Manage K8s Clusters");
        document.title = "Kubernetes Clusters";
        loadAll();
    }, []);

    function reloadTabularData() {
        loadAll();
    }

    function loadAll() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/kubernetes-cluster-settings`)
            .then((response) => {
                setLoading(false);
                setDataSource(response.data);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function deleteSetting(settingResourceId) {
        setLoading(true);
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/kubernetes-cluster-settings/${settingResourceId}`)
            .then((response) => {
                setLoading(false);
                enqueueSnackbar('Setting deleted successfully.', { variant: 'success' });
                reloadTabularData();
            })
            .catch((error) => {
                setLoading(false);
            });
    }


    return (
            <Container maxWidth="xl" className={classes.container}>
                    <Grid>
                        <MaterialTable
                            title="Kubernetes Clusters"
                            icons={tableIcons}
                            isLoading={loading}
                            components={{ Container: props => props.children }}
                            columns={[
                                { title: 'Name', field: 'displayName' },
                                { title: 'ID', field: 'settingResourceId' },
                                { title: 'Updated On', field: 'lastUpdatedOn', render: (rowData)=> format(new Date(rowData.lastUpdatedOn), "PPpp")}
                            ]}
                            data={dataSource}
                            actions={[
                                {
                                    icon: () => <EditIcon color="action" fontSize="small" />,
                                    tooltip: 'Edit Cluster',
                                    onClick: (event, rowData) => history.push(`/app/project/${projectResourceId}/kubernetes-cluster/${rowData.settingResourceId}/edit`)
                                },
                                {
                                    icon: () => <DeleteIcon color="action" fontSize="small" />,
                                    tooltip: 'Delete Cluster',
                                    onClick: (event, rowData) => deleteSetting(rowData.settingResourceId)
                                },
                                {
                                    icon: () => <AddIcon color="action" fontSize="small" />,
                                    tooltip: 'Add Cluster',
                                    isFreeAction: true,
                                    onClick: () => history.push(`/app/project/${projectResourceId}/kubernetes-cluster/add`)
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
                                cellStyle: { fontSize: '12px'},
                                pageSize: 20,
                                pageSizeOptions: [20, 30, 40, 50],
                            }}
                        />

                    </Grid>
            </Container>
    );
}

export default ManageK8sCusters;