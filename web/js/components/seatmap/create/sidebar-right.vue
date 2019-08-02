<template>
    <div id="sidebar-right" class="row">
        <div>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Décompte</h5>
                    <blockquote class="card-text">
                        <ul>
                            <li>Nombre de chaises:</li>
                            <li>Par catégorie:</li>
                            <li>Nombre de places:</li>
                        </ul>
                    </blockquote>
                </div>
            </div>
            <div class="card" v-if="showEditObject">
                <div class="card-body">
                    <h5 class="card-title">Info sur l'objet</h5>
                    <blockquote class="card-text">
                        <ul>
                            <li>Nom:{{sectionName}}</li>
                            <li>Type:{{sectionType}}</li>
                            <li>Nombre de places:</li>
                        </ul>
                    </blockquote>
                    <button class="btn btn-primary" v-on:click="editSeat">Modifier</button>
                    <button class="btn btn-danger">Supprimer</button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import Bus from './Bus'

    export default {
        name: "SidebarRight",
        template: "#sidebar-right",
        data() {
            return {
                sectionName: "",
                seatingType: "",
                sectionType: "",
                tableType: "",
                seatType: "",
                roundSeats: this.roundSeats,
                xSeats: this.xSeats,
                ySeats: this.ySeats,
                columns: this.columns,
                rows: this.rows,
                sectionColor: "",
                cols: this.cols,
                colStart: 1,
                rowStart: "A",
                posX: this.posX,
                posY: this.posY,
                showEditSeatingForm: false,
                price: 0,
                fabCanvas: null,
                showEditObject: false
            }
        },
        methods: {
            editSeat(e)
            {
                Bus.$emit('sigDetailsObjSidebar');
            }
        },
        mounted() {
            //this.showEditSeatingForm = true;
            this.fabCanvas.on('object:selected', e => {

                if (e.target.type == "circle") {
                    Bus.$emit('sigAddSeatPopup', [e.target.oCoords.mt.x, e.target.oCoords.mt.y, e.target.width]);
                } else {
                    console.log(e);
                    //Bus.$emit('sigDetailsObjSidebar', [e.target.columns, e.target.rows, this.rowStart, this.sectionName]);
                }
            });
            Bus.$on('sigDetailsObjSidebar',function(){
                console.log(this.fabCanvas);
                let selectedGroup = this.fabCanvas.getActiveObject();
                if (selectedGroup != null){
                    let editGroup = selectedGroup.getObjects();
                    selectedGroup._restoreObjectsState();
                    this.fabCanvas.remove(selectedGroup);
                    for (let i = 0; i < editGroup.length; i++) {
                        this.fabCanvas.add(editGroup[i]);
                        editGroup[i].dirty = true;
                        editGroup[i].lockMovementX = true;
                        editGroup[i].lockMovementY = true;
                        this.fabCanvas.item(this.fabCanvas.size()-1).hasControls = false;
                    }
                    this.fabCanvas.renderAll();
                    var seatEditing = true;
                }
            });
        },
        created() {
            Bus.$on('fabricCanvas', fabCanvas => {
                // console.log(fabCanvas);
                this.fabCanvas = fabCanvas;
                this.fabCanvas.on('object:selected', e => {
                    //this.showEditObject=true;
                    let group = fabCanvas.getActiveObject(),
                        groupObjects = group.getObjects();
                    //initialisation des données du formulaire d'édition depuis l'élémént sélectionné sur le canvas
                    this.rows = groupObjects[0].rows;
                    this.columns = groupObjects[0].cols;
                    this.rowStart = groupObjects[0].rowStart;
                    this.colStart = groupObjects[0].colStart;
                    this.posX = groupObjects[0].left;
                    this.posY = groupObjects[0].top;
                    this.roundSeats = groupObjects[0].roundSeats;
                    this.xSeats = groupObjects[0].xSeats;
                    this.ySeats = groupObjects[0].ySeats;
                    this.tableType = groupObjects[0].tableType;
                    this.sectionName = groupObjects[1].text;
                    this.seatingType = groupObjects[0].seatType;

                    if (group.sectionType == "seating") {
                        this.sectionType = "Seating";
                        this.price = groupObjects[2].price;
                    } else if (group.sectionType == "table") {
                        this.sectionType = "Table";
                        this.price = groupObjects[3].price;
                    } else if (group.sectionType == "generalArea") {
                        this.sectionType = "General";
                        this.sectionColor = groupObjects[0].fill.substring(1);
                        this.price = groupObjects[0].price;
                    }
                });
                //TODO: Check event when no group object is not selected
                this.fabCanvas.on('selection:cleared', e => {
                    this.showEditObject=true;
                });
            });
        }


    }
</script>

<style scoped>
    #sidebar-right {
        background-color: #0b2e13;
    }

</style>