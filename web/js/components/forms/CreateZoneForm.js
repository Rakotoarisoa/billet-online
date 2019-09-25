import React, {Component} from 'react';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import ColorPicker from 'material-ui-color-picker';

class CreateZoneForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nom: 'Zone 1',
            forme: 'rectangle',
            type: 'zone',
            text: 'Texte',
            icon: 'micro',
            color: '#888888',
            submitted: false
        };
        this.handleChangeZoneForm = this.handleChangeZoneForm.bind(this);
        this.handleSubmitZoneForm = this.handleSubmitZoneForm.bind(this);
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('alreadyExist', (value) => {
            let data = this.props.dataMap;
            let object_names = [];
            if (data.length > 0) {
                data.forEach((el) => {
                    object_names.push(el.nom);
                });
                if (object_names.includes(value))
                    return false;
                return true;
            } else
                return true;
        });
    }

    handleChangeZoneForm(event) {
        if (typeof event.target == "undefined" && event.match(/^#[0-9a-f]{3,6}$/i)) {
            console.log("color");
            this.setState({'color': event.toString()});
        } else {
            console.log("other");
            const target = event.target;
            const value = target.value;
            const name = target.name;
            this.setState({
                [name]: value
            });
        }

    }

    handleSubmitZoneForm(event) {
        this.setState({submitted: true}, () => {
            this.props.newObject({
                nom: this.state.nom,
                type: this.state.type,
                text: this.state.text,
                forme: this.state.forme,
                icon: this.state.icon,
                color: this.state.color,
                x: 200,
                y: 200
            });
            setTimeout(() => this.setState({submitted: false}), 1000);
        });
        event.preventDefault();
    }

    render() {
        return (
            <ValidatorForm
                ref="form"
                onSubmit={this.handleSubmitZoneForm}
            >
                <div className="p-2 bg-light">
                    <div className="p-2 bg-light">
                        <TextValidator
                            validators={["required", "alreadyExist"]}
                            errorMessages={['Ce champ est requis', "Ce nom d'objet existe déjà sur le plan"]}
                            id="nom"
                            label="Nom"
                            className={"form-control secondary"}
                            value={this.state.nom}
                            onChange={this.handleChangeZoneForm}
                            margin="normal"
                            name={"nom"}
                        />
                    </div>
                    <div className={"d-flex d-flex-row"}>
                        <div className={"p-2 bg-light"}>
                            <FormControl className={"form-control"}>
                                <InputLabel htmlFor="forme">Forme</InputLabel>
                                <Select
                                    value={this.state.forme}
                                    onChange={this.handleChangeZoneForm}
                                    inputProps={{
                                        name: 'forme',
                                        id: 'forme',
                                    }}
                                >
                                    <MenuItem value={"rectangle"}>Rectangle</MenuItem>
                                    <MenuItem value={"cercle"}>Cercle</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className={"p-2 bg-light"}>

                            {(this.state.forme === "cercle") ? <span className={"fa fa-circle-thin fa-3x"}></span> :
                                <span className={"fa fa-square fa-3x"}></span>}
                        </div>
                    </div>
                    <div className="p-2 bg-light">
                        <TextValidator
                            id="texte"
                            label="Texte"
                            className={"form-control secondary"}
                            value={this.state.text}
                            onChange={this.handleChangeZoneForm}
                            margin="normal"
                            name={"text"}
                            id={"text"}
                        />
                    </div>

                    <div className={"p-2 bg-light"}>
                        <FormControl className={"form-control"}>
                            <InputLabel htmlFor="icon">Icône</InputLabel>
                            <Select
                                value={this.state.icon}
                                onChange={this.handleChangeZoneForm}
                                inputProps={{
                                    name: 'icon',
                                    id: 'icon',
                                }}
                            >
                                <MenuItem value={"micro"}>Microphone  &nbsp;&nbsp;<span
                                    className={"fa fa-microphone"}></span></MenuItem>
                                <MenuItem value={"plat"}>Plat  &nbsp; &nbsp;<span className={"fa fa-hamburger"}></span></MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <br/>
                    <div className={"p-2 bg-light"}>
                        <InputLabel htmlFor="color">Couleur</InputLabel>
                        <ColorPicker
                            name='color'
                            value={this.state.color}
                            onChange={this.handleChangeZoneForm}

                        />

                    </div>
                    <div className="p-2 bg-light">
                        <Button variant="contained"
                                color="primary"
                                className={"btn btn-primary"}
                                type={"submit"}>
                            Créer
                        </Button>
                    </div>
                </div>
            </ValidatorForm>
        );
    }
}

export default CreateZoneForm;