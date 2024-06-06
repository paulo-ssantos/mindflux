<script setup>
import { useToast } from "primevue/usetoast";
import { FilterMatchMode, FilterOperator } from "primevue/api";

const supabase = useSupabaseClient();
const selectedCategory = ref(null);
const selectedMultipleCategories = ref([]);
const showDialog = ref(false);
const submitted = ref(false);
const toast = useToast();
const filters = ref();
const deleteCategoryDialog = ref(false);
const deleteCategoriesDialog = ref(false);

const cadastrarCategoria = ref("");
const processosPorCategoria = ref(0);
let categorias = ref([]);
const processosCounts = ref({});

const getProcessosPorCategoria = async (id) => {
  const { data, error } = await supabase
    .from("processos")
    .select("*")
    .eq("categoria_id", id);
  if (error) {
    console.error("Erro ao buscar processos", error);
  }
  // Store the count in processosCounts
  processosCounts.value[id] = data.length;
};

onMounted(async () => {
  const { data, error } = await supabase.from("categorias").select("*");
  if (error) {
    console.error("Error fetching categories:", error);
  } else {
    categorias.value = data;
    // Fetch the number of processes for each category
    for (const categoria of data) {
      await getProcessosPorCategoria(categoria.id);
    }
  }
});

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nome: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  };
};

initFilters();

const clearFilter = () => {
  initFilters();
};

function openNew() {
  showDialog.value = true;
  selectedCategory.value = null;
  resetForm();
}

function openEdit(categoria) {
  selectedCategory.value = { ...categoria };
  showDialog.value = true;
}

function hideDialog() {
  showDialog.value = false;
  submitted.value = false;
}

// function resetForm() {
//   cadastrarCategoria.value = "";
// }

async function saveCategory() {
  submitted.value = true;

  try {
    const { data, error } = await supabase
      .from("categorias")
      .insert({
        nome: cadastrarCategoria.value,
      });

    if (error) {
      throw error;
    }

    console.log("Categoria criada:", data);
    hideDialog();
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Categoria criada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar categoria:", error.message);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao criar categoria",
    });
  }
}

async function editCategory() {
  if (!selectedCategory.value) {
    console.error("Nenhuma categoria selecionada para editar.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("categorias")
      .update({
        nome: cadastrarCategoria.value,
      })
      .eq("id", selectedCategory.value.id);

    if (error) {
      throw error;
    }

    console.log("Categoria atualizada:", data);
    hideDialog();
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Categoria atualizada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error.message);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao atualizar categoria",
    });
  }
}

async function deleteCategory() {
  try {
    const idToDelete = selectedCategory.value.id;
    const { error } = await supabase.from("categorias").delete().eq("id", idToDelete);

    if (error) {
      throw error;
    }

    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Categoria excluída com sucesso",
    });
    fetchCategories();
  } catch (error) {
    console.error("Erro ao excluir categoria:", error.message);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao excluir categoria",
    });
  } finally {
    deleteCategoryDialog.value = false;
  }
}

async function deleteSelectedCategories() {
  try {
    const idsToDelete = selectedMultipleCategories.value.map(categoria => categoria.id);
    const { error } = await supabase.from("categorias").delete().in("id", idsToDelete);

    if (error) {
      throw error;
    }

    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Categorias selecionadas excluídas com sucesso",
    });
    fetchCategories();
  } catch (error) {
    console.error("Erro ao excluir categorias selecionadas:", error.message);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao excluir categorias selecionadas",
    });
  } finally {
    deleteCategoriesDialog.value = false;
  }
}

function confirmDeleteCategory(categoria) {
  selectedCategory.value = categoria;
  deleteCategoryDialog.value = true;
}

function confirmDeleteSelected() {
  deleteCategoriesDialog.value = true;
}

function fetchCategories() {
  supabase.from("categorias").select("*").then(({ data, error }) => {
    if (error) {
      console.error("Erro ao buscar categorias:", error);
    } else {
      categorias.value = data;
    }
  });
}
</script>

<template>
  <slot>
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h5>Administrar Categorias</h5>
          <p>Exclua, adicione e remova categorias.</p>
        </div>
      </div>
    </div>

    <div class="grid crud-demo"></div>
    <div class="col-12"></div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <div class="my-2">
            <Button
              label="Criar Categoria"
              icon="pi pi-plus"
              class="p-button-success mr-2"
              @click="openNew"
            />
            <Button
              label="Deletar"
              icon="pi pi-trash"
              class="p-button-danger"
              :disabled="!selectedCategory || !selectedMultipleCategories.length"
              @click="confirmDeleteSelected"
            />
          </div>
        </template>
      </Toolbar>
    </div>

    <div class="card">
      <DataTable
        v-model:filters="filters"
        v-model:selection="selectedMultipleCategories"
        :value="categorias"
        paginator
        showGridlines
        :rows="10"
        dataKey="id"
        filterDisplay="menu"
        :loading="loading"
        :globalFilterFields="['nome']"
        responsive-layout="scroll"
      >
        <template #header>
          <div class="flex justify-content-between">
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              outlined
              @click="clearFilter()"
            />
            <IconField iconPosition="left">
              <!-- <InputIcon>
            <i class="pi pi-search" />
          </InputIcon> -->
              <InputText
                v-model="filters['global'].value"
                placeholder="Procurar Processo"
              />
            </IconField>
          </div>
        </template>
        <template #empty> Processos não encontrados. </template>
        <template #loading> Carregando... </template>
        <Column selection-mode="multiple" header-style="width: 3em" />
        <Column field="nome" header="Nome" style="min-width: 12rem">
          <template #filter="{ filterModel }">
            <InputText
              v-model="filterModel.value"
              type="text"
              class="p-column-filter"
              placeholder="Procurar por categoria"
            />
          </template>
        </Column>
        <Column
          header="Numero de Processos"
          filterField="nome"
          style="min-width: 12rem"
        >
          <template #body="{ data }">
            <div class="flex align-items-center gap-2">
              <span>{{ processosCounts[data.id] }}</span>
            </div>
          </template>
          <template #filter="{ filterModel }">
            <InputText
              v-model="filterModel.value"
              type="text"
              class="p-column-filter"
              placeholder="Procurar por categoria"
            />
          </template>
          <template #filterclear="{ filterCallback }">
            <Button
              type="button"
              icon="pi pi-times"
              @click="filterCallback()"
              severity="secondary"
            ></Button>
          </template>
          <template #filterapply="{ filterCallback }">
            <Button
              type="button"
              icon="pi pi-check"
              @click="filterCallback()"
              severity="success"
            ></Button>
          </template>
        </Column>
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
              @click="confirmDeleteCategory(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog :visible="showDialog" :modal="true" :closable="false">
      <template #header>
        <h3>{{ selectedCategory ? "Atualizar Categoria" : "Criar nova Categoria" }}</h3>
      </template>
      <template #default>
        <div class="p-field">
          <label for="name"><strong>Nova Categoria:</strong></label>
          <InputText
            id="newCategory"
            class="inputCSS"
            v-model="cadastrarCategoria"
            placeholder="Digite o nome da categoria"
          />
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
          @click="selectedCategory ? editCategory() : saveCategory()"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteCategoryDialog"
      :style="{ width: '450px' }"
      header="Confirmar exclusão"
      :modal="true"
    >
      <div class="flex align-items-center justify-content-center">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="selectedCategory"
          >Tem certeza de que deseja excluir a categoria
          <b>{{ selectedCategory.nome }}</b>?</span
        >
      </div>
      <template #footer>
        <Button
          label="Não"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteCategoryDialog = false"
        />
        <Button
          label="Sim"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteCategory"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteCategoriesDialog"
      :style="{ width: '450px' }"
      header="Confirmar exclusão"
      :modal="true"
    >
      <div class="flex align-items-center justify-content-center">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="selectedMultipleCategories && selectedMultipleCategories.length > 0"
          >Tem certeza de que deseja excluir as categorias selecionadas?</span
        >
      </div>
      <template #footer>
        <Button
          label="Não"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteCategoriesDialog = false"
        />
        <Button
          label="Sim"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteSelectedCategories"
        />
      </template>
    </Dialog>
  </slot>
</template>

<style scoped>

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