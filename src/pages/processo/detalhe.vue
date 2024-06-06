<template>
  <slot>
    <div class="card">
      <h5>Processo em Detalhe</h5>
      <p>Documentação detalhada de como aplicar o processo.</p>

      <!-- Show all informations of processo -->
      <div class="p-fluid formgrid grid">
        <ClientOnly fallback-tag="span" fallback="Carregando o editor...">
          <div class="border-2 border-primary rounded-4xl p-2 w-full">
            <NuxtEditorJs
              :config="config"
              :holder="holder"
              v-model:modelValue="processTextContent"
            />
          </div>
        </ClientOnly>
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

const holder = "nuxt-editor-js";
const config = {
  autofocus: false,
  readOnly: true,
};

const processTextContent = ref(
  (
    await supabase
      .from("processos")
      .select("conteudo")
      .eq("id", processoId.value)
      .single()
  ).data.conteudo,
);

onMounted(() => {
  if (processoId.value == null) {
    router.push("/acessar-processos");
  }
});
</script>

<style scoped></style>
