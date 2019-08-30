import React, {Component} from 'react';
import Konva from "konva";
import {Circle, Group, Rect, Text} from "react-konva";

const rad = 10,
    dia = rad * 2,
    gap = 5,
    posY = 200,
    posX = 200,
    // buffers from edges of group box
    sideBuff = 10,
    topBuff = 10,
    bottomBuff = 10,
    sizeX = 10; // doesn't matter, just an initialization
const ySeats = 10, xSeats = 10; //VALEUR PAR DEFAUT NOMBRE DE CHAISES
let tableWidth = (dia) + (2 * gap); // 55 by default
let tableHeight = tableWidth;// 55 by default


if (xSeats >= 1)
    tableWidth = (xSeats * dia) + ((xSeats + 1) * gap);
if (ySeats >= 1)
    tableHeight = (ySeats * dia) + ((ySeats + 1) * gap);
let contWidth = 0;
let wholeWidth = tableWidth;
if (ySeats > 0)
    wholeWidth = wholeWidth + dia * 2 + gap * 2;
let wholeHeight = tableHeight;
if (xSeats > 0)
    wholeHeight = wholeHeight + dia * 2 + gap * 2;

let tablePosY = (posY + topBuff + topBuff) + (wholeHeight - tableHeight) / 2, tablePosX = (sizeX / 2);
//VARIABLE Texte
let textWidth = 50, textHeight = 10;
// resize container to accomodate text and table
if (textWidth > wholeWidth) {
    contWidth = sideBuff * 2 + textWidth;
} else {
    contWidth = sideBuff * 2 + wholeWidth;
}
//VARIABLE POUR CHAISE HORIZONTALE
let leftStart = sizeX / 2 - tableWidth / 2 + gap + rad;
let topPos = (posX + textHeight + topBuff) + rad;
let bottomPos = (posY + textHeight + topBuff) + dia + gap * 2 + tableHeight + rad;
//VARIABLE POUR CHAISE VERTICALE
let topStart = (posX + topBuff) + (wholeHeight - tableHeight) / 2 + gap + rad;
let leftPos = tablePosX - tableWidth / 2 - gap - rad;
let rightPos = tablePosX + tableWidth / 2 + gap + rad;


class TableRect extends Component {

    constructor(props){
        super(props);
    }
    state = {
        color: 'green',
        xSeats: xSeats,
        ySeats: ySeats,
        x: posX,
        y: posY,
        nom:"Table 1",
        bottomSeats: [],
        leftSeats:[]
    };
    createBottomSeats = (number) => {

        let bottomSeats =[];
        for(var i=parseInt(this.state.xSeats);i>0;i--){
            number=number+1;
            bottomSeats.push(
                <Group
                    key={"Rectb"+i}>
                    <Circle
                        key={number}
                        x={leftStart + dia * (i-1) + gap * (i-1)}
                        y={bottomPos}
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
                        text={number}
                        fontStyle={"arial"}
                        fontSize={10}
                        x={leftStart + dia * (i-1) + gap * (i-1)-5}
                        y={bottomPos-5}

                    />
                </Group>
            );
        }
        bottomSeats["current_nb"] = number;
        return bottomSeats;
    };
    createLeftSeats = (number) => {
        let leftSeats =[];
        for(let i=parseInt(this.state.ySeats);i>0;i--) {
            number=number+1;
            //console.log(number);
            leftSeats.push(
                <Group
                    key={"Rectg"+i}>
                    <Circle
                        key={number}
                        x={leftPos}
                        y={topStart + topBuff + dia * (i-1) + gap * (i-1)+4}
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
                        text={(number)}
                        fontStyle={"arial"}
                        fontSize={10}
                        x={leftPos-7}
                        y={topStart + topBuff + dia * (i-1) + gap * i-6}

                    />
                </Group>
            );
        }
        return leftSeats;
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
        let numero_chaise = 0;
        return (
            <Group
                key={"rect"}
                x={this.state.x}
                y={this.state.y}
                height={topBuff * 2 + textWidth + wholeHeight + bottomBuff}
                width={contWidth}
                onDragEnd={this.handleDragEnd}
                name={"rectangle"}
                draggable
            >

                <Rect
                    x={leftStart-15}
                    y={(posY + textHeight + topBuff) + (wholeHeight - tableHeight) / 2}
                    radius={50}
                    fill="white"
                    stroke={"#888888"}
                    strokeWidth={2}
                    width={tableWidth}
                    height={tableHeight}
                />


                {[...Array(this.state.xSeats)].map((_, i) => (// CREER chaises en haut de la table
                    <Group
                        key={"RectT"+i}
                    >

                        <Circle
                            key={numero_chaise++}
                            x={leftStart + dia * i + gap * i}
                            y={topPos}
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
                            text={numero_chaise}
                            fontStyle={"arial"}
                            fontSize={10}
                            x={leftStart + dia * i + gap * i - 3}
                            y={topPos - 5}
                        />
                    </Group>
                ))}
                {[...Array(this.state.ySeats)].map((_, i) => (// CREER chaises à droite de la table
                    <Group
                        key={"Rectd"+i}>
                        <Circle
                            key={numero_chaise++}
                            x={rightPos}
                            y={topStart + topBuff + dia * i + gap * i}
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
                            text={numero_chaise}
                            fontStyle={"arial"}
                            fontSize={10}
                            x={rightPos-7}
                            y={topStart + topBuff + dia * i + gap * i - 5}

                        />
                    </Group>
                ))}
                {this.createBottomSeats(numero_chaise)}
                {this.createLeftSeats(numero_chaise+parseInt(this.state.xSeats))}
                <Text
                    text={this.state.nom}
                    x={0}
                    y={wholeHeight/2+(posY+topBuff)}
                    width={textWidth}
                    height={textHeight}
                />

            </Group>);
    }
}
export default TableRect;
