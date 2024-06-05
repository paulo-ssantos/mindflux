<script setup>
import { useToast } from "primevue/usetoast";

const supabase = useSupabaseClient();
const filters = ref({ global: { value: null } });
const toast = useToast();
const showDialog = ref(false);
const submitted = ref(false);
const selectedUser = ref(null);
const deleteUserDialog = ref(false);
const deleteUsersDialog = ref(false);

const cadastrarNome = ref("");
const cadastrarEmail = ref("");
const cadastrarSenha = ref("");
const cadastrarConfirmarSenha = ref("");
const cadastrarCargo = ref("");

const users = ref([]);
const selectedUsers = ref([]);

// Funções para abrir e fechar diálogos
function openNew() {
  showDialog.value = true;
  selectedUser.value = null;
  resetForm();
}

function openEdit(user) {
  showDialog.value = true;
  selectedUser.value = user;
  cadastrarNome.value = user.nome;
  cadastrarEmail.value = user.email;
  cadastrarSenha.value = ""; // Não preencher a senha por segurança
  cadastrarConfirmarSenha.value = ""; // Não preencher a senha por segurança
  cadastrarCargo.value = user.cargo;
}

function hideDialog() {
  showDialog.value = false; 
  submitted.value = false;
  resetForm();
}

function resetForm() {
  cadastrarNome.value = "";
  cadastrarEmail.value = "";
  cadastrarSenha.value = "";
  cadastrarConfirmarSenha.value = "";
  cadastrarCargo.value = "";
}

// Funções CRUD
async function editUser() {
  submitted.value = true;

  if (cadastrarSenha.value !== cadastrarConfirmarSenha.value) {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "As senhas não coincidem",
    });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        nome: cadastrarNome.value,
        email: cadastrarEmail.value,
        cargo: cadastrarCargo.value,
      })
      .eq('id', selectedUser.value.id);

    if (error) {
      throw error;
    }

    console.log("Usuário atualizado");
    hideDialog();
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Usuário atualizado com sucesso",
    });
    fetchUsers();
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error.message);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao atualizar usuário",
    });
  }
}

async function saveUser() {
  submitted.value = true;

  if (cadastrarSenha.value !== cadastrarConfirmarSenha.value) {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "As senhas não coincidem",
    });
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: cadastrarEmail.value,
      password: cadastrarSenha.value,
      options: {
        data: {
          nome: cadastrarNome.value,
          cargo: cadastrarCargo.value,
        },
      },
    });

    if (error) {
      throw error;
    }

    console.log("Usuário salvo:", data);
    hideDialog();
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Usuário cadastrado com sucesso",
    });
    fetchUsers();
  } catch (error) {
    console.error("Erro ao salvar usuário:", error.message);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao cadastrar usuário",
    });
  }
}

async function fetchUsers() {
  try {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      throw error;
    }

    users.value = data.map(user => ({
      ...user,
      nome: user.nome || "",
      email: user.email || "",
      cargo: user.cargo || "",
    }));

    console.log("USUÁRIOS = ", users.value);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error.message);
  }
}

async function deleteUser() {
  try {
    const idToDelete = selectedUser.value.id;
    const { error } = await supabase.from('users').delete().eq('id', idToDelete);

    if (error) {
      throw error;
    }

    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Usuário excluído com sucesso",
    });
    fetchUsers();
  } catch (error) {
    console.error("Erro ao excluir usuário:", error.message);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao excluir usuário",
    });
  } finally {
    deleteUserDialog.value = false;
  }
}

async function deleteSelectedUsers() {
  try {
    const idsToDelete = selectedUsers.value.map(user => user.id);
    const { error } = await supabase.from('users').delete().in('id', idsToDelete);

    if (error) {
      throw error;
    }

    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Usuários selecionados excluídos com sucesso",
    });
    fetchUsers();
  } catch (error) {
    console.error("Erro ao excluir usuários selecionados:", error.message);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao excluir usuários selecionados",
    });
  } finally {
    deleteUsersDialog.value = false;
  }
}

function confirmDeleteUser(user) {
  selectedUser.value = user;
  deleteUserDialog.value = true;
}

function confirmDeleteSelected() {
  deleteUsersDialog.value = true;
}




onMounted(() => {
  fetchUsers();
});

</script>

<template>
  <div class="grid crud-demo">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template #start>
            <div class="my-2">
              <Button
                label="Cadastrar Usuário"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="openNew"
              />
              <Button
                label="Delete"
                icon="pi pi-trash"
                class="p-button-danger"
                :disabled="!selectedUsers || !selectedUsers.length"
                @click="confirmDeleteSelected"
              />
            </div>
          </template>
          <template #end>
            <Button
              label="Export"
              icon="pi pi-upload"
              class="p-button-help"
              @click="exportCSV($event)"
            />
          </template>
        </Toolbar>

        <DataTable
          ref="dt"
          v-model:selection="selectedUsers"
          :value="users"
          data-key="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows-per-page-options="[5, 10, 25]"
          current-page-report-template="Mostrando {first} a {last} de {totalRecords} usuários"
          responsive-layout="scroll"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">Gerenciar Usuário</h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters.global.value" placeholder="Procurar" />
              </span>
            </div>
          </template>

          <Column field="nome" header="Nome" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Nome</span>
              {{ slotProps.data.nome }}
            </template>
          </Column>
          <Column field="email" header="Email" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Email</span>
              {{ slotProps.data.email }}
            </template>
          </Column>
          <Column field="cargo" header="Cargo" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Cargo</span>
              {{ slotProps.data.cargo }}
            </template>
          </Column>
          <Column selection-mode="multiple" header-style="width: 3em" />
          <Column>
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="openEdit(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning"
                @click="confirmDeleteUser(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
  
  <Dialog :visible="showDialog" :modal="true" :closable="false">
    <template #header>
      <h3>{{ selectedUser ? 'Atualizar Usuário' : 'Cadastro de Usuário' }}</h3>
    </template>
    <template #default>
      <div class="p-field">
        <label for="name"><strong>Nome:</strong></label>
        <InputText
          id="name"
          class="inputCSS"
          v-model="cadastrarNome"
          placeholder="Digite seu nome"
        />
      </div>
      <div class="p-field">
        <label for="email"><strong>Email:</strong></label>
        <InputText
          id="email"
          class="inputCSS"
          v-model="cadastrarEmail"
          placeholder="Digite seu email"
        />
      </div>
      <div class="p-field">
        <label for="password"><strong>Senha:</strong></label>
        <Password
          id="password"
          class="inputCSS"
          v-model="cadastrarSenha"
          placeholder="Digite sua senha"
        />
      </div>
      <div class="p-field">
        <label for="confirmPassword"><strong>Confirmar Senha:</strong></label>
        <Password
          id="confirmPassword"
          class="inputCSS"
          v-model="cadastrarConfirmarSenha"
          placeholder="Digite novamente sua senha"
        />
      </div>
      <div class="field" style="margin-top: 20px">
        <label class="mb-3"><strong>Cargo</strong></label>
        <div class="formgrid grid">
          <div class="field-radiobutton col-6">
            <RadioButton
              id="cargo1"
              v-model="cadastrarCargo"
              name="cargo"
              value="Administrador"
            />
            <label for="cargo1">Administrador</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="cargo2"
              v-model="cadastrarCargo"
              name="cargo"
              value="Funcionario"
            />
            <label for="cargo2">Funcionário</label>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        class="p-button-text"
        @click="hideDialog"
      />
      <Button
        label="Salvar"
        icon="pi pi-check"
        class="p-button-text"
        @click="selectedUser ? editUser() : saveUser()"
      />
    </template>
  </Dialog>

  <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirmar exclusão" :modal="true">
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="selectedUser">Tem certeza de que deseja excluir o usuário <b>{{ selectedUser.nome }}</b>?</span>
    </div>
    <template #footer>
      <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false" />
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteUser" />
    </template>
  </Dialog>
  
  <Dialog v-model:visible="deleteUsersDialog" :style="{ width: '450px' }" header="Confirmar exclusão" :modal="true">
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="selectedUsers && selectedUsers.length > 0">Tem certeza de que deseja excluir os usuários selecionados?</span>
    </div>
    <template #footer>
      <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteUsersDialog = false" />
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteSelectedUsers" />
    </template>
  </Dialog>
</template>

<style scoped>
.crud-demo .p-toolbar {
  justify-content: space-between;
}

.label-padding {
  padding-right: 10px;
}

.p-field {
  margin-bottom: 20px;
  margin-right: 10px;
}

.p-inputtext {
  margin-left: 12px;
}

.p-component {
  margin-left: 5px;
}
</style>