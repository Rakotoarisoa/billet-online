<template>
    <div id="canvas-element" class="container" style="margin-left:-10px;z-index:1;" v-show="fabricCanvas">
            <div class="panel panel-default">
                <canvas id="c" data-toggle="popover"></canvas>
            </div>
    </div>
</template>

<script>
    import Bus from './Bus'
    export default {
        name: "CanvasElement",
        template:"#canvas-element",
        data() {
            return {
                fabCanvas : null,
                fabricCanvas : true,
                totalSeats : 0,
                deletedSeats : 0
            }
        },
        mounted() {
            this.fabCanvas = new fabric.Canvas('c');
            this.fabCanvas.setWidth(window.innerWidth*80/100);//window.innerWidth
            this.fabCanvas.setHeight(window.innerHeight*80/100);//window.innerHeight
            var editGroup = null;
            var seatEditing = false;
// resize canvas when window resizes
            $(window).resize(() =>{
                this.fabCanvas.setWidth(window.innerWidth*80/100);
                this.fabCanvas.setHeight(window.innerHeight*90/100);
                this.fabCanvas.calcOffset();
            });

// canvas zooming
            this.fabCanvas.on('mouse:wheel', opt => {
                var delta = opt.e.deltaY;
                //var pointer = this.fabCanvas.getPointer(opt.e);
                var zoom = this.fabCanvas.getZoom();
                zoom = zoom + delta/200;
                if (zoom > 20) zoom = 20;
                if (zoom < 0.01) zoom = 0.01;
                this.fabCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
                // fabCanvas.setZoom(zoom);
                opt.e.preventDefault();
                opt.e.stopPropagation();
            });
//Added :: ZoomIn / Zoom Out Button //Andry
            $(()=>{


                $('#zoomIn').click(()=>{
                    this.fabCanvas.setZoom(this.fabCanvas.getZoom() * 1.1 ) ;
                    this.stopPropagation();
                });
                $('#zoomOut').click(()=>{
                    this.fabCanvas.setZoom(this.fabCanvas.getZoom() / 1.1 ) ;
                    this.stopPropagation();
                });
                //Added :: Panning //Andry
                $('#goRight').click(()=>{
                    var units = 20 ;
                    var delta = new fabric.Point(units,0) ;
                    this.fabCanvas.relativePan(delta) ;
                });
                $('#goLeft').click(()=>{
                    var units = 20 ;
                    var delta = new fabric.Point(-units,0) ;
                    this.fabCanvas.relativePan(delta) ;
                });
                $('#goUp').click(()=>{
                    var units = 20 ;
                    var delta = new fabric.Point(0,-units) ;
                    this.fabCanvas.relativePan(delta) ;
                });
                $('#goDown').click(()=>{
                    var units = 20 ;
                    var delta = new fabric.Point(0,units) ;
                    this.fabCanvas.relativePan(delta) ;
                });

            });

//-------------------------------------------------------

            //export {removeSeat, editSeating, regroupSeating}
// canvas panning - adapted from http://jsfiddle.net/gncabrera/hkee5L6d/5/
// pans with mouse click only
// var panning = false;
// fabCanvas.on('mouse:up', function(e) {
//     panning = false;
// });
// fabCanvas.on('mouse:down', function(e) {
//     if (e.target == null) {
//         panning = true;
//     }
// });
// fabCanvas.on('mouse:move', function (e) {
//     if (panning && e && e.e) {
//         //debugger;
//         var units = 10;
//         var delta = new fabric.Point(e.e.movementX, e.e.movementY);
//         fabCanvas.relativePan(delta);
//     }
// });

// pans with alt key
            this.fabCanvas.on('mouse:down', opt => {
                var evt = opt.e;
                if (evt.altKey === true) {
                    this.isDragging = true;
                    this.selection = false;
                    this.lastPosX = evt.clientX;
                    this.lastPosY = evt.clientY;
                }
                if(!this.fabCanvas.getActiveObject()){
                    $(".popup").remove();
                }
            });
            this.fabCanvas.on('mouse:move', opt => {
                if (this.isDragging) {
                    var e = opt.e;
                    this.viewportTransform[4] += e.clientX - this.lastPosX;
                    this.viewportTransform[5] += e.clientY - this.lastPosY;
                    this.renderAll();
                    this.lastPosX = e.clientX;
                    this.lastPosY = e.clientY;
                }
            });
            this.fabCanvas.on('mouse:up', opt => {
                this.isDragging = false;
                this.selection = true;
            });
            this.fabCanvas.on('object:selected', e =>{
                if(e.target.type=="circle") {
                    Bus.$emit('sigAddSeatPopup', [e.target.oCoords.mt.x, e.target.oCoords.mt.y, e.target.width]);
                } else {
                    Bus.$emit('sigAddSectionPopup', [e.target.oCoords.mt.x, e.target.oCoords.mt.y, e.target.width]);
                }
            });
            this.fabCanvas.on('object:modified',e =>{
                if(e.target.type=="circle") {
                    Bus.$emit('sigAddSeatPopup', [e.target.oCoords.mt.x, e.target.oCoords.mt.y, e.target.width]);
                } else {
                    Bus.$emit('sigAddSectionPopup', [e.target.oCoords.mt.x, e.target.oCoords.mt.y, e.target.width]);
                }
            });
            this.fabCanvas.on('object:moving',e =>{
                $(".popup").remove();
            });

// Ajout d'autres propriétés pour le type d'objet Rect
            fabric.Rect.prototype.toObject = (toObject=>{
                return function(){
                    return fabric.util.object.extend(toObject.call(this),{
                        price: this.price,
                        groupId: this.groupId,
                        seatType: this.seatType,
                        roundSeats: this.roundSeats,
                        xSeats: this.xSeats,
                        ySeats: this.ySeats
                    });
                };
            })(fabric.Rect.prototype.toObject);

// Ajout d'autres propriétés pour le type d'objet i-text
            fabric.IText.prototype.toObject = (toObject=>{
                return function(){
                    return fabric.util.object.extend(toObject.call(this),{
                        groupId: this.groupId,
                    });
                };
            })(fabric.IText.prototype.toObject);

// Ajout d'autres propriétés pour le type d'objet Cercle(chaise)
            fabric.Circle.prototype.toObject = (toObject=>{
                return function(){
                    return fabric.util.object.extend(toObject.call(this),{
                        price: this.price,
                        groupId: this.groupId,
                        rowName: this.rowName,
                        colName: this.colName,
                        deleted: this.deleted,
                        seatType: this.seatType,
                        seatName:this.rowName+this.colName
                    });
                };
            })(fabric.Circle.prototype.toObject);

// Ajout d'autres propriétés pour le type d'objet groupe, (ensemble de chaises, table)
            fabric.Group.prototype.toObject = (toObject=>{
                return function(){
                    return fabric.util.object.extend(toObject.call(this),{
                        sectionType: this.sectionType,
                        rows: this.rows,
                        cols: this.cols,
                        rowStart: this.rowStart,
                        colStart: this.colStart,

                    });
                };
            })(fabric.Group.prototype.toObject);

// a vue bus instance that is used to communicate between
// vue applications and vue components using signals
// that are defined inside the create methods of each party
// signals are decided upon up front.
//var bus = new Vue();

// Place dans canvas pour ajouter un nouvel objet
            var startX = 200;
            var startY = 100;
            //export {startX,startY}
            Bus.$emit('fabricCanvas', this.fabCanvas);
            //console.log(Bus);
        }
    }
</script>

<style scoped>

</style>