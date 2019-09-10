import React, {Component} from "react";

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
                        <button className={'btn btn-primary'} onClick={this.saveCanvas} >Sauvegarder</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SaveCanvas;
