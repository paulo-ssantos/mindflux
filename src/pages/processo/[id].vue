<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Todos os Processos</h5>
        <p>
          Acesse todos os processos cadastrados no sistema. Utilize os filtros
          para encontrar o que você procura.
        </p>

          <div class="w-full">
            <div class="p-4 card-w-title">
              <!-- <h5>TabMenu</h5>
              <p>
                Steps and TabMenu are integrated with the same child routes.
              </p> -->
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
import { ProcessoStore } from "~/store/processoStore";
import Detalhe from "./detalhe.vue";
import Diagrama from "./diagrama.vue";
import Geral from "./geral.vue";

const supabase = useSupabaseClient();
const route = useRoute();
const processoId = ref(route.params.id);

// Set the processoId in the store, so it can be used in the child components
watchEffect(() => {
  ProcessoStore.processoId = processoId.value;
});

// Clean processo Id when exit from page
onUnmounted(() => {
  ProcessoStore.processoId = null;
});

const selectedComponent = ref(Geral);
const tabMenuItems = [
  { label: "Geral", component: Geral },
  { label: "Detalhe", component: Detalhe },
  { label: "Diagrama", component: Diagrama },
];

function selectTab(componentIndex: number) {
  selectedComponent.value = tabMenuItems[componentIndex].component;
}
</script>

<style scoped></style>
