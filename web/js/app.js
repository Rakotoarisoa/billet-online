import React,{Component} from 'react';
import Konva from 'konva';
import {render} from 'react-dom';
import {Stage, Layer} from 'react-konva';
import TableCircle from "./components/TableCircle";
import TableRect from "./components/TableRect";
import SectionSeat from "./components/SectionSeat";
import RightSidebar from "./components/RightSidebar";
import '../css/index.css';



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
    render() {
        return (
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    <TableRect/>
                    <TableCircle/>
                    <SectionSeat/>
                </Layer>
            </Stage>

        );
    }
}

render(<div className="row">
    <div className="col-sm-9">
    <App/>
    </div>
    <div className="col-sm-3 sidebar-right">
    <RightSidebar/>
    </div>
    </div>
    , document.getElementById('root'));

