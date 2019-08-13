<template>
    <div id="toolbar-vertical" class="toolbar-vertical">
        <div class="col-md-12 col-1 pl-0 pr-0 collapse fade show" id="sidebar">
            <div class="list-group panel">
                <button data-target="#ajoutObjet" class="list-group-item collapsed" data-toggle="modal" v-on:click='setAddSeating'><i class="fa fa-plus fa-fw" ></i></button>
                <button data-target="#editerObjet" class="list-group-item collapsed" data-toggle="modal" v-on:click='setEditTool'><i class="fa fa-edit fa-fw"></i></button>
                <button data-target="#menu3" class="list-group-item collapsed" data-toggle="collapse" data-parent="#sidebar" aria-expanded="false" v-on:click="setDeleteSeating"><i class="fa fa-remove fa-fw"></i> </button>
                <button id="goUp"  class="list-group-item collapsed" data-parent="#sidebar"><i class="fa fa-arrow-up fa-fw"></i></button>
                <button id="goDown" class="list-group-item collapsed" data-parent="#sidebar"><i class="fa fa-arrow-down fa-fw"></i></button>
                <button id="goLeft" class="list-group-item collapsed" data-parent="#sidebar"><i class="fa fa-arrow-left fa-fw"></i></button>
                <button id="goRight" class="list-group-item collapsed" data-parent="#sidebar"><i class="fa fa-arrow-right fa-fw"></i></button>
                <button id="" class="list-group-item collapsed" data-parent="#sidebar" v-on:click = 'performDownload'><i class="fa fa-check fa-fw"></i></button>
            </div>
        </div>


    </div>

</template>

<script>
    import Bus from './Bus'
    import axios from 'axios'
    export default {
        name: "ToolbarVertical",
        template: '#toolbar-vertical',
        data() {
            return {
                fabCanvas : null
            }
        },
        methods: {
            preventDropmenuClosing(e) {
                $('.toolbar-vertical').on('click', (e) => {
                    // console.log(e);
                    // console.log('stopped');
                    e.stopPropagation();
                });
            },
            performDownload(){
                //TODO : enregistrer les données de la carte .
                // console.log("download performing on "+ name);
                var fileName = "seat-map.json";
                let pathArray = window.location.pathname.split('/');
                const api = axios.create({baseURL: pathArray[0]});
                api.post('/api/event/update-map/'+pathArray[5], {//getting Id of Event
                    data_map: JSON.stringify(this.fabCanvas)
                })
                    .then(res => {
                        console.log(res);
                        //$('.toast-save-map-success').toast('show');
                    })
                    .catch(error => {
                        console.log(error)
                    });
                var jsonString = JSON.stringify(this.fabCanvas);
                // console.log("jsonString:");
                // console.log(jsonString);
                //var element = document.createElement('a');
                //element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonString));
                //element.setAttribute('download', fileName);

                //element.style.display = 'none';
                //document.body.appendChild(element);

                //element.click();

                //document.body.removeChild(element);
            },
            setAddSeating() {
                // emits a Bus signal to toggle the add seating form.
                Bus.$emit('sigAddSeatFormOn');
                Bus.$emit('sigEditSeatFormOff');
                Bus.$emit('sigAddGenFormOff');
                Bus.$emit('sigAddTableFormOff');
            },
            setDeleteSeating() {
                Bus.$emit('sigAddSeatFormOff');
                Bus.$emit('sigEditSeatFormOff');
                Bus.$emit('sigDeleteSeating');
                Bus.$emit('sigAddGenFormOff');
                Bus.$emit('sigAddTableFormOff');
            },
            setEditTool() {

                Bus.$emit('sigEditSeatFormOn');
                Bus.$emit('sigAddSeatFormOff');
                Bus.$emit('sigAddGenFormOff');
                Bus.$emit('sigAddTableFormOff');
            },
            setAddGeneral(){

                Bus.$emit('sigAddSeatFormOff');
                Bus.$emit('sigEditSeatFormOff');
                Bus.$emit('sigAddGenFormOn');
                Bus.$emit('sigAddTableFormOff');
            },
            setAddTable(){
                Bus.$emit('sigAddSeatFormOff');
                Bus.$emit('sigEditSeatFormOff');
                Bus.$emit('sigAddGenFormOff');
                Bus.$emit('sigAddTableFormOn');
            },
        },
        created() {
            Bus.$on('fabricCanvas', fabCanvas => {
                // console.log(fabCanvas);
                this.fabCanvas=fabCanvas;
            });
        }

    };
</script>

<style scoped>
    .toolbar-vertical {
        position: fixed;
        top: 50px;
        width: 10%;
        left: 0;
        background-color: #333333;
        margin: 0;
        padding-top: 10px;
        padding-bottom: 6px;
        padding-left: 12px;
        border-radius: 0 0 6px 0;
        z-index: 1;
    }
</style>