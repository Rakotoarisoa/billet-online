import React, {Component} from 'react';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input"
import MenuItem from '@material-ui/core/MenuItem';

const RECTANGLE = "rectangle", RONDE = "ronde", SECTION = "section";
/** Class Form By Object*/
class ObjectForm extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        let object = this.props.object;
        if (object.type === RECTANGLE) {
            return (

                <section><TextValidator
                    id="horizontal"
                    label="Nombre à l'horizontal"
                    value={""}
                    type="text"
                    className={"form-control secondary"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                    validators={['required', 'minNumber:1', 'maxNumber:50', 'matchRegexp:^[0-9]{1,2}$']}
                    errorMessages={['Ce champ est requis', 'Nombre min:0', 'Nombre max:50', 'Veuiller insérer un nombre']}
                    name={"cols"}
                />
                    <br/><br/>

                    <TextValidator
                        id="vertical"
                        label="Nombre à la verticale"
                        value={""}
                        type="text"
                        className={"form-control secondary"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        validators={['required', 'minNumber:1', 'maxNumber:50', 'matchRegexp:^[0-9]{1,2}$']}
                        errorMessages={['Ce champ est requis', 'Nombre min:1', 'Nombre max:50', 'Veuiller insérer un nombre']}
                        name={"rows"}
                    />
                    <br/><br/>
                </section>
            );
        } else if (object.type === RONDE) {
            return (<section><TextValidator
                id="chaises"
                label="Nombre de chaises"
                value={""}
                type="text"
                className={"form-control secondary"}
                InputLabelProps={{
                    shrink: true
                }}
                margin="normal"
                validators={['required', 'minNumber:1', 'maxNumber:25', 'matchRegexp:^[0-9]{1,2}$']}
                errorMessages={['Ce champ est requis', 'Nombre min:0', 'Nombre max:50', 'Veuiller insérer un nombre']}
                name={"chaises"}
            />
                <br/><br/>
            </section>);
        } else if (object.type === SECTION) {
            return (<section><TextValidator
                id="horizontal"
                label="Nombre à l'horizontal"
                value={""}
                type="text"
                className={"form-control secondary"}
                InputLabelProps={{
                    shrink: true,
                }}
                margin="normal"
                validators={['required', 'minNumber:1', 'maxNumber:50', 'matchRegexp:^[0-9]{1,2}$']}
                errorMessages={['Ce champ est requis', 'Nombre min:0', 'Nombre max:50', 'Veuiller insérer un nombre']}
                name={"cols"}
            />
                <br/><br/>

                <TextValidator
                    id="vertical"
                    label="Nombre à la verticale"
                    value={""}
                    type="text"
                    className={"form-control secondary"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                    validators={['required', 'minNumber:1', 'maxNumber:50', 'matchRegexp:^[0-9]{1,2}$']}
                    errorMessages={['Ce champ est requis', 'Nombre min:1', 'Nombre max:50', 'Veuiller insérer un nombre']}
                    name={"rows"}
                />
            </section>);
        }
    }
}


class UpdateTableForm extends Component {
    constructor(props) {
        super(props);
        this.handleChangeRangeForm = this.handleChangeRangeForm.bind(this);
        this.handleSubmitRangeForm = this.handleSubmitRangeForm.bind(this);
    }
    state = {
        nom: 'Table 1',
        rows: 5,
        cols: 5,
        chaises: 5,
        table_type: RECTANGLE,
        submitted: false,
        updateObject: null,
        isUpdating: false
    };

    handleSubmit(event) {
        alert('Nom de rangée: ' + this.state.value);
        event.preventDefault();
    }

    handleChangeRangeForm(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });

    }
    setUpdate=()=>{
        this.setState({'isUpdating': !this.state.isUpdating});
    };
    handleUpdateObject=()=>{
        this.setUpdate();
        this.props.updatedObject(this.props.updateObject);
    };
    deleteObject = () => {
        return this.props.deleteObject(this.props.updateObject);
    };
    componentDidMount() {
        this.setState({'updateObject': this.props.updateObject});
        ValidatorForm.addValidationRule('alreadyExist1', (value) => {
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
    componentDidUpdate(){
    }

    handleSubmitRangeForm(event) {
        this.setState({submitted: true}, () => {
            if (this.state.table_type === RECTANGLE) {
                this.props.newObject({
                    nom: this.state.nom,
                    xSeats: parseInt(this.state.rows),
                    ySeats: parseInt(this.state.cols),
                    type: this.state.table_type,
                    number_seats: parseInt(this.state.rows) * parseInt(this.state.cols),
                    x: 200,
                    y: 200
                });
            } else if (this.state.table_type === RONDE) {
                this.props.newObject({
                    nom: this.state.nom,
                    chaises: parseInt(this.state.chaises),
                    type: this.state.table_type,
                    number_seats: parseInt(this.state.chaises),
                    x: 200,
                    y: 200
                });
            }
            setTimeout(() => this.setState({submitted: false}), 1000);
        });
        event.preventDefault();
    }

    render() {
        const tableType = [
            {
                value: RECTANGLE,
                label: 'Rectangle',
            },
            {
                value: RONDE,
                label: 'Ronde',
            }
        ], object = this.props.updateObject;
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
                            <p>Deleted : {object.deleted_seats}</p>
                            <p>Nombre de places : {object.number_seats}</p>
                        </div>
                    </div>
                    <div className={"p-2 bg-light"}>
                        <div className={"d-flex d-flex-row"}>
                            <div className="p-2 bg-light">
                                <Button variant="contained"
                                        color="primary"
                                        className={"btn btn-primary"}
                                        onClick={this.handleUpdateObject}>
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
                                <ObjectForm object={this.props.updateObject}/>
                            </div>
                        </div>
                        <div className={"p-2 bg-light"}>
                            <div className={"d-flex d-flex-row"}>
                                <div className="p-2 bg-light">
                                    <Button variant="contained"
                                            color="primary"
                                            className={"btn btn-primary"}
                                            onClick={this.setUpdate}>
                                        Terminé
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