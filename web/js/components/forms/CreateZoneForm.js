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
            submitted: false
        };
        this.handleChangeZoneForm = this.handleChangeZoneForm.bind(this);
        this.handleSubmitZoneForm = this.handleSubmitZoneForm.bind(this);
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('alreadyExist', (value) => {
            let data = this.props.dataMap;
            let object_names = [];
            data.forEach((el) => {
                object_names.push(el.nom);
            });
            if (object_names.includes(value))
                return false;
            return true;
        });
    }

    handleChangeZoneForm(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });

    }

    handleSubmitZoneForm(event) {
        this.setState({submitted: true}, () => {
            this.props.newObject({
                nom: this.state.nom,
                type: this.state.type,
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
                            defaultValue='#000'
                            // value={this.state.color} - for controlled component
                            onChange={color => console.log(color)}

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