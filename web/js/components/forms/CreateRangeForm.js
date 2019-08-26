import React, {Component} from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class CreateRangeForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            nom: 'Nom par défaut',
            cols: 5,
            rows: 5
        };
        this.handleChangeRangeForm = this.handleChangeRangeForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        console.log(this.state.nom);
    }

    handleSubmitRangeForm(event) {
        alert('Nom de rangée: ' + this.state.nom);
        event.preventDefault();
    }
    render(){
        return(

            <form onSubmit={this.handleSubmitRangeForm}>

                <div className="p-2 bg-light">
                    <TextField
                        id="standard-name"
                        label="Nom"
                        className={"form-control secondary"}
                        defaultValue={this.state.nom}
                        onChange={this.handleChangeRangeForm}
                        margin="normal"
                        name={"nom"}
                    />

                    <TextField
                        id="rangeCols"
                        label="Nombre de colonnes"
                        defaultValue={this.state.cols}
                        onChange={this.handleChangeRangeForm}
                        type="number"
                        className={"form-control secondary"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />

                    <TextField
                        id="rangeRows"
                        label="Nombre de Rangées"
                        defaultValue={this.state.rows}
                        onChange={this.handleChangeRangeForm}
                        type="number"
                        className={"form-control secondary"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                    <Button variant="contained"
                            color="primary"
                            className={"btn btn-primary"}>
                        Valider
                    </Button>
                </div>
            </form>
        );
    }
}
export default CreateRangeForm;