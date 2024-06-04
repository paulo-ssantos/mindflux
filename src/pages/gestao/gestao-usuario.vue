<script setup>

import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { useToast } from "primevue/usetoast";
// import { useSupabaseClient } from '@supabase/vue';

// * Definindo variáveis
const supabase = useSupabaseClient();
const toast = useToast();
const showDialog = ref(false);
const submitted = ref(false);

const cadastrarNome = ref('');
const cadastrarEmail = ref('');
const cadastrarSenha = ref('');
const cadastrarConfirmarSenha = ref('');
const cadastrarCargo = ref('');

function openNew() {
  showDialog.value = true; // Abre o diálogo
}

function hideDialog() {
  showDialog.value = false; // Fecha o diálogo
  submitted.value = false; // Reseta o estado enviado
  // Limpa os campos
  cadastrarNome.value = '';
  cadastrarEmail.value = '';
  cadastrarSenha.value = '';
  cadastrarConfirmarSenha.value = '';
  cadastrarCargo.value = '';
}

async function saveUser() {
  submitted.value = true;
  
  if (cadastrarSenha.value !== cadastrarConfirmarSenha.value) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'As senhas não coincidem' });
    return;
  }
  
  const cargo = cadastrarCargo.value === 'Administrador' ? 'Administrador' : 'Funcionário';
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: cadastrarEmail.value,
      password: cadastrarSenha.value,
      options: {
        data: {
          nome: cadastrarNome.value,
          cargo: cargo // Definindo o valor do cargo
        }
      }
    });

    if (error) {
      throw error;
    }

    console.log('Usuário salvo:', data);
    showDialog.value = false; // Fecha o diálogo após salvar
    hideDialog();
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar usuário:', error.message);
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar usuário' });
  }
}




</script>

<template>
  <div class="grid crud-demo">
    <div class="col-12">
      <div class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template #start>
            <div class="my-2">
              <h1></h1>
              <Button label="Cadastrar Usuário" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
              <Button
                label="Delete" icon="pi pi-trash" class="p-button-danger"
                :disabled="!selectedUsers || !selectedUsers.length"
                @click="confirmDeleteSelected"
              />
            </div>
          </template>
        </Toolbar>
      </div>
    </div>
  </div>
  <Dialog :visible="showDialog" :modal="true" :closable="false">
    <template #header>
      <h3>Cadastro de Usuário</h3>
    </template>
    <template #default>
      <div class="p-field">
        <label for="name"><strong>Nome:</strong></label>
        <InputText id="name" class="inputCSS" v-model="cadastrarNome" placeholder="Digite seu nome" />
      </div>
      <div class="p-field">
        <label for="email"><strong>Email:</strong></label>
        <InputText id="email" class="inputCSS" v-model="cadastrarEmail" placeholder="Digite seu email" />
      </div>
      <div class="p-field">
        <label for="password"><strong>Senha:</strong></label>
        <Password id="password" class="inputCSS" v-model="cadastrarSenha" placeholder="Digite sua senha" />
      </div>
      <div class="p-field">
        <label for="confirmPassword"><strong>Confirmar Senha:</strong></label>
        <Password id="confirmPassword" class="inputCSS" v-model="cadastrarConfirmarSenha" placeholder="Digite novamente sua senha" />
      </div>
      <div class="field" style="margin-top: 20px;">
        <label class="mb-3"><strong>Cargo</strong></label>
        <div class="formgrid grid">
          <div class="field-radiobutton col-6">
            <RadioButton id="cargo1" v-model="cadastrarCargo" name="cargo" value="Administrador" />
            <label for="cargo1">Administrador</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton id="cargo2" v-model="cadastrarCargo" name="cargo" value="Funcionario" />
            <label for="cargo2">Funcionário</label>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
      <Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="saveUser" />
    </template>
  </Dialog>
</template>



<style scoped>

.crud-demo .p-toolbar {
  justify-content: space-between;
}

.InputCSS{
  margin-left: 10px;
}

.p-field {
  margin-bottom: 20px;
  margin-right: 10px;
}

</style>
