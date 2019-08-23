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
    state = {
        color: 'green',
        xSeats: 5
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
                key={"Rect"}
                x={posX}
                y={posY}
                height={topBuff * 2 + textWidth + wholeHeight + bottomBuff}
                width={contWidth}
                draggable
            >

                <Rect
                    x={leftStart-15}
                    y={(posY + textHeight + topBuff) + (wholeHeight - tableHeight) / 2}
                    radius={50}
                    fill="white"
                    stroke={"#888888"}
                    strokeWidth={"2px"}
                    width={tableWidth}
                    height={tableHeight}
                />


                {[...Array(xSeats)].map((_, i) => (// CREER chaises en haut de la table
                    <Group
                        key={"Rect"}
                    >

                        <Circle
                            key={numero_chaise++}
                            x={leftStart + dia * i + gap * i}
                            y={topPos}
                            width={20}
                            height={20}
                            fill="#A9A8B3"
                            stroke={"#888888"}
                            strokeWidth={"2px"}
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
                {[...Array(ySeats)].map((_, i) => (// CREER chaises à droite de la table
                    <Group
                        key={"Rect"}>
                        <Circle
                            key={numero_chaise++}
                            x={rightPos}
                            y={topStart + topBuff + dia * i + gap * i}
                            width={20}
                            height={20}
                            fill="#A9A8B3"
                            stroke={"#888888"}
                            strokeWidth={"2px"}
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
                {[...Array(xSeats)].map((_, i) => (// CREER chaises en bas de la table
                    <Group>
                        <Circle
                            key={numero_chaise++}
                            x={leftStart + dia * i + gap * i}
                            y={bottomPos}
                            width={20}
                            height={20}
                            fill="#A9A8B3"
                            stroke={"#888888"}
                            strokeWidth={"2px"}
                            shadowColor={'gray'}
                            shadowOffset={{x: 2,
                                y: 2}}
                            shadowBlur={5}

                        />
                        <Text
                            text={numero_chaise}
                            fontStyle={"arial"}
                            fontSize={10}
                            x={leftStart + dia * i + gap * i-7}
                            y={bottomPos-5}

                        />
                    </Group>
                ))}
                {[...Array(ySeats)].map((_, i) => (// CREER chaises à gauche de la table
                    <Group>
                        <Circle
                            key={numero_chaise++}
                            x={leftPos}
                            y={topStart + topBuff + dia * i + gap * i}
                            width={20}
                            height={20}
                            fill="#A9A8B3"
                            stroke={"#888888"}
                            strokeWidth={"2px"}
                            shadowColor={'gray'}
                            shadowOffset={{x: 2,
                                y: 2}}
                            shadowBlur={5}
                        />
                        <Text
                            text={(numero_chaise)}
                            fontStyle={"arial"}
                            fontSize={10}
                            x={leftPos-7}
                            y={topStart + topBuff + dia * i + gap * i-5}

                        />
                    </Group>
                ))}
                <Text
                    text={"Test"}
                    x={0}
                    y={wholeHeight/2+(posY+topBuff)}
                    width={textWidth}
                    height={textHeight}
                />

            </Group>);
    }
}
export default TableRect;
