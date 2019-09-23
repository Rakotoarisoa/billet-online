import React from 'react';
import reactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SetMap from "./SetMap";
import SetTicket from "./SetTicket";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            <Box >{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 4,
        backgroundColor: theme.palette.background.paper,
        fontStyle: "Archivo Narrow, sans-serif"
    },
}));
function App() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }
    const handleChangeN =() =>{
        console.log("Clicked");
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tab">
                    <Tab label="Configuration Carte" {...a11yProps(0)} onChange={handleChangeN} />
                    <Tab label="Assigner les billets" {...a11yProps(1)} onChange={handleChangeN} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <SetMap/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <SetTicket/>
            </TabPanel>
        </div>
    );
}

reactDOM.render(
    <App/>, document.getElementById('root'));


