<template>
    <div class="modal fade" id="editerObjet" tabindex="-1" role="dialog" aria-labelledby="editerObjet"
         aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="">Modifier un objet</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Fermer">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <ul class=" overflow-auto">
                        <form>
                        <!-- v-model directive binds data from field to data in Vue instance -->
                        Nom de l'objet: <input class="form-control" type="text" id="editName" value="Test Name"
                                    v-model="sectionName" placeholder="Nom de l'objet">
                        Prix: <input class="form-control" type="number" id="newPrice" style="width: 100"
                                     v-model="price">

                        <!--<p>Seating Type</p><br>-->
                        <h5>Type d'objet :</h5>
                        <form>
                            <ul class="list-unstyled list-inline">
                                <li class="list-inline-item">
                                    <div class="form-check form-check-inline">
                                        <input id="seating" class="form-check-input" type="radio"
                                               name="SectionType"
                                               value="Seating" v-model="sectionType">
                                        <label class="form-check-label" for="seating">Chaise</label>
                                    </div>
                                </li>
                                <li class="list-inline-item">
                                    <div class="form-check form-check-inline">
                                        <input id="table" class="form-check-input" type="radio"
                                               name="SectionType"
                                               value="Table" v-model="sectionType">
                                        <label class="form-check-label" for="table">Table</label>
                                    </div>
                                </li>
                                <li class="list-inline-item">
                                    <div class="form-check form-check-inline">
                                        <input id="section" class="form-check-input" type="radio"
                                               name="SectionType" value="General"
                                               v-model="sectionType">
                                        <label class="form-check-label" for="section">Section</label>
                                    </div>
                                </li>
                            </ul>
                        </form>
                        <template v-if="sectionType!='General'">
                            <h5>Catégorie:</h5>
                            <form>
                                <ul class="list-unstyled list-inline">
                                    <li class="list-inline-item">
                                        <div class="form-check form-check-inline">
                                            <input id="VIP" class="form-check-input" type="radio" name="Type"
                                                   value="VIP"
                                                   v-model="seatingType"> <label class="form-check-label"
                                                                                 for="VIP"> VIP</label></div>
                                    </li>
                                    <li class="list-inline-item">
                                        <div class="form-check form-check-inline">
                                            <input id="normal" class="form-check-input" type="radio" name="Type"
                                                   value="Normal"
                                                   v-model="seatingType"><label class="form-check-label"
                                                                                for="normal"> Normal</label>
                                        </div>
                                    </li>
                                    <li class="list-inline-item">
                                        <div class="form-check form-check-inline">
                                            <input id="economy" class="form-check-input" type="radio"
                                                   name="Type" value="Economy"
                                                   v-model="seatingType">
                                            <label class="form-check-label" for="economy">Economie</label>
                                        </div>
                                    </li>
                                </ul>
                            </form>
                        </template>
                        <template v-if="sectionType=='Seating'">
                                <form>
                                    <div class="form-inline">
                                        <div class="form-group">
                                            <label for="addCols">Colonnes:</label> <input
                                                class="form-control col-md-5" type="text" id="addCols" value="5"
                                                v-model="columns" placeholder="0">
                                        </div>
                                        <div class="form-group">
                                            <label for="addRows">Rangs:</label>
                                            <input class="form-control col-md-5" type="text" id="addRows" value="7"
                                                   v-model="rows" placeholder="#">
                                        </div>
                                    </div>
                                    <div class="form-inline">
                                        <div class="form-group">
                                            <label for="colnumStart">Identifiant colonnes commencant par :</label><input
                                                class="form-control" type="text" id="colNumStart" value="7"
                                                v-model="colStart" placeholder="#">
                                        </div>
                                        <div class="form-group">
                                            <label for="rowNameStart">Rangées commencant par:</label>
                                            <select class="form-control" id="rowNameStart" v-model="rowStart">
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                                <option value="E">E</option>
                                                <option value="F">F</option>
                                                <option value="G">G</option>
                                                <option value="H">H</option>
                                                <option value="I">I</option>
                                                <option value="J">J</option>
                                                <option value="K">K</option>
                                                <option value="L">L</option>
                                                <option value="M">M</option>
                                                <option value="N">N</option>
                                                <option value="O">O</option>
                                                <option value="P">P</option>
                                                <option value="Q">Q</option>
                                                <option value="R">R</option>
                                                <option value="S">S</option>
                                                <option value="T">T</option>
                                                <option value="U">U</option>
                                                <option value="V">V</option>
                                                <option value="W">W</option>
                                                <option value="X">X</option>
                                                <option value="Y">Y</option>
                                                <option value="Z">Z</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </template>
                        <template v-else-if="sectionType=='Table'">
                                <h5>Type de table:</h5>
                                <form>
                                    <ul class="list-unstyled list-inline">
                                        <div class="form-check-inline">
                                            <li class="list-inline-item"><input class="form-check-input" id="ronde"
                                                                                type="radio" name="Type" value="round"
                                                                                v-model="tableType"><label
                                                    class="form-check-label" for="ronde">Ronde</label></li>
                                        </div>
                                        <div class="form-check-inline">
                                            <li class="list-inline-item"><input class="form-check-input" id="rectangle"
                                                                                type="radio" name="Type" value="rect"
                                                                                v-model="tableType"><label
                                                    class="form-check-label" for="rectangle">Rectangle</label></li>
                                        </div>
                                    </ul>
                                </form>
                            </template>
                        <template v-else>
                            <form>
                                <h6>Couleur:</h6>
                                <input class="form-control col-md-2" type="text" id="colorSelect" value="ffffff"
                                       v-model="sectionColor">
                            </form>
                        </template>
                        <!--<Section-Type></Section-Type>-->

                        <template v-if="tableType=='round' && sectionType=='Table'">
                            <div class="col-sm-12">
                                <label for="ronde">Nombre de chaises:</label> <input class="form-control"
                                                                                     type="text" id="addRoundSeats"
                                                                                     value="5"
                                                                                     v-model="roundSeats"
                                                                                     placeholder="">
                            </div>
                        </template>
                        <template v-if="tableType=='rect' && sectionType=='Table'">
                            <div class="col-sm-12">
                                <label for="addXSeats">Chaise en horizontal:</label> <input class="form-control"
                                                                                            type="text" id="addXSeats"
                                                                                            value="5" v-model="xSeats"
                                                                                            placeholder="">
                                <label for="addYSeats">Chaise en vertical:</label> <input class="form-control"
                                                                                          type="text" id="addYSeats"
                                                                                          value="5" v-model="ySeats"
                                                                                          placeholder="">
                            </div>
                        </template>
                        <!-- v-on calls "submitSeatingData" when a click event is detected on this button  -->
                        <!-- Debugging to see that the form toggle flag is being set -->
                        <!--<p v-show="false"><span>{{showAddSeatForm}}</span></p>-->
                        </form>
                    </ul>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                <button type="button" class="btn btn-primary" v-on:click="submitEditSeating" data-dismiss="modal">
                    Valider
                </button>
            </div>
        </div>
    </div>
    </div>
    <!--End Edit Modal -->
</template>

<script>
    import Bus from './Bus'

    export default {
        name: "EditForm",
        template: '#edit-form',
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
                fabCanvas: null
            };
        },
        methods: {
            //Ajout Elément sur le sidebar droit sur l'objet  sélectionné sur le canvas
            addSeatPopupMenu(x, y, w) {
                $(".popup").remove();
                var btnLeft = x;
                var btnTop = y - 25;
                var widthadjust = w / 2;
                btnLeft = widthadjust + btnLeft - 25;
                var popup = "<ul id='popup' class='popup' style='position:absolute;top:" + btnTop + "px;left:" + btnLeft + "px;cursor:pointer;'>" +
                    '<button class="btn" type="button" onclick="removeSeat();">Supprimer</button>' +
                    "</ul>";
                $(".canvas-container").append(popup);
            },
            //Ajout popup sur un groupe d'objet ( Table, groupe de chaises, sections)
            addSectionPopupMenu(x, y, w) {
                $(".popup").remove();
                var btnLeft = x;
                var btnTop = y - 25;
                var widthadjust = w / 2;
                btnLeft = widthadjust + btnLeft - 25;
                var popup = "<ul id='popup' class='popup' style='position:absolute;top:" + btnTop + "px;left:" + btnLeft + "px;cursor:pointer;'>" +
                    '<button class="btn" type="button" onclick="editSeating();">Modifier</button><br>' +
                    '<button class="btn" type="button" onclick="regroupSeating();">Terminé</button>' +
                    "</ul>";
                $(".canvas-container").append(popup);
            },
            //Appelé lors de la validation du formulaire
            submitEditSeating() {
                if (this.fabCanvas.getActiveObject() != null) {
                    var coords = this.fabCanvas.getActiveObject().calcCoords();
                    var object = this.fabCanvas.getActiveObject();
                    // &&(object.sectionType == "seating")
                    this.fabCanvas.remove(object);
                    this.fabCanvas.renderAll();
                    if ((this.sectionType == "Seating")) {//pour le type d'objet chaise
                        Bus.$emit('sigMakeSeating', coords.tl.x, coords.tl.y, this.columns, this.rows, this.sectionName, this.seatingType, this.colStart, this.rowStart, this.price);
                    } else if (this.sectionType == "Table") {//pour le type d'objet Table
                        Bus.$emit('sigMakeTable', coords.tl.x, coords.tl.y, this.tableType, this.roundSeats, this.xSeats, this.ySeats, this.sectionName, this.seatingType, this.price);
                    } else if (this.sectionType == "General") {//pour le type d'objet section
                        Bus.$emit('sigMakeGeneral', coords.tl.x, coords.tl.y, 300, 200, this.sectionName, this.sectionColor, this.price);
                    }
                }
                this.showEditSeatingForm = false;
            },
            //edition d'un groupe d'objets
            seatEdit() {
                var selectedGroup = this.fabCanvas.getActiveObject();
                if (selectedGroup != null) {
                    editGroup = selectedGroup.getObjects();
                    selectedGroup._restoreObjectsState();
                    this.fabCanvas.remove(selectedGroup);

                    for (var i = 0; i < editGroup.length; i++) {
                        this.fabCanvas.add(editGroup[i]);
                        editGroup[i].dirty = true;
                        editGroup[i].lockMovementX = true;
                        editGroup[i].lockMovementY = true;
                        this.fabCanvas.item(this.fabCanvas.size() - 1).hasControls = false;
                    }
                    // if you have disabled render on addition
                    this.fabCanvas.renderAll();
                    seatEditing = true;
                }
            },
            //regrouper les éléments du groupe
            regroupEdit() {
                //console.log(editGroup);
                if (editGroup != null) {
                    for (var i = 0; i < editGroup.length; i++) {
                        editGroup[i].lockMovementX = false;
                        editGroup[i].lockMovementY = false;
                        this.fabCanvas.remove(editGroup[i])
                    }
                    var group = new fabric.Group(editGroup, {
                        lockScalingX: true,
                        lockScalingY: true
                    });
                    this.fabCanvas.add(group);
                    this.fabCanvas.renderAll();
                    editGroup = null;
                    seatEditing = false;
                }
                // for(var i = 0; i < fabCanvas._objects.length; i++){
                //     console.log(i)
                //     console.log(fabCanvas._objects[i])
                // }
            },
            //d
            removeSelectedSeat() {
                var seat = this.fabCanvas.getActiveObject();
                if (seatEditing && !seat.deleted) {
                    //console.log(seat)
                    seat.fill = 'transparent';
                    seat.stroke = 'gray';
                    seat.dirty = true;
                    seat.deleted = true;
                    //console.log(seat)
                } else if (seatEditing && seat.deleted) {
                    if (seat.type === "VIP")
                        color = "green";
                    else if (seat.type === "Normal")
                        color = "yellow";
                    else if (seat.type === "Economy")
                        color = "blue";
                    seat.color = color;
                    seat.stroke = 'transparent';
                    seat.dirty = true;
                    seat.deleted = false;
                }
                this.fabCanvas.renderAll();
            }
        },
        created() {
            Bus.$on('fabricCanvas', fabCanvas => {
                // console.log(fabCanvas);
                this.fabCanvas = fabCanvas;
            });
            // écouteur d'évènements Bus lorsque le formulaire est appelé
            Bus.$on('sigEditSeatFormOn', () => {
                this.showEditSeatingForm = true;
                var group = this.fabCanvas.getActiveObject();
                var groupObjects = group.getObjects();
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
            Bus.$on('sigEditSeatFormOff', () => {
                this.showEditSeatingForm = false;
            });
            Bus.$on('sigAddSeatPopup', (args) => {
                //this.addSeatPopupMenu(args[0], args[1], args[2]);
            });
            Bus.$on('sigAddSectionPopup', (args) => {
                //this.addSectionPopupMenu(args[0], args[1], args[2]);
            });
            Bus.$on('sigRemoveSeat', () => {
                $(".popup").remove();
                this.removeSelectedSeat();
            });
            Bus.$on('sigEditSeating', () => {
                $(".popup").remove();
                this.seatEdit();
            });
            Bus.$on('sigRegroupSeating', () => {
                $(".popup").remove();
                this.regroupEdit();
            });
        }
    };
</script>

<style scoped>

</style>