<template>
    <div>
            <toolbar-vertical></toolbar-vertical>
            <add-form></add-form>
        <!-- Vertical toolbar -->
    </div>
</template>

<script>
    import ToolbarVertical from './create/toolbar-vertical'
    import AddForm from './create/add-form'
    import SidebarRight from './create/sidebar-right'

    export default {
        components: {
            'toolbar-vertical':ToolbarVertical,
            'add-form':AddForm,
            'sidebar-right':SidebarRight,
        },
        name:'CreateMap'
    }
</script>

<style scoped>
    .custom-ul {
        padding: 10px;
        width: 500px;
    }

    .list-group-horizontal .list-group-item {
        display: inline-block;
    }

    .list-group-horizontal .list-group-item {
        margin-bottom: 0;
        margin-left: -4px;
        margin-right: 0;
        border-right-width: 0;
    }

    .list-group-horizontal .list-group-item:first-child {
        border-top-right-radius: 0;
        border-bottom-left-radius: 4px;
    }

    .list-group-horizontal .list-group-item:last-child {
        border-top-right-radius: 4px;
        border-bottom-left-radius: 0;
        border-right-width: 1px;
    }

    .container {
        margin-top: -60px;
        width: 1300px;
    }
</style>