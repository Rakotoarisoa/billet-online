<template>
    <div id="canvas-element-user" class="container" style="margin-left:-10px;z-index:1;" v-show="fabricCanvas">
        <div class="panel panel-default">
            <canvas id="c" data-toggle="popover"></canvas>
        </div>
    </div>
</template>

<script>
    import Bus from './Bus'
    export default {
        name: "CanvasElementUser",
        template: "#canvas-element-user",
        data() {
            return {
                fabCanvas : null,
                fabricCanvas : true
            }
        },
        mounted() {
            this.fabCanvas = new fabric.Canvas('c');
            this.fabCanvas.setWidth(window.innerWidth*80/100);//window.innerWidth
            this.fabCanvas.setHeight(window.innerHeight*80/100);//window.innerHeight
            this.fabCanvas.on('object:selected', function(e){
                console.log(e);
                //Bus.$emit('sigAddSeatPopup', [e.target.oCoords.mt.x, e.target.oCoords.mt.y, e.target.width, e.target.price]);
                Bus.$emit('sigUpdateSidebarRight',[e.target.oCoords.mt.x, e.target.oCoords.mt.y, e.target.width, e.target.price]);
                Bus.$emit('sigInfoSeat');
            });

            this.fabCanvas.on('mouse:down', opt => {
                if(!this.fabCanvas.getActiveObject()){
                    $(".popup").remove();
                }
            });
            //lorsque aucun objet est selectionné, on cache la barre latérale
            this.fabCanvas.on('selection:cleared', e => {
                Bus.$emit('hideSidebar');
            });
            Bus.$emit('fabricCanvasUser', this.fabCanvas);
        }

    }
</script>

<style scoped>

</style>