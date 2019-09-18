import React, {Component} from 'react';
import CreateRangeForm from "./forms/CreateRangeForm";
import CreateTableForm from "./forms/CreateTableForm";
import SaveCanvas from "./forms/SaveCanvas";
import UpdateTableForm from "./forms/UpdateTableForm";
function RightSidebar(props){

    const handleNewObject = (object) => {
        this.props.addNewObject(object);
    };
    const saveCanvas = (save) => {
        this.props.saveCanvas(save);
    };
    const deleteObject =(object) =>{
        this.props.deleteObject(object);
    };
    const getFocusedObject =(obj) => {
        if(this.props.updateObject) {
            this.props.focusedObject(obj);
        }
    };
    const getUpdatedObject =(obj)=> {
        if(this.props.updateObject){
            this.props.updatedObject(obj);
        }
    };

        return (
            <aside>

                <div className={''}>
                    {!props.updateObject && <div className="p-3 bg-light">
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
                    </div>}
                    {props.updateObject && <UpdateTableForm focusedObject={getFocusedObject} updateObject={props.updateObject} updatedObject={getUpdatedObject}/>}
                    {!props.updateObject && <SaveCanvas saveCanvas={saveCanvas} updateObject={props.updateObject}/>}
                </div>
                <div className={"collapse"} id="sectionCreate">
                    <div className="d-flex p-3 bg-light">
                        <CreateRangeForm dataMap={props.dataMap} newObject={handleNewObject} updateObject={props.updateObject}/>
                    </div>
                </div>
                <div className={"collapse"} id="tableCreate">
                    <div className="d-flex p-3 bg-light">
                        <CreateTableForm dataMap={props.dataMap} newObject={handleNewObject} updateObject={props.updateObject}/>
                    </div>
                </div>
            </aside>
        );
}

export default RightSidebar;