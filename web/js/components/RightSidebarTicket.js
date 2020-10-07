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
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import List from '@material-ui/core/List';
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";

let container;
const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        margin: theme.spacing(1)
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
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
                        formattedSeat.push({seat_id: name, type: billet, is_booked: false});
                    }
                }
            } else if (selectedItem.type === "rectangle") {
                for (let i = 0; i < ((selectedItem.xSeats * 2) + (selectedItem.ySeats * 2)); i++) {
                    if (selectedItem.deleted_seats.includes(parseInt(i + 1))) continue;
                    formattedSeat.push({seat_id: i + 1, type: billet, is_booked: false});
                }
            } else if (selectedItem.type === "ronde") {
                for (let i = 0; i < selectedItem.chaises; i++) {
                    if (selectedItem.deleted_seats.includes(parseInt(i + 1))) continue;
                    formattedSeat.push({seat_id: i + 1, type: billet, is_booked: false});
                }
            }
            props.assignTicket(formattedSeat);
        }
    };
    const unAssignAll = () => {
        props.assignTicket([]);
    };
    const reInitAllSeats = (reInit) => {
        if (reInit) {
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
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <List dense={true}>
                                {billet.map((item, i) =>
                                    <ListItem key={item.id}>
                                        <ListItemAvatar>
                                            <Avatar className={classes.small} onClick={() => handleAssignAll(item.libelle)}>
                                                <span className={"fa fa-circle"} style={{color: colors[i].color.toString()}}></span>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={item.libelle}
                                            secondary={item.quantite + " billets"}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton edge={"end"} color="secondary" aria-label="Remove item"
                                                        component="span"
                                                        onClick={() => {
                                                            handleSelectedBillet(item)
                                                        }}>
                                                <span className={"fa fa-plus"}/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )}
                            </List>
                        </CardContent>
                    </Card>
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
