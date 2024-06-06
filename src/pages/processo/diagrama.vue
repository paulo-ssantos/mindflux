<template>
  <slot>
    <div class="card">
      <h5>Diagrama de Exemplificação</h5>
      <p>
        Diagrama de exemplificação do processo. Utilize o diagrama para
        visualizar o fluxo do processo.
      </p>

      <!-- Show all informations of processo -->
      <div class="p-fluid formgrid grid">
        <ClientOnly fallback-tag="span" fallback="Carregando o fluxograma...">
          <ExcalidrawClient
            :read-only="true"
            :initial-elements="processDiagramContent"
            class="w-full"
          />
        </ClientOnly>
      </div>
    </div>
  </slot>
</template>

<script setup lang="ts">
import ExcalidrawClient from "~/components/Excalidraw.client.vue";
import { ExcalidrawStore } from "~/store/excalidrawStore";
import { ProcessoStore } from "~/store/processoStore";

const supabase = useSupabaseClient();
const processoId: Ref<any> = ref(ProcessoStore.processoId);
const router = useRouter();
const inputDisabled = ref(true); // * Variável para controle de edição

// * Variáveis temporárias
const tempDiagramContent = ref();

const processDiagramContent = ref(
  (
    await supabase
      .from("processos")
      .select("diagrama")
      .eq("id", processoId.value)
      .single()
  ).data.diagrama,
);

// * Salvando do diagrama
watchEffect(() => {
  tempDiagramContent.value = ExcalidrawStore.excalidrawElementsData;
});

onMounted(() => {
  if (processoId.value == null) {
    router.push("/acessar-processos");
  }
});
</script>

<style scoped></style>
