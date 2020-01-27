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
    },
    underlined: {
        textDecoration: 'underline',
    }
}));

function RightSidebarTicket(props) {
    const [billet, setBillet] = useState([]);
    const [hasObjectSelected, setHasObjectSelected] = useState(false);
    const [typeBilletSelected, setTypeBilletSelected] = React.useState([]);
    const [objectSelected, setObjectSelected] = useState(props.selectedItem);
    const [colors, setColors] = useState(props.colors);
    const [openSeatDialog, setOpenSeatDialog] = useState(false);
    const closeSeatDialog = (closed) => {
        setOpenSeatDialog(!closed);
    };
    const classes = useStyles();
    const handleSelectedBillet = (billet) => {
        setTypeBilletSelected(billet);
        setOpenSeatDialog(true);
    };
    const handleAssign = (list) => {
        props.assignTicket(list);
    };
    const handleAssignAll = (billet) => {
        if (props.selectedItem) {
            let selectedItem = props.selectedItem;
            //let nbSeats = selectedItem.number_seats;
            let formattedSeat = [];
            const alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
            if (selectedItem.type === "section") {
                for (let j = 0; j < selectedItem.xSeats; j++) {
                    for (let i = 0; i < selectedItem.ySeats; i++) {
                        let name = ((alphabet[j]) + (i + 1)).toString().toUpperCase();
                        if (selectedItem.deleted_seats.includes(name)) continue;
                        formattedSeat.push({seat_id: name, type: billet});
                    }
                }
            }
            else if(selectedItem.type === "rectangle"){
                for (let i = 0; i < ((selectedItem.xSeats*2)+(selectedItem.ySeats*2)); i++) {
                    if (selectedItem.deleted_seats.includes(parseInt(i + 1))) continue;
                    formattedSeat.push({seat_id: i + 1, type: billet});
                }
            }
            else if(selectedItem.type === "ronde") {
                for (let i = 0; i < selectedItem.chaises; i++) {
                    if (selectedItem.deleted_seats.includes(parseInt(i + 1)))  continue;
                    formattedSeat.push({seat_id: i + 1, type: billet});
                }
            }
            props.assignTicket(formattedSeat);
        }
    };
    const unAssignAll =()=>{
        props.assignTicket([]);
    };
    const reInitAllSeats = (reInit) =>{
        if(reInit){
            props.reInit(reInit);
        }
    };
    useEffect(() => {
        if (props.selectedItem !== objectSelected) {
            setObjectSelected(props.selectedItem);
            if (props.selectedItem === null)
                setHasObjectSelected(false);
            else
                setHasObjectSelected(true);
        } else {
            try {
                const fetchData = () => {
                    setBillet(props.liste_billet);
                    setColors(props.colors);
                };
                fetchData();
            } catch (error) {
                container.error("Une erreur s'est produite: " + error.message, "Erreur", {closeButton: true});
            }
        }


    }, [props.selectedItem, props.liste_billet]);
    const saveCanvas = (save) => {
        props.saveMap(save);
    };

    return (
        <aside className={"d-inline-flex justify-content-center flex-wrap"}>
            <div className={classes.root}>
                <ToastContainer ref={ref => container = ref} className="toast-bottom-left"/>
                {hasObjectSelected &&
                <Button className={"btn btn-light"} onClick={unAssignAll}>
                    <Typography variant="caption" className={classes.underlined}>
                        Retirer les chaises
                    </Typography>
                </Button>}
                <Fade in={hasObjectSelected}
                      style={{transitionDelay: '50ms', display: (hasObjectSelected) ? "inherit" : "none"}}>
                    <Grid container spacing={2} justify="center" direction="row">
                        {billet.map((item, i) =>
                            <Paper className={classes.paper} key={i}>
                                <Grid container direction={"row"}>
                                    <Grid item xs={12} sm={4}>
                                        <ButtonBase key={item.libelle}>
                                            <span id={"billet-" + i} className={"btn fa fa-plus-circle fa-3x"}
                                                  style={{color: colors[i].color.toString()}}
                                                  title={"Assigner toutes les chaises"} onClick={() => handleAssignAll(item.libelle)}></span>
                                        </ButtonBase></Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle1">{item.libelle}</Typography></Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="body2"
                                                    style={{cursor: 'pointer'}}>{item.quantite} billets</Typography></Grid>
                                </Grid>
                                <Grid container direction={"row"}>
                                    <Grid xs={12} sm={6} item>
                                        <ButtonBase className={"btn btn-light"} onClick={() => {handleSelectedBillet(item)}}>
                                            <Typography variant="caption" className={classes.underlined}>
                                                Assigner des chaises spécifiques
                                            </Typography>
                                    </ButtonBase>
                                    </Grid>
                                </Grid>
                            </Paper>)}
                    </Grid>
                </Fade>
                {!hasObjectSelected && <SaveCanvas saveCanvas={saveCanvas} updateObject={props.updateObject}/>}
                {!hasObjectSelected && <ReInitSeat reInitSeat={reInitAllSeats}/>}
                {openSeatDialog &&
                <ChoosePlaceDialog open={openSeatDialog} close={closeSeatDialog} selectedItem={props.selectedItem}
                                   type={typeBilletSelected} listAssign={handleAssign}/>}
            </div>

        </aside>
    );
}

export default RightSidebarTicket;