import React, {Component} from 'react';
import {render} from 'react-dom';
import Konva from 'konva';
import axios from 'axios';
import RightSidebar from "./components/RightSidebar";
import SectionSeat from "./components/SectionSeat";
import TableRect from "./components/TableRect";
import TableCircle from "./components/TableCircle";
import {Circle, Group, Rect, Text} from "react-konva";
/*import {Stage, Layer,FastLayer, useStrictMode} from 'react-konva';
import TableCircle from "./components/TableCircle";
import TableRect from "./components/TableRect";
import SectionSeat from "./components/SectionSeat";

import PopupEvent from "./components/canvas-events/PopupEvent";
import TransformHandler from "./components/TransformHandler";*/

class App extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        stageScale: 1,
        stageX: 0,
        stageY: 0,
        selectedItem: null,
        newItem: '',
        isAddingItem: false,
        current_map: '',
        selectedSeat: null,
        x:200,
        y:200,
        rad : 10,
        dia : 20,
        gap : 5,
        posY : 200,
        posX : 200,
        // buffers from edges of group box
        sideBuff : 10,
        topBuff : 10,
        bottomBuff : 10,
        sizeX : 10
    };

    addNewObject = (object) => {
        if (object && (this.state.isAddingItem === false)) {
            this.setState({"isAddingItem": true});
            switch (object.type) {
                case "section":
                    this.setState({'newItem': this.renderSectionSeat(object)});
                    this.setState({"isAddingItem": false});
                    break;
                case "ronde":
                    this.setState({'newItem': this.renderTableRect(object)});
                    this.setState({"isAddingItem": false});
                    break;
                case "rectangle":
                    this.setState({'newItem': this.renderTableCircle(object)});
                    this.setState({"isAddingItem": false});
                    break;
                default:
                    this.setState({'newItem': this.renderSectionSeat(object)});
                    this.setState({"isAddingItem": false});
                    break;
            }
        }
    };
    renderSectionSeat = (row,col,nom) => {
        const rows=row,
            cols=col,
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
            textHeight = 10,
            alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
        let section = new Konva.Group({
            key:this.state.nom,
            x:this.state.x,
            y:this.state.y,
            height:parseInt(sizeX),
            width:parseInt(sizeY),
            onDragStart:this.handleDragStart,
            onDragEnd:this.handleDragEnd,
            draggable: true
        });
        let text = new Konva.Text({
            text:nom,
            x:posX+10,
            y:0,
            width:textWidth,
            height:textHeight,
        });
        for(let i=0;i<rows;i++)
        {
            for(let j=0;j<rows;j++){
                let newGroup =new Konva.Group({
                    name:alphabet[i].toUpperCase()+(j+1)
                });
                let circle =new Konva.Circle({
                    x:parseInt((posX + sideBuff) + rad + j * dia + j * gap),
                    y:parseInt(( textHeight + topBuff) + rad + i * dia + i * gap),
                    width:20,
                    height:20,
                    stroke:"#888888",
                    strokeWidth:2,
                    fill:"#A9A8B3",
                    shadowColor:'gray',
                    shadowOffsetX:2,
                    shadowOffsetY:2,
                    shadowBlur:5
                });
                let text = new Konva.Text({
                    text:j+1,
                    fontStyle:"arial",
                    fontSize:10,
                    x:(posX + sideBuff) + rad + j * dia + j * gap-3,
                    y:( textHeight + topBuff) + rad + i * dia + i * gap-5
                });
                newGroup.add(circle);
                newGroup.add(text);
                section.add(newGroup);
            }
        }
        section.add(text);
        return section;
    };
    renderTableRect = (x,y,nom) => {
        let numero_chaise = 0;
        let tableWidth = (this.state.dia) + (2 * this.state.gap); // 55 by default
        let tableHeight = tableWidth;// 55 by default

        if (x >= 1)
            tableWidth = (x * this.state.dia) + ((x + 1) * this.state.gap);
        if (y >= 1)
            tableHeight = (y * this.state.dia) + ((y + 1) * this.state.gap);
        let contWidth = 0;
        let wholeWidth = tableWidth;
        if (y > 0)
            wholeWidth = wholeWidth + this.state.dia * 2 + this.state.gap * 2;
        let wholeHeight = tableHeight;
        if (x > 0)
            wholeHeight = wholeHeight + this.state.dia * 2 + this.state.gap * 2;

        let tablePosY = (this.state.posY + this.state.topBuff *2) + (wholeHeight - tableHeight) / 2, tablePosX = (this.state.sizeX / 2);
//CONSTANTE Texte
        const textWidth = 50, textHeight = 10;
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
        let leftPos = tablePosX - tableWidth / 2 ;
        let rightPos = tablePosX + tableWidth / 2 + this.state.gap + this.state.rad+this.state.sideBuff;
        let table = new Konva.Group({
            x:this.state.x,
            y:this.state.y,
            height:parseInt(this.state.topBuff * 2 + textWidth + wholeHeight + this.state.bottomBuff),
            width:contWidth,
            onDragEnd:this.handleDragEnd,
            name:"rectangle",
            draggable:true
        });
        let tableRect = new Konva.Rect({
            x:leftStart+this.state.sideBuff*1.5,
            y:parseInt((this.state.posY + textHeight + this.state.topBuff) + (wholeHeight - tableHeight) / 2),
            radius:50,
            fill:"white",
            stroke:"#888888",
            strokeWidth:2,
            width:tableWidth,
            height:tableHeight
        });
        let text= new Konva.Text({
            text:nom,
            fontStyle: "arial",
            x:textWidth/2,
            y:parseInt(wholeHeight/2+(this.state.posY+this.state.topBuff)),
            width:textWidth,
            height:textHeight,
        });
        //render top and left seats
        for(let i=0;i<x;i++) {
            let top_group = new Konva.Group({
                name: nom + "-" + 1,
                id: numero_chaise++
            });
            let top_circle = new Konva.Circle({
                x: this.state.sideBuff * 3 + leftStart + this.state.dia * i + this.state.gap * i,
                y: parseInt(topPos),
                width: 20,
                height: 20,
                fill: "#A9A8B3",
                stroke: "#888888",
                strokeWidth: 2,
                shadowColor: 'gray',
                shadowOffsetX: 2,
                shadowOffsetY: 2,
                shadowBlur: 5
            });
            let top_text = new Konva.Text({
                text: numero_chaise,
                fontStyle: "arial",
                fontSize: 10,
                x: this.state.sideBuff * 2.8 + leftStart + this.state.dia * i + this.state.gap * i - 3,
                y: topPos - 5
            });
            top_group.add(top_circle);
            top_group.add(top_text);
            table.add(top_group);
        }
        for(let i=0;i<y;i++) {
            let right_group = new Konva.Group({
                name:nom+"-"+1,
                id:numero_chaise++

            });
            let right_circle = new Konva.Circle({
                key:numero_chaise,
                x:rightPos+this.state.sideBuff*2,
                y:parseInt(topStart + this.state.topBuff + this.state.dia * i + this.state.gap * i),
                width:20,
                height:20,
                fill:"#A9A8B3",
                stroke:"#888888",
                strokeWidth:2,
                shadowColor:'gray',
                shadowOffsetX:2,
                shadowOffsetY:2,
                shadowBlur:5
            });
            let right_text = new Konva.Text({
                text:numero_chaise,
                fontStyle:"arial",
                fontSize:10,
                x:rightPos+this.state.sideBuff*2-7,
                y:topStart + this.state.topBuff + this.state.dia * i + this.state.gap * i - 5
            });
            right_group.add(right_circle);
            right_group.add(right_text);
            table.add(right_group);
        }
        for(let j=x;j>0;j--) {
            let bottom_group = new Konva.Group({
                name: nom + "-" + 1,
                id: numero_chaise++
            });
            let bottom_circle = new Konva.Circle({
                x: this.state.sideBuff * 2.8 + leftStart + this.state.dia * (j - 1) + this.state.gap * (j - 1),
                y: bottomPos,
                width: 20,
                height: 20,
                fill: "#A9A8B3",
                stroke: "#888888",
                strokeWidth: 2,
                shadowColor: 'gray',
                shadowOffsetX: 2,
                shadowOffsetY: 2,
                shadowBlur: 5
            });
            let bottom_text = new Konva.Text({
                text: numero_chaise,
                fontStyle: "arial",
                fontSize: 10,
                x: this.state.sideBuff * 2.7 + leftStart + this.state.dia * (j - 1) + this.state.gap * (j - 1)-5,
                y: bottomPos-5
            });
            bottom_group.add(bottom_circle);
            bottom_group.add(bottom_text);
            table.add(bottom_group);
        }
        for(let j=y;j>0;j--) {
            let left_group = new Konva.Group({
                name:nom+"-"+1,

            });
            let left_circle = new Konva.Circle({
                key:numero_chaise++,
                x:leftPos+15,
                y:parseInt(topStart + this.state.topBuff + this.state.dia * (j-1) + this.state.gap * (j-1)),
                width:20,
                height:20,
                fill:"#A9A8B3",
                stroke:"#888888",
                strokeWidth:2,
                shadowColor:'gray',
                shadowOffsetX:2,
                shadowOffestY:2,
                shadowBlur:5
            });
            let left_text = new Konva.Text({
                text:numero_chaise,
                fontStyle:"arial",
                fontSize:10,
                x:leftPos+10,
                y:topStart + this.state.topBuff + this.state.dia * (j-1) + this.state.gap * (j-1)-5
            });
            left_group.add(left_circle);
            left_group.add(left_text);
            table.add(left_group);

        }
        table.add(tableRect);
        table.add(text);
        return table;
    };
    renderTableCircle = (seats,nom) => {
        const deg = (2*Math.PI)/seats;//initialisation Nombre chaise.
        let tableRad = this.state.rad + this.state.gap;
        if (seats >= 4 && seats < 6)
            tableRad = this.state.rad*1.5;
        if (seats >= 6 && seats < 9)
            tableRad = this.state.rad*2;
        if (seats >= 9 && seats < 13)
            tableRad = this.state.rad*3.5;
        if (seats >= 13 && seats <15)
            tableRad = this.state.rad*4.2;
        if (seats >= 15 && seats <17)
            tableRad = this.state.rad*4.5;
        if (seats >= 17 && seats <22)
            tableRad = this.state.rad*6;
        if (seats >= 22 && seats <25)
            tableRad = this.state.rad*10;
        let wholeDia = tableRad * 2 + this.state.dia*2 + this.state.gap*2;
// resize container to accomodate text and table
        let textWidth = 50, textHeight = 10;
        let contWidth =0;
        if (textWidth > wholeDia) {
            contWidth = this.state.sideBuff*2 + textWidth;
        } else {
            contWidth = this.state.sideBuff*2 + wholeDia;
        }
        let tableLeft=posX + contWidth/2,tableTop=(textWidth + textHeight + this.state.topBuff) + this.state.dia + this.state.gap;
        let group= new Konva.Group({
            x:this.state.x,
            y:this.state.y,
            height:this.state.topBuff * 2 + textWidth + this.state.bottomBuff,
            width:contWidth,
            visible:true,
            draggable:true,
            onDragEnd:this.handleDragEnd,
            onClick:this.handleClick,
            fill:"#A9A8B3",
            });
        let tableCircle=new Konva.Circle({
            radius:tableRad,
            x:this.state.posX + contWidth/2,
            y: (tableRad+textWidth + textHeight + this.state.topBuff) + this.state.dia + this.state.gap,
            fill:"white",
            stroke:"#444444",
            strokeWidth:2
        });
        let text = new Konva.Text({
            text:i+1,
            fontStyle:"Tahoma, Geneva, sans-serif",
            fontSize:10,
            x:Math.cos(deg*i)*(tableRad + this.state.gap + this.state.rad) + tableLeft-5,
            y:Math.sin(deg*i)*(tableRad + this.stategap + this.state.rad) + (tableTop + tableRad-5)
        });
        for(let i=0;i<seats;i++){
            let c_group=new Konva.Group({});
            let circle=new Konva.Circle({
                x:Math.cos(deg*i)*(tableRad + gap + rad) + tableLeft,
                y:Math.sin(deg*i)*(tableRad + gap + rad) + (tableTop + tableRad),
                width:20,
                height:20,
                fill:"#A9A8B3",
                stroke:"#888888",
                strokeWidth:2,
                shadowColor:'gray',
                shadowOffsetX:2,
                shadowOffsetY:2,
                shadowBlur:5
            });
            let text=new Konva.Text({
                text:i+1,
                fontStyle:"Tahoma, Geneva, sans-serif",
                fontSize:10,
                x:Math.cos(deg*i)*(tableRad + gap + rad) + tableLeft-5,
                y:Math.sin(deg*i)*(tableRad + gap + rad) + (tableTop + tableRad-5)
            });
            c_group.add(circle);
            c_group.add(text);
            group.add(c_group);
        }
        group.add(tableCircle);
        group.add(text);
    };
    componentDidMount() {
        this.loadStage();

    }
    componentDidUpdate() {
    }

    saveStage = () => {

        console.log(this.stageRef.toJSON()); //Données sur le canvas
        axios.post(
            '/symfony3.4/web/api/event/update-map/395', {
                data_map: JSON.parse(this.stageRef.toJSON())
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            }
        );
    };
    
    loadStage = () => {
        /*axios.get(
            '/symfony3.4/web/api/event/get-map/395')
            .then(function (response) {
                let width = window.innerWidth;
                let height = window.innerHeight;
                let tween = null;

            })
            .catch(function (error) {
                    console.log(error);
                }
            );*/

        let data="{\"attrs\":{\"width\":1280,\"height\":686,\"scaleX\":1.0201,\"scaleY\":1.0201,\"x\":-14.391600000000063,\"y\":-8.019899999999998},\"className\":\"Stage\",\"children\":[{\"attrs\":{},\"className\":\"Layer\",\"children\":[{\"attrs\":{\"x\":200,\"y\":200,\"height\":385,\"width\":325,\"name\":\"rectangle\",\"draggable\":true},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-122.5,\"y\":245,\"radius\":50,\"fill\":\"white\",\"stroke\":\"#888888\",\"width\":255,\"height\":255},\"className\":\"Rect\"},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-107.5,\"y\":230,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"1\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-110.5,\"y\":225},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-82.5,\"y\":230,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"2\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-85.5,\"y\":225},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-57.5,\"y\":230,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"3\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-60.5,\"y\":225},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-32.5,\"y\":230,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"4\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-35.5,\"y\":225},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-7.5,\"y\":230,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"5\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-10.5,\"y\":225},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":17.5,\"y\":230,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"6\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":14.5,\"y\":225},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":42.5,\"y\":230,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"7\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":39.5,\"y\":225},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":67.5,\"y\":230,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"8\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":64.5,\"y\":225},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":92.5,\"y\":230,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"9\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":89.5,\"y\":225},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":117.5,\"y\":230,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"10\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":114.5,\"y\":225},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":147.5,\"y\":260,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"11\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":140.5,\"y\":255},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":147.5,\"y\":285,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"12\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":140.5,\"y\":280},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":147.5,\"y\":310,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"13\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":140.5,\"y\":305},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":147.5,\"y\":335,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"14\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":140.5,\"y\":330},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":147.5,\"y\":360,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"15\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":140.5,\"y\":355},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":147.5,\"y\":385,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"16\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":140.5,\"y\":380},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":147.5,\"y\":410,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"17\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":140.5,\"y\":405},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":147.5,\"y\":435,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"18\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":140.5,\"y\":430},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":147.5,\"y\":460,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"19\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":140.5,\"y\":455},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":147.5,\"y\":485,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"20\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":140.5,\"y\":480},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-107.5,\"y\":515,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"21\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-114.5,\"y\":510},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-82.5,\"y\":515,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"22\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-89.5,\"y\":510},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-57.5,\"y\":515,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"23\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-64.5,\"y\":510},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-32.5,\"y\":515,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"24\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-39.5,\"y\":510},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-7.5,\"y\":515,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"25\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-14.5,\"y\":510},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":17.5,\"y\":515,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"26\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":10.5,\"y\":510},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":42.5,\"y\":515,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"27\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":35.5,\"y\":510},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":67.5,\"y\":515,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"28\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":60.5,\"y\":510},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":92.5,\"y\":515,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"29\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":85.5,\"y\":510},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":117.5,\"y\":515,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"30\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":110.5,\"y\":510},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-137.5,\"y\":260,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"31\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-144.5,\"y\":255},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-137.5,\"y\":285,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"32\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-144.5,\"y\":280},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-137.5,\"y\":310,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"33\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-144.5,\"y\":305},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-137.5,\"y\":335,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"34\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-144.5,\"y\":330},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-137.5,\"y\":360,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"35\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-144.5,\"y\":355},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-137.5,\"y\":385,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"36\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-144.5,\"y\":380},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-137.5,\"y\":410,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"37\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-144.5,\"y\":405},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-137.5,\"y\":435,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"38\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-144.5,\"y\":430},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-137.5,\"y\":460,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"39\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-144.5,\"y\":455},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":-137.5,\"y\":485,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"40\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":-144.5,\"y\":480},\"className\":\"Text\"}]},{\"attrs\":{\"fill\":\"black\",\"text\":\"Table 1\",\"y\":362.5,\"width\":50,\"height\":10},\"className\":\"Text\"}]},{\"attrs\":{\"x\":200,\"y\":200,\"height\":80,\"width\":140,\"visible\":true,\"draggable\":true,\"fill\":\"green\"},\"className\":\"Group\",\"children\":[{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":320,\"y\":130,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"1\",\"fontStyle\":\"Tahoma, Geneva, sans-serif\",\"fontSize\":10,\"x\":315,\"y\":125},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":310.45084971874735,\"y\":159.38926261462365,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"2\",\"fontStyle\":\"Tahoma, Geneva, sans-serif\",\"fontSize\":10,\"x\":305.45084971874735,\"y\":154.38926261462365},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":285.45084971874735,\"y\":177.55282581475768,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"3\",\"fontStyle\":\"Tahoma, Geneva, sans-serif\",\"fontSize\":10,\"x\":280.45084971874735,\"y\":172.55282581475768},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":254.54915028125262,\"y\":177.55282581475768,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"4\",\"fontStyle\":\"Tahoma, Geneva, sans-serif\",\"fontSize\":10,\"x\":249.54915028125262,\"y\":172.55282581475768},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":229.54915028125265,\"y\":159.38926261462365,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"5\",\"fontStyle\":\"Tahoma, Geneva, sans-serif\",\"fontSize\":10,\"x\":224.54915028125265,\"y\":154.38926261462365},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":220,\"y\":130,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"6\",\"fontStyle\":\"Tahoma, Geneva, sans-serif\",\"fontSize\":10,\"x\":215,\"y\":125},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":229.54915028125262,\"y\":100.61073738537635,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"7\",\"fontStyle\":\"Tahoma, Geneva, sans-serif\",\"fontSize\":10,\"x\":224.54915028125262,\"y\":95.61073738537635},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":254.54915028125262,\"y\":82.44717418524232,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"8\",\"fontStyle\":\"Tahoma, Geneva, sans-serif\",\"fontSize\":10,\"x\":249.54915028125262,\"y\":77.44717418524232},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":285.45084971874735,\"y\":82.44717418524232,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"9\",\"fontStyle\":\"Tahoma, Geneva, sans-serif\",\"fontSize\":10,\"x\":280.45084971874735,\"y\":77.44717418524232},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":310.45084971874735,\"y\":100.61073738537632,\"radius\":10,\"fill\":\"#A9A8B3\",\"stroke\":\"#888888\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"10\",\"fontStyle\":\"Tahoma, Geneva, sans-serif\",\"fontSize\":10,\"x\":305.45084971874735,\"y\":95.61073738537632},\"className\":\"Text\"}]},{\"attrs\":{\"radius\":35,\"x\":270,\"y\":130,\"fill\":\"white\",\"stroke\":\"#444444\"},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"Table 1\",\"x\":258,\"y\":120,\"width\":50,\"height\":10},\"className\":\"Text\"}]},{\"attrs\":{\"x\":200,\"y\":200,\"height\":140,\"width\":140,\"draggable\":true},\"className\":\"Group\",\"children\":[{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":220,\"y\":30,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"1\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":217,\"y\":25},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":245,\"y\":30,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"2\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":242,\"y\":25},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":270,\"y\":30,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"3\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":267,\"y\":25},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":295,\"y\":30,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"4\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":292,\"y\":25},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":320,\"y\":30,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"5\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":317,\"y\":25},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":220,\"y\":55,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"1\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":217,\"y\":50},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":245,\"y\":55,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"2\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":242,\"y\":50},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":270,\"y\":55,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"3\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":267,\"y\":50},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":295,\"y\":55,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"4\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":292,\"y\":50},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":320,\"y\":55,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"5\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":317,\"y\":50},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":220,\"y\":80,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"1\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":217,\"y\":75},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":245,\"y\":80,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"2\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":242,\"y\":75},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":270,\"y\":80,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"3\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":267,\"y\":75},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":295,\"y\":80,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"4\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":292,\"y\":75},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":320,\"y\":80,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"5\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":317,\"y\":75},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":220,\"y\":105,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"1\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":217,\"y\":100},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":245,\"y\":105,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"2\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":242,\"y\":100},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":270,\"y\":105,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"3\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":267,\"y\":100},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":295,\"y\":105,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"4\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":292,\"y\":100},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":320,\"y\":105,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"5\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":317,\"y\":100},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":220,\"y\":130,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"1\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":217,\"y\":125},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":245,\"y\":130,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"2\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":242,\"y\":125},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":270,\"y\":130,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"3\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":267,\"y\":125},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":295,\"y\":130,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"4\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":292,\"y\":125},\"className\":\"Text\"}]},{\"attrs\":{},\"className\":\"Group\",\"children\":[{\"attrs\":{\"x\":320,\"y\":130,\"radius\":10,\"stroke\":\"#888888\",\"fill\":\"#A9A8B3\",\"shadowColor\":\"gray\",\"shadowOffsetX\":2,\"shadowOffsetY\":2,\"shadowBlur\":5},\"className\":\"Circle\"},{\"attrs\":{\"fill\":\"black\",\"text\":\"5\",\"fontStyle\":\"arial\",\"fontSize\":10,\"x\":317,\"y\":125},\"className\":\"Text\"}]},{\"attrs\":{\"fill\":\"black\",\"text\":\"Section 1\",\"x\":210,\"width\":100,\"height\":10},\"className\":\"Text\"}]}]}]}";
        let stage = Konva.Node.create(data,'stage-container');
        //stage.children.cache();
        let newSection = this.renderSectionSeat(2,2,"Test");
        let newRect = this.renderTableRect(3,3,"Test");
        let newRect2 = this.renderTableRect(8,6,"Test");
        let circle = this.renderTableCircle(5,"Test");
        stage.children.add(newSection);
        stage.children.add(newRect);
        stage.children.add(newRect2);
        stage.children.add(circle);
        stage.batchDraw();
    };
    handleLayerChange = () => {
      this.state.isAddingItem = !this.state.isAddingItem;
      this.state.newItem = '';
      console.log("Changé");
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

        stage.scale({x: newScale, y: newScale});

        this.setState({
            stageScale: newScale,
            stageX:
                -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            stageY:
                -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
        });
    };
    hoverSeat = e => {
        this.setState({
           selectedSeat : e
    });
    };
    handleSelected = e => {
        this.setState({'selectedItem': e});
        console.log(e.target);
    };

    render() {
        return (
            <div className="row">
                <div id="stage-container" className="col-sm-9">

                </div>
                <div className="col-sm-3 sidebar-right">
                    <RightSidebar addNewObject={this.addNewObject}/>
                </div>
            </div>

        );
    }
}
render(
    <App/>
    , document.getElementById('root')
);


