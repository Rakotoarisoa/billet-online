import React, {Component} from 'react';
import CreateRangeForm from "./forms/CreateRangeForm";
import CreateTableForm from "./forms/CreateTableForm";
import SaveCanvas from "./forms/SaveCanvas";
import UpdateTableForm from "./forms/UpdateTableForm";

class RightSidebar extends Component {
    constructor(props) {
        super(props);
    }

    state = {
    };
    handleNewObject = (object) => {
        this.props.addNewObject(object);
    };
    saveCanvas = (save) => {
        this.props.saveCanvas(save);
    };
    deleteObject =(object) =>{
        this.props.deleteObject(object);
    };
    getFocusedObject =(obj) => {
        if(this.props.updateObject) {
            this.props.focusedObject(obj);
        }
    };
    getUpdatedObject =(obj)=> {
        if(this.props.updateObject){
            this.props.updatedObject(obj);
        }
    };
    render() {
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
                    {this.props.updateObject && <UpdateTableForm deleteObject={this.deleteObject} focusedObject={this.getFocusedObject} updateObject={this.props.updateObject} updatedObject={this.getUpdatedObject} dataMap={this.props.dataMap}/>}
                    {!this.props.updateObject && <SaveCanvas saveCanvas={this.saveCanvas} updateObject={this.props.updateObject}/>}
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