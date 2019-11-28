import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import ButtonBase from "@material-ui/core/ButtonBase";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import {ToastContainer} from "react-toastr";
import ChoosePlaceDialog from "./forms/ChoosePlaceDialog";
import SaveCanvas from "./forms/SaveCanvas";
import ReInitSeat from "./forms/ReInitSeat";

let container;

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        margin: theme.spacing(1)
    },
    underlined: {
        textDecoration: 'underline',
    }
}));

function RightSidebarFront(props) {
    const [billet, setBillet] = useState([]);
    const [colors, setColors] = useState(props.colors);
    const classes = useStyles();
    useEffect(() => {

            try {
                const fetchData = () => {
                    setBillet(props.liste_billet);
                    setColors(props.colors);
                };
                fetchData();
            } catch (error) {
                container.error("Une erreur s'est produite: " + error.message, "Erreur", {closeButton: true});
            }
    });
    return (
        <aside>
            <div className={classes.root}>
                <br/>
            <Fade in={true} style={{transitionDelay: '50ms', display: "inherit" }}>
                <Grid container spacing={2} direction="row">
                    {billet.map((item, i) =>
                        <Paper className={classes.paper} key={i} >
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={2}>
                                    <ButtonBase key={item.libelle}>
                                        <span id={"billet-" + i} className={"btn fa fa-circle fa-2x"}
                                              style={{color: colors[i].color.toString()}}></span>
                                    </ButtonBase></Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1">{item.libelle}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body2" style={{cursor: 'pointer'}}>{item.quantite} billets</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}
                </Grid>
            </Fade>
            </div>
        </aside>
    );
}

export default RightSidebarFront;