<script setup>
let cards = ref([])
for (let i = 0; i < 30; i++) {
    cards.value.push({ id: i });
} 

</script>

<template>
    <div>
        <div>
            Home page
        </div>
        <div v-for="card in cards" :key="card.id" class="card mt-5 mx-auto p-2" style="width: 70%;">
            <div class="card-body" style="width:300px">
                <h5 class="card-title">Card title</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
                    content.</p>
                <a href="#" class="card-link">Card link</a>
                <a href="#" class="card-link">Another link</a>
            </div>

        </div>
    </div>
</template>