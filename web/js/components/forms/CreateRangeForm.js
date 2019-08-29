import React, {Component} from 'react';
import SectionSeat from "../SectionSeat";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from "@material-ui/core/Button";

class CreateRangeForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            nom: 'Nom par défaut',
            cols: 5,
            rows: 5,
            type:'section',
            submitted: false
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

    handleSubmitRangeForm(event) {
        this.setState({ submitted: true }, () => {
            //TODO: create object SectionSeat, interaction with app.js
            this.props.newObject({
                nom:this.state.nom,
                rows:parseInt(this.state.rows),
                cols:parseInt(this.state.cols),
                type:this.state.type
            });
            setTimeout(() => this.setState({ submitted: false }), 1000);
        });
        console.log(this.props.newObject);
        event.preventDefault();
    }
    render(){
        const { rows, cols, nom } = this.state;
        return(
            <ValidatorForm
                ref="form"
                onSubmit={this.handleSubmitRangeForm}
            >
                <div className="p-2 bg-light">

                    <TextValidator
                        validators={["required"]}
                        errorMessages={['Ce champ est requis']}
                        id="nom"
                        label="Nom"
                        className={"form-control secondary"}
                        value={nom}
                        onChange={this.handleChangeRangeForm}
                        margin="normal"
                        name={"nom"}
                    />
                   <br/><br/>
                    <TextValidator
                        id="rangeCols"
                        label="Nombre de colonnes"
                        value={cols}
                        onChange={this.handleChangeRangeForm}
                        type="text"
                        className={"form-control secondary"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        validators={['required','minNumber:0', 'maxNumber:50', 'matchRegexp:^[0-9]$']}
                        errorMessages={['Ce champ est requis','Nombre min:0','Nombre max:50','Veuiller insérer un nombre']}
                        name={"cols"}
                    />
                    <br/><br/>

                    <TextValidator
                        id="rangeRows"
                        label="Nombre de Rangées"
                        value={rows}
                        onChange={this.handleChangeRangeForm}
                        type="text"
                        className={"form-control secondary"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        validators={['required','minNumber:1','isNumber', 'maxNumber:50', 'matchRegexp:^[0-9]$']}
                        errorMessages={['Ce champ est requis','Nombre min:1','Nombre max:50','Veuiller insérer un nombre']}
                        name={"rows"}
                    />
                    <br/><br/>

                    <Button variant="contained"
                            color="primary"
                            className={"btn btn-primary"}
                            type={"submit"}>
                        Créer
                    </Button>
                </div>
            </ValidatorForm>
        );
    }
}
export default CreateRangeForm;