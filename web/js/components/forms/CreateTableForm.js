import React, {Component} from 'react';
import SectionSeat from "../SectionSeat";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import TableRect from "../TableRect";
const RECTANGLE="rectangle",RONDE="ronde";

class TextFieldsByTable extends Component{
    constructor(props){
        super(props);
    }

    state={
    cols: this.props.cols,
    rows: this.props.rows,
    type: this.props.table_type,
    chaises: this.props.chaises
    };
    render() {
        let {  handleChangeRangeForm } = this.props;
        if (this.props.table_type === RECTANGLE) {

            return (

                <section><TextValidator
                    id="horizontal"
                    label="Nombre à l'horizontal"
                    value={this.props.cols}
                    type="text"
                    className={"form-control secondary"}
                    onChange={handleChangeRangeForm}
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
                        value={this.props.rows}
                        type="text"
                        className={"form-control secondary"}
                        onChange={handleChangeRangeForm}
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
        } else if (this.props.table_type === RONDE) {
            return (<section><TextValidator
                id="chaises"
                label="Nombre de chaises"
                value={this.props.chaises}
                type="text"
                className={"form-control secondary"}
                InputLabelProps={{
                    shrink: true
                }}
                margin="normal"
                onChange={handleChangeRangeForm}
                validators={['required', 'minNumber:1', 'maxNumber:25', 'matchRegexp:^[0-9]{1,2}$']}
                errorMessages={['Ce champ est requis', 'Nombre min:0', 'Nombre max:50', 'Veuiller insérer un nombre']}
                name={"chaises"}
            />
            <br/><br/>
            </section>);
        }
    }

}
class CreateTableForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            nom: 'Table 1',
            rows: 5,
            cols: 5,
            chaises: 5,
            table_type: RECTANGLE,
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
            if(this.state.table_type === RECTANGLE){
                this.props.newObject({
                    nom:this.state.nom,
                    rows:parseInt(this.state.rows),
                    cols:parseInt(this.state.cols),
                    type:this.state.table_type
                });
            }
            else if(this.state.table_type === RONDE){
                this.props.newObject({
                    nom:this.state.nom,
                    chaises:parseInt(this.state.chaises),
                    type:this.state.table_type
                });
            }

            setTimeout(() => this.setState({ submitted: false }), 1000);
        });
        event.preventDefault();
    }
    render(){
        const tableType = [
            {
                value: RECTANGLE,
                label: 'Rectangle',
            },
            {
                value: RONDE,
                label: 'Ronde',
            }
        ];
        const { rows, cols, nom,chaises, table_type } = this.state;
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
                        helperText="Selectionner la forme de la table"
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
                    <TextFieldsByTable chaises={chaises} rows={rows} cols={cols} table_type={table_type} handleChangeRangeForm={this.handleChangeRangeForm}/>
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