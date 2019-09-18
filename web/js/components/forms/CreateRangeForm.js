import React, {Component} from 'react';
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
    componentDidMount() {
        ValidatorForm.addValidationRule('alreadyExist', (value) => {
            let data = this.props.dataMap;
            let object_names= [];
            data.forEach((el)=>{
                object_names.push(el.nom);
            });
            if(object_names.includes(value))
                return false;
            return true;
        });
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
            this.props.newObject({
                nom:this.state.nom,
                xSeats:parseInt(this.state.rows),
                ySeats:parseInt(this.state.cols),
                number_seats: parseInt(this.state.cols)*parseInt(this.state.rows),
                type:this.state.type,
                x:200,
                y:200,
                deleted_seats: []
            });
            setTimeout(() => this.setState({ submitted: false }), 1000);
        });
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
                        validators={["required","alreadyExist"]}
                        errorMessages={['Ce champ est requis',"Ce nom d'objet existe déjà sur le plan"]}
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
                        validators={['required','minNumber:1', 'maxNumber:50', 'matchRegexp:^[0-9]{1,2}$']}
                        errorMessages={['Ce champ est requis','Nombre min:1','Nombre max:50','Veuiller insérer un nombre']}
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
                        validators={['required','minNumber:1', 'maxNumber:50', 'matchRegexp:^[0-9]{1,2}$']}
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