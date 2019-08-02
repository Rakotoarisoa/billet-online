<template>
    <div id="sidebar-right-user"class="row" data-wow-delay="350ms">
        <div id="tpl-sdb" v-show="!hideSidebar">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Info Place</h5>
                    <blockquote class="card-text" >
                        <ul>
                            <li>Identifiant:{{row}}{{col}}</li>
                            <li>Type:</li>
                            <li>Prix: {{price}}</li>
                        </ul>
                    </blockquote>
                    <button class="btn btn-primary" v-on:click="buySeat">Acheter</button>
                    <button class="btn btn-danger"  v-on:click="cancel">Annuler</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Bus from './Bus'
    export default {
        name: "sidebar-right-user",
        template: "#sidebar-right-user",
        data(){
            return{
                price: 0,
                bought: false,
                fabCanvas: null,
                seatName: null,
                row: null,
                col: null,
                hideSidebar : true
            };
        },
        methods:{
            updateSidebarRight(x,y,w, price) {
                $(".popup").remove();
                var btnLeft = x;
                var btnTop = y - 25;
                var widthadjust=w/2;
                btnLeft = widthadjust+btnLeft-25;
                /*var popup = "<ul id='popup' class='popup' style='position:absolute;top:"+btnTop+"px;left:"+btnLeft+"px;cursor:pointer;'>" +
                    '<h3 type="price", class="price", id="price"">Prix: $'+price+'</h3>' +
                    '<button class="btn" type="button", onclick="buySeating()">Acheter</button>' +
                    '<button class="btn" type="button", onclick="cancelBuying()">Annuler</button>' +
                    "</ul>";
                $(".canvas-container").append(popup);*/
            },
            buySeat(){
                console.log("buySeat!");
                var selectedSeat = this.fabCanvas.getActiveObject();
                if (selectedSeat.fill != "red"){
                    if (selectedSeat.type == "circle"){
                        selectedSeat.fill = "red";
                        selectedSeat.selectable = false;
                        selectedSeat.dirty = true;
                        this.fabCanvas.renderAll();
                    }
                    console.log(selectedSeat);
                    var seatName = " ";
                    if ((selectedSeat.colName != undefined)&&(selectedSeat.rowName != undefined)){
                        seatName = " "+ selectedSeat.rowName + selectedSeat.colName+ " ";
                        // seatName = " "+selectedSeat.name+" ";
                    }
                    alert("Chaise "+seatName+" Reservée.");
                    // // set toggle the seating forms visibility since the seating section has been created.
                    this.showBuySeatForm = false;

                }
            },
            getInfoSelectedSeat() {
                const selectedSeat=this.fabCanvas.getActiveObject();
                this.seatName= selectedSeat.seatName;
                this.col= selectedSeat.colName;
                this.row= selectedSeat.rowName;
                this.price=selectedSeat.price;
            },
            cancel(){
                console.log("Annulé");
                this.showBuySeatForm = false;
            }
        },
        // function that launches when Forms component is created
        // signal listeners must be initialized on component creation
        created(){
            //this.showBuySeatForm = vm.showBuySeatForm;
            Bus.$on('hideSidebar',()=>{
                this.hideSidebar=true;
            });
            Bus.$on('fabricCanvasUser', fabCanvas=>{
                this.fabCanvas=fabCanvas;
            });
            // a "bus stop" signal listener for toggling the visibility of the add seating form.
            Bus.$on('sigBuySeatFormOn', (object, price)=>{
                this.price = price;
                this.showBuySeatForm = true;
                console.log("sigBuySeatFormOn");
            });
            // a bus listener for toggling the visibility of both forms when
            // the delete seating signal is received.
            Bus.$on('sigBuySeatFormOff',()=>{
                this.showBuySeatForm = false;
            });
            Bus.$on('sigUpdateSidebarRight', (args)=>{
                this.updateSidebarRight(args[0], args[1], args[2], args[3]);
            });
            Bus.$on('sigInfoSeat', ()=>{
                this.hideSidebar=false;
                this.getInfoSelectedSeat();
            });
            Bus.$on('sigBuySeating', (args)=>{
                this.buySeat();
            })
        }

    }
</script>

<style scoped>

</style>