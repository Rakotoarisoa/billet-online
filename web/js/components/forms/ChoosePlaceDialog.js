import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const useStyles = makeStyles(theme => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120,
    },
    formControlLabel: {
        marginTop: theme.spacing(1),
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    }
}));

export default function ChoosePlaceDialog(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [typeBillet, setTypeBillet] = React.useState(null);
    const [listOfSeat, setListOfSeat] = React.useState([]);
    const [selectedSeat, setSelectedSeat] = React.useState([]);

    const handleClose = () => {
        props.close(true);
        setListOfSeat([]);
        setTypeBillet(null);
        setOpen(false);
    };
    const seatList = () => {
        if (props.selectedItem) {
            let selectedItem = props.selectedItem;
            let nbSeats = selectedItem.number_seats;
            let formattedSeat = [];
            const alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
            if (selectedItem.type === "section") {
                for (let j = 0; j < selectedItem.ySeats; j++) {
                    for (let i = 0; i < selectedItem.xSeats; i++) {
                        if (selectedItem.deleted_seats.includes((alphabet[j]) + (i + 1))){
                            continue;
                        }
                        formattedSeat.push({value: (alphabet[j]) + (i + 1), name: (alphabet[j]) + (i + 1)});
                    }
                }
            } else {
                for (let i = 0; i < nbSeats; i++) {
                    if (selectedItem.deleted_seats.includes(i + 1)){
                        continue;
                    }
                    formattedSeat.push({value: i + 1, name: i + 1});
                }
            }
            return formattedSeat;
        }
    };
    const handleChange = (event) => {
        setSelectedSeat(event.target.value);
    };
    useEffect(() => {
        if (props.open !== open) {
            setOpen(props.open);
        }
        if (props.selectedItem && props.open) {
            setListOfSeat(seatList());
        }
        if (props.type) {
            setTypeBillet(props.type)
        }
    }, [props.open, props.selectedItem, props.type]);

    return (
        <React.Fragment>
            <Dialog
                fullWidth={false}
                maxWidth={'sm'}
                open={open}
                onClose={handleClose}
                aria-labelledby="seat"
            >
                <DialogTitle id="seat">Assigner les chaises pour "<b>{props.selectedItem.nom.toString()}</b>"
                </DialogTitle>
                <DialogContent>
                    <form className={classes.form} noValidate>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="select-multiple-seat">Choisir des chaises</InputLabel>
                            <Select
                                multiple
                                value={selectedSeat}
                                onChange={handleChange}
                                input={<Input id="select-multiple-seat"/>}
                                renderValue={selected => (
                                    <div className={classes.chips}>
                                        {selected.map(value => (
                                            <Chip key={value} label={value} className={classes.chip}/>
                                        ))}
                                    </div>
                                )}
                                MenuProps={MenuProps}
                            >
                                {listOfSeat.map((item, i) => (
                                    <MenuItem key={i} value={item.value.toString()}>
                                        {item.name.toString()}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Chaises à assigner au billet "<b></b>"</FormHelperText>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" type={"submit"}>
                        Valider
                    </Button>
                    <Button onClick={handleClose} color="secondary">
                        FERMER
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}