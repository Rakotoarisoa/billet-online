import React, {Component} from 'react';
import {render} from 'react-dom';
import Konva from 'konva';
import axios from 'axios';
import _ from "lodash";
import RightSidebar from "./components/RightSidebar";

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
        x: 200,
        y: 200,
        rad: 10,
        dia: 20,
        gap: 5,
        posY: 200,
        posX: 200,
        // buffers from edges of group box
        sideBuff: 10,
        topBuff: 10,
        bottomBuff: 10,
        sizeX: 10,
        data_map: [],
        saveCanvas: false,
        stage: null,
        mainLayer: null
    };
    updateObject=(object)=> {
        //find object into data_map state
        let data = this.state.data_map;
        data.find((el,i)=> {
            if(el.nom === object.nom){
                data[i]=object;
                console.log(data[i]);
                this.setState({'data_map':data});
            }
        });


    };
    addNewObjectFromSidebar = (object) => {
        let data_map = this.state.data_map;
        data_map.push(object);
        this.setState({'data_map': data_map});
        this.addNewObject(object);
        this.loadStage();
    };
    addNewObject = (object) => {
        let object_names = [];
        _.forEach(this.state.data_map, function (k, v) {
            object_names.push(k.nom);
        });
        if (object_names && object) {
            switch (object.type) {
                case "section":
                    return this.renderSectionSeat(object.xSeats, object.ySeats, object.nom);
                case "rectangle":
                    return this.renderTableRect(object.xSeats, object.ySeats, object.nom);
                case "ronde":
                    return this.renderTableCircle(object.chaises, object.nom);
                default:
                    return this.renderSectionSeat(object.xSeats, object.ySeats, object.nom);
            }
        }
        console.log(object);
    };
    renderSectionSeat = (row, col, nom, transformer = null) => {
        const rows = row,
            cols = col,
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
            name: this.state.nom,
            x: this.state.x,
            y: this.state.y,
            height: parseInt(sizeX),
            width: parseInt(sizeY),
            draggable: true
        });
        let text = new Konva.Text({
            text: nom,
            x: posX + 10,
            y: 0,
            width: textWidth,
            height: textHeight,
        });
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let newGroup = new Konva.Group({
                    name: alphabet[i].toUpperCase() + (j + 1)
                });
                let circle = new Konva.Circle({
                    x: parseInt((posX + sideBuff) + rad + j * dia + j * gap),
                    y: parseInt((textHeight + topBuff) + rad + i * dia + i * gap),
                    width: 20,
                    height: 20,
                    stroke: "#888888",
                    strokeWidth: 2,
                    fill: "#A9A8B3",
                    shadowColor: 'gray',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                    shadowBlur: 5
                });
                let text = new Konva.Text({
                    text: j + 1,
                    fontStyle: "arial",
                    fontSize: 10,
                    x: (posX + sideBuff) + rad + j * dia + j * gap - 3,
                    y: (textHeight + topBuff) + rad + i * dia + i * gap - 5
                });
                newGroup.add(circle);
                newGroup.add(text);
                section.add(newGroup);
            }
        }
        section.add(text);
        section.cache();
        section.on('dblclick', (e) => {
            console.log(e.target);
            //transformer.detach();
            transformer.attachTo(section);
        });
        section.on('dragend',(e)=>{
            let data ={nom:nom,x:e.target.x(),y:e.target.y(),xSeats:row,ySeats:col,number_seats:(row*col)};
            this.updateObject(data);
        });
        return section;
    };
    renderTableRect = (x, y, nom) => {
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

        let tablePosY = (this.state.posY + this.state.topBuff * 2) + (wholeHeight - tableHeight) / 2,
            tablePosX = (this.state.sizeX / 2);
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
        let leftPos = tablePosX - tableWidth / 2;
        let rightPos = tablePosX + tableWidth / 2 + this.state.gap + this.state.rad + this.state.sideBuff;
        let table = new Konva.Group({
            x: this.state.x,
            y: this.state.y,
            height: parseInt(this.state.topBuff * 2 + textWidth + wholeHeight + this.state.bottomBuff),
            width: contWidth,
            onDragEnd: this.handleDragEnd,
            name: "rectangle",
            draggable: true
        });
        let tableRect = new Konva.Rect({
            x: leftStart + this.state.sideBuff * 1.5,
            y: parseInt((this.state.posY + textHeight + this.state.topBuff) + (wholeHeight - tableHeight) / 2),
            radius: 50,
            fill: "white",
            stroke: "#888888",
            strokeWidth: 2,
            width: tableWidth,
            height: tableHeight
        });
        let text = new Konva.Text({
            text: nom,
            fontStyle: "arial",
            x: textWidth / 2,
            y: parseInt(wholeHeight / 2 + (this.state.posY + this.state.topBuff)),
            width: textWidth,
            height: textHeight,
        });
        //render top and left seats
        for (let i = 0; i < x; i++) {
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
        for (let i = 0; i < y; i++) {
            let right_group = new Konva.Group({
                name: nom + "-" + 1,
                id: numero_chaise++

            });
            let right_circle = new Konva.Circle({
                key: numero_chaise,
                x: rightPos + this.state.sideBuff * 2,
                y: parseInt(topStart + this.state.topBuff + this.state.dia * i + this.state.gap * i),
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
            let right_text = new Konva.Text({
                text: numero_chaise,
                fontStyle: "arial",
                fontSize: 10,
                x: rightPos + this.state.sideBuff * 2 - 7,
                y: topStart + this.state.topBuff + this.state.dia * i + this.state.gap * i - 5
            });
            right_group.add(right_circle);
            right_group.add(right_text);
            table.add(right_group);
        }
        for (let j = x; j > 0; j--) {
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
                x: this.state.sideBuff * 2.7 + leftStart + this.state.dia * (j - 1) + this.state.gap * (j - 1) - 5,
                y: bottomPos - 5
            });
            bottom_group.add(bottom_circle);
            bottom_group.add(bottom_text);
            table.add(bottom_group);
        }
        for (let j = y; j > 0; j--) {
            let left_group = new Konva.Group({
                name: nom + "-" + 1,

            });
            let left_circle = new Konva.Circle({
                key: numero_chaise++,
                x: leftPos + 15,
                y: parseInt(topStart + this.state.topBuff + this.state.dia * (j - 1) + this.state.gap * (j - 1)),
                width: 20,
                height: 20,
                fill: "#A9A8B3",
                stroke: "#888888",
                strokeWidth: 2,
                shadowColor: 'gray',
                shadowOffsetX: 2,
                shadowOffestY: 2,
                shadowBlur: 5
            });
            let left_text = new Konva.Text({
                text: numero_chaise,
                fontStyle: "arial",
                fontSize: 10,
                x: leftPos + 10,
                y: topStart + this.state.topBuff + this.state.dia * (j - 1) + this.state.gap * (j - 1) - 5
            });
            left_group.add(left_circle);
            left_group.add(left_text);
            table.add(left_group);

        }
        table.add(tableRect);
        table.add(text);
        return table;
    };
    renderTableCircle = (seats, nom) => {
        const deg = (2 * Math.PI) / seats;//initialisation Nombre chaise.
        let tableRad = this.state.rad + this.state.gap;
        if (seats >= 4 && seats < 6)
            tableRad = this.state.rad * 1.5;
        if (seats >= 6 && seats < 9)
            tableRad = this.state.rad * 2;
        if (seats >= 9 && seats < 13)
            tableRad = this.state.rad * 3.5;
        if (seats >= 13 && seats < 15)
            tableRad = this.state.rad * 4.2;
        if (seats >= 15 && seats < 17)
            tableRad = this.state.rad * 4.5;
        if (seats >= 17 && seats < 22)
            tableRad = this.state.rad * 6;
        if (seats >= 22 && seats < 25)
            tableRad = this.state.rad * 10;
        let wholeDia = tableRad * 2 + this.state.dia * 2 + this.state.gap * 2;
// resize container to accomodate text and table
        let textWidth = 50, textHeight = 10;
        let contWidth = 0;
        if (textWidth > wholeDia) {
            contWidth = this.state.sideBuff * 2 + textWidth;
        } else {
            contWidth = this.state.sideBuff * 2 + wholeDia;
        }
        let tableLeft = this.state.posX + contWidth / 2,
            tableTop = (textWidth + textHeight + this.state.topBuff) + this.state.dia + this.state.gap;
        let group = new Konva.Group({
            x: this.state.x,
            y: this.state.y,
            height: this.state.topBuff * 2 + textWidth + this.state.bottomBuff,
            width: contWidth,
            visible: true,
            draggable: true,
            onDragEnd: this.handleDragEnd,
            onClick: this.handleClick,
            fill: "#A9A8B3",
        });
        let tableCircle = new Konva.Circle({
            radius: tableRad,
            x: this.state.posX + contWidth / 2,
            y: (tableRad + textWidth + textHeight + this.state.topBuff) + this.state.dia + this.state.gap,
            fill: "white",
            stroke: "#444444",
            strokeWidth: 2
        });
        let text = new Konva.Text({
            text: nom,
            fontStyle: "arial",
            x: this.state.posX + contWidth / 2 - 12,
            y: (tableRad + textWidth + this.state.topBuff) + this.state.dia + this.state.gap,
            width: textWidth / 2,
            height: textHeight
        });
        for (let i = 0; i < seats; i++) {
            let c_group = new Konva.Group({});
            let circle = new Konva.Circle({
                x: Math.cos(deg * i) * (tableRad + this.state.gap + this.state.rad) + tableLeft,
                y: Math.sin(deg * i) * (tableRad + this.state.gap + this.state.rad) + (tableTop + tableRad),
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
            let text = new Konva.Text({
                text: i + 1,
                fontStyle: "Tahoma, Geneva, sans-serif",
                fontSize: 10,
                x: Math.cos(deg * i) * (tableRad + this.state.gap + this.state.rad) + tableLeft - 5,
                y: Math.sin(deg * i) * (tableRad + this.state.gap + this.state.rad) + (tableTop + tableRad - 5)
            });
            c_group.add(circle);
            c_group.add(text);
            group.add(c_group);
        }
        group.add(tableCircle);
        group.add(text);
        return group;
    };
    componentDidMount() {
        axios.get(
            '/symfony3.4/web/api/event/get-map/395')
            .then( (response)=> {
                this.setState({'data_map':response.data});
                this.loadStage();
            })
            .catch(function (error) {
                    console.log(error);
            });
    }
    componentDidUpdate() {
        if (this.state.stage) {
            let stage = this.state.stage;
            stage.batchDraw();
            // this.setState({'stage':stage});
        }
    }
    saveCanvas = (save) => {
        this.setState({'saveCanvas': save});
        this.saveStage();
        setTimeout(() => {
            this.setState({'saveCanvas': !save})
        }, 3000);
    };
    saveStage = () => {
        if (this.state.saveCanvas) {
            let data = this.state.data_map;
            data = JSON.stringify(data);
            axios.post(
                '/symfony3.4/web/api/event/update-map/395', {
                    data_map: JSON.parse(data)
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                        console.log(error);
                    }
                );
        }
    };
    loadStage = () => {
        let data = this.state.data_map;
        let stage = new Konva.Stage({
            container: 'stage-container',
            width: window.innerWidth,
            height: window.innerHeight
        });
        let layer = new Konva.Layer();
        let dragLayer = new Konva.Layer();
        stage.add(layer);
        stage.add(dragLayer);
        let transformer = new Konva.Transformer({
            name: 'Transformer',
            rotateAnchorOffset: 5,
            enabledAnchors: [''],
            borderStroke: "#888",
            resizeEnabled: false,
            rotationSnaps: [0, 45, 90, 180, 270],
        });
        layer.add(transformer);
        data.forEach((obj, v) => {
            let newObject = this.addNewObject(obj);
            newObject.cache();
            layer.add(newObject);
        });

        stage.on('click', (e) => {

            if (e.target.parent == null) {
                console.log('destroyed');
                transformer.detach();
            }
        });
        stage.draw();
        this.setState({'stage': stage,'mainLayer':layer});
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
        alert('Drag');
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
            selectedSeat: e
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
                    <RightSidebar addNewObject={this.addNewObjectFromSidebar} saveCanvas={this.saveCanvas}/>
                </div>
            </div>
        );
    }
}

render(
    <App/>
    , document.getElementById('root')
);


