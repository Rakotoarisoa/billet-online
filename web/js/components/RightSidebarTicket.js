import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import ButtonBase from "@material-ui/core/ButtonBase";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';
import GridListTile from "@material-ui/core/GridListTile";
import Typography from "@material-ui/core/Typography";
import EventContext from "./contexts/EventContext";
import {ToastContainer} from "react-toastr";

let container;

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    underlined:{
        textDecoration: 'underline',
    }
}));

function RightSidebarTicket(props) {
    const [billet, setBillet] = useState([]);
    const [hasObjectSelected, setHasObjectSelected] = useState(false);
    const [objectSelected, setObjectSelected] = useState(props.selectedItem);
    const [colors, setColors] = useState(props.colors);
    const classes=useStyles();
    useEffect(() => {
        if(props.selectedItem !== objectSelected) {
            setObjectSelected(props.selectedItem);
            if(props.selectedItem === null)
                setHasObjectSelected(false);
            else
                setHasObjectSelected(true);
        } else {
            try {
                const fetchData = ()=> {
                    setBillet(props.liste_billet);
                    setColors(props.colors);
                };
                fetchData();
                } catch (error) {
                    container.error("Une erreur s'est produite: " + error.message, "Erreur", {closeButton: true});
                }
        }


    }, [props.selectedItem,props.liste_billet]);
    return (
        <aside>
            <div className={classes.root}>
                <ToastContainer ref={ref => container = ref} className="toast-bottom-left"/>
                <Fade in={hasObjectSelected} style={{transitionDelay: '50ms'}}>
                    <Grid container spacing={2} justify="center" direction="row" alignItems="center">
                    {billet.map((item, i) =>
                    <Paper className={classes.paper}>
                        <Grid container direction={"row"} xs={12}>
                            <Grid item xs="12" sm={4}>
                            <ButtonBase><span id={"billet-" + i} className={"btn fa fa-plus-circle fa-3x"}
                                              style={{color: colors[i].color.toString()}} title={"Assigner toutes les chaises"}></span></ButtonBase></Grid>
                            <Grid item xs={12} sm={4} alignItems={"center"}>
                                <Typography variant="subtitle1">{item.libelle}</Typography></Grid>
                            <Grid item xs={12} sm={4} alignItems={"center"}>
                                <Typography variant="body2" style={{ cursor: 'pointer' }}>{item.quantite} billets</Typography></Grid>
                        </Grid>
                        <Grid container direction={"row"} xs={12} sm={12}>
                            <Grid xs="12" sm={6} item><ButtonBase className={"btn btn-light"}><Typography variant="caption" className={classes.underlined}>Assigner des chaises spécifiques</Typography></ButtonBase></Grid>
                        </Grid>
                    </Paper>)}
                    </Grid>
                </Fade>
            </div>
        </aside>
    );
}

export default RightSidebarTicket;