<script setup>

import { FilterMatchMode, FilterOperator } from "primevue/api";
import { useToast } from "primevue/usetoast";


// * Definindo variáveis
const supabase = useSupabaseClient();
const router = useRouter();

const selectedProcess = ref(null);
const selectedMultipleProcess = ref([]);
const showDialog = ref(false);
const submitted = ref(false);
const toast = useToast();
const deleteProcessoDialog = ref(false);
const deleteProcessosDialog = ref(false);

const filters = ref();
const processos = ref([]);
const categorias = ref([]);
const processosTags = ref([]);
const allTags = ref([]);
const loading = ref(true);

const cadastrarCategoria = ref("");



function openNew() {
  showDialog.value = true;
  selectedProcess.value = null;
  resetForm();
}

function openEdit(processo) {
  selectedProcess.value = { ...processo };
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
      nome: cadastrarCategoria.value
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

// * Carregando dados
onMounted(() => {
  supabase
    .from("processos")
    .select("*, categorias:categoria_id(*)")
    .then(({ data }) => {
      processos.value = data;
      loading.value = false;

      // convert diagrama to boolean
      processos.value = processos.value.map((processo) => {
        processo.diagrama = convertDiagramaToBoolean(processo.diagrama);
        return processo;
      });

      // get user
      processos.value = processos.value.map((processo) => {
        getUser(processo.usuario_id).then((user) => {
          processo.usuario = user;
        });
        return processo;
      });

      supabase
        .from("processos_tag")
        .select("*, tags:id_tag(*)")
        .then(({ data }) => {
          processosTags.value = data;

          processos.value = processos.value.map((processo) => {
            processo.tags = getTags(processo.id);
            return processo;
          });
        });
    });

  supabase
    .from("categorias")
    .select()
    .then(({ data }) => {
      categorias.value = data;
    });

  supabase
    .from("tags")
    .select()
    .then(({ data }) => {
      allTags.value = data;
    });
});

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    titulo: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    "categorias.nome": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    usuario: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    diagrama: { value: null, matchMode: FilterMatchMode.EQUALS },
  };
};

initFilters();

const convertDiagramaToBoolean = (diagramaContent) => {
  // Assuming diagramaContent can be null, an object, or undefined,
  // and we consider it true if it's not null or undefined.
  return diagramaContent !== null && diagramaContent !== undefined;
};

const getTags = (processoId) => {
  return processosTags.value.filter((tag) => tag.id_processo === processoId);
};

const getUser = async (userId) => {
  const user = await supabase.from("users").select().eq("id", userId).single();

  return user.data.nome;
};

const clearFilter = () => {
  initFilters();
};
</script>

<template>
<slot>
    <div class="grid">
        <div class="col-12">
          <div class="card">
            <h5>Admnistrar Processos</h5>
            <p>
              Exclue e edite processos cadastrados no sistema.
            </p>
          </div>
        </div>
        </div>

  <div class="card">
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedMultipleProcess"
      :value="processos"
      paginator
      showGridlines
      :rows="10"
      dataKey="id"
      filterDisplay="menu"
      :loading="loading"
      :globalFilterFields="['titulo', 'categoria', 'usuario', 'diagrama']"
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
      <Column field="titulo" header="Título" style="min-width: 12rem">
        <template #body="{ data }">
          <div class="flex hover:underline">
            <RouterLink
              :to="`/processo/${data.id}`"
              class="text-primary-500"
            >
              <Icon name="prime:angle-right" class="h-full" />
              {{ data.titulo }}
            </RouterLink>
          </div>
        </template>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Procurar por título"
          />
        </template>
      </Column>
      <Column
        header="Categoria"
        filterField="categorias.nome"
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <span>{{ data.categorias.nome }}</span>
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
      <Column field="usuario" header="Usuário" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.usuario }}
        </template>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Procurar por usuário"
          />
        </template>
      </Column>
      <Column header="Tags" field="tags" style="min-width: 12rem">
        <template #body="{ data }">
          <Tag
            v-for="tag in data.tags"
            :value="tag.tags.nome"
            class="p-2 m-2 transition-all"
          />
        </template>
      </Column>
      <Column
        field="diagrama"
        header="Diagrama"
        dataType="boolean"
        bodyClass="text-center"
        style="min-width: 8rem"
      >
        <template #body="{ data }">
          <i
            class="pi"
            :class="{
              'pi-check-circle text-green-500 ': data.diagrama,
              'pi-times-circle text-red-500': !data.diagrama,
            }"
          >
          </i>
        </template>
        <template #filter="{ filterModel }">
          <label for="diagrama-filter" class="font-bold">
            Contém Diagrama?
          </label>
          <TriStateCheckbox
            v-model="filterModel.value"
            inputId="diagrama-filter"
          />
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
                @click="confirmDeleteUser(slotProps.data)"
              />
            </template>
          </Column>
    </DataTable>
  </div>

  <Dialog :visible="showDialog" :modal="true" :closable="false">
    <template #header>
      <h3>{{ selectedProcess ? 'Atualizar Categoria' : 'Criar nova Categoria' }}</h3>
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
          @click="selectedProcess ? editProcess() : saveCategory()"
        />
      </template>
      </Dialog>
</slot>
</template>

<style scoped></style>
