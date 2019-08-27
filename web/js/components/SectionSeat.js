import React, {Component} from 'react';
import {Circle, Group, Text} from "react-konva";

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
    textWidth = 100,
    textHeight = 10;
let currentCol = 5;//NBR OF Columns
let currentRow = 'A';


class SectionSeat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: '#A9A8B3',
            stroke: '#888888',
            isSelected: false,
            colNumber: this.props.cols,
            rowNumber: this.props.rows,
            x: posX,
            y: posY,
            sectionName: this.props.title
        };
    }
    handleDragEnd = e => {
        this.setState({
            x: e.target.x(),
            y: e.target.y()
        });
    };
    handleClick = () => {
        this.setState({
            isSelected: true,
        });
    };
    render() {
        return (
            <Group
                key={"section1"}
                x={this.state.x}
                y={this.state.y}
                height={sizeX}
                width={sizeY}
                onDragEnd={this.handleDragEnd}
                draggable
            >


                {[...Array(this.state.rowNumber)].map((_, i) => (// CREER
                    [...Array(this.state.colNumber)].map((_, j) => (// CREER
                        <Group
                            key={"Element"+i+" "+j}
                        >

                            <Circle
                                key={j+"1"+i}
                                x={(posX + sideBuff) + rad + j * dia + j * gap}
                                y={( textHeight + topBuff) + rad + i * dia + i * gap}
                                width={20}
                                height={20}
                                stroke={this.state.stroke}
                                strokeWidth={2}
                                fill={this.state.color}
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
                    text={this.state.sectionName}
                    x={posX+10}
                    y={0}
                    width={textWidth}
                    height={textHeight}
                />

            </Group>);
    }
}
export default SectionSeat;
