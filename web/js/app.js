import React, {useEffect} from 'react';
import reactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SetMap from "./SetMap";
import SetTicket from "./SetTicket";
import axios from "axios";
import {ToastContainer} from "react-toastr";
import {EventProvider} from './components/contexts/EventContext';
import SeatMap from "./SeatMap";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            <Box>{children}</Box>
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
    let container = null;
    const classes = useStyles();
    const [tabIndex, setTabIndex] = React.useState(0);
    const event_id = document.getElementById("root").getAttribute("data-event-id");
    const is_front = document.getElementById("root").getAttribute("data-is-front");
    console.log(is_front);
    function handleChange(event, newValue) {
        setTabIndex(newValue);
    }
    const handleChangeN =() =>{
        console.log("Clicked");
    };
    if(is_front) {
        return (
            <div className={classes.root}>
                <EventProvider value={event_id}>
                    <SeatMap eventId={event_id}/>
                </EventProvider>
            </div>

        );
    }
    else{
        return (
            <div className={classes.root}>
                <EventProvider value={event_id}>
                    <ToastContainer ref={ref => container = ref} className="toast-bottom-left"/>
                    <AppBar position="static">
                        <Tabs value={tabIndex} onChange={handleChange} aria-label="simple tab">
                            <Tab label="Configuration Carte" {...a11yProps(0)} onChange={handleChangeN}/>
                            <Tab label="Assigner les billets" {...a11yProps(1)} onChange={handleChangeN}/>
                        </Tabs>
                    </AppBar>
                    <TabPanel value={tabIndex} index={0}>
                        <SetMap eventId={event_id}/>
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                        <SetTicket eventId={event_id}/>
                    </TabPanel>
                </EventProvider>
            </div>
        );
    }
}

reactDOM.render(
    <App/>, document.getElementById('root'));


