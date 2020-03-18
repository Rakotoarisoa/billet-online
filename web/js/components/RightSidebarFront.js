import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
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
            width: "80%"
        },
        display: 'inline-flex',
        alignContent: 'center',
        fontWeight: '500'
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
    const [ticketItem, setTicketItem] = useState(null);
    useEffect(() => {
        setEventId(props.event_id);
        setTickets(props.billets_admission);
    });

    const handleSubmit = (item, e) => {
        e.preventDefault();
        handleData(item);
    };
    const handleChange = (e) => {
        setTicketItem({name: e.target.name, value: e.target.value});
    };
    const handleData = (item) => {
        if (item.libelle === ticketItem.name) {
            axios.post("/res_billet/add/", {
                event_id: eventId,
                type_billet: item.libelle,
                select_nb_billets: ticketItem.value,
                redirect: ""
            }).then((data) => {
                props.handleNewDataInCart(true);
            });
        }
    };
    if (tickets !== null && tickets.length > 0) {
        return (
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Billet d'admissions:
                    </Typography>
                    <List dense={false}>
                        {tickets.map((ticket, i) => {
                            return (
                                <ListItem className={classes.noSeat} key={i.toString()}>
                                    <form onSubmit={(e) => {
                                        handleSubmit(ticket, e)
                                    }}>
                                        <TextField
                                            fullWidth={false}
                                            name={ticket.libelle.toString()}
                                            label={"Billet " + ticket.libelle}
                                            type="number"
                                            InputProps={{
                                                required: true,
                                                inputProps: {
                                                    min: 1,
                                                    max: Math.min(10, (parseInt(ticket.quantite) - parseInt(ticket.nombreBillets)))
                                                }
                                            }}
                                            onChange={handleChange}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            helperText={(parseInt(ticket.quantite) - parseInt(ticket.nombreBillets)) > 0 ?"Prix: EUR " + ticket.prix:"Billet épuisé"}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton type={"submit"} edge={"end"} color="primary"
                                                        aria-label="add to shopping cart">
                                                <span className={"fa fa-cart-plus"}/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </form>
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
const DataCartFormatDisplay = (props) => {
    const classes = useStyles();
    const [dataCart, setDataCart] = useState(props.data);
    const [billetAdm, setBilletAdm] = useState(props.billets_admission);
    const [colors, setColors] = useState(props.colors);
    useEffect(() => {
        setDataCart(props.data);
        setBilletAdm(props.billets_admission);
        setColors(props.colors);
    });
    const getColor = (type) => {
        let item = colors.filter((color) => {
            return color.billet.toString() === type.toString();
        });
        if (item.length !== 0)
            return item[0].color.toString();
        else
            return "#ffffff";
    };
    let formatted = [];
    let billet_seats = dataCart.filter((item) => {
        return item.seat !== "-" && item.section !== "-";
    });
    billet_seats.map((item, i) => {
        formatted.push(item);
    });
    billetAdm.map((item_billet, i) => {
        let filter_no_seat_data = dataCart.filter((item) => {
            return item.seat === "-" && item.section === "-" && item.category_str === item_billet.libelle;
        });
        if (filter_no_seat_data.length > 0) {
            formatted.push({
                //id: formatted.length - 1,
                name: "-",
                quantity: filter_no_seat_data.length,
                price: item_billet.prix,
                category: null,
                category_str: item_billet.libelle,
                section: "-",
                seat: "-"
            });
        }
    });
    const handleDataCartFromSideBar = (item) => {
        props.handleDataCartFromSideBar(item);
    };
    return (
        <List dense={true}>
            {formatted.map(
                (item, i) => {
                    return (
                        <div key={i}>
                            {item.seat !== "-" && item.section !== "-" ?
                                (
                                    <ListItem key={i}>
                                        <ListItemAvatar>
                                            <Avatar className={classes.small}>
                                            <span className={"fa fa-circle"}
                                                  style={{color: getColor(item.category_str)}}></span>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={"Billet " + item.category_str}
                                                      secondary={item.section + ", " + item.seat}/>
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

                                ) : (
                                    <ListItem key={i}>
                                    <ListItemAvatar>
                                        <Avatar className={classes.small}>
                                            <span style={{color: "#333333"}}>{item.quantity}</span>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={"Billet " + item.category_str}/>
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
                            }
                        </div>
                    )
                })
            }
        </List>
    )
};
const DataCartDisplay = (props) => {
    const [dataCart, setDataCart] = useState(null);
    const [colors, setColors] = useState(null);
    const [billetAdmission, setBilletAdmission] = useState(null);

    useEffect(() => {
        setDataCart(props.data);
        setColors(props.colors);
        setBilletAdmission(props.billets_admission);
    });
    const handleDataCartFromSideBar = (item) => {
        props.handleDataCartFromSideBar(item);
    };
    return (<DataCartFormatDisplay data={props.data} billets_admission={props.billets_admission}
                                   handleDataCartFromSideBar={handleDataCartFromSideBar}
                                   colors={props.colors}></DataCartFormatDisplay>);
};
const GenerateDataCart = (props) => {
    const classes = useStyles();
    const [dataCart, setDataCart] = useState(null);
    const [colors, setColors] = useState(null);
    const [billetAdmission, setBilletAdmission] = useState(null);
    const [totalCart, setTotalCart] = useState(null);
    const [eventId, setEventId] = useState(null);
    useEffect(() => {
        try {
            setDataCart(props.data);
            setColors(props.colors);
            setEventId(props.event_id);
            setBilletAdmission(props.billets_admission);
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
    const handleDataCartFromSideBar = (item) => {
        props.handleDataCartFromSideBar(item);
    };
    if (dataCart !== null && dataCart.length > 0 && dataCart[0].evenement.id === parseInt(eventId) && colors !== null && colors.length > 0) {
        return (
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Résumé de votre commande
                    </Typography>
                    <DataCartDisplay data={dataCart} colors={colors}
                                     handleDataCartFromSideBar={handleDataCartFromSideBar}
                                     billets_admission={billetAdmission}/>
                    <List>
                        <ListItem className={classes.listItem}>
                            <ListItemText primary="Total"/>
                            <Typography variant="subtitle1" className={classes.total}>
                                {"EUR " + totalCart}
                            </Typography>
                        </ListItem>
                        <div className={classes.buttons}>
                            <Button className={classes.button} onClick={() => {
                                props.clear_all(true)
                            }}>
                                <span className={"fa fa-trash"}/> Vider mon panier
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() => {
                                    props.checkout(true)
                                }}>
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
};

function RightSidebarFront(props) {
    const [billet, setBillet] = useState(props.liste_billet);
    const [colors, setColors] = useState(props.colors);
    const [eventId, setEventId] = useState(props.event_id);
    const [billetAdmission, setBilletAdmission] = useState(null);
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
    useEffect(() => {
            axios.get("/api/typeBillet/admission-only/" + eventId).then((data) => {
                setBilletAdmission(data.data);
            });
        }, [eventId]
    );
    const handleDataCartFromSideBar = (item) => {
        props.handleDataCartFromSideBar(item);
    };
    const handleNewDataInCart = (updated) => {
        props.handleNewDataInCart(updated);
    };
    const checkOut = (checkout) => {
        props.checkout(checkout);
    };
    const clearAll = (clear_all) => {
        props.clear_all(clear_all);
    };
    return (
        <aside>
            <Fade in={true} style={{transitionDelay: '50ms', display: "inherit"}}>
                <GenerateAdmissionTicket event_id={eventId} billets_admission={billetAdmission}
                                         handleNewDataInCart={handleNewDataInCart}/>
            </Fade>
            <Fade in={true} style={{transitionDelay: '50ms', display: "inherit"}}>
                <GenerateDataCart event_id={eventId} billets_admission={billetAdmission} colors={colors} data={billet}
                                  handleDataCartFromSideBar={handleDataCartFromSideBar} checkout={checkOut}
                                  clear_all={clearAll}/>
            </Fade>
        </aside>
    );
}

export default RightSidebarFront;