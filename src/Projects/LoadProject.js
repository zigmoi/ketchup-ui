import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import MaterialTable from 'material-table';
import { Grid, Container, DialogActions, Button } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import RefreshIcon from '@material-ui/icons/Refresh';
import tableIcons from '../tableIcons';
import ProjectContext from '../ProjectContext';
import {format} from "date-fns";
import useCurrentUser from "../useCurrentUser";

const useStyles = makeStyles(() => ({
  container: {
    fontSize: '12px',
    flexGrow: 1,
    overflow: 'auto',
    backgroundColor: 'white'
  },
}));

export default function LoadProject(props) {
  const { onClose, activeProjectId, open } = props;
  const classes = useStyles();
  const projectContext = useContext(ProjectContext);
  const currentUser = useCurrentUser();
  let history = useHistory();

  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);


  useEffect(() => {
    console.log("in effect Load Project");
    loadAll();
  }, [activeProjectId]);


  const handleClose = () => {
    onClose();
  };



  function loadAll() {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects`)
      .then((response) => {
        setLoading(false);
        setDataSource(response.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function openProject(selectedRecord) {
    console.log("View project details selectedRecord", selectedRecord);
    let projectName = selectedRecord.id.resourceId;
    projectContext.setCurrentProject(currentUser?.id, projectName);
    history.push(`/app/dashboard`);
    handleClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="md">
      <Container maxWidth="xl" className={classes.container}>
        <Grid>
          <MaterialTable
            title="Select Project"
            icons={tableIcons}
            isLoading={loading}
            components={{ Container: props => props.children }}
            columns={[
              { title: 'Name', 
                field: 'id.resourceId',
                render: rowData => rowData.id.resourceId === activeProjectId ? <b>{rowData.id.resourceId}</b>: rowData.id.resourceId
              },
              { title: 'Created On', field: 'createdOn', render: (rowData)=> format(new Date(rowData.createdOn), "PPpp")}
            ]}
            data={dataSource}
            actions={[
              {
                icon: () => <LaunchIcon color="action" fontSize="small" />,
                tooltip: 'Open Project',
                onClick: (event, rowData) => openProject(rowData)
              },
              {
                icon: () => <AddIcon color="action" fontSize="small" />,
                tooltip: 'New Project',
                isFreeAction: true,
                onClick: () => {history.push('/app/project/create');handleClose();}
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
              cellStyle: { fontSize: '12px' },
              pageSize: 10,
            }}
          />
        </Grid>
      </Container>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

LoadProject.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  activeProjectId: PropTypes.string.isRequired,
};
