/*jshint esversion: 6 */
import AddForm from './components/seatmap/create/add-form'
import EditForm from './components/seatmap/create/edit-form'
import ToolbarVertical from './components/seatmap/create/toolbar-vertical'
import SidebarRight from './components/seatmap/create/sidebar-right'
import SidebarRightUser from './components/seatmap/purchase/sidebar-right-user'
import CanvasElement from './components/seatmap/create/canvas-element'
import CanvasElementUser from './components/seatmap/purchase/canvas-element-user'
import FormulaireAchat from './components/seatmap/purchase/formulaire-achat'
import Vue from 'vue'
import BusCreate from './components/seatmap/create/Bus.js'
import BusBuy from './components/seatmap/purchase/Bus.js'
import axios from 'axios'

let pathArray = window.location.pathname.split('/');
let eventId=pathArray[3].split('-')[1];
Vue.prototype.$eventId=eventId;
/**/
Vue.component('add-general-form',{
    template: '#add-general-form',
    data(){
        return{
            sectionName: "test name",
            sectionColor: "ffffff",
            showAddGenForm: false,
        };
    },
    methods:{

        submitGeneralData(){
            // console.log("submit seat data");
            // emit a Make Seating bus signal; or place a passenger on the bus carrying the
            // parameters to make a seating section. This package will get off at
            // the bus.$on (bus stop) and get routed to where it should be delivered.
            bus.$emit('sigMakeGeneral',startX,startY,300,200, this.sectionName, this.sectionColor, this.price);

            this.showAddGenForm = false;
        }
    },
    created(){
        // a "bus stop" signal listener for toggling the visibility of the add seating form.
        bus.$on('sigAddGenFormOn', ()=>{
            this.showAddGenForm = true;
        });


        bus.$on('sigAddGenFormOff',()=>{
            this.showAddGenForm = false;
        });
    },
});

Vue.component('add-table-form',{
    template: '#add-table-form',
    data(){
        return{
            sectionName: "Objet 1",
            tableType: "round",
            seats: 2,
            xSeats: 5,
            ySeats: 2,
            showAddTableForm: false,
            seatType: "",
            price: 0
        };
    },
    methods:{
        submitTableData(){
            // console.log("Adding seating");
            const startX = 200,startY=100;
            bus.$emit('sigMakeTable',startX,startY,this.tableType, this.seats, this.xSeats, this.ySeats, this.sectionName, this.seatType, this.price);
            this.showAddTableForm = false;
        }
    },

    created(){
        bus.$on('sigAddTableFormOn', ()=>{
            this.showAddTableForm = true;
        });

        bus.$on('sigAddTableFormOff',()=>{
            this.showAddTableForm = false;
        });
    },
});

function removeSeat() {
    bus.$emit('sigRemoveSeat',[]);
}

function editSeating() {
    bus.$emit('sigEditSeating',  []);
}

function regroupSeating() {
    bus.$emit('sigRegroupSeating',  []);
}
function mountTemplateByContext(vm_create,vm_buy){
    //const newURL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search;
    const pathArray = window.location.pathname.split('/');
    if(pathArray[5] === "map"){
        eventId=pathArray[4];
        vm_buy.$mount("#vue-app-user");
    }
    else if(pathArray[3] === "create-map"){
        vm_create.$mount("#vue-app");
    }
}

const vm_create = new Vue({
    data: {
        groupIdCounter: -1,
        fabCanvas: null,
        nbrSeat: 0
    },
    methods: {
        countTotalSeats(objects){
            let seats=[];
            const ref =this;
            if(Object.keys(objects).length>0){
                $.each(objects,function(object){
                    seats.push(ref.checkSeatOnObject(object.sectionType));
                });
            }
            seats.push({nbr:Object.keys(seats).length});
            return seats;
        },
        /*function to get Seats on json array*/
        checkSeatOnObject(objectList){
            let seats=[];
            $.each(objectList,function(index,value){
                $.each(value,function(i,element){
                    if(i === "objects"){
                        $.each(element,function(i,v){
                            if(v.type === "circle"){
                                seats.push({seatName: v.seatName,prix:v.price,groupId:v.groupId});
                            }
                        });

                    }
                });
                //seats.push({seatName: element.seatName,prix:element.price,groupId:element.groupId});
            });
            return seats;
        },
        makeSeating (posX, posY, cols, rows, name, type, colStart, rowStart, price) {
            // compter les groupes d'objets dans le canvas, à chaque ajout d'objets, le variable sera incrémenté
            this.groupIdCounter+=1;
            var rad = 10,
                dia = rad * 2,
                gap = 5,
                sideBuff = 10,
                topBuff = 10,
                bottomBuff = 10,
                sizeX = sideBuff * 2 + cols * dia + (cols - 1) * gap,
                sizeY = topBuff + bottomBuff + rows * dia + (rows - 1) * gap,
            currentCol = parseInt(colStart),
            currentRow = rowStart;

            var items = [];

            var container = new fabric.Rect({
                left: posX,
                top: posY,
                originX: 'left',
                originY: 'top',
                stroke: 'transparent',
                fill: 'transparent',
                width: sizeX,
                height: sizeY,
            });
            /* EDIT STUFF */
            container.set("rows", rows);
            container.set("cols", cols);
            container.set("seatType", type);
            container.set("sectionType","Seating");
            container.set("colStart", colStart);
            container.set("rowStart", rowStart);
            /* EDIT STUFF */
            // identifiant du groupe
            container.groupId = this.groupIdCounter;

            var text = new fabric.IText(name, {
                fontSize: 20,
                fontFamily: 'sans-serif',
                left: (posX + (sizeX / 2)),
                top: (posY + 10),
                originX: 'center',
                originY: 'top',
                hasControls: false
            });
            // set text groupId
            text.groupId = this.groupIdCounter;

            container.setHeight(topBuff * 2 + text.height + bottomBuff + rows * dia + (rows - 1) * gap);

            items.push(container);
            items.push(text);
            var color = "";
            if (type == "VIP")
                color = "green";
            else if (type == "Normal")
                color = "yellow";
            else if (type == "Economy")
                color = "blue";
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    var circle = new fabric.Circle({
                        radius: rad,
                        left: (posX + sideBuff) + rad + j * dia + j * gap,
                        top: (text.top + text.height + topBuff) + rad + i * dia + i * gap,
                        originX: 'center',
                        originY: 'center',
                        fill: color,
                    });

                    circle.groupId = this.groupIdCounter;

                    circle.deleted = false;
                    this.addPriceToObject(circle,price);
                    circle.rowName = currentRow;
                    circle.colName = currentCol;
                    //console.log("created seat " + currentRow + currentCol);

                    items.push(circle);
                    currentCol = currentCol + 1;
                }
                currentCol = parseInt(colStart);
                currentRow = String.fromCharCode(currentRow.charCodeAt() + 1);
            }
            var group = new fabric.Group(items, {
                //lockScalingX: true,
                //lockScalingY: true
                originX: 'center',
                originY: 'center'
            });
            // add row to group
            group.rows = rows;
            // add cols to group
            group.cols = cols;

            group.sectionType = "seating";
            this.fabCanvas.add(group);
            this.fabCanvas.renderAll();

            var ungroup = function (group) {
                var groupItems = groupObjects;
                group._restoreObjectsState();
                this.fabCanvas.remove(group);
                for (var i = 0; i < groupItems.length; i++) {
                    this.fabCanvas.add(groupItems[i]);
                    items[i].dirty = true;
                    this.fabCanvas.item(this.fabCanvas.size()-1).hasControls = false;
                }

                this.fabCanvas.renderAll();
            };
        },
        editSeating() {
            var selectedGroup = this.fabCanvas.getActiveObject();
            if (selectedGroup != null){
                var editGroup = selectedGroup.getObjects();
                selectedGroup._restoreObjectsState();
                this.fabCanvas.remove(selectedGroup);
                for (var i = 0; i < editGroup.length; i++) {
                    this.fabCanvas.add(editGroup[i]);
                    editGroup[i].dirty = true;
                    editGroup[i].lockMovementX = true;
                    editGroup[i].lockMovementY = true;
                    this.fabCanvas.item(this.fabCanvas.size()-1).hasControls = false;
                }
                this.fabCanvas.renderAll();
                var seatEditing = true;
            }
        },

        deleteSeating () {
            var seatingToDelete = this.fabCanvas.getActiveObject();
            this.fabCanvas.remove(seatingToDelete);
            this.fabCanvas.renderAll();
        },
        post:function(){
        },

        makeGeneral:function(posX, posY, sizeX, sizeY, name, color, price) {
            this.groupIdCounter +=1;
            var items = [];
            var container = new fabric.Rect({
                left: posX,
                top: posY,
                originX: 'left',
                originY: 'top',
                stroke: 'black',
                fill: '#' + color,
                width: sizeX,
                height: sizeY,
                objectCaching: false
            });
            // set container groupId
            container.groupId = this.groupIdCounter;
            // set container price
            this.addPriceToObject(container, price);

            var text = new fabric.IText(name, {
                fontSize: 20,
                fontFamily: 'sans-serif',
                left: (posX+(sizeX/2)),
                top: (posY+(sizeY/2)),
                originX: 'center',
                originY: 'top',
                hasControls: false,
                objectCashing: false
            });
            // set text groupId
            text.groupId = this.groupIdCounter;

            items.push(container);
            items.push(text);

            var group = new fabric.Group(items, {
                lockScalingX: false,
                lockScalingY: false
            });
            // set section type
            group.sectionType = "generalArea";
            // add table group to fabric canvas for rendering
            this.fabCanvas.add(group);
            this.fabCanvas.renderAll();

            // ungroup objects in group
            var groupItems = [];
            var ungroup = group => {
                // console.log("in ungroup()");
                groupItems = group.getObjects();
                group._restoreObjectsState();
                this.fabCanvas.remove(group);
                for (var i = 0; i < groupItems.length; i++) {
                    this.fabCanvas.add(groupItems[i]);
                    items[i].dirty = true;
                    this.fabCanvas.item(this.fabCanvas.size()-1).hasControls = false;
                }
                // if you have disabled render on addition
                this.fabCanvas.renderAll();
            };
            group.on('modified', opt => {
                ungroup(group);
                // get info from current objects
                const sizeX = container.getWidth(),
                sizeY = container.getHeight(),
                posX = container.left,
                posY = container.top,
                price = container.price,
                color = container.fill.slice(1),
                name = text.get('text');
                // remove current objects
                this.fabCanvas.remove(container);
                this.fabCanvas.remove(text);
                // create new object
                BusCreate.$emit('sigMakeGeneral', posX, posY, sizeX, sizeY, name, color, price)
            });

        },
        makeTable:function(posX, posY, type, seats, xSeats, ySeats, name, seatType, price) {
            // incrementation groupIdCounter

            this.groupIdCounter += 1;

            xSeats = parseInt(xSeats);
            ySeats = parseInt(ySeats);
            // IMPORTANT : taille de la table
            const rad = 10,
                dia = rad*2,
                gap = 5,
                sideBuff = 10,
                topBuff = 10,
                bottomBuff = 10,
                // size of group box
                sizeX = 10,
            sizeY = 10;

            const items = [];

            var container = new fabric.Rect({
                left: posX,
                top: posY,
                originX: 'left',
                originY: 'top',
                stroke: 'transparent',
                fill: 'transparent',
                width: sizeX,
                height: sizeY,
            });

            container.set("roundSeats", seats);
            container.set("xSeats", xSeats);
            container.set("ySeats", ySeats);
            container.set("seatType", seatType);
            container.set("sectionType","Table");
            container.set("tableType", type);

            container.on('mouse:over', function(e) {
                e.target.set('stroke', 'black');
                this.fabCanvas.renderAll();
            });

            container.on('mouse:out', function(e) {
                // console.log(typeof(e));
                e.target.set('stroke', 'transparent');
                this.fabCanvas.renderAll();
            });
            // set container groupId
            container.groupId = this.groupIdCounter;

            var text = new fabric.IText(name, {
                fontSize: 20,
                fontFamily: 'sans-serif',
                left: (posX),
                top: (posY + topBuff),
                originX: 'center',
                originY: 'top',
                hasControls: false
            });
            // set text groupId
            text.groupId = this.groupIdCounter;
            // set the seatType color
            var color = "green";
            if (seatType === "VIP")
                color = "green";
            else if (seatType === "Normal")
                color = "yellow";
            else if (seatType === "Economy")
                color = "blue";
            if (type === 'rect') {

                // calculate height and width of table
                let tableWidth = (1*dia) + (2*gap), // 55 by default
                 tableHeight = tableWidth;       // 55 by default
                if (xSeats >= 1)
                    tableWidth = (xSeats*dia) + ((xSeats+1)*gap);
                if (ySeats >= 1)
                    tableHeight = (ySeats*dia) + ((ySeats+1)*gap);

                var wholeWidth = tableWidth;
                if (ySeats > 0)
                    wholeWidth = wholeWidth + dia*2 + gap*2;
                var wholeHeight = tableHeight;
                if (xSeats > 0)
                    wholeHeight = wholeHeight + dia*2 + gap*2;

                // resize container to accomodate text and table
                if (text.width > wholeWidth) {
                   var contWidth = sideBuff*2 + text.width;
                } else {
                    contWidth = sideBuff*2 + wholeWidth;
                }
                container.setWidth(contWidth);
                container.setHeight(topBuff*2 + text.height + wholeHeight + bottomBuff);

                // position text in middle of box
                text.setLeft(posX + contWidth/2);

                // build table object
                var table = new fabric.Rect({
                    stroke: 'black',
                    fill: 'white',
                    width: tableWidth,
                    height: tableHeight,
                    left: (posX + container.width/2),
                    top: (text.top + text.height + topBuff) + (wholeHeight-tableHeight)/2,
                    originX: 'center',
                    originY: 'top'
                });
                // set table groupId
                table.groupId = this.groupIdCounter;

                // intégrer les éléments dans items
                items.push(container);
                items.push(text);
                items.push(table);

                // creation des chaise à l'horizontal
                if (xSeats > 0) {
                    var leftStart = table.left - tableWidth/2 + gap + rad;
                    var topPos = (text.top + text.height + topBuff) + rad;
                    var bottomPos = (text.top + text.height + topBuff) + dia + gap*2 + tableHeight + rad;
                    for (var i = 0; i < xSeats; i++) {
                        var circleT = new fabric.Circle({
                            radius: rad,
                            fill: color,
                            left: leftStart + dia*i + gap*i,
                            top: topPos,
                            originX: 'center',
                            originY: 'center'
                        });
                        var circleB = new fabric.Circle({
                            radius: rad,
                            fill: color,
                            left: leftStart + dia*i + gap*i,
                            top: bottomPos,
                            originX: 'center',
                            originY: 'center'
                        });
                        // set circleT groupId
                        circleT.groupId = this.groupIdCounter;
                        // set circleB groupId
                        circleB.groupId = this.groupIdCounter;
                        // set circleT price
                        this.addPriceToObject(circleT, price);
                        // set circleB price
                        this.addPriceToObject(circleB, price);
                        // set circleT seatType
                        // circleT.seatType = type;
                        // set circleB seatType
                        // circleB.seatType = type;
                        items.push(circleT);
                        items.push(circleB);
                    }
                }

                // création des chaises en vertical
                if (ySeats > 0) {
                    var topStart = (text.top + text.height + topBuff) + (wholeHeight-tableHeight)/2 + gap + rad;
                    var leftPos = table.left - tableWidth/2 - gap - rad;
                    var rightPos = table.left + tableWidth/2 + gap + rad;
                    for (var i = 0; i < ySeats; i++) {
                        var circleL = new fabric.Circle({
                            radius: rad,
                            fill: color,
                            left: leftPos,
                            top: topStart + dia*i + gap*i,
                            originX: 'center',
                            originY: 'center'
                        });
                        var circleR = new fabric.Circle({
                            radius: rad,
                            fill: color,
                            left: rightPos,
                            top: topStart + dia*i + gap*i,
                            originX: 'center',
                            originY: 'center'
                        });
                        circleL.groupId = this.groupIdCounter;

                        circleR.groupId = this.groupIdCounter;
                        this.addPriceToObject(circleL, price);

                        this.addPriceToObject(circleR, price);

                        items.push(circleL);
                        items.push(circleR);
                    }
                } // if seats on y axis
            } // if table = rect

            if (type == 'round') {
                // calculate the size of the table
                var tableRad = rad + gap;
                if (seats >= 4 && seats < 6)
                    tableRad = rad*1.5;
                if (seats >= 6 && seats < 9)
                    tableRad = rad*2;
                if (seats >= 9 && seats < 13)
                    tableRad = rad*3.5;
                var wholeDia = tableRad * 2 + dia*2 + gap*2;

                // resize container to accomodate text and table
                if (text.width > wholeDia) {
                    contWidth = sideBuff*2 + text.width;
                } else {
                    contWidth = sideBuff*2 + wholeDia;
                }
                container.setWidth(contWidth);
                container.setHeight(topBuff*2 + text.height + wholeDia + bottomBuff);

                // position text in middle of box
                text.setLeft(posX + contWidth/2);

                //creation table en cercle
                var table = new fabric.Circle({
                    radius: tableRad,
                    stroke: 'black',
                    fill: 'white',
                    left: (posX + container.width/2),
                    top: (text.top + text.height + topBuff) + dia + gap,
                    originX: 'center',
                    originY: 'top'
                });

                table.groupId = this.groupIdCounter;

                items.push(container);
                items.push(text);
                items.push(table);

                //chaise pour les tables en cercle
                var pi = 3.1415926535897932384626433832795;
                var deg = (2*Math.PI)/seats; // uses radians
                for (var i = 0; i < seats; i++) {
                    var angle = deg*i;
                    var xPos = Math.cos(angle)*(tableRad + gap + rad) + table.left;
                    var yPos = Math.sin(angle)*(tableRad + gap + rad) + (table.top + tableRad);

                    var circle = new fabric.Circle({
                        radius: rad,
                        fill: color,
                        left: xPos,
                        top: yPos,
                        originX: 'center',
                        originY: 'center'
                    });
                    // set circle groupId
                    circle.groupId = this.groupIdCounter;
                    // set circle price
                    this.addPriceToObject(circle, price);
                    // set circle seatType
                    // circle.seatType = type;

                    items.push(circle);
                }
            }

            var group = new fabric.Group(items, {
                lockScalingX: false,
                lockScalingY: false,
                originX: 'center',
                originY: 'center'
            });
            // set group sectionType
            group.sectionType = "table";
            this.fabCanvas.add(group);
            this.fabCanvas.renderAll();
        },
        addPriceToObject(object, price){

            if ((price == undefined||(price<0))){
                price = 999999;
            }
            // console.log("addPriceToObject adding: "+price);
            object.price = price;
        },
        RemoveSeat() {
            this.removeSelectedSeat();
        }
    },
    created(){
        BusCreate.$on('fabricCanvas', fabCanvas => {
            this.fabCanvas=fabCanvas;
            //console.log(pathArray[3].split('-')[1]);
            axios.get("/api/event/get-map/"+pathArray[4])
                .then(response => {

                    fabCanvas.loadFromJSON(response.data);
                    // get the array of fabric objects stored in the canvas object
                    var fabGroupObjects = fabCanvas.getObjects();
                    // get the max groupID in the array of groups
                    fabGroupObjects.forEach(group => {
                        if (group.sectionType != "generalArea"){
                            group.lockScalingX = group.lockScalingY = true;}
                        var fabObjects = group.getObjects();
                        // get first object
                        var fabObject = fabObjects[0];
                        // check if this objects groupId is greater than the current groupId counter
                        if(this.groupIdCounter < fabObject.groupId){
                            // set groupIdCounter to the new max value
                            this.groupIdCounter = fabObject.groupId;
                        }
                    });
                    this.nbrSeat=this.countTotalSeats(response.data.objects);
                });
        });
        BusCreate.$on('sigMakeSeating', (posX, posY, cols, rows, name, type, colStart, rowStart, price) => {
            this.makeSeating(posX, posY, cols, rows, name, type, colStart, rowStart, price);
        });
        BusCreate.$on('sigEditSeating', ()=>{
            this.editSeating();
        });
        BusCreate.$on('sigDeleteSeating', () => {
            this.deleteSeating();
        });
        // listens for a signal saying to create a new general section
        BusCreate.$on('sigMakeGeneral', (posX, posY, sizeX, sizeY, name, color, price)=>{
            this.makeGeneral(posX, posY, sizeX, sizeY, name, color, price);
        });
        BusCreate.$on('sigMakeTable', (posX, posY, type, seats, xSeats, ySeats, name, seatingType, price)=>{
            // console.log("On Sig Make Table:");

            this.makeTable(posX, posY, type, seats, xSeats, ySeats, name, seatingType, price);
        });
        // charger un canvas depuis un fichier json

    },
    components: {ToolbarVertical,SidebarRight,CanvasElement,EditForm,AddForm}
});
const vm_buy = new Vue({
    data:{
        mapData:{},
        fabCanvas: null
    },
    methods:{
        menuPopperUpper(object) {
            console.log("MenuPopperUpper");
            //this.showBuySeatForm = true;
            //  bus.$emit('sigBuySeatFormOn', object, object.price);   //TODO: price and color of original object
            /*if (object.fill != "gray") { //"Gray", as in the cultural perception of what is colorless enough.
                object.selectable = false;
            }*/
        }
    },
    created(){
        // loads a canvas instance from the data store in seat-map.json
        BusBuy.$on('fabricCanvasUser', fabCanvas => {
            this.fabCanvas=fabCanvas;

            axios.get("/api/event/get-map/"+eventId)
                .then(response =>{
                 //console.log(response.data);
                this.fabCanvas.loadFromJSON(response.data);
                var groups = Array.from(this.fabCanvas.getObjects());
                groups.forEach((section) => {
                    section._restoreObjectsState();
                    var sectionObjects = Array.from(section.getObjects());
                    this.fabCanvas.remove(section);
                    sectionObjects.forEach((object) => {
                        //CNF: Object is selectable but not editable besides purchasing.
                        // console.log(object);
                        object.lockScalingX = object.lockScalingY = true;
                        object.lockMovementX = object.lockMovementY = true;
                        object.lockRotation = true;
                        object.selectable = object.hasControls = false;
                        object.dirty = true;
                        //CNF: Disable any text objects.
                        if (object.get('type') === 'text' || object.get('type') === 'i-text')  {
                            //object.selectable = false;
                            object.editable = false;
                        }
                        if ((object.price != undefined) && (object.deleted != true)) {
                            object.selectable = true;
                            //Info on 'selected' from https://github.com/kangax/fabric.js/wiki/Working-with-events
                            // object.on('selected', function (opt) {
                            //     vm.menuPopperUpper(object);
                            // });
                        }
                        if(object.get('type') === 'rect'){
                            object.selectable = false;
                        }
                        this.fabCanvas.add(object);
                        this.fabCanvas.renderAll();
                    });
                });
            });
        });
    },
    components :{CanvasElementUser,SidebarRightUser,FormulaireAchat}
});
mountTemplateByContext(vm_create,vm_buy);

