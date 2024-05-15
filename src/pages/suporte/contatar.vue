<script setup>
import { useToast } from "primevue/usetoast";

const toast = useToast();


const salvarprocesso = async () => {
    toast.add({
      severity: "success",
      summary: "Enviado com sucesso",
      detail: "Enviado com sucesso",
      life: 3000,
    });
  }
const dropdownItem = ref(null);
const dropdownItems = ref([
  { name: "Problema no Login" },
  { name: "Problema nos processos" },
  { name: "Erro na recuperação de senha" },
  { name: "Outros" },
]);


</script>

<template>
  <div class="col-12">
    <div class="card">
      <h5>Fale Conosco</h5>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="nome">Nome</label>
          <InputText id="nome" type="text" placeholder="Insira seu nome" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="email">Insira seu Email</label>
          <InputText id="email" type="e-mail" placeholder="Ex.: paulo@email.com"/>
        </div>
        <div class="field col-12">
          <label for="descricao">Descrição</label>
          <Textarea id="descricao" rows="4" placeholder="Descreva o problema"/>
        </div>
        <div class="field col-12 md:col-3">
          <label for="state">Problema</label>
          <ClientOnly>
            <Dropdown
              id="state"
              v-model="dropdownItem"
              :options="dropdownItems"
              option-label="name"
              placeholder="Escolha um problema"
            />
          </ClientOnly>
          <Button
            label="Salvar"
            icon="pi pi-save"
            icon-pos="right"
            class="mr-4 mt-4"
            @click="salvarprocesso"
          >
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
