import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    TextField,
    Toolbar,
    Typography,
    MenuItem,
    Select,
    FormControl,
    FormHelperText,
    InputLabel
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import axios from 'axios';
import {useSnackbar} from 'notistack';
import React, {useState, useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useForm, Controller} from "react-hook-form";

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
        backgroundColor: 'white',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    textField: {
        fontSize: '12px'
    },
    button: {
        marginRight: theme.spacing(0.5),
    },
    circularProgress: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(0.3),
    },
}));

function GenerateGitWebHookUrl() {
    document.title = "Generate Git Web Hook URL";
    const classes = useStyles();
    const {control, register, handleSubmit, watch, reset, setValue, errors} = useForm({mode: 'onBlur'});

    let {projectResourceId, applicationResourceId} = useParams();

    const [loading, setLoading] = useState(false);
    let history = useHistory();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [webhookUrl, setWebhookUrl] = useState("");


    function onSubmit(formValues) {
        console.log(formValues);
        setLoading(true);

        // alert(JSON.stringify(data, null, 2));
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}/git-webhook/generate/listener-url?vendor=${formValues.vendor}`)
            .then((response) => {
                console.log(response);
                setLoading(false);
                setValue("url", response.data.webhookUrl);
                setWebhookUrl(response.data.webhookUrl);
                enqueueSnackbar('URL generated successfully.', {variant: 'success'});
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Generate Git Web Hook URL
                        <Typography variant="caption">
                            &nbsp; {applicationResourceId}
                        </Typography>
                    </Typography>
                    {loading ? <CircularProgress size={15} className={classes.circularProgress}/> : null}
                    <div style={{flexGrow: 1}}/>
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item md={9} lg={6} xl={5}>
                    <Box m={2}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="vendor"
                                control={control}
                                defaultValue={''}
                                rules={{
                                    required: "Required"
                                }}
                                as={<TextField
                                    variant="outlined" size="small" fullWidth margin="normal"
                                    InputLabelProps={{shrink: true,}}
                                    InputProps={{
                                        classes: {input: classes.textField},
                                    }}
                                    label="Vendor"
                                    required
                                    select
                                    error={errors.type ? true : false}
                                    helperText={errors.type?.message}
                                >
                                    <MenuItem key="gitlab" value="gitlab">Gitlab</MenuItem>
                                </TextField>}
                            />
                            <Grid container>
                                <Button
                                    className={classes.button}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    type="submit"
                                    disabled={loading}>Generate</Button>
                                <Button
                                    className={classes.button}
                                    size="small"
                                    variant="outlined"
                                    onClick={(e) => history.goBack()}
                                >Cancel</Button>
                            </Grid>
                            <br/>
                            <br/>
                            <Typography variant="caption">
                                &nbsp; Please update this URL in your GIT provider webhooks for continuous integration.
                            </Typography>
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                    readOnly: true,
                                }}
                                name="url"
                                label="URL"
                                readOnly
                                multiline
                                rows={5}
                                inputRef={register()}
                            />
                            <Grid container>
                                <Button
                                    className={classes.button}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={(e) => {
                                        navigator.clipboard.writeText(webhookUrl);
                                        enqueueSnackbar('URL copied to clipoard.', {variant: 'success'});
                                    }}
                                >Copy To Clipboard</Button>
                            </Grid>
                        </form>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )

}

export default GenerateGitWebHookUrl;