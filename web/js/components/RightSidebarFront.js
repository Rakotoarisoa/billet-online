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
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

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
    noSeat: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: "50%"
        },
        display: 'inline-flex'
    },
    cartItems: {
        display: 'inline-flex'
    },
    cartItemName: {
        alignContent: 'center'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        margin: theme.spacing(1)
    },
    underlined: {
        textDecoration: 'underline',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
        alignSelf: 'center'
    },
    price: {
        alignSelf: 'center'
    },
    buttonNoSeatCheckout: {
        alignSelf: "center",
        width: "20%"
    },
    listItem: {
        padding: theme.spacing(1, 0),
    },
    total: {
        fontWeight: '700',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));


const GenerateAdmissionTicket = (props) => {
    const classes = useStyles();
    const [tickets, setTickets] = useState(null);
    const [eventId, setEventId] = useState(null);
    useEffect(()=>{
        setEventId(props.event_id);
    });
    useEffect(() => {
            axios.get("/api/typeBillet/front_end/admission-only/" + eventId).then((data) => {
                setTickets(data.data);
            });
        }, [eventId]
    );
    const checkout = () =>{

    };
    const handleChange = (e) =>{
        e.preventDefault();
        console.log(e);
    };
    if (tickets !== null && tickets.length > 0) {
        return (
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Billet d'admissions:
                    </Typography>
                    <List dense={false}>
                        {tickets.map((ticket,i) => {
                            return (
                                <ListItem className={classes.noSeat} key={i.toString()}>
                                    <TextField
                                        variant={"outlined"}
                                        fullWidth={false}
                                        id="standard-number"
                                        label={"Billet " + ticket.libelle}
                                        type="number"
                                        InputProps={{
                                            inputProps: { min: 0, max: Math.min(10,(parseInt(ticket.quantite)-parseInt(ticket.nombreBillets))) }
                                        }}
                                        //onChange={(e)=>{handleChange(e.target.value)}}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        helperText={"Prix: EUR "+ticket.prix}
                                    />
                                    <Button variant="contained" color="secondary" className={classes.buttonNoSeatCheckout} onClick={()=>{checkout}}>
                                        Ajouter
                                    </Button>
                                </ListItem>
                            )
                        })
                        }
                    </List>
                </CardContent>
            </Card>)
    } else {
        return <div></div>;
    }
};
const GenerateDataCart = (props) => {
    const classes = useStyles();
    const [dataCart, setDataCart] = useState(null);
    const [colors, setColors] = useState(null);
    const [totalCart, setTotalCart] = useState(null);
    useEffect(() => {
        try {
            const fetchData = () => {
                setDataCart(props.data);
                setColors(props.colors);

            };
            fetchData();
        } catch (error) {
            container.error("Une erreur s'est produite: " + error.message, "Erreur", {closeButton: true});
        }
    });
    useEffect(() => {
            axios.get("/api/cart/get_total").then((data) => {
                setTotalCart(data.data);
            });
        }, [dataCart]
    );
    const getColor = (type) => {
        let item = colors.filter((color) => {
            return color.billet.toString() === type.toString();
        });
        console.log(item[0]);
        return item[0].color.toString();
        //return "#333333";
    };
    const handleDataCartFromSideBar = (item) => {
        props.handleDataCartFromSideBar(item);
    };
    if (dataCart !== null && dataCart.length > 0 && colors !== null && colors.length > 0) {
        return (
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Résumé de votre commande
                    </Typography>
                    <List dense={true}>
                        {dataCart.map(
                            (item,i) => {
                                return (
                                    <ListItem key={i.toString()}>
                                        <ListItemAvatar>
                                            <Avatar className={classes.small}>
                                            <span className={"fa fa-circle"}
                                                  style={{color: getColor(item.category_str)}}></span>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={"Billet " + item.category_str}
                                            secondary={item.section + ", " + item.seat}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton edge={"end"} color="secondary" aria-label="Remove item"
                                                        component="span"
                                                        onClick={() => {
                                                            handleDataCartFromSideBar(item)
                                                        }}>
                                                <span className={"fa fa-trash"}/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                    <List>
                        <ListItem className={classes.listItem}>
                            <ListItemText primary="Total"/>
                            <Typography variant="subtitle1" className={classes.total}>
                                {"EUR " + totalCart}
                            </Typography>
                        </ListItem>
                        <div className={classes.buttons}>
                            <Button className={classes.button} onClick={()=>{props.clear_all(true)}}>
                                <span className={"fa fa-trash"}/> Vider mon panier
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={()=>{props.checkout(true)}}>
                                Commander
                            </Button>
                        </div>
                    </List>
                </CardContent>
            </Card>
        );
    } else {
        return (
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Aucun article sélectionné
                    </Typography>
                </CardContent>
            </Card>);
    }

    /*return [0, 1, 2, 3, 4, 5, 6 ,7 , 8, 9, 10, 11, 12 ].map(value =>
        React.cloneElement(element, {
            key: value,
        }),
    );*/
};

function RightSidebarFront(props) {
    const [billet, setBillet] = useState(props.liste_billet);
    const [colors, setColors] = useState(props.colors);
    const [eventId, setEventId] = useState(props.event_id);
    const classes = useStyles();
    useEffect(() => {
        try {
            const fetchData = () => {
                setBillet(props.liste_billet);
                setColors(props.colors);
                setEventId(props.event_id);
            };
            fetchData();
        } catch (error) {
            container.error("Une erreur s'est produite: " + error.message, "Erreur", {closeButton: true});
        }
    });
    const handleDataCartFromSideBar = (item) => {
        props.handleDataCartFromSideBar(item);
    };
    const checkOut = (checkout) => {
        props.checkout(checkout);
    };
    const clearAll = (clear_all) =>{
        props.clear_all(clear_all);
    };
    return (
        <aside>
            <Fade in={true} style={{transitionDelay: '50ms', display: "inherit"}}>
                <GenerateAdmissionTicket event_id={eventId}/>
            </Fade>
            <Fade in={true} style={{transitionDelay: '50ms', display: "inherit"}}>
                <GenerateDataCart colors={colors} data={billet} handleDataCartFromSideBar={handleDataCartFromSideBar} checkout={checkOut} clear_all={clearAll}/>
            </Fade>
        </aside>
    );
}

export default RightSidebarFront;