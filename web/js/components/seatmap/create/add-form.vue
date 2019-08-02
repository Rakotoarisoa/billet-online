<template>
    <div id="add-form">
        <div id="ajoutObjet" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="ajoutObjet"
             aria-hidden="false">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Ajouter un objet</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Fermer">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <ul class="overflow-auto">
                            <form>
                                <!-- v-model directive binds data from field to data in Vue instance -->
                                Nom de l'objet: <input class="form-control" type="text" id="addName" value="Nom objet"
                                                       v-model="sectionName" placeholder="Nom de l'objet"/>
                                <!--<p>Seating Type</p><br>-->
                                Prix: <input class="form-control" type="number" id="addPrice" value="100"
                                             v-model="price"/>
                                <h5>Type d'objet:</h5>
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
                                        <div class="form">
                                            <div class="form-group">
                                                <label for="colnumStart">Identifiant colonnes commencant par
                                                    :</label><input class="form-control col-md-2" type="text" id="colNumStart"
                                                                    value="7" v-model="colStart" placeholder="#">
                                            </div>
                                            <div class="form-group">
                                                <label for="rowNameStart">Rangées commencant par:</label>
                                                <select class="form-control  col-md-2" id="rowNameStart" v-model="rowStart">
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
                                                                                    type="radio" name="Type"
                                                                                    value="round"
                                                                                    v-model="tableType"><label
                                                        class="form-check-label" for="ronde">Ronde</label></li>
                                            </div>
                                            <div class="form-check-inline">
                                                <li class="list-inline-item"><input class="form-check-input"
                                                                                    id="rectangle" type="radio"
                                                                                    name="Type" value="rect"
                                                                                    v-model="tableType"><label
                                                        class="form-check-label" for="rectangle">Rectangle</label></li>
                                            </div>
                                        </ul>
                                    </form>
                                </template>
                                <template v-else>
                                    <form>
                                        <h6>Couleur:</h6>
                                        <input class="form-control col-md-2" type="color" id="colorSelect" value="ffffff"
                                               v-model="color">

                                    </form>
                                </template>
                                <!--<Section-Type></Section-Type>-->

                                <template v-if="tableType=='round' && sectionType=='Table'">
                                    <div class="col-sm-12">
                                        <label for="ronde">Nombre de chaises:</label>
                                        <input class="form-control col-md-2"
                                               type="text" id="addRoundSeats"
                                               value="5"
                                               v-model="roundSeats"
                                               placeholder="">
                                    </div>
                                </template>
                                <template v-if="tableType=='rect' && sectionType=='Table'">
                                    <div class="col-sm-12">
                                        <label for="addXSeats"> XSeats:</label>
                                        <input class="form-control col-md-2" type="text"
                                               id="addXSeats" value="5"
                                               v-model="xSeats" placeholder="">

                                        <label for="addYSeats">YSeats:</label>
                                        <input class="form-control col-md-2" type="text"
                                               id="addYSeats" value="5"
                                               v-model="ySeats" placeholder="">
                                    </div>

                                </template>
                            </form>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal"
                                v-on:click="submitSeatingData">Valider</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import Bus from './Bus'
    //import {startY ,startX} from './canvas'
    export default {
        name: "AddForm",
        template: '#add-form',
        data() {
            return {
                sectionName: "",
                seatingType: "Normal",
                sectionType: "Seating",
                tableType: "round",
                roundSeats: 4,
                xSeats: 2,
                ySeats: 2,
                columns: 5,
                rows: 5,
                colStart: 1,
                rowStart: "A",
                color: "ffffff",
                showAddSeatForm: false,
                price: 20000
                //DONNEES PAR DEFAUT
            }
        },
        methods: {
            // Appel par le bouton submit via v-on:click
            submitSeatingData() {
                const startX = 100, startY = 200;
                if (this.sectionType == "Seating")
                    Bus.$emit('sigMakeSeating', startX, startY, this.columns, this.rows, this.sectionName, this.seatingType, this.colStart, this.rowStart, parseInt(this.price));
                else if (this.sectionType == "Table")
                    Bus.$emit('sigMakeTable', startX, startY, this.tableType, this.roundSeats, this.xSeats, this.ySeats, this.sectionName, this.seatingType, parseInt(this.price));
                else if (this.sectionType == "General")
                    Bus.$emit('sigMakeGeneral', startX, startY, 300, 200, this.sectionName, this.color, parseInt(this.price));

                // set toggle the seating forms visibility since the seating section has been created.
                this.showAddSeatForm = false;
            }
        },
        // Appel lorsque le composant est créé
        created() {
            // Activation formulaire
            Bus.$on('sigAddSeatFormOn', () => {
                this.showAddSeatForm = true;
            });
            // Desactiver Formulaire
            Bus.$on('sigAddSeatFormOff', () => {
                this.showAddSeatForm = false;
            });
        },
    };
</script>

<style scoped>

</style>