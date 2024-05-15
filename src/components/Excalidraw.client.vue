<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Excalidraw</h5>
        <div id="excalidraw" style="height: 500px"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// * Importando
import { ExcalidrawStore } from "~/store/excalidrawStore";
import * as ExcalidrawLib from "@excalidraw/excalidraw";
import React from "react";
import ReactDOM from "react-dom/client";

// * definindo a variavel de dados
const excalidrawElementsData = ref({});

// * Montando o componente Excalidraw na inicialização
onMounted(() => {
  const App = () => {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        {
          style: { height: "500px" },
        },
        React.createElement(ExcalidrawLib.Excalidraw as any, {
          initialData: excalidrawElementsData.value,
          onChange: (elements: any, state: any) => {
            excalidrawElementsData.value = elements;
          },
        }),
      ),
    );
  };

  const excalidrawWrapper = document.getElementById(
    "excalidraw",
  ) as HTMLElement;
  const root = ReactDOM.createRoot(excalidrawWrapper);
  root.render(React.createElement(App));
});

// Definindo o processo de salvamento do Excalidraw na store
watchEffect(() => {
  ExcalidrawStore.excalidrawElementsData = excalidrawElementsData.value;
});

</script>

<style scoped></style>
