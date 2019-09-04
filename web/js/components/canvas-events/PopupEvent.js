import React, {Component} from 'react';
import Konva from "konva";
import {Circle, Group, Rect, Text} from "react-konva";

const color = 10; // doesn't matter, just an initialization


class PopupEvent extends Component {

    constructor(props){
        super(props);
    }
    state = {
        color: 'white',
        seatId: null,
        x: 0,
        y: 0,

    };

    render() {
        let numero_chaise = 0;
        return (
            <div
                style={{
                    position: "absolute",
                    top: this.props.position.y + 50 + "px",
                    left: this.props.position.x+ 350  + "px",
                    padding: "10px",
                    borderRadius: "3px",
                    boxShadow: "0 0 5px grey",
                    zIndex: 10,
                    backgroundColor: "white"
                }}>
                <p>Chaise n° : {this.props.seatId}</p>
                <p>Table: </p>
            </div>);
    }
}
export default PopupEvent;
