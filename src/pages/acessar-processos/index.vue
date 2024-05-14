<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Empty Page</h5>
        <p>
          Use this page to start from scratch and place your custom content.
        </p>

        <div v-for="processo in processos" :key="processo.id">
          {{ processo }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// * Importando dependências

// * Definindo variáveis
const supabase = useSupabaseClient();

// * Carregando dados
const processos = ref((await supabase.from("processos").select()).data);
</script>

<style scoped></style>
