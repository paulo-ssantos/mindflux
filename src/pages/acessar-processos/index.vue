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
              filterField="categoria"
              style="min-width: 12rem"
            >
              <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                  <span>{{ formatarCategoria(data.categoria_id) }}</span>
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
                <Tag v-for="tag in getTags(data.id)" :value="tag.tags.nome" />
              </template>
              <template #filter="{ filterModel }">
                <Dropdown
                  v-model="filterModel.value"
                  :options="tags"
                  placeholder="Selecione uma"
                  class="p-column-filter"
                  showClear
                >
                  <template #option="slotProps">
                    <Tag
                      :value="slotProps.option"
                      :severity="getSeverity(slotProps.option)"
                    />
                  </template>
                </Dropdown>
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
                <label for="verified-filter" class="font-bold">
                  Verified
                </label>
                <TriStateCheckbox
                  v-model="filterModel.value"
                  inputId="verified-filter"
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
const processos = ref();
const categorias = ref([]);
const tags = ref([]);
const loading = ref(true);

// * Carregando dados
onMounted(() => {
  supabase
    .from("processos")
    .select()
    .then(({ data }) => {
      processos.value = data;
      loading.value = false;
    });

  supabase
    .from("categorias")
    .select()
    .then(({ data }) => {
      categorias.value = data;
    });

  supabase
    .from("processos_tag")
    .select("*, tags:id_tag(*)")
    .then(({ data }) => {
      tags.value = data;
    });

  console.log(processos.value);
});

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    titulo: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    categoria: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    tags: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
    },
    diagrama: { value: null, matchMode: FilterMatchMode.EQUALS },
  };
};

initFilters();

const formatarCategoria = (id) => {
  return (categorias.value.find((categoria) => categoria.id === id)).nome;
};

const getTags = (processoId) => {
  return tags.value.filter((tag) => tag.id_processo === processoId);
};

const clearFilter = () => {
  initFilters();
};
</script>

<style scoped></style>
