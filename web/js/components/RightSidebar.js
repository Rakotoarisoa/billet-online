import React, {Component} from 'react';
import CreateRangeForm from "./forms/CreateRangeForm";
import CreateTableForm from "./forms/CreateTableForm";
import CreateZoneForm from "./forms/CreateZoneForm";
import SaveCanvas from "./forms/SaveCanvas";
import UpdateTableForm from "./forms/UpdateTableForm";
import Fade from "@material-ui/core/Fade";
class RightSidebar extends Component {
    constructor(props){
        super(props);
    }
    state = {
       clickedTable: false,
       clickedZone: false,
       clickedSection: false
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
    switchClick =(clicked)=>{
        switch(clicked.target.id){
            case "table":
                this.setState({clickedTable:!this.state.clickedTable});
                break;
            case "zone":
                this.setState({clickedZone:!this.state.clickedZone});
                break;
            case "section":
                this.setState({clickedSection:!this.state.clickedSection});
                break;
        }

    }
    render() {
        return (
            <aside>

                <div className={''}>
                    {!this.props.updateObject && <div className="p-3 bg-light">
                        <div className={"d-flex d-flex-row"}>

                            <div className="p-2 bg-light">
                                <button className={"btn btn-light"} id="table" onClick={this.switchClick}>Table
                                </button>
                            </div>
                            <div className="p-2 bg-light">
                                <button className={"btn btn-light"} id="zone" onClick={this.switchClick}>Zone
                                </button>
                            </div>
                            <div className="p-2 bg-light">
                                <button className={"btn btn-light"} id="section" onClick={this.switchClick}>Rangée
                                </button>
                            </div>
                        </div>
                    </div>}
                    {this.props.updateObject &&
                    <UpdateTableForm focusedObject={this.getFocusedObject} updateObject={this.props.updateObject}
                                     updatedObject={this.getUpdatedObject} dataMap={this.props.dataMap} selectedSeat={this.props.selectedSeat}/>}
                    {!this.props.updateObject && <SaveCanvas saveCanvas={this.saveCanvas} updateObject={this.props.updateObject}/>}
                </div>

                <Fade in={this.state.clickedSection && !this.props.updateObject} style={{transitionDelay: this.props.clickedSection ? '50ms' : '50ms'}}>{<div id="sectionCreate" style={{display:(this.state.clickedSection && !this.props.updateObject)?"inherit":"none"}}>
                    <div className="d-flex p-3 bg-light">
                        <CreateRangeForm dataMap={this.props.dataMap} newObject={this.handleNewObject}
                                         updateObject={this.props.updateObject}/>
                    </div>
                </div>}</Fade>

                <Fade in={this.state.clickedTable && !this.props.updateObject} style={{transitionDelay: this.props.clickedTable ? '50ms' : '50ms'}}>{ <div id="tableCreate" style={{display:(this.state.clickedTable && !this.props.updateObject)?"inherit":"none"}}>
                    <div className="d-flex p-3 bg-light">
                        <CreateTableForm dataMap={this.props.dataMap} newObject={this.handleNewObject}
                                         updateObject={this.props.updateObject}/>
                    </div>
                </div>
                }</Fade>
                <Fade in={this.state.clickedZone && !this.props.updateObject} style={{transitionDelay: this.props.clickedZone ? '50ms' : '50ms'}}>{ <div id="zoneCreate" style={{display:(this.state.clickedZone && !this.props.updateObject)?"inherit":"none"}}>
                    <div className="d-flex p-3 bg-light">
                        <CreateZoneForm dataMap={this.props.dataMap} newObject={this.handleNewObject}
                                         updateObject={this.props.updateObject}/>
                    </div>
                </div>
                }</Fade>
            </aside>
        );
    }
}

export default RightSidebar;