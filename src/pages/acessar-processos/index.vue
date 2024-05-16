<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Todos os Processos</h5>
        <p>
          Acesse todos os processos cadastrados no sistema. Utilize os filtros
          para encontrar o que você procura.
        </p>

        <div class="card">
          <DataTable
            v-model:filters="filters"
            :value="processos"
            :onchange="console.log('FILTERS = ', filters)"
            paginator
            showGridlines
            :rows="10"
            dataKey="id"
            filterDisplay="menu"
            :loading="loading"
            :globalFilterFields="['titulo', 'categoria', 'tags', 'diagrama']"
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
            <Column field="titulo" header="Título" style="min-width: 12rem">
              <template #body="{ data }">
                {{ data.titulo }}
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
            <Column
              header="Tags"
              field="tags"
              :filterMenuStyle="{ width: '14rem' }"
              style="min-width: 12rem"
            >
              <template #body="{ data }">
                <Tag
                  v-for="tag in data.tags"
                  :value="tag.tags.nome"
                  class="p-2 m-2 transition-all"
                />
              </template>
              <template #filter="{ filterModel }">
                <MultiSelect
                  v-model="filterModel.value"
                  :options="allTags"
                  placeholder="Selecione as tags"
                  class="p-column-filter"
                  option-label="nome"
                  :onchange="
                    console.log('TAG FIELD FILTER = ', filterModel.value)
                  "
                  showClear
                >
                  <template #option="slotProps">
                    <Tag :value="slotProps.option.nome" />
                  </template>
                </MultiSelect>
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
                ></i>
              </template>
              <template #filter="{ filterModel }">
                <label for="diagrama-filter" class="font-bold">
                  Diagrama
                </label>
                <TriStateCheckbox
                  v-model="filterModel.value"
                  inputId="diagrama-filter"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// * Importando dependências
import { FilterMatchMode, FilterOperator } from "primevue/api";

// * Definindo variáveis
const supabase = useSupabaseClient();
const filters = ref();
const processos = ref([]);
const categorias = ref([]);
const processosTags = ref([]);
const allTags = ref([]);
const loading = ref(true);

// * Carregando dados
onMounted(() => {
  supabase
    .from("processos")
    .select("*, categorias:categoria_id(*)")
    .then(({ data }) => {
      processos.value = data;
      loading.value = false;

      supabase
        .from("processos_tag")
        .select("*, tags:id_tag(*)")
        .then(({ data }) => {
          processosTags.value = data;

          processos.value = processos.value.map((processo) => {
            processo.tags = getTags(processo.id);
            return processo;
          });

          console.log("NOVO PROCESSO = ", processos.value);
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
    tags: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    diagrama: { value: null, matchMode: FilterMatchMode.EQUALS },
  };
};

initFilters();

const formatarCategoria = (id) => {
  return categorias.value.find((categoria) => categoria.id === id).nome;
};

const getTags = (processoId) => {
  return processosTags.value.filter((tag) => tag.id_processo === processoId);
};

const clearFilter = () => {
  initFilters();
};
</script>

<style scoped></style>
