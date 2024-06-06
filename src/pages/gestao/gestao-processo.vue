<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Informação</h5>
        <p>
          Acesse todos os processos cadastrados no sistema, exclua ou edite. Adicione novas categorias, edite ou exclua. 
        </p>

          <div class="w-full">
            <div class="p-4 card-w-title">
              <h5>Admnistração</h5>
              <p>
                Acesse os processos ou categoria
              </p>
              <!-- <TabMenu :model="tabMenuItems"  /> -->
              <TabMenu :model="tabMenuItems" @tab-change="
                selectTab($event.index)
              " />

              <component :is="selectedComponent"></component>

              <NuxtPage />
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Categorias from "./edit/categoria.vue";
import Processos from "./edit/processo.vue";



const selectedComponent = ref(Processos);
const tabMenuItems = [
  { label: "Processos", component: Processos },
  { label: "Categorias", component: Categorias },
];

function selectTab(componentIndex: number) {
  selectedComponent.value = tabMenuItems[componentIndex].component;
}
</script>

<style scoped></style>
