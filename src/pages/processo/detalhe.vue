<template>
  <slot>
    <h5>Informações Gerais do Processo</h5>
    <p>Acesse as informações sobre o processo selecionado.</p>

    <!-- Show all informations of processo -->
    <div class="p-fluid formgrid grid">
      <ClientOnly fallback-tag="span" fallback="Carregando o editor...">
        <div class="border-2 border-primary rounded-4xl p-2 w-full">
          <NuxtEditorJs v-model:modelValue="processTextContent" />
        </div>
      </ClientOnly>
    </div>
  </slot>
</template>

<script setup lang="ts">
import { ProcessoStore } from "~/store/processoStore";

const supabase = useSupabaseClient();
const processoId: Ref<any> = ref(ProcessoStore.processoId);
const router = useRouter();
const inputDisabled = ref(true); // * Variável para controle de edição

const processTextContent = ref(
  (
    await supabase
      .from("processos")
      .select("conteudo")
      .eq("id", processoId.value)
      .single()
  ).data,
);

console.log(processTextContent.value);
</script>

<style scoped></style>
