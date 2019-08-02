<template>
    <div id="formulaire-achat">
        <!--TODO-->
        <!-- v-on calls "submitSeatingData" when a click event is detected on this button  -->
        <button>Acheter</button>
        <button>Annuler</button> <!--TODO-->
        <!-- Debugging to see that the form toggle flag is being set -->
        <p>
            <span>Price: $</span>
        </p>
    </div>
</template>
<script>
    import Bus from './Bus'
    export default {
        name: "formulaireAchat",
        template: '#formulaire-achat'
    }
</script>

<style scoped>

</style>