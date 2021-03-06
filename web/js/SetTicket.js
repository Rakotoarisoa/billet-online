import React, {Component} from 'react';
import {render} from 'react-dom';
import Konva from 'konva';
import axios from 'axios';
import {ToastContainer} from "react-toastr";
import DeleteContext from "./components/contexts/DeleteContext";
import RightSidebarTicket from "./components/RightSidebarTicket";

let container;

class SetTicket extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        total_assigned: 0,
        stageScale: 1,
        stageX: 1,
        stageY: 1,
        scaleX: 0.4,
        scaleY: 0.4,
        selectedItem: null,
        newItem: '',
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
        ticket_colors: [],
        focusObject: null,
        initWidth: 947,
        initHeight: 947,
        number_seats: 0,
        color_seat: "#EEEEEE",
        liste_billet: []
    };
    //Enregistrer les déplacements de l'objet
    updateObject = (object) => {
        //find object into data_map state
        let data = this.state.data_map;
        data.find((el, i) => {
            if (el.id === object.id) {
                data[i] = object;
                this.setState({'data_map': data}, () => {
                    this.loadStage();
                });
            }
        });
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
                zone.batchDraw();
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
                /** assigned seat representation*/
                let circle_color = this.state.color_seat;
                let seat_id= '-';
                if (object.mapping !== undefined) {
                    let colors = this.state.ticket_colors;
                    let mapped = object.mapping;
                    mapped.forEach((el) => {
                        if (el.seat_id === (alphabet[i].toUpperCase() + (j + 1)).toString())
                            colors.forEach((color) => {
                                if (color.billet === el.type) {
                                    circle_color = color.color;
                                    seat_id=el.seat_id;
                                }
                            })
                    });
                }
                /** end assigned  seat representation */
                let newGroup = new Konva.Group({
                    name: alphabet[i].toUpperCase() + (j + 1),
                    x: parseInt((this.state.posX + sideBuff) + rad + j * dia + j * gap),
                    y: parseInt((textHeight + topBuff) + rad + i * dia + i * gap),
                    seat_id: seat_id
                });
                let circle = new Konva.Circle({
                    x: 0,
                    y: 0,
                    width: 20,
                    height: 20,
                    stroke: "#888888",
                    strokeWidth: 2,
                    fill: circle_color,
                    shadowColor: 'gray',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                    shadowBlur: 5,
                });
                let text = new Konva.Text({
                    text: j + 1,
                    fontStyle: "arial",
                    fontSize: 10,
                    x: -3,
                    y: -5

                });
                newGroup.add(circle);
                newGroup.add(text);
                section.add(newGroup);
                /*newGroup.on('click',(e)=>{
                    console.log(e.target.parent.getAttr('name'));
                });*/
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
                        mapping: (object.mapping?object.mapping:[]),
                        number_seats: (object.xSeats * object.ySeats) - (object.deleted_seats.length),
                        deleted_seats: object.deleted_seats
                    },
                'focusObject': null
            }, () => {
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
        let colors = this.state.ticket_colors;
        let mapped = object.mapping;
        //render top and left seats
        for (let i = 0; i < x; i++) {
            if (deleted && deleted.includes(i + 1)) {
                numero_chaise++;
                continue;
            }
            /** assigned seat representation*/
            let circle_color = this.state.color_seat;
            if (object.mapping !== undefined) {
                mapped.forEach((el) => {
                    if (el.seat_id === parseInt(numero_chaise + 1))
                        colors.forEach((color) => {
                            if (color.billet === el.type) circle_color = color.color;
                        })
                });
            }
            /** end assigned  seat representation */
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
                fill: circle_color,
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
            table.add(top_group);
        }
        for (let i = 0; i < y; i++) {
            if (deleted && deleted.includes(numero_chaise + 1)) {
                numero_chaise++;
                continue;
            }
            /** assigned seat representation*/
            let circle_color = this.state.color_seat;
            if (object.mapping !== undefined) {
                mapped.forEach((el) => {
                    if (el.seat_id === parseInt(numero_chaise + 1))
                        colors.forEach((color) => {
                            if (color.billet === el.type) circle_color = color.color;
                        })
                });
            }
            /** end assigned  seat representation */
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
                fill: circle_color,
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
            table.add(right_group);
        }
        for (let j = x; j > 0; j--) {
            if (deleted && deleted.includes(numero_chaise + 1)) {
                numero_chaise++;
                continue;
            }
            /** assigned seat representation*/
            let circle_color = this.state.color_seat;
            if (object.mapping !== undefined) {
                mapped.forEach((el) => {
                    if (el.seat_id === parseInt(numero_chaise + 1))
                        colors.forEach((color) => {
                            if (color.billet === el.type) circle_color = color.color;
                        })
                });
            }
            /** end assigned  seat representation */
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
                fill: circle_color,
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
            table.add(bottom_group);
        }
        for (let j = y; j > 0; j--) {
            if (deleted && deleted.includes(numero_chaise + 1)) {
                numero_chaise++;
                continue;
            }
            /** assigned seat representation*/
            let circle_color = this.state.color_seat;
            if (object.mapping !== undefined) {
                mapped.forEach((el) => {
                    if (el.seat_id === parseInt(numero_chaise + 1))
                        colors.forEach((color) => {
                            if (color.billet === el.type) circle_color = color.color;
                        })
                });
            }
            /** end assigned  seat representation */
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
                fill: circle_color,
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
                        mapping: (object.mapping?object.mapping:[]),
                        number_seats: (object.xSeats * 2 + object.ySeats * 2) - (object.deleted_seats.length),
                        deleted_seats: object.deleted_seats
                    },
                'focusObject': null
            }, () => {
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
            fill: this.state.color_seat,
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
        /* manage mapped */
        /* end mapped */
        for (let i = 0; i < seats; i++) {
            /* manage deleted seats */
            let deleted = object.deleted_seats;
            if (deleted && deleted.includes(i + 1)) {
                continue;
            }
            /* end manage delete */
            /** assigned seat representation*/
            let circle_color = this.state.color_seat;
            if (object.mapping !== undefined) {
                let colors = this.state.ticket_colors;
                let mapped = object.mapping;
                mapped.forEach((el) => {
                    if (el.seat_id === i+1)
                        colors.forEach((color) => {
                            if (color.billet === el.type) circle_color = color.color;
                        })
                });
            }
            /** end assigned  seat representation */
            let c_group = new Konva.Group({
                name: (i + 1).toString(),
                id: i + 1,
                x: Math.cos(deg * i) * (tableRad + this.state.gap + this.state.rad) + tableLeft,
                y: Math.sin(deg * i) * (tableRad + this.state.gap + this.state.rad) + (tableTop + tableRad)
            });
            let circle = new Konva.Circle({
                width: 20,
                height: 20,
                fill: circle_color,
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
                        mapping: (object.mapping?object.mapping:[]),
                        deleted_seats: object.deleted_seats
                    },
                'focusObject': null
            }, () => {
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
            fill: this.state.color_seat,
            name: object.nom.toString(),
            rotation: object.rotation
        });

    };
    //initialisation pendant Montage du composant
    componentDidMount() {
        function initColors(nb, billets) {
            let listColors = [];
            for (let i = 0; i < nb; i++) {
                let colors_palette= ['#decfd0','#feb6b1','#b4b8cf','#94c9a9','#c6ecae','#f6d8ae','#f8e398','#ea97ac','#dec3be','#c6a29d'];
                let color = colors_palette[i];
                let billet = billets[i].libelle;
                listColors.push({color, billet});
                //document.getElementById("billet-"+i).setAttribute("style","color:"+color+';');
            }
            return listColors;
        };
        const fetchData = async () => {
            try {
                await axios.get(
                    '/api/event/get-map/' + this.props.eventId)
                    .then((response) => {
                        if (response.data) {
                            this.setState({'data_map': response.data});
                            let data = this.state.data_map;
                            if (data.length > 0) {
                                this.setState({'data_is_empty': !this.state.data_is_empty});
                                let nb_seats = 0;
                                let nb_seats_assigned = 0;
                                data.forEach((el) => {
                                    nb_seats += parseInt(el.number_seats);
                                    (el.mapping?nb_seats_assigned+=el.mapping.length:nb_seats_assigned+=0);
                                });
                                this.setState({'number_seats': nb_seats,'total_assigned': nb_seats_assigned});
                            }

                        }
                    })
                    .catch(function (error) {
                        container.error("Une Erreur s'est produite pendant le chargement de la carte:" + error.message, 'Erreur', {closeButton: true});
                    });
                await axios.get(
                    '/api/typeBillet/seat-map/for-edit/' + this.props.eventId
                ).then((response) => {
                    this.setState({
                        'liste_billet': response.data,
                        'ticket_colors': initColors(response.data.length, response.data)
                    });
                    this.loadStage();
                });
            } catch (error) {
                container.error("Une erreur s'est produite: " + error.message, "Erreur", {closeButton: true});
            }
        };
        fetchData();

    }
    //Nombre total de chaises
    setTotalAssignedSeats(){
        let data = this.state.data_map;
        if (data.length > 0) {
            let nb_seats_assigned = 0;
            data.forEach((el) => {
                (el.mapping?nb_seats_assigned+=el.mapping.length:nb_seats_assigned+=0);
            });
            this.setState({'total_assigned': nb_seats_assigned});
        }
    }
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
    //Tache pendant mise à jour du composant
    componentDidUpdate() {
        if (this.state.stage) {
            let stage = this.state.stage;
            stage.batchDraw();
        }

    }
    //Sauvegarder le canvas
    saveCanvas = (save) => {
        this.setState({'saveCanvas': save}, () => {
            this.saveStage();
        });
        setTimeout(() => {
            this.setState({'saveCanvas': !save})
        }, 3000);
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
                container.success("Carte enregistré avec succès", 'Succès', {closeButton: true});
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
        this.setTotalAssignedSeats();
        let stage = new Konva.Stage({
            container: 'stage-container-ticket',
            width: window.innerWidth * 3 / 4,
            height: window.innerHeight,
            scale: {x: this.state.scaleX, y: this.state.scaleY}
        });
        let layer = new Konva.Layer();
        let focusLayer = new Konva.Layer();
        stage.add(layer);
        stage.add(focusLayer);
        let transformer = new Konva.Transformer({
            name: 'Transformer',
            borderStroke: "#007bff",
            resizeEnabled: false,
            borderDash: [2, 2],
            borderStrokeWidth: 2,
            rotateEnabled: false,
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
        stage.on('mousedown', (e) => {
            if (e.target === stage) {
                stage.container().style.cursor = 'move';
                stage.draggable(true);
                stage.draw();
            }
        });
        stage.on('mouseup', (e) => {
            if (e.target === stage) {
                stage.container().style.cursor = 'default';
                stage.draggable(false);
                stage.draw();
            }
        });
        stage.on('wheel', (e) => {
            this.handleWheel(e);
        });
        stage.draw();
        /** Responsive stage*/
        window.addEventListener('resize',(e)=>{
            /*let container = document.querySelector('#stage-container-ticket');
            const stageWidth= this.state.initWidth,stageHeight=this.state.initHeight;
            let containerWidth = container.offsetWidth;
            let scale = containerWidth / stageWidth;
            stage.width(stageWidth * scale);
            stage.height(stageHeight * scale);
            stage.scale({ x: scale, y: scale });
            this.setState({'scaleX':scale,'scaleY':scale,'stageScale':{x:scale,y:scale}},()=>{stage.batchDraw();});*/
            this.reInitScale(stage);
        });
        let focus_object = this.state.selectedItem;
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
        const MAX_SCALE = 1;
        const MIN_SCALE = 0.4;
        const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
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
                stage.position(this.state.stageScale);
                stage.batchDraw();
            });
        }
    };
    //initScale : 0.4
    reInitScale = (stage) => {
        stage.scale({x: 0.4, y: 0.4});
        stage.position({x: 0, y: 0});
        stage.draw();
    };
    handleSelected = e => {
        this.setState({'selectedItem': e});
    };
    handleReInitAll =(reInit) =>{
        if(reInit) {
            let data = this.state.data_map;
            data.forEach((el) => {
                if (el.mapping) el.mapping = [];
            });
            this.setState({'data_map':data},()=>{this.loadStage()});
        }
    };
    handleAssign = (list = []) => {
        let selected = this.state.selectedItem;
        selected.mapping = list;
        this.setState({'selectedItem':null});
        this.updateObject(selected);
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
    getColors = (colors) => {
        this.setState({'ticket_colors': colors});
    };
    //rendu du composant
    render() {
        return (
            <div className="row mr-0">
                <ToastContainer ref={ref => container = ref} className="toast-bottom-left"/>
                <div id="stage-container-ticket" className={"col-sm-9"} style={{paddingLeft: 0}}>
                </div>
                <div className="col-sm-3 sidebar-right">
                    <p style={{color: '#eeeeee'}}>{this.state.total_assigned}/{this.state.number_seats} places
                        assignées</p>
                    <RightSidebarTicket selectedItem={this.state.selectedItem} colors={this.state.ticket_colors}
                                        liste_billet={this.state.liste_billet} assignTicket={this.handleAssign} saveMap={this.saveCanvas} reInit={this.handleReInitAll}/>
                </div>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"/>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.3/toastr.min.css"/>
            </div>
        );
    }
}

export default SetTicket;


