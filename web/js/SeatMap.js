import React, {Component} from 'react';
import {render} from 'react-dom';
import Konva from 'konva';
import axios from 'axios';
import {ToastContainer} from "react-toastr";
import RightSidebarFront from "./components/RightSidebarFront";

let container;

class SeatMap extends Component {
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
        liste_billet: [],
        booked_circle_color: "#DDDDDD",
        data_in_cart: null
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
    getDataInCart = () => {
        axios.get('/api/cart/list').then((data) => {
            this.setState({'data_in_cart': data.data});
        });
        return this.state.data_in_cart;
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
                    return this.renderZone(object);
                default:
                    return this.renderSectionSeat(object, transformer);
            }
        }
    };
    //Ajouter objet type zone
    renderZone = (object) => {
        let zone = new Konva.Group({
            id: object.id,
            name: object.nom.toString(),
            x: object.x,
            y: object.y,
            height: object.height,
            width: object.width,
            draggable: false,
            rotation: object.rotation
        });
        let table = null;
        if (object.forme === "cercle") {
            table = new Konva.Circle({
                x: object.width / 2,
                y: object.width / 2,
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
            x: object.width / 2 - 50 / 2,
            y: object.height / 2,
            width: 50,
            height: 10,
        });
        zone.add(table);
        zone.add(text);
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
                let stroke_color = "#888888";
                let seat_type = '-';
                if (object.mapping !== undefined) {
                    let colors = this.state.ticket_colors;
                    let mapped = object.mapping;
                    mapped.forEach((el) => {
                        if (el.seat_id === (alphabet[i].toUpperCase() + (j + 1)).toString() && !el.is_booked)
                            colors.forEach((color) => {
                                if (color.billet === el.type) {
                                    circle_color = color.color;
                                    seat_type = el.type;
                                }
                            });
                        else if (el.seat_id === (alphabet[i].toUpperCase() + (j + 1)).toString() && el.is_booked) {
                            circle_color = this.state.booked_circle_color;
                            stroke_color = this.state.booked_circle_color;
                        }
                    });
                }
                /** end assigned  seat representation */
                let newGroup = new Konva.Group({
                    type: seat_type,
                    name: alphabet[i].toUpperCase() + (j + 1),
                    is_selected: false,
                    x: parseInt((this.state.posX + sideBuff) + rad + j * dia + j * gap),
                    y: parseInt((textHeight + topBuff) + rad + i * dia + i * gap)
                });
                let circle = new Konva.Circle({
                    x: 0,
                    y: 0,
                    width: 20,
                    height: 20,
                    stroke: stroke_color,
                    strokeWidth: 2,
                    fill: circle_color,
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
                newGroup.add(circle);
                newGroup.add(text);
                newGroup.on('click',
                    (e) => {
                        // update tooltip
                        $('#tooltip_wrapper').remove();
                        circle = newGroup
                            .getChildren(function (node) {
                                return node.getType() === 'Shape' && node.getClassName() === 'Circle';
                            })[0]
                        ;
                        //circle.fill('red');
                        //circle.draw();
                        newGroup.getStage().remove();
                        let card_body = $("<div></div>").attr('class', 'card-body');
                        let card_title = $('<h6></h6>').attr('class', 'card-title').text('Chaise');
                        let row_type = $("<div></div>").attr('class', 'row');
                        let row_title = $("<div></div>").attr('class', 'row');
                        let row_value = $("<div></div>").attr('class', 'row');
                        let card_text_table = $("<small></small>").attr('class', 'card-text col-6').text('Table/Section');
                        let card_text_seat = $("<small></small>").attr('class', 'card-text col-6').text('Chaise');
                        let card_text_type = $("<small></small>").attr('class', 'card-text col-6').text('Type');
                        let table_value = $("<p></p>").attr('class', 'card-text col-6').text(object.nom.toString());
                        let seat_value = $("<p></p>").attr('class', 'card-text col-6').text(alphabet[i].toUpperCase() + (j + 1));
                        let type_value = $("<p></p>").attr('class', 'card-text col-12').text(seat_type);
                        row_type.append(card_text_type);
                        row_type.append(type_value);
                        row_title.append(card_text_table);
                        row_title.append(card_text_seat);
                        row_value.append(table_value);
                        row_value.append(seat_value);
                        let buy_link = $('<a></a>');
                        if (seat_type !== '-') {
                            buy_link.attr('class', 'card-link btn btn-danger').attr('href', '#').attr('id', 'submit-seat').text('Ajouter');
                        } else {
                            buy_link.attr('class', 'card-link btn btn-danger').attr('href', '#').text('Place non disponible');
                        }
                        card_body.append(card_title);
                        card_body.append(row_type);
                        card_body.append(row_title);
                        card_body.append(row_value);
                        card_body.append(buy_link);
                        let el = $("<div></div>").attr('class', 'card').attr('id', 'tooltip_wrapper').css({
                            'width': '24%',
                            'position': 'absolute',
                            'top': newGroup.getAbsolutePosition().y - 250,
                            'left': newGroup.getAbsolutePosition().x - 100
                        }).append(card_body);
                        $('#stage-container-front').append(el);
                        newGroup.setAttr('is_selected', !newGroup.getAttr('is_selected'));
                        $("#submit-seat").on('click', (e) => {
                            let seat_data = this.state.data_map;
                            seat_data = JSON.stringify(seat_data);
                            $.post("/api/event/seat/is-locked", {
                                section_id: object.nom.toString(),
                                seat_id: alphabet[i].toUpperCase() + (j + 1),
                                table_event: JSON.parse(seat_data),
                                lock_action: true,
                                event_id: this.props.eventId
                            }, (data, status, xhr) => {
                                if (!data) {
                                    $.post("/res_billet/add/", {
                                        select_nb_billets: 1,
                                        type_billet: seat_type,
                                        event_id: this.props.eventId,
                                        redirect: "/",
                                        section_id: object.nom.toString(),
                                        place_id: alphabet[i].toUpperCase() + (j + 1)
                                    }, (data, status, xhr) => {
                                        $(el).remove();
                                        //this.generateCartInfo();
                                        switch (xhr.status) {
                                            case 200:
                                                container.success(data.toString(), 'Commande ajoutée');
                                                this.getDataInCart();
                                                this.generateCartInfo();
                                                break;
                                            case 208:
                                                container.warning(data.toString(), 'Impossible de commander');
                                                break;
                                            case 500:
                                                container.error(data.toString(), 'Impossible de commander');
                                                break;
                                            default:
                                                container.warning('', 'Requete en cours');
                                                break;

                                        }

                                    })
                                }
                                else{
                                    container.warning('Une autre personne est en instance sur la place', 'Commande impossible');
                                }
                            });

                        })

                    }
                );
                section.add(newGroup);
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
        return section;
    };
    //initScale : 0.4
    reInitScale = (stage) => {
        stage.scale({x: 0.4, y: 0.4});
        stage.position({x: 0, y: 0});
        stage.draw();
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
                    if (el.seat_id === i + 1)
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
                        mapping: (object.mapping ? object.mapping : []),
                        deleted_seats: object.deleted_seats
                    },
                'focusObject': null
            }, () => {
                group.moveToTop();
                group.getLayer().draw();
            });

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
                let colors_palette = ['#decfd0', '#feb6b1', '#b4b8cf', '#94c9a9', '#c6ecae', '#f6d8ae', '#f8e398', '#ea97ac', '#dec3be', '#c6a29d'];
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
                                    (el.mapping ? nb_seats_assigned += el.mapping.length : nb_seats_assigned += 0);
                                });
                                this.setState({'number_seats': nb_seats, 'total_assigned': nb_seats_assigned});
                            }

                        }
                    })
                    .catch(function (error) {
                        container.error("Une Erreur s'est produite pendant le chargement de la carte:" + error.message, 'Erreur', {closeButton: true});
                    });
                await axios.get(
                    '/api/typeBillet/' + this.props.eventId
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
    setTotalAssignedSeats() {
        let data = this.state.data_map;
        if (data.length > 0) {
            let nb_seats_assigned = 0;
            data.forEach((el) => {
                (el.mapping ? nb_seats_assigned += el.mapping.length : nb_seats_assigned += 0);
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

    //Charger le stage (konva) , initialiser le map
    loadStage = (focusObj = null) => {
        let data = this.state.data_map;
        let stage = new Konva.Stage({
            container: 'stage-container-front',
            width: window.innerWidth * 10 / 12,
            height: window.innerHeight,
            scale: {x: this.state.scaleX, y: this.state.scaleY},
        });
        let layer = new Konva.Layer();
        let focusLayer = new Konva.Layer();
        stage.add(layer);
        stage.add(focusLayer);
        if (data.length > 0) {
            data.forEach((obj) => {
                let newObject = this.addNewObject(obj);
                newObject.cache();
                /*if (focusObj && focusObj.id === obj.id) {
                    //transformer.attachTo(newObject);
                    //newObject.draggable(true);
                }*/
                layer.add(newObject);
            });
        }
        stage.on('click tap', (e) => {
            if (e.target === stage) {
                this.reInitScale(stage);
                $('#tooltip_wrapper').remove();
                //stage.find('Transformer').detach();
                this.setState({'focusObject': null});
                /*let objects = stage.getChildren()[0].getChildren();
                objects.each((obj) => {
                    if (obj.name !== "Transformer")
                        obj.draggable(false);
                });*/
                this.setState({'selectedItem': null});
                //layer.draw();
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
        this.generateCartInfo();
        this.getDataInCart();
        stage.draw();
        /** Responsive stage*/
        window.addEventListener('resize', (e) => {
            /*let container = document.querySelector('#stage-container');
            const stageWidth= this.state.initWidth,stageHeight=this.state.initHeight;
            let containerWidth = container.offsetWidth;
            let scale = containerWidth / stageWidth;
            stage.width(stageWidth * scale);
            stage.height(stageHeight * scale);
            stage.scale({ x: scale, y: scale });
            this.setState({'scaleX':scale,'scaleY':scale,'stageScale':{x:scale,y:scale}},()=>{stage.batchDraw();});*/
            this.reInitScale(stage);
            $('#tooltip_wrapper').remove();
        });

        /*function downloadURI(uri, name) {
            var link = document.createElement('a');
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        var dataURL = stage.toDataURL({ pixelRatio: 3 });
        downloadURI(dataURL, 'stage.png');*/
    };
    //Générer div cart tooltip
    generateCartInfo = () => {
        let count = 0;
        $('#tooltip_card').remove();
        axios.get('/api/cart/count').then((response) => {
            count = response.data;
            if (count > 0) {
                let card_body = $("<div></div>").attr('class', 'card-body');
                let row = $("<div></div>").attr('class', 'row');
                let cart_icon = $("<div></div>").attr('id', 'cart_icon').attr('class', 'col my-auto').append('<a id="details" class="btn btn-link"><span class="p1 fa-stack fa-lg has-badge" data-count="' + count + '"><i class="p3 fa fa-shopping-cart fa-stack-1x xfa-inverse" data-count="4b"></i></span></a>').append(' réservations');
                let details = $("<a></a>").attr('title', 'Test').attr('id', 'details').attr('class', 'btn btn-link text text-info col my-auto').text('Détails');
                row.append(cart_icon);
                //let command_text=$('<div></div>').attr('class','col').text('réservations');
                let purchase_button = $('<a></a>').attr('class', 'btn btn-link text text-danger col my-auto').attr('id', 'submit_command').text('Commander');
                let remove_button = $('<a></a>').attr('class', 'btn btn-link text text-danger col my-auto').attr('id', 'clear_command').text('Annuler les commandes');
                row.append(purchase_button);
                //row.append(details);
                row.append(remove_button);
                card_body.append(row);
                let el = $("<div></div>").attr('class', 'card').attr('id', 'tooltip_card').css({
                    'width': '24%',
                    'position': 'absolute'
                }).append(card_body);
                $('#stage-container-front').append(el.css({'top': 10, 'left': 500}));
                $('#submit_command').on('click', function (e) {
                    $('#checkout_command').modal('show');
                });
                $('#clear_command').on('click', (e)=> {
                    let array_cart=[];
                    let data_cart=this.getDataInCart();
                    data_cart.forEach(function (el) {
                        array_cart.push({section:el.section,seat:el.seat});
                    });
                    $.get('/res_billet/clear', () => {
                        $('#tooltip_card').remove();
                        location.reload();
                    });
                });
                $('#details').on('click', function (e) {
                    $('#cart_details').modal('show');
                });
                $('#cart_details').on('shown.bs.modal', () => {
                    let cart_items_list = this.getDataInCart();
                    let cart_details_content = $('#cart_details_content');
                    cart_details_content.empty();
                    cart_items_list.forEach(function (el) {
                        cart_details_content.append('<div class="row">' +
                            '<div class="col">Section: <b>' + el.section + '</b></div>' +
                            '<div class="col">Place: <b>' + el.seat + '</b></div>' +
                            '<div class="col"><span class="pull-right"> Prix: <b>' + el.price + '</b></span></div>' +
                            '</div>')
                    });
                });
            }
        });


    };
    //Gestion scroll Souris sur la carte
    handleWheel = e => {
        e.evt.preventDefault();
        $('#tooltip_wrapper').remove();
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
    handleSelected = e => {
        this.setState({'selectedItem': e});
    };
    getColors = (colors) => {
        this.setState({'ticket_colors': colors});
    };

    //rendu du composant
    render() {
        return (
            <div className="row">
                <ToastContainer ref={ref => container = ref} className="toast-bottom-left"/>
                <div id="stage-container-front" className={"col-sm-10"}
                     style={{paddingLeft: 0, backgroundColor: '#f8f8fa'}}>
                </div>
                <div className="col-sm-2 sidebar-right">
                    <RightSidebarFront colors={this.state.ticket_colors} liste_billet={this.state.liste_billet}/>
                </div>
            </div>
        );
    }
}

export default SeatMap;


