import React,{Component} from 'react';
import Konva from "konva";
import {Circle, Group, Text} from "react-konva";

const rad = 10,
    dia = rad * 2,
    gap = 5,
    posY = 200,
    posX = 200,
    // buffers from edges of group box
    sideBuff = 10,
    topBuff = 10,
    bottomBuff = 10,
    sizeX = 10, // doesn't matter, just an initialization
    seats=10,
    deg = (2*Math.PI)/seats;//initialisation Nombre chaise.


let tableRad = rad + gap;
if (seats >= 4 && seats < 6)
    tableRad = rad*1.5;
if (seats >= 6 && seats < 9)
    tableRad = rad*2;
if (seats >= 9 && seats < 13)
    tableRad = rad*3.5;
if (seats >= 13 && seats <15)
    tableRad = rad*4.2;
if (seats >= 15 && seats <17)
    tableRad = rad*4.5;
if (seats >= 17 && seats <22)
    tableRad = rad*6;
if (seats >= 22 && seats <25)
    tableRad = rad*10;
let wholeDia = tableRad * 2 + dia*2 + gap*2;
// resize container to accomodate text and table
let textWidth = 50, textHeight = 10;
let contWidth =0;
if (textWidth > wholeDia) {
    contWidth = sideBuff*2 + textWidth;
} else {
    contWidth = sideBuff*2 + wholeDia;
}
let tableLeft=posX + contWidth/2,tableTop=(textWidth + textHeight + topBuff) + dia + gap;

class TableCircle extends Component {
    state = {
        color: 'green',
        seats: seats,
        x: posX,
        y: posY
    };
    handleDragEnd = e => {
        this.setState({
            x: e.target.x(),
            y: e.target.y()
        });
    };
    handleClick = () => {
        this.setState({
            color: Konva.Util.getRandomColor()
        });
    };

    render() {
        return (
            <Group
                x={this.state.x}
                y={this.state.y}
                height={topBuff * 2 + textWidth + bottomBuff}
                width={contWidth}
                visible={true}
                draggable
                onDragEnd={this.handleDragEnd}
            >
                {[...Array(seats)].map((_, i) => (// CREER chaises à gauche de la table
                    <Group
                    key={"Circle"+i}>
                        <Circle
                            key={i+1}
                            x={Math.cos(deg*i)*(tableRad + gap + rad) + tableLeft}
                            y={Math.sin(deg*i)*(tableRad + gap + rad) + (tableTop + tableRad)}
                            width={20}
                            height={20}
                            fill="#A9A8B3"
                            stroke={"#888888"}
                            strokeWidth={2}
                            shadowColor={'gray'}
                            shadowOffset={{x: 2,
                                y: 2}}
                            shadowBlur={5}
                        />
                        <Text
                            text={i+1}
                            fontStyle={"Tahoma, Geneva, sans-serif"}
                            fontSize={10}
                            x={Math.cos(deg*i)*(tableRad + gap + rad) + tableLeft-5}
                            y={Math.sin(deg*i)*(tableRad + gap + rad) + (tableTop + tableRad-5)}

                        />
                    </Group>
                ))}
                <Circle //TABLE RONDE
                    radius={tableRad}
                    x={posX + contWidth/2}
                    y={ (tableRad+textWidth + textHeight + topBuff) + dia + gap}
                    fill={"white"}
                    stroke={"#444444"}
                    strokeWidth={2}
                />
                <Text
                    text={"Test"}
                    x={posX+contWidth/2-12}
                    y={(tableRad+textWidth + topBuff) + dia + gap}
                    width={textWidth}
                    height={textHeight}
                />

            </Group>);
    }
}

export default TableCircle;