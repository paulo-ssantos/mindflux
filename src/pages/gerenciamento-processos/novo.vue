<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Novo Processo</h5>
        <p>
          Faça a descrição do projeto para que seja visualizado por outros
          funcionários.
        </p>

        <div v-if="step == 0">
          <div class="col-12">
            <div class="card">
              <h5>Informações do Processo</h5>
              <div class="p-fluid formgrid grid">
                <div class="field col-12 md:col-6">
                  <label for="firstname2">Título</label>
                  <InputText
                    id="processTitle"
                    type="text"
                    v-model="processTitle"
                  />
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
                  />
                </div>
                <div class="field col-12">
                  <label for="address">Descrição</label>
                  <Textarea
                    id="address"
                    rows="4"
                    v-model="processDescription"
                  />
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
                  >
                    <template #value="slotProps">
                      <div
                        v-for="option of slotProps.value"
                        :key="option.id"
                        class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2"
                      >
                        <div>{{ option.nome }}</div>
                      </div>
                      <template
                        v-if="!slotProps.value || slotProps.value.length === 0"
                      >
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
          </div>

          <Button
            label="Avançar"
            icon="pi pi-arrow-right"
            icon-pos="right"
            class="mr-2 mb-2"
            type="submit"
            @click="verifySteps"
          />
        </div>

        <div v-if="step == 1">
          <ClientOnly fallback-tag="span" fallback="Carregando o editor...">
            <div class="border-2 border-primary rounded-4xl p-2">
              <NuxtEditorJs v-model:modelValue="processTextContent" />
            </div>
          </ClientOnly>

          <Button
            label="Voltar"
            icon="pi pi-arrow-left"
            class="mt-4 mr-2 mb-2"
            @click="step--"
          />
          <Button
            label="Avançar"
            icon="pi pi-arrow-right"
            icon-pos="right"
            class="mr-2 mb-2"
            @click="verifySteps"
          />
        </div>

        <div v-if="step == 2">
          <ClientOnly fallback-tag="span" fallback="Carregando o editor...">
            <div class="border-2 border-primary rounded-4xl p-2">
              <div id="drawflow"></div>
            </div>
          </ClientOnly>
          <Button
            label="Voltar"
            icon="pi pi-arrow-left"
            class="mr-2 mb-2"
            @click="step--"
          />
          <Button
            label="Salvar"
            icon="pi pi-save"
            icon-pos="right"
            class="mr-2 mb-2"
            @click="saveProcess"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// * Importando componentes
import { useToast } from "primevue/usetoast";
import Drawflow from "drawflow";
import styleDrawflow from "drawflow/dist/drawflow.min.css";

// * Definindo variáveis
const supabase = useSupabaseClient();
const toast = useToast();

// * Controle de estágio do processo
const step = ref(0);

// * Informações básicas do processo
const processTitle = ref("");
const processCategory = ref("");
const processDescription = ref("");
const processTags = ref([]);
const processTextContent = ref({});
const processDiagramContent = ref({});

// * Populando o dropdowns
const dropdownCategoria = ref(
  (await supabase.from("categorias").select()).data,
);
const multiSelectTags = ref((await supabase.from("tags").select()).data);

// * Manipulando o editor de texto

// * Verificar Campos
const verifySteps = () => {
  switch (step.value) {
    case 0: // Informações básica
      const processTitleElement = document.getElementById(
        "processTitle",
      ) as HTMLInputElement;
      const processCategoryElement = document.getElementById(
        "processCategory",
      ) as HTMLInputElement;

      processTitle.value === ""
        ? processTitleElement.classList.add("p-invalid")
        : processTitleElement.classList.remove("p-invalid");
      processCategory.value === ""
        ? processCategoryElement.classList.add("p-invalid")
        : processCategoryElement.classList.remove("p-invalid");
      if (processTitle.value === "" || processCategory.value === "") {
        toast.add({
          severity: "error",
          summary: "Campos obrigatórios",
          detail: "Preencha todos os campos obrigatórios",
          life: 3000,
        });
      } else {
        step.value++;
      }

      break;

    case 1: // Editor de texto
      step.value++;

      var drawFlowElement = document.getElementById("drawflow");
      const editor = new Drawflow(drawFlowElement);
      
      editor.start();
      break;

    case 2: // Diagrama
      step.value++;
      break;

    default:
      break;
  }
};

// * Salvando o processo no banco
const saveProcess = async () => {
  toast.add({
    severity: "info",
    summary: "Salvando o Processo...",
    detail: "Aguarde um momento até salvarmos seu processo.",
    life: 3000,
  });

  const userId = (await supabase.auth.getUser()).data.user.id;

  const process = {
    titulo: processTitle.value,
    categoria_id: processCategory.value,
    descricao: processDescription.value,
    conteudo: processTextContent.value,
    usuario_id: userId,
  };

  const { data, error } = await supabase
    .from("processos")
    .insert([process])
    .select();

  if (error) {
    console.error(error);

    toast.add({
      severity: "error",
      summary: "Erro ao criar o processo",
      detail: "Erro ao criar o processo",
      life: 3000,
    });
  } else {
    console.log(data);

    const processId = data[0].id;

    for (let i = 0; i < processTags.value.length; i++) {
      const { data, error } = await supabase.from("processos_tag").insert([
        {
          id_processo: processId,
          id_tag: processTags.value[i].id,
        },
      ]);

      if (error) {
        console.error(error);

        toast.add({
          severity: "error",
          summary: "Erro ao criar o processo",
          detail: "Erro ao criar o processo",
          life: 3000,
        });
      } else {
        console.log(data);
      }
    }

    toast.add({
      severity: "success",
      summary: "Processo criado com sucesso",
      detail: "Processo criado com sucesso",
      life: 3000,
    });
  }
};
</script>

<style scoped></style>
