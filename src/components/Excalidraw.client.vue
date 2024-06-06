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
const props = defineProps({
  initialElements: {
    type: Array,
    default: () => {},
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

// * Importando
import * as ExcalidrawLib from "@excalidraw/excalidraw";
import React from "react";
import ReactDOM from "react-dom/client";

// * definindo a variavel de dados
const excalidrawElementsData = ref(props.initialElements);

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
            if (props.readOnly) {
              return;
            }
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
</script>

<style scoped></style>
