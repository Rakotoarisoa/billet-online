import React, {Component} from 'react';
import Konva from 'konva';
import {render} from 'react-dom';
import {Stage, Layer, Transformer} from 'react-konva';
import TableCircle from "./components/TableCircle";
import TableRect from "./components/TableRect";
import SectionSeat from "./components/SectionSeat";
import RightSidebar from "./components/RightSidebar";


class App extends Component {
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
                   onWheel={this.handleWheel}>
                <Layer>
                    <TableRect/>
                    <TableCircle/>
                    <SectionSeat/>
                </Layer>
            </Stage>

        );
    }
}

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

