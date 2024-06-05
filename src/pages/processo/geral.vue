<template>
  <slot>
    <div class="card">
      <h5>Informações Gerais do Processo</h5>
      <p>Acesse as informações sobre o processo selecionado.</p>

      <!-- Show all informations of processo -->
      <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="firstname2">Título</label>
          <InputText id="processTitle" type="text" v-model="processTitle" :disabled="inputDisabled" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="lastname2">Categoria</label>
          <Dropdown
            id="processCategory"
            v-model="processCategory"
            :options="dropdownCategoria"
            empty-message="Nenhuma categoria encontrada"
            option-value="id"
            option-label="nome"
            placeholder="Selecionar Categoria"
            :disabled="inputDisabled"
          />
        </div>
        <div class="field col-12">
          <label for="address">Descrição</label>
          <Textarea id="address" rows="4" v-model="processDescription" :disabled="inputDisabled" />
        </div>
        <div class="field col-12">
          <label for="city">Tags</label>
          <MultiSelect
            v-model="processTags"
            :options="multiSelectTags"
            option-label="tags"
            placeholder="Selecionar Tags"
            empty-message="Nenhuma tag encontrada"
            :filter="true"
            :disabled="inputDisabled"
          >
            <template #value="slotProps">
              <div
                v-for="option of slotProps.value"
                :key="option.id"
                class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2"
              >
                <div>{{ option.nome }}</div>
              </div>
              <template v-if="!slotProps.value || slotProps.value.length === 0">
                <div class="p-1">Selecionar Tags</div>
              </template>
            </template>
            <template #option="slotProps">
              <div class="flex align-items-center">
                <div>{{ slotProps.option.nome }}</div>
              </div>
            </template>
          </MultiSelect>
        </div>
      </div>
    </div>
  </slot>
</template>

<script setup lang="ts">
import { ProcessoStore } from "~/store/processoStore";

const supabase = useSupabaseClient();
const processoId: Ref<any> = ref(ProcessoStore.processoId);
const router = useRouter();
const inputDisabled = ref(true); // * Variável para controle de edição

const processo = ref(
  (
    await supabase
      .from("processos")
      .select("*, categorias:categoria_id(*)")
      .eq("id", processoId.value)
      .single()
  ).data,
);

// * Populando o dropdowns
const dropdownCategoria = ref(
  (await supabase.from("categorias").select()).data,
);
const multiSelectTags = ref((await supabase.from("tags").select()).data);

// * Informações básicas do processo
const processTitle = ref(processo.value.titulo);
const processCategory = ref(processo.value.categoria_id);
const processDescription = ref(processo.value.descricao);
const processTags = ref([]);

// * Populando as tags do processo
supabase
  .from("processos_tag")
  .select("*, tags:id_tag(*)")
  .eq("id_processo", processoId.value)
  .then(({ data }) => {
    processTags.value = data.map((tag) => tag.tags);
  });

watchEffect(() => {
  processoId.value = ProcessoStore.processoId;
});

onMounted(() => {
  if (processoId.value == null) {
    router.push("/acessar-processos");
  }
});
</script>

<style scoped></style>
