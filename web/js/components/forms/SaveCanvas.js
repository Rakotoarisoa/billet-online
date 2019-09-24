import React, {Component} from "react";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";

class SaveCanvas extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        isUpdatingObject : false
    };
    saveCanvas =()=>{
        this.props.saveCanvas(true);
    };
    componentDidUpdate() {
        if(this.props.updateObject)
        {
            this.setState({'isUpdatingObject':!this.state.isUpdatingObject});
        }
    }

    render() {
        return (
            <Fade in={!this.state.isUpdatingObject}>
            <div className={"d-inline-flex p-2"}>
                    <div className="p-2">
                        <Button variant="contained"
                                color="primary"
                                className={"btn btn-primary"}
                                type={"submit"}
                                onClick={this.saveCanvas}>
                            Sauvegarder la carte
                        </Button>
                    </div>
            </div>
            </Fade>
        );
    }
}

export default SaveCanvas;
