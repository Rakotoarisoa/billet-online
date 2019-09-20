import React, {Component, useContext} from 'react';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import DeleteContext from "./../contexts/DeleteContext";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input"
import MenuItem from '@material-ui/core/MenuItem';
import UpdateContext from "../contexts/UpdateContext";

/** Class Form By Object*/

class UpdateTableForm extends Component {
    constructor(props) {
        super(props);
        this.handleChangeForm = this.handleChangeForm.bind(this);
        this.handleSubmitRangeForm = this.handleSubmitRangeForm.bind(this);
    }

    state = {
        nom: '',
        deleted_seats: [],
        isUpdating: false,
        updateObject: this.props.updateObject
    };

    setUpdate = () => {
        this.setState({'isUpdating': !this.state.isUpdating});
    };
    handleFocusObject = () => {
        console.log("Test");
        this.setUpdate();
        this.props.focusedObject(this.props.updateObject);
        let object = this.props.updateObject;
        this.setState({
            'updateObject': this.props.updateObject,
            'nom': object.nom.toString(),
            'deleted_seats': object.deleted_seats
        });
    };
    handleFocusObjectClose = () => {
        this.setUpdate();
        this.setState({'updateObject': null, 'nom': null, 'deleted_seats': null});
        this.props.focusedObject(null);
    };
    deleteObject = () => {
        return this.props.deleteObject(this.props.updateObject);
    };
    deleteSeat = () => {
        let deleted_seats = this.state.deleted_seats;
        let object = this.props.updateObject;
        let selectedSeat= this.props.selectedSeat;
        if(object.type !== "section")
        {
            console.log("parsedInt");
            selectedSeat=parseInt(selectedSeat);
        }
        object.number_seats = object.number_seats-1;
        deleted_seats.push(selectedSeat);
        this.setState({'deleted_seats': deleted_seats});
    };
    renderDeletedSeats = () => {
        let dSeats = this.state.deleted_seats;
        var list = dSeats.map(function (seat) {
            return <li>{seat}</li>;
        });
        return <ul>{list}</ul>;
    };
    componentDidMount() {
        let object = this.props.updateObject;
        this.setState({
            'updateObject': this.props.updateObject, 'nom': object.nom,
            'deleted_seats': object.deleted_seats
        });
        ValidatorForm.addValidationRule('alreadyExist', (value) => {
            let data = this.props.dataMap;
            let object_names = [];
            data.forEach((el) => {
                let data = this.props.updateObject;
                if (value !== data.nom) {
                    object_names.push(el.nom);
                }
            });
            if (object_names.includes(value)) {
                return false;
            }
            return true;
        });
    }

    handleChangeForm = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    };

    handleSubmitRangeForm(event) {
        this.setState({submitted: true}, () => {
            this.setUpdate();
            let object = this.props.updateObject;
            object.nom = this.state.nom;
            object.deleted_seats = this.state.deleted_seats;
            this.props.updatedObject(object);
            setTimeout(() => this.setState({submitted: false,deleted_seats:[]}), 1000);
        });
        event.preventDefault();
    }

    render() {
        const object = this.props.updateObject;
        return (
            <ValidatorForm
                ref="form"
                onSubmit={this.handleSubmitRangeForm}
                noValidate autoComplete="off"
            >
                {!this.state.isUpdating &&
                <Fade in={!this.state.isUpdating} style={{transitionDelay: !this.state.isUpdating ? '50ms' : '50ms'}}>
                    <div className="p-2 bg-light">
                        <div className={"d-flex d-flex-row"}>
                            <div className="p-2 bg-light">
                                <p>Nom : {object.nom}</p>
                                <p>Type : {object.type}</p>
                                <p>Nombre de places : {object.number_seats}</p>
                            </div>
                        </div>
                        <div className={"p-2 bg-light"}>
                            <div className={"d-flex d-flex-row"}>
                                <div className="p-2 bg-light">
                                    <Button variant="contained"
                                            color="primary"
                                            className={"btn btn-primary"}
                                            onClick={this.handleFocusObject}>
                                        Modifier
                                    </Button>
                                </div>
                                <div className="p-2 bg-light">
                                    <DeleteContext.Consumer>
                                        {deleteObject => (
                                            <Button variant="contained"
                                                    color="secondary"
                                                    className={"btn btn-danger pull-right"}
                                                    onClick={() => deleteObject(this.props.updateObject)}>
                                                Supprimer
                                            </Button>
                                        )
                                        }
                                    </DeleteContext.Consumer>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fade>}
                {this.state.isUpdating &&
                <Fade in={this.state.isUpdating} style={{transitionDelay: this.state.isUpdating ? '50ms' : '50ms'}}>
                    <div className="p-2 bg-light">
                        <div className={"d-flex d-flex-row"}>
                            <div className="p-2 bg-light">
                                <TextValidator
                                    id="nom"
                                    label="Nom"
                                    value={this.state.nom}
                                    type="text"
                                    className={"form-control secondary"}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    validators={['required', 'alreadyExist']}
                                    errorMessages={['Ce champ est requis', 'Ce nom d\'objet est déjà utilisé']}
                                    name={"nom"}
                                    onChange={this.handleChangeForm}
                                />
                            </div>
                        </div>
                        {this.state.deleted_seats.length>0 &&
                            <div className="p-2 bg-light">
                                {
                                    this.renderDeletedSeats
                                }
                            </div>

                        }
                        {this.props.selectedSeat &&
                        <Fade in={this.props.selectedSeat !== null} style={{transitionDelay: this.props.selectedSeat !== null ? '50ms' : '50ms'}}>
                        <div className="p-2 bg-light">
                            <Button variant="contained"
                                                     color="secondary"
                                                     className={"form-control btn btn-secondary"}
                                                     onClick={this.deleteSeat}
                        >
                            <span className={"fa fa-seat"}></span>Supprimer la chaise n°{this.props.selectedSeat}
                        </Button>
                        </div>
                        </Fade>}

                        <div className={"p-2 bg-light"}>
                            <div className={"d-flex d-flex-row"}>
                                <div className="p-2 bg-light">
                                    <Button variant="contained"
                                            color="primary"
                                            className={"btn btn-primary"}
                                            type={"submit"}>
                                        Valider
                                    </Button>
                                </div>
                                <div className="p-2 bg-light">
                                    <Button variant="contained"
                                            color="primary"
                                            className={"btn btn-primary"}
                                            onClick={this.handleFocusObjectClose}>
                                        FERMER
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fade>}
            </ValidatorForm>
        );
    }
}

export default UpdateTableForm;