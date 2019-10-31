import React, {Component} from 'react';
import {render} from 'react-dom';
import Konva from 'konva';
import axios from 'axios';
import RightSidebar from "./components/RightSidebar";
import {ToastContainer} from "react-toastr";
import DeleteContext from "./components/contexts/DeleteContext";
import Button from "@material-ui/core/Button";
import {EventProvider} from "./components/contexts/EventContext";

let container;

class SetMap extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        stageScale: 1,
        stageX: 1,
        stageY: 1,
        scaleX: 1,
        scaleY: 1,
        selectedItem: null,
        isAddingItem: false,
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
        data_is_empty: true,
        saveCanvas: false,
        stage: null,
        focusObject: null,
        initWidth: 947,
        initHeight: 947,
        number_seats: 0,
        max_leftX:window.innerWidth*3/4,
        min_leftX:0,
        max_leftY:window.innerHeight,
        min_leftY:0
    };
    //Enregistrer les déplacements de l'objet
    updateObject = (object) => {
        //find object into data_map state
        let data = this.state.data_map;
        data.find((el, i) => {
            if (el.id === object.id) {
                data[i] = object;
                this.setState({'data_map': data}, () => {
                    this.loadStage(object);
                });
            }
        });
    };
    //Ajouter objet via Panneau Latéral
    addNewObjectFromSidebar = (object) => {
        let data_map = this.state.data_map;
        object.id = data_map.length;
        data_map.push(object);
        this.setState({'data_map': data_map});
        this.addNewObject(object);
        this.loadStage();
    };
    //Ajouter Object ( selon type)
    addNewObject = (object, transformer) => {
        if (object) {
            switch (object.type) {
                case "section":
                    return this.renderSectionSeat(object, transformer);
                case "rectangle":
                    return this.renderTableRect(object, transformer);
                case "ronde":
                    return this.renderTableCircle(object, transformer);
                case "zone":
                    return this.renderZone(object, transformer);
                default:
                    return this.renderSectionSeat(object, transformer);
            }
        }
    };
    //Switch Data
    switchData = () => {
        this.setState({'data_is_empty': !this.state.data_is_empty}, () => {
            container.success("Commencer à construire votre première table", 'Info', {closeButton: true});
        });
    };
    //Ajouter objet type zone
    renderZone = (object, transformer, width = 200, height = 200) => {
        let zone = new Konva.Group({
            id: object.id,
            name: object.nom.toString(),
            x: object.x,
            y: object.y,
            height: height,
            width: width,
            draggable: false,
            rotation: object.rotation
        });
        let table = null;
        if (object.forme === "cercle") {
            table = new Konva.Circle({
                x: width / 2,
                y: width / 2,
                radius: 50,
                fill: object.color.toString(),
                stroke: "#888888",
                strokeWidth: 2
            });
        } else if (object.forme === "rectangle") {
            table = new Konva.Rect({
                x: 0,
                y: 0,
                radius: 50,
                fill: object.color.toString(),
                stroke: "#888888",
                strokeWidth: 2,
                width: 200,
                height: 200
            });
        }

        let text = new Konva.Text({
            text: object.nom,
            x: width / 2 - 50 / 2,
            y: height / 2,
            width: 50,
            height: 10,
        });
        zone.add(table);
        zone.add(text);
        zone.on('click tap', (e) => {
            transformer.attachTo(zone);
            this.setState({
                'selectedItem':
                    {
                        id: object.id,
                        nom: object.nom,
                        x: object.x,
                        y: object.y,
                        forme: object.forme,
                        color: object.color,
                        type: 'zone',
                        rotation: zone.rotation()
                    },
                'focusObject': null
            }, () => {
                zone.draggable(true);
                transformer.resizeEnabled(true);
                zone.moveToTop();
                zone.getLayer().draw();
            });
        });
        zone.on('dragend transformend', (e) => {
            let data = {
                id: object.id,
                nom: object.nom,
                x: e.target.x(),
                y: e.target.y(),
                forme: object.forme,
                color: object.color,
                width: zone.width(),
                height: zone.height(),
                type: 'zone',
                rotation: zone.rotation(),
            };
            transformer.resizeEnabled(true);
            this.updateObject(data);
        });
        zone.on('resize transform', (e) => {
            zone = this.renderZone(object, transformer, zone.getAbsoluteScale().x * zone.width(), zone.getAbsoluteScale().y * zone.height());
            zone.position({x: e.target.x(), y: e.target.y()});
            let data = {
                id: object.id,
                nom: object.nom,
                x: e.target.x(),
                y: e.target.y(),
                forme: object.forme,
                color: object.color,
                width: zone.width(),
                height: zone.height(),
                type: 'zone',
                rotation: zone.rotation(),
            };
            this.updateObject(data);
            zone.getLayer().batchDraw();
        });
        return zone;

    };
    //Ajouter objet Type Section
    renderSectionSeat = (object, transformer = null) => {
        const rows = object.xSeats,
            cols = object.ySeats,
            rad = 10,
            dia = rad * 2,
            gap = 5,
            sideBuff = 10,
            topBuff = 10,
            bottomBuff = 10,
            sizeX = sideBuff * 2 + cols * dia + (cols - 1) * gap,
            sizeY = topBuff + bottomBuff + rows * dia + (rows - 1) * gap,
            textWidth = 100,
            textHeight = 10,
            alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
        let section = new Konva.Group({
            id: object.id,
            name: object.nom.toString(),
            x: object.x,
            y: object.y,
            height: parseInt(sizeX),
            width: parseInt(sizeY),
            draggable: false,
            rotation: object.rotation
        });
        let text = new Konva.Text({
            text: object.nom,
            x: this.state.posX + 10,
            y: 0,
            width: textWidth,
            height: textHeight,
        });
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                /** Deleted Seats*/
                let deleted = object.deleted_seats;
                let skip = false;
                if (deleted) {
                    deleted.forEach((del) => {
                        if (del === (alphabet[i].toUpperCase()) + (j + 1)) {
                            skip = true;
                        }
                    });
                }
                if (skip) {
                    skip = !skip;
                    if (j === cols - 1) {
                        let rowTitle = new Konva.Text({
                            text: alphabet[i].toUpperCase(),
                            fontStyle: "arial",
                            fontSize: 10,
                            x: (this.state.posX + sideBuff) + rad + (j + 1) * dia + (j + 1) * gap - 10,
                            y: (textHeight + topBuff) + rad + i * dia + i * gap - 5
                        });
                        section.add(rowTitle);
                    }
                    continue;
                }
                /** End Deleted Seats*/
                let newGroup = new Konva.Group({
                    name: alphabet[i].toUpperCase() + (j + 1),
                    x: parseInt((this.state.posX + sideBuff) + rad + j * dia + j * gap),
                    y: parseInt((textHeight + topBuff) + rad + i * dia + i * gap)
                });
                let circle = new Konva.Circle({
                    x: 0,
                    y: 0,
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
                    x: -3,
                    y: -5
                });
                text.on('transform', () => {
                    console.log('tranformed');
                });
                newGroup.add(circle);
                newGroup.add(text);
                section.add(newGroup);
                this.setStageDimensions(newGroup);
                if (j === cols - 1) {
                    let rowTitle = new Konva.Text({
                        text: alphabet[i].toUpperCase(),
                        fontStyle: "arial",
                        fontSize: 10,
                        x: (this.state.posX + sideBuff) + rad + (j + 1) * dia + (j + 1) * gap - 10,
                        y: (textHeight + topBuff) + rad + i * dia + i * gap - 5
                    });
                    section.add(rowTitle);
                }
            }
        }
        section.add(text);
        section.cache();
        section.on('click tap', (e) => {
            transformer.attachTo(section);
            this.setState({
                'selectedItem':
                    {
                        id: object.id,
                        nom: object.nom,
                        x: object.x,
                        y: object.y,
                        xSeats: object.xSeats,
                        ySeats: object.ySeats,
                        type: 'section',
                        rotation: section.rotation(),
                        number_seats: (object.xSeats * object.ySeats) - (object.deleted_seats.length),
                        deleted_seats: object.deleted_seats
                    },
                'focusObject': null
            }, () => {
                section.draggable(true);
                section.moveToTop();
                section.getLayer().draw();
            });
        });
        section.on('dragend transformend', (e) => {
            let data = {
                id: object.id,
                nom: object.nom,
                x: e.target.x(),
                y: e.target.y(),
                xSeats: object.xSeats,
                ySeats: object.ySeats,
                type: 'section',
                rotation: section.rotation(),
                number_seats: (object.xSeats * object.ySeats) - object.deleted_seats.length
            };
            if (object.deleted_seats) {
                data.deleted_seats = object.deleted_seats;
            }
            this.updateObject(data);
        });
        section.on('transform', () => {
            let text_list = section.find(node => {
                return node.getAttr("text") && !node.hasChildren()
            });
            text_list.forEach((text) => {
                text.fill("red");
                section.getLayer().batchDraw();
            });
        });
        return section;
    };
    //Ajouter objet Type Table Rectangle
    renderTableRect = (object, transformer = null) => {
        let x = object.xSeats, y = object.ySeats, deleted = object.deleted_seats;
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
            id: object.id,
            x: object.x,
            y: object.y,
            height: parseInt(this.state.topBuff * 2 + textWidth + wholeHeight + this.state.bottomBuff),
            width: contWidth,
            name: object.nom.toString(),
            draggable: false,
            rotation: object.rotation
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
            text: object.nom,
            fontStyle: "arial",
            x: textWidth / 2,
            y: parseInt(wholeHeight / 2 + (this.state.posY + this.state.topBuff)),
            width: textWidth,
            height: textHeight,
        });
        //render top and left seats
        for (let i = 0; i < x; i++) {
            if (deleted && deleted.includes(i + 1)) {
                numero_chaise++;
                continue;
            }
            let top_group = new Konva.Group({
                name: (numero_chaise + 1).toString(),
                id: numero_chaise++,
                x: this.state.sideBuff * 3 + leftStart + this.state.dia * i + this.state.gap * i,
                y: parseInt(topPos)
            });
            let top_circle = new Konva.Circle({
                x: 0,
                y: 0,
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
                x: -3,
                y: -5
            });
            top_group.add(top_circle);
            top_group.add(top_text);
            this.setStageDimensions(top_group);
            table.add(top_group);
        }
        for (let i = 0; i < y; i++) {
            if (deleted && deleted.includes(numero_chaise + 1)) {
                numero_chaise++;
                continue;
            }
            let right_group = new Konva.Group({
                name: (numero_chaise + 1).toString(),
                id: numero_chaise++,
                x: rightPos + this.state.sideBuff * 2,
                y: parseInt(topStart + this.state.topBuff + this.state.dia * i + this.state.gap * i)

            });
            let right_circle = new Konva.Circle({
                key: numero_chaise,
                x: 0,
                y: 0,
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
                x: -7,
                y: -5
            });
            right_group.add(right_circle);
            right_group.add(right_text);
            this.setStageDimensions(right_group);
            table.add(right_group);
        }
        for (let j = x; j > 0; j--) {
            if (deleted && deleted.includes(numero_chaise + 1)) {
                numero_chaise++;
                continue;
            }
            let bottom_group = new Konva.Group({
                name: (numero_chaise + 1).toString(),
                id: numero_chaise++,
                x: this.state.sideBuff * 3 + leftStart + this.state.dia * (j - 1) + this.state.gap * (j - 1),
                y: bottomPos
            });
            let bottom_circle = new Konva.Circle({
                x: 0,
                y: 0,
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
                x: -5,
                y: -5
            });
            bottom_group.add(bottom_circle);
            bottom_group.add(bottom_text);
            this.setStageDimensions(bottom_group);
            table.add(bottom_group);
        }
        for (let j = y; j > 0; j--) {
            if (deleted && deleted.includes(numero_chaise + 1)) {
                numero_chaise++;
                continue;
            }
            let left_group = new Konva.Group({
                name: (numero_chaise + 1).toString(),
                id: numero_chaise++,
                x: leftPos + 15,
                y: parseInt(topStart + this.state.topBuff + this.state.dia * (j - 1) + this.state.gap * (j - 1))

            });
            let left_circle = new Konva.Circle({
                key: numero_chaise,
                x: 0,
                y: 0,
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
                x: -5,
                y: -5
            });
            left_group.add(left_circle);
            left_group.add(left_text);
            this.setStageDimensions(left_group);
            table.add(left_group);
        }
        table.add(tableRect);
        table.add(text);
        table.on('click tap', (e) => {
            transformer.attachTo(table);
            this.setState({
                'selectedItem':
                    {
                        id: object.id,
                        nom: object.nom,
                        x: object.x,
                        y: object.y,
                        xSeats: object.xSeats,
                        ySeats: object.ySeats,
                        type: 'rectangle',
                        rotation: table.rotation(),
                        number_seats: (object.xSeats * 2 + object.ySeats * 2) - (object.deleted_seats.length),
                        deleted_seats: object.deleted_seats
                    },
                'focusObject': null
            }, () => {
                table.draggable(true);
                table.moveToTop();
                table.getLayer().draw();
            });

        });
        table.on('dragend transformend', (e) => {
            let data = {
                id: object.id,
                nom: object.nom,
                x: e.target.x(),
                y: e.target.y(),
                xSeats: object.xSeats,
                ySeats: object.ySeats,
                type: 'rectangle',
                rotation: table.rotation(),
                number_seats: (object.xSeats * 2 + object.ySeats * 2) - (object.deleted_seats.length)
            };
            if (object.deleted_seats) {
                data.deleted_seats = object.deleted_seats;
            }
            this.updateObject(data);
        });
        return table;
    };
    //Ajouter objet Type Table Circulaire
    renderTableCircle = (object, transformer = null) => {
        const seats = object.chaises;
        const deg = (2 * Math.PI) / seats;
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
            id: object.id,
            x: object.x,
            y: object.y,
            height: this.state.topBuff * 2 + textWidth + this.state.bottomBuff,
            width: contWidth,
            visible: true,
            draggable: false,
            fill: "#A9A8B3",
            name: object.nom.toString(),
            rotation: object.rotation
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
            text: object.nom,
            fontStyle: "arial",
            x: this.state.posX + contWidth / 2 - 12,
            y: (tableRad + textWidth + this.state.topBuff) + this.state.dia + this.state.gap,
            width: textWidth,
            height: textHeight,
            rotation: 0
        });
        for (let i = 0; i < seats; i++) {
            let deleted = object.deleted_seats;
            if (deleted && deleted.includes(i + 1)) {
                continue;
            }
            let c_group = new Konva.Group({
                name: (i + 1).toString(),
                id: i + 1,
                x: Math.cos(deg * i) * (tableRad + this.state.gap + this.state.rad) + tableLeft,
                y: Math.sin(deg * i) * (tableRad + this.state.gap + this.state.rad) + (tableTop + tableRad)
            });
            let circle = new Konva.Circle({
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
                x: -5,
                y: -5
            });
            c_group.add(circle);
            c_group.add(text);
            this.setStageDimensions(c_group);
            group.add(c_group);
        }
        group.add(tableCircle);
        group.add(text);
        group.on('click tap', (e) => {
            transformer.attachTo(group);
            this.setState({
                'selectedItem':
                    {
                        id: object.id,
                        nom: object.nom,
                        x: object.x,
                        y: object.y,
                        chaises: seats,
                        type: 'ronde',
                        rotation: group.rotation(),
                        number_seats: seats - object.deleted_seats.length,
                        deleted_seats: object.deleted_seats
                    },
                'focusObject': null
            }, () => {
                group.draggable(true);
                group.moveToTop();
                group.getLayer().draw();
            });

        });
        group.on('dragend transformend', (e) => {
            let data = {
                id: object.id,
                nom: object.nom,
                x: e.target.x(),
                y: e.target.y(),
                chaises: seats,
                type: 'ronde',
                rotation: group.rotation(),
                number_seats: seats - object.deleted_seats.length
            };
            if (object.deleted_seats) {
                data.deleted_seats = object.deleted_seats;
            }
            this.updateObject(data);
        });
        return group;
    };
    //Ajouter objet type Forme
    renderShape = (object, transformer = null) => {
        let group = new Konva.Group({
            id: object.id,
            x: object.x,
            y: object.y,
            height: this.state.topBuff * 2 + textWidth + this.state.bottomBuff,
            width: contWidth,
            visible: true,
            draggable: false,
            fill: "#A9A8B3",
            name: object.nom.toString(),
            rotation: object.rotation
        });

    };

    //initialisation pendant Montage du composant
    componentDidMount() {
        axios.get(
            '/api/event/get-map/' + this.props.eventId)
            .then((response)=> {
                if (response.data) {
                    this.setState({'data_map': response.data});
                    let data = this.state.data_map;
                    if (data.length > 0) {
                        this.setState({'data_is_empty': !this.state.data_is_empty});
                        let nb_seats = 0;
                        data.forEach((el) => {
                            nb_seats += parseInt(el.number_seats);
                        });
                        this.setState({'number_seats': nb_seats});
                    }
                    this.loadStage();
                }
            })
        .catch(function (error) {
            container.error("Une Erreur s'est produite pendant le chargement de la carte", 'Erreur', {closeButton: true});
        });
    }

    //Nombre total de chaises
    setTotalSeats() {
        let data = this.state.data_map;
        if (data.length > 0) {
            let nb_seats = 0;
            data.forEach((el) => {
                nb_seats += parseInt(el.number_seats);
            });
            this.setState({'number_seats': nb_seats});
        }
    }
    //set stage dimensions
    setStageDimensions(object){
        const PADDING = 20;
        let x_object=object.getAbsolutePosition().x;
        let y_object=object.getAbsolutePosition().y;
        if(x_object <= this.state.min_leftX){
            let scale= window.innerWidth/(window.innerWidth + (x_object*-1) + PADDING);
            console.log(object);
            console.log(scale);
            this.setState({'scaleX': scale,'scaleY': scale});
        }
        if(x_object >= this.state.max_leftX){
            let scale= window.innerWidth/(window.innerWidth + (x_object) + PADDING);
            console.log(x_object);
            console.log(scale);
            this.setState({'scaleX': scale,'scaleY': scale});
        }
        if(y_object <= this.state.min_leftY){
            let scale= window.innerHeight/(window.innerHeight + (y_object*-1) + PADDING);
            console.log(scale);
            this.setState({'scaleX': scale,'scaleY': scale});
        }
        if(y_object >= this.state.max_leftY){
            let scale= window.innerHeight/(window.innerHeight + (y_object) + PADDING);
            console.log(scale);
            this.setState({'scaleX': scale,'scaleY': scale});
        }

    };

    //Sauvegarder le canvas
    saveCanvas = (save) => {
        this.setState({'saveCanvas': save}, () => {
            this.saveStage();
        });
        setTimeout(() => {
            this.setState({'saveCanvas': !save});
        }, 1500);
    };
    //Supprimer un objet sur le canvas
    deleteObject = (object) => {
        let data = this.state.data_map;
        data.forEach((el, i) => {
            if (el.id === object.id) {
                data = data.filter(function (ele) {
                    return ele.id !== object.id;
                });
            }
        });
        data = this.reorderDataMap(data);
        this.setState({data_map: data, selectedItem: null}, () => {
            this.loadStage();
        });
    };
    //Réordonner les objets après suppression
    reorderDataMap = (dataMap) => {
        dataMap.forEach((element, i) => {
            element.id = i;
        });
        return dataMap;
    };
    //Sauvegarder le stage (konva)
    saveStage = () => {
        let data = this.state.data_map;
        data = JSON.stringify(data);
        axios.post(
            '/api/event/update-map/' + this.props.eventId, {
                data_map: JSON.parse(data)
            })
            .then(function (response) {
                container.success("Carte enregistré aves succès", 'Succès', {closeButton: true});
                setTimeout(() => {
                    location.reload();
                },1500);
            })
            .catch(function (error) {
                    container.error("Une Erreur s'est produite pendant l'enregistrement de la carte", 'Erreur', {closeButton: true});
                }
            );
    };
    //Charger le stage (konva) , initialiser le map
    loadStage = (focusObj) => {
        let data = this.state.data_map;
        this.setTotalSeats();
        let stage = new Konva.Stage({
            container: 'stage-container',
            width: window.innerWidth * 3 / 4,
            height: window.innerHeight,
            x:0,
            y:0,
            scale: {x: this.state.scaleX, y: this.state.scaleY}
        });
        let layer = new Konva.Layer();
        let focusLayer = new Konva.Layer();
        stage.add(layer);
        stage.add(focusLayer);
        let transformer = new Konva.Transformer({
            name: 'Transformer',
            rotateAnchorOffset: 5,
            borderStroke: "#007bff",
            resizeEnabled: false,
            borderDash: [2, 2],
            borderStrokeWidth: 2,
            rotationSnaps: [0, 45, 90, 180, 270],
        });
        layer.add(transformer);
        let padding = 20;
        for (let i = 0; i < window.innerWidth * 2 / padding; i++) {
            let h_line = new Konva.Line({
                points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, window.innerWidth * 2],
                stroke: '#ddd',
                strokeWidth: 1,
            });
            layer.add(h_line);
        }
        let t_line = new Konva.Line({points: [0, 0, 10, 10]});
        layer.add(t_line);
        for (let j = 0; j < window.innerHeight * 2 / padding; j++) {
            let v_line = new Konva.Line({
                points: [0, Math.round(j * padding), window.innerWidth * 2, Math.round(j * padding)],
                stroke: '#ddd',
                strokeWidth: 0.5,
            });
            layer.add(v_line);
        }
        if (data.length > 0) {
            data.forEach((obj) => {
                let newObject = this.addNewObject(obj, transformer);
                newObject.cache();
                if (focusObj && focusObj.id === obj.id) {
                    transformer.attachTo(newObject);
                    newObject.draggable(true);
                }
                layer.add(newObject);
            });
        }
        stage.on('click tap', (e) => {
            if (e.target === stage) {
                stage.find('Transformer').detach();
                this.setState({'focusObject': null});
                let objects = stage.getChildren()[0].getChildren();
                objects.each((obj) => {
                    if (obj.name !== "Transformer")
                        obj.draggable(false);
                });
                this.setState({'selectedItem': null});
                layer.draw();
                return;
            }
        });
        stage.on('wheel', (e) => {
            this.handleWheel(e);
        });
        stage.draw();
        /** Responsive stage*/
        window.addEventListener('resize',(e)=>{
            let container = document.querySelector('#stage-container');
            const stageWidth= this.state.initWidth,stageHeight=this.state.initHeight;
            let containerWidth = container.offsetWidth;
            let scale = containerWidth / stageWidth;
            stage.width(stageWidth * scale);
            stage.height(stageHeight * scale);
            stage.scale({ x: scale, y: scale });
            this.setState({'scaleX':scale,'scaleY':scale,'stageScale':{x:scale,y:scale}},()=>{stage.batchDraw();});
        });

        /** Focus on object : executed when this.state.focusObject is not null*/
        let focus_object = this.state.focusObject;
        if (focus_object) {
            stage.off('dragend click tap');
            let object = stage.getLayers()[0].find(node => {
                return node.getType() === 'Group' && node.getName() === focus_object.nom.toString();
            });
            object[0].moveTo(focusLayer);
            transformer.moveTo(focusLayer);
            let seatTranformer = new Konva.Transformer({
                name: 'SeatTransformer',
                rotateAnchorOffset: 5,
                borderStroke: "#007bff",
                resizeEnabled: false,
                rotateEnabled: false,
                borderDash: [2, 2],
                borderStrokeWidth: 2,
            });
            object[0].add(seatTranformer);
            object[0].draggable(false);
            transformer.rotateEnabled(false);
            object[0].off("dragend click tap");//
            let unGrouped_object = object[0].find(node => {
                return node.parent === object[0];
            });
            unGrouped_object.forEach((element, i) => {
                console.log(object[0].getAbsolutePosition());
                console.log(element.getAbsolutePosition());
                let x = element.getAbsolutePosition().x;
                let y = element.getAbsolutePosition().y;
                element.moveTo(focusLayer);

                element.position({x: x, y: y});
                element.on('click tap', () => {
                    if (element.getType() === "Group") {
                        this.setState({'selectedSeat': element.getAttr('name')}, () => {
                            seatTranformer.attachTo(element);
                            focusLayer.draw();
                        });

                    } else {
                        this.setState({'selectedSeat': null}, () => {
                            seatTranformer.detach();
                            focusLayer.draw();
                        });
                    }
                });
                object[0].remove();
                focusLayer.batchDraw();
            });
            layer.find(node => {
                return node.getType() === 'Group'
                    && node.parent.getType() === 'Layer'
                    && node.getName() !== focus_object.nom.toString()
                    && node.getName() !== 'Transformer'
            }).forEach((el) => {
                el.off('dragend click tap');
            });
            layer.opacity(0.5);
            stage.draw();
        }
    };
    //Gestion scroll Souris sur la carte
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
            stageScale: {
                x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
                y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
            },
            stageX:
                -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            stageY:
                -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
            scaleX: newScale,
            scaleY: newScale
        }, () => {
            stage.batchDraw();
        });
    };
    handleSelected = e => {
        this.setState({'selectedItem': e});
    };
    getFocusedObject = (obj) => {
        if (this.state.selectedItem) {
            this.setState({'focusObject': obj}, () => {
                this.loadStage(this.state.selectedItem)
            });
        }
    };
    getUpdatedObject = (obj) => {
        if (this.state.selectedItem) {
            this.setState({'focusObject': null}, () => {
                this.updateObject(obj);
            });
        }
    };

    //rendu du composant
    render() {
        return (
            <div className="row mr-0">
                <ToastContainer ref={ref => container = ref} className="toast-bottom-left"/>
                <div id="stage-container" className={"col-sm-9"} style={{paddingLeft: 0}}>
                </div>
                {!this.state.data_is_empty &&
                <div className="col-sm-3 sidebar-right">
                    <p style={{color: '#eeeeee'}}>Nombre de places: {this.state.number_seats}</p>
                    <DeleteContext.Provider value={this.deleteObject}>

                        <RightSidebar addNewObject={this.addNewObjectFromSidebar} saveCanvas={this.saveCanvas}
                                      focusedObject={this.getFocusedObject} updatedObject={this.getUpdatedObject}
                                      dataMap={this.state.data_map} updateObject={this.state.selectedItem}
                                      selectedSeat={this.state.selectedSeat}
                        />
                    </DeleteContext.Provider>
                </div>}
                {this.state.data_is_empty &&
                <div className="col-sm-3 sidebar-right">
                    <p className={"text text-danger"}>La carte ne contient aucune donnée</p>
                    <p className={"text text-secondary"}>Cliquer ci-dessous pour débuter</p>
                    <Button
                        variant="contained"
                        color="primary"
                        className={"btn btn-primary"}
                        onClick={this.switchData}
                    >
                        Commencer
                    </Button>
                </div>}
            </div>
        );
    }
}

export default SetMap;


