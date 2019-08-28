import React, {Component} from 'react';
import {render} from 'react-dom';
import {Stage, Layer, useStrictMode} from 'react-konva';
import TableCircle from "./components/TableCircle";
import TableRect from "./components/TableRect";
import SectionSeat from "./components/SectionSeat";
import RightSidebar from "./components/RightSidebar";

class App extends Component {
    constructor(props){
        super(props);
        this.stageRef = React.createRef();
    }
    state = {
        stageScale: 1,
        stageX: 0,
        stageY: 0
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

        stage.scale({ x: newScale, y: newScale });

        this.setState({
            stageScale: newScale,
            stageX:
                -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            stageY:
                -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
        });
    };
    render() {
        return (
            <Stage width={window.innerWidth}
                   height={window.innerHeight}
                   onWheel={this.handleWheel}
                   scaleX={this.state.stageScale}
                   scaleY={this.state.stageScale}
                   x={this.state.stageX}
                   y={this.state.stageY}
                   ref={ref => { this.stageRef = ref; }}>
                <Layer>
                    <TableRect title={"Test"} colNb={5} rowNb={5}/>
                    <TableCircle title={"Test"} chaises={5}/>
                    <SectionSeat title={"Section 1"} rows={5} cols={5} />
                </Layer>
            </Stage>

        );
    }
}
useStrictMode(false);
render(
    <div className="row">
        <div className="col-sm-9">
            <App/>
        </div>
        <div className="col-sm-3 sidebar-right">
            <RightSidebar/>
        </div>
    </div>
    , document.getElementById('root')
);


