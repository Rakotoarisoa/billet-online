import React, {Component} from "react";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";

class ReInitSeat extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        isUpdatingObject : false
    };
    reInitCanvas =()=>{
        this.props.reInitSeat(true);
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
                                color="secondary"
                                className={"btn btn-secondary"}
                                type={"submit"}
                                onClick={this.reInitCanvas}>
                            Reinitialiser les billets
                        </Button>
                    </div>
                </div>
            </Fade>
        );
    }
}

export default ReInitSeat;
