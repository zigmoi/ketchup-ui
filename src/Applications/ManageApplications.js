import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import tableIcons from '../tableIcons';
import {useHistory, useParams} from 'react-router-dom';
import {format} from "date-fns";
import ApplicationsActionMenu from "./ApplicationsActionMenu";
import {Grid} from "@material-ui/core";

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
    let {projectResourceId} = useParams();

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        console.log("in effect Manage Applications");
        document.title = "Applications";
        loadAll();
    }, [projectResourceId]);

    function loadAll() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications`)
            .then((response) => {
                setLoading(false);
                setDataSource(response.data);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return (
        <Container maxWidth="xl" className={classes.container}>
            <Grid>
                <MaterialTable
                    title="Applications"
                    icons={tableIcons}
                    isLoading={loading}
                    components={{Container: props => props.children}}
                    columns={[
                        {title: 'Name', field: 'displayName'},
                        {title: 'ID', field: 'id.applicationResourceId', width: 280},
                        {title: 'Type', field: 'type'},
                        {
                            title: 'Updated On',
                            field: 'lastUpdatedOn',
                            render: (rowData) => format(new Date(rowData.lastUpdatedOn), "PPpp")
                        },
                        {
                            title: 'Actions', width: 100, render: (rowData) => <ApplicationsActionMenu rowData={rowData}/>
                        },
                    ]}
                    data={dataSource}
                    actions={[
                        {
                            icon: () => <AddIcon color="action" fontSize="small"/>,
                            tooltip: 'Add Application',
                            isFreeAction: true,
                            onClick: () => history.push(`/app/project/${projectResourceId}/application/create`)
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

export default ManageApplications;