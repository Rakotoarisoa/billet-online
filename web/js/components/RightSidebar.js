import React, {Component} from 'react';
import CreateRangeForm from "./forms/CreateRangeForm";
import CreateTableForm from "./forms/CreateTableForm";
import SaveCanvas from "./forms/SaveCanvas";
import UpdateTableForm from "./forms/UpdateTableForm";
import { ToastContainer } from "react-toastr";

class RightSidebar extends Component {
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
    handleNewObject = (object) => {
        this.props.addNewObject(object);
    };
    saveCanvas = (save) => {
        this.props.saveCanvas(save);
    };

    componentDidMount() {

    }
    deleteObject =(object) =>{
        this.props.deleteObject(object);
    };

    componentDidUpdate(prevProps) {
        if(prevProps.dataMap !== this.props.dataMap)
        {

        }
    }

    componentWillUnmount() {

    }

    render() {
        let container;
        return (
            <aside>
                <div className={''}>
                    <div className="p-3 bg-light">
                        <div className={"d-flex d-flex-row"}>

                            <div className="p-2 bg-light">
                                <button className={"btn btn-light"} data-toggle={"collapse"}
                                        data-target={"#tableCreate"}>Table
                                </button>
                            </div>
                            <div className="p-2 bg-light">
                                <button className={"btn btn-light"} data-toggle={"collapse"}
                                        data-target={"#zoneCreate"} aria-expanded="false"
                                        aria-controls="zoneCreate">Zone
                                </button>
                            </div>
                            <div className="p-2 bg-light">
                                <button className={"btn btn-light"} data-toggle={"collapse"}
                                        data-target={"#sectionCreate"}
                                        aria-expanded="false" aria-controls="sectionCreate">Rangée
                                </button>
                            </div>
                        </div>
                    </div>
                    {this.props.updateObject && <UpdateTableForm deleteObject={this.deleteObject} updateObject={this.props.updateObject} dataMap={this.props.dataMap}/>}
                    <SaveCanvas saveCanvas={this.saveCanvas}/>
                </div>
                <div className={"collapse"} id="sectionCreate">
                    <div className="d-flex p-3 bg-light">
                        <CreateRangeForm dataMap={this.props.dataMap} newObject={this.handleNewObject} updateObject={this.props.updateObject}/>
                    </div>
                </div>
                <div className={"collapse"} id="tableCreate">
                    <div className="d-flex p-3 bg-light">
                        <CreateTableForm dataMap={this.props.dataMap} newObject={this.handleNewObject} updateObject={this.props.updateObject}/>
                    </div>
                </div>
            </aside>
        );
    }
}

export default RightSidebar;