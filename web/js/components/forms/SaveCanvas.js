import React, {Component} from "react";
import Button from "@material-ui/core/Button";

class SaveCanvas extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        newObject: {
            name: '',
            type: '',
            coords: {
                x: '',
                y: ''
            }
        }
    };
    saveCanvas =()=>{
        this.props.saveCanvas(true);
    };

    render() {
        return (
            <div className={"p-2 bg-light"}>
                <div className={"d-flex d-flex-row"}>
                    <div className="p-2 bg-light">
                        <Button variant="contained"
                                color="primary"
                                className={"btn btn-primary"}
                                type={"submit"}
                                onClick={this.saveCanvas}>
                            Sauvegarder
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SaveCanvas;
