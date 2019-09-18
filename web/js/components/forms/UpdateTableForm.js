import React, {Component} from 'react';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input"
import MenuItem from '@material-ui/core/MenuItem';

/** Class Form By Object*/

class UpdateTableForm extends Component {
    constructor(props) {
        super(props);
        this.handleChangeForm=this.handleChangeForm.bind(this);
        this.handleSubmitRangeForm = this.handleSubmitRangeForm.bind(this);
    }
    state = {
        nom: '',
        deleted_seats: [],
        isUpdating: false,
        updateObject: this.props.updateObject
    };

    setUpdate=()=>{
        this.setState({'isUpdating': !this.state.isUpdating});
    };
    handleFocusObject=()=>{
        this.setUpdate();
        this.props.focusedObject(this.props.updateObject);
        let object= this.props.updateObject;
        this.setState({'updateObject':this.props.updateObject,'nom':object.nom.toString(),'deleted_seats':object.deleted_seats});
    };
    handleFocusObjectClose=()=>{
        this.setUpdate();
        this.setState({'updateObject':null,'nom':null,'deleted_seats':null});
        this.props.focusedObject(null);
    };
    deleteObject = () => {
        return this.props.deleteObject(this.props.updateObject);
    };
    componentDidMount() {
        let object= this.props.updateObject;
        this.setState({'updateObject': this.props.updateObject,'nom':object.nom,
            'deleted_seats':object.deleted_seats});
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
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.state.nom);
    }

    handleChangeForm =(event) =>{
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    };
    handleSubmitRangeForm(event) {
        this.setState({submitted: true}, () => {
            let object=this.props.updateObject;
            object.nom = this.state.nom;
            object.deleted_seats = this.state.deleted_seats;
            this.props.updatedObject(object);
            setTimeout(() => this.setState({submitted: false}), 1000);
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
                {!this.state.isUpdating && <Fade in={!this.state.isUpdating}  style={{ transitionDelay: !this.state.isUpdating ? '50ms' : '50ms' }}>
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
                                <Button variant="contained"
                                        color="secondary"
                                        className={"btn btn-danger pull-right"}
                                        onClick={this.deleteObject}>
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                </Fade>}
                {this.state.isUpdating && <Fade in={this.state.isUpdating}  style={{ transitionDelay: this.state.isUpdating? '50ms' : '50ms' }}>
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
                                    validators={['required','alreadyExist']}
                                    errorMessages={['Ce champ est requis','Ce nom d\'objet est déjà utilisé']}
                                    name={"nom"}
                                    onChange={this.handleChangeForm}
                                />
                            </div>
                        </div>
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