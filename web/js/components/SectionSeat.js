import React, {Component} from 'react';
import Konva from "konva";
import {Circle, Group, Text} from "react-konva";
import RightSidebar from "./RightSidebar";

const rows=5,
    cols=5,
    rad = 10,
    dia = rad * 2,
    gap = 5,
    sideBuff = 10,
    topBuff = 10,
    bottomBuff = 10,
    sizeX = sideBuff * 2 + cols * dia + (cols - 1) * gap,
    sizeY = topBuff + bottomBuff + rows * dia + (rows - 1) * gap,
    posY = 200,
    posX = 200,
    textWidth = 50,
    textHeight = 10;
let currentCol = 5;//NBR OF Columns
let currentRow = 'A';


class SectionSeat extends Component {
    state = {
        color: 'green'
    };

    handleClick = () => {
        this.setState({
            color: Konva.Util.getRandomColor()
        });
    };

    render() {
        return (
            <Group
                x={posX}
                y={posY}
                height={sizeX}
                width={sizeY}
                draggable
            >


                {[...Array(rows)].map((_, i) => (// CREER
                    [...Array(cols)].map((_, j) => (// CREER
                        <Group
                        >

                            <Circle
                                key={j+1}
                                x={(posX + sideBuff) + rad + j * dia + j * gap}
                                y={( textHeight + topBuff) + rad + i * dia + i * gap}
                                width={20}
                                height={20}
                                stroke={"#888888"}
                                strokeWidth={"2px"}
                                fill="#A9A8B3"
                                shadowColor={'gray'}
                                shadowOffset={{x: 2,
                                    y: 2}}
                                shadowBlur={5}

                            />
                            <Text
                                text={j+1}
                                fontStyle={"arial"}
                                fontSize={10}
                                x={(posX + sideBuff) + rad + j * dia + j * gap-3}
                                y={( textHeight + topBuff) + rad + i * dia + i * gap-5}
                            />
                        </Group>
                    ))

                ))}
                <Text
                    text={"Test"}
                    x={posX+10}
                    y={0}
                    width={textWidth}
                    height={textHeight}
                />

            </Group>);
    }
}
export default SectionSeat;
