import React, {Component} from 'react';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input"
import MenuItem from '@material-ui/core/MenuItem';

const RECTANGLE = "rectangle", RONDE = "ronde";

class UpdateTableForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nom: 'Table 1',
            rows: 5,
            cols: 5,
            chaises: 5,
            table_type: RECTANGLE,
            submitted: false,
            updateObject: null
        };
        this.handleChangeRangeForm = this.handleChangeRangeForm.bind(this);
        this.handleSubmitRangeForm = this.handleSubmitRangeForm.bind(this);
    }

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
    handleUpdateObject=()=>{
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
            </ValidatorForm>
        );
    }
}

export default UpdateTableForm;