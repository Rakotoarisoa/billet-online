import React, {Component} from 'react';
import Konva from "konva";
import {Circle, Group, Rect, Text} from "react-konva";

 // doesn't matter, just an initialization
//const ySeats = 5, xSeats = 10; //VALEUR PAR DEFAUT NOMBRE DE CHAISES



class TableRect extends Component {

    constructor(props){
        super(props);
    }
    state = {
        color: 'green',
        xSeats: this.props.colNb,
        ySeats: this.props.rowNb,
        x: window.innerWidth/2,
        y: window.innerHeight/2,
        nom:"Table 1",
        bottomSeats: [],
        leftSeats:[],
        rad : 10,
        dia : 20,
        gap : 5,
        posY : 200,
        posX : 200,
        // buffers from edges of group box
        sideBuff : 10,
        topBuff : 10,
        bottomBuff : 10,
        sizeX : 10,

    };
    createBottomSeats = (number,leftStart,bottomPos) => {

        let bottomSeats =[];
        for(var i=parseInt(this.state.xSeats);i>0;i--){
            number=number+1;
            bottomSeats.push(
                <Group
                    key={"Rectb"+i}>
                    <Circle
                        key={number}
                        x={this.state.sideBuff*2.8+leftStart + this.state.dia * (i-1) + this.state.gap * (i-1)}
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
                        x={this.state.sideBuff*2.8+leftStart + this.state.dia * (i-1) + this.state.gap * (i-1)-5}
                        y={bottomPos-5}

                    />
                </Group>
            );
        }
        bottomSeats["current_nb"] = number;
        return bottomSeats;
    };
    createLeftSeats = (number,leftPos,topStart) => {
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
                        y={topStart + this.state.topBuff + this.state.dia * (i-1) + this.state.gap * (i-1)}
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
                        y={topStart + this.state.topBuff + this.state.dia * (i-1) + this.state.gap * (i-1)-5}

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
        let tableWidth = (this.state.dia) + (2 * this.state.gap); // 55 by default
        let tableHeight = tableWidth;// 55 by default

        if (this.state.xSeats >= 1)
            tableWidth = (this.state.xSeats * this.state.dia) + ((this.state.xSeats + 1) * this.state.gap);
        if (this.state.ySeats >= 1)
            tableHeight = (this.state.ySeats * this.state.dia) + ((this.state.ySeats + 1) * this.state.gap);
        let contWidth = 0;
        let wholeWidth = tableWidth;
        if (this.state.ySeats > 0)
            wholeWidth = wholeWidth + this.state.dia * 2 + this.state.gap * 2;
        let wholeHeight = tableHeight;
        if (this.state.xSeats > 0)
            wholeHeight = wholeHeight + this.state.dia * 2 + this.state.gap * 2;

        let tablePosY = (this.state.posY + this.state.topBuff *2) + (wholeHeight - tableHeight) / 2, tablePosX = (this.state.sizeX / 2);
//VARIABLE Texte
        let textWidth = 50, textHeight = 10;
// resize container to accomodate text and table
        if (textWidth > wholeWidth) {
            contWidth = this.state.sideBuff * 2 + textWidth;
        } else {
            contWidth = this.state.sideBuff * 2 + wholeWidth;
        }
//VARIABLE POUR CHAISE HORIZONTALE
        let leftStart = this.state.sizeX / 2 - tableWidth / 2 + this.state.gap + this.state.rad;
        let topPos = (this.state.posX + textHeight + this.state.topBuff) + this.state.rad;
        let bottomPos = (this.state.posY + textHeight + this.state.topBuff) + this.state.dia + this.state.gap * 2 + tableHeight + this.state.rad;
//VARIABLE POUR CHAISE VERTICALE
        let topStart = (this.state.posX + this.state.topBuff) + (wholeHeight - tableHeight) / 2 + this.state.gap + this.state.rad;
        let leftPos = tablePosX - tableWidth / 2 - this.state.gap - this.state.rad;
        let rightPos = tablePosX + tableWidth / 2 + this.state.gap + this.state.rad+this.state.sideBuff;
        return (
            <Group
                key={"rect"}
                x={this.state.x}
                y={this.state.y}
                height={parseInt(this.state.topBuff * 2 + textWidth + wholeHeight + this.state.bottomBuff)}
                width={contWidth}
                onDragEnd={this.handleDragEnd}
                name={"rectangle"}
                draggable
            >

                <Rect
                    x={leftStart+this.state.sideBuff*1.5}
                    y={parseInt((this.state.posY + textHeight + this.state.topBuff) + (wholeHeight - tableHeight) / 2)}
                    radius={50}
                    fill="white"
                    stroke={"#888888"}
                    strokeWidth={2}
                    width={tableWidth}
                    height={parseInt(tableHeight)}
                />


                {[...Array(this.state.xSeats)].map((_, i) => (// CREER chaises en haut de la table
                    <Group
                        key={"RectT"+i}
                    >

                        <Circle
                            key={numero_chaise++}
                            x={this.state.sideBuff*2.8+leftStart + this.state.dia * i + this.state.gap * i}
                            y={parseInt(topPos)}
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
                            x={this.state.sideBuff*2.8+leftStart + this.state.dia * i + this.state.gap * i - 3}
                            y={topPos - 5}
                        />
                    </Group>
                ))}
                {[...Array(this.state.ySeats)].map((_, i) => (// CREER chaises à droite de la table
                    <Group
                        key={"Rectd"+i}>
                        <Circle
                            key={numero_chaise++}
                            x={rightPos+this.state.sideBuff*2}
                            y={parseInt(topStart + this.state.topBuff + this.state.dia * i + this.state.gap * i)}
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
                            x={rightPos+this.state.sideBuff*2-7}
                            y={topStart + this.state.topBuff + this.state.dia * i + this.state.gap * i - 5}

                        />
                    </Group>
                ))}
                {this.createBottomSeats(numero_chaise,leftStart,bottomPos)}
                {this.createLeftSeats(numero_chaise+parseInt(this.state.xSeats),leftStart,topStart)}
                <Text
                    text={this.props.title}
                    x={tableWidth/10}
                    y={parseInt(wholeHeight/2+(this.state.posY+this.state.topBuff))}
                    width={textWidth}
                    height={textHeight}
                />

            </Group>);
    }
}
export default TableRect;
