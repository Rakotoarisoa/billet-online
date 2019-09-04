import React, {Component} from 'react';
import {render} from 'react-dom';
import Konva from 'konva';
import axios from 'axios';
import {Stage, Layer, useStrictMode} from 'react-konva';
import TableCircle from "./components/TableCircle";
import TableRect from "./components/TableRect";
import SectionSeat from "./components/SectionSeat";
import RightSidebar from "./components/RightSidebar";
import PopupEvent from "./components/canvas-events/PopupEvent";
import TransformHandler from "./components/TransformHandler";

class App extends Component {
    constructor(props) {
        super(props);
        this.stageRef = React.createRef();
        this.transformer = new TransformHandler();
    }

    state = {
        stageScale: 1,
        stageX: 0,
        stageY: 0,
        selectedItem: null,
        newItem: '',
        isAddingItem: false,
        current_map: '',
        selectedSeat: null,
    };
    addNewObject = (object) => {
        if (object && (this.state.isAddingItem === false)) {
            this.setState({"isAddingItem": true});
            switch (object.type) {
                case "section":
                    this.setState({'newItem': this.renderSectionSeat(object)});
                    this.setState({"isAddingItem": false});
                    break;
                case "ronde":
                    this.setState({'newItem': this.renderTableRect(object)});
                    this.setState({"isAddingItem": false});
                    break;
                case "rectangle":
                    this.setState({'newItem': this.renderTableCircle(object)});
                    this.setState({"isAddingItem": false});
                    break;
                default:
                    this.setState({'newItem': this.renderSectionSeat(object)});
                    this.setState({"isAddingItem": false});
                    break;
            }
        }
    };
    componentDidMount() {
        this.loadStage(this.stageRef);
    }

    saveStage = () => {

        console.log(this.stageRef.toJSON()); //Données sur le canvas
        axios.post(
            '/symfony3.4/web/api/event/update-map/395', {
                data_map: JSON.parse(this.stageRef.toJSON())
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            }
        );
    };
    loadStage = (stage) => {
        axios.get(
            '/symfony3.4/web/api/event/get-map/395')
            .then(function (response) {
               // stage.create(response,'root');
                //console.log(response);
            })
            .catch(function (error) {
                    console.log(error);
                }
            );
        //return map;
    };
    renderSectionSeat = (section) => {
        return (<SectionSeat title={section.nom} rows={section.rows} cols={section.cols}/>);
    };
    renderTableRect = (object) => {
        return (<TableRect title={object.nom} rows={object.rows} cols={object.cols}/>);
    };
    renderTableCircle = (object) => {
        return (<TableCircle title={object.nom} chaises={object.chaises}/>);
    };
    handleLayerChange = () => {
      this.state.isAddingItem = !this.state.isAddingItem;
      this.state.newItem = '';
      console.log("Changé");
    };
    handleDragStart = e => {
        e.target.setAttrs({
            shadowOffset: {
                x: 15,
                y: 15
            },
            scaleX: 1.1,
            scaleY: 1.1
        });
    };
    handleDragEnd = e => {
        e.target.to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseOut,
            scaleX: 1,
            scaleY: 1,
            shadowOffsetX: 5,
            shadowOffsetY: 5
        });
    };
    handleWheel = e => {
        e.evt.preventDefault();

        const scaleBy = 1.01;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({x: newScale, y: newScale});

        this.setState({
            stageScale: newScale,
            stageX:
                -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            stageY:
                -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
        });
    };
    hoverSeat = e => {
        this.setState({
           selectedSeat : e
    });
    };
    handleSelected = e => {
        this.setState({'selectedItem': e});
        console.log(e.target);
    };

    render() {
        return (
            <div className="row">
                <div className="col-sm-9">
                    <Stage width={window.innerWidth*9/12}
                           height={window.innerHeight}
                           onWheel={this.handleWheel}
                           onTransformEnd={this.handleLayerChange}
                           scaleX={this.state.stageScale}
                           scaleY={this.state.stageScale}
                           x={this.state.stageX}
                           y={this.state.stageY}
                           ref={ref => {
                               this.stageRef = ref;
                           }}
                    >
                        <Layer
                        >
                            <TableRect title={"Test"} colNb={4} rowNb={4} hoverSeat={this.hoverSeat} selected={this.handleSelected}/>
                            <TableRect title={"Test"} colNb={5} rowNb={5} hoverSeat={this.hoverSeat} selected={this.handleSelected}/>
                            <TableRect title={"Test"} colNb={15} rowNb={15} hoverSeat={this.hoverSeat} selected={this.handleSelected}/>
                            <TableCircle title={"Test"} nbSeats={20}/>
                            <SectionSeat title={"Section 1"} rows={15} cols={5} />
                        </Layer>
                    </Stage>
                    {this.state.selectedSeat && (
                        <PopupEvent
                            position={this.state.selectedSeat.position}
                            seatId={this.state.selectedSeat.seatId}
                            onClose={() => {
                                this.setState({ selectedSeat: null });
                            }}
                        />
                    )}
                </div>
                <div className="col-sm-3 sidebar-right">
                    <RightSidebar addNewObject={this.addNewObject}/>
                </div>
            </div>

        );
    }
}

useStrictMode(false);
render(
    <App/>
    , document.getElementById('root')
);


