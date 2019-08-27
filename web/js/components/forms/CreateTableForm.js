import React, {Component} from 'react';
import SectionSeat from "../SectionSeat";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
class TextFieldsByTable extends Component{
    constructor(props){
        super(props);
    }
    render() {
        if (this.props.table_type === "rectangle") {

            return (

                <section><TextValidator
                    id="rangeCols"
                    label="Nombre de colonnes"
                    value={this.props.cols}
                    onChange={this.props.onChange}
                    type="text"
                    className={"form-control secondary"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                    validators={['required', 'minNumber:0', 'maxNumber:50', 'matchRegexp:^[0-9]$']}
                    errorMessages={['Ce champ est requis', 'Nombre min:0', 'Nombre max:50', 'Veuiller insérer un nombre']}
                    name={"cols"}
                />
                    <br/><br/>

                    <TextValidator
                        id="rangeRows"
                        label="Nombre de Rangées"
                        value={this.props.rows}
                        onChange={this.props.onChange}
                        type="text"
                        className={"form-control secondary"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        validators={['required', 'minNumber:1', 'isNumber', 'maxNumber:50', 'matchRegexp:^[0-9]$']}
                        errorMessages={['Ce champ est requis', 'Nombre min:1', 'Nombre max:50', 'Veuiller insérer un nombre']}
                        name={"rows"}
                    />
                    <br/><br/>
                </section>
            );
        } else if (this.props.table_type === "ronde") {

            return (<section><TextValidator
                id="chaises"
                label="Nombre de chaises"
                value={this.props.cols}
                onChange={this.props.onChange}
                type="text"
                className={"form-control secondary"}
                InputLabelProps={{
                    shrink: true,
                }}
                margin="normal"
                validators={['required', 'minNumber:0', 'maxNumber:25', 'matchRegexp:^[0-9]$']}
                errorMessages={['Ce champ est requis', 'Nombre min:0', 'Nombre max:50', 'Veuiller insérer un nombre']}
                name={"chaises"}
            />
            </section>);
        }
    }

}
class CreateTableForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            nom: 'Table 1',
            cols: 5,
            rows: 5,
            nbChaisesRonde: 5,
            table_type:"rectangle",
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
            //TODO: create object SectionSeat
            const sectionSeat= new SectionSeat({
                rowNumber:this.state.rows,
                colNumber: this.state.cols,
                nom: this.state.nom
            });
            let canvas=this.props.canvas;
            console.log(canvas);

            setTimeout(() => this.setState({ submitted: false }), 5000);
        });
        alert('Nom de rangée: ' + this.state.nom);
        event.preventDefault();
    }
    render(){
        const tableType = [
            {
                value: 'rectangle',
                label: 'Rectangle',
            },
            {
                value: 'ronde',
                label: 'Ronde',
            }
        ];
        const { rows, cols, nom, table_type } = this.state;
        return(
            <ValidatorForm
                ref="form"
                onSubmit={this.handleSubmitRangeForm}
                noValidate autoComplete="off"
            >
                <div className="p-2 bg-light">
                    <TextField
                        id="table-type"
                        select
                        label="Selectionner votre type de table"
                        className={"form-control"}
                        value={table_type}
                        onChange={this.handleChangeRangeForm}
                        //helperText="Please select your currency"
                        margin="normal"
                        variant="filled"
                        name={"table_type"}
                    >
                        {tableType.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
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
                    <TextFieldsByTable rows={this.state.rows} cols={this.state.cols} table_type={this.state.table_type}/>
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
export default CreateTableForm;