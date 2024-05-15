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

        <div id="step-2">
          <div class="wrapper">
            <div class="col">
              <div
                class="drag-drawflow"
                draggable="true"
                ondragstart="drag(event)"
                data-node="facebook"
              >
                <i class="fab fa-facebook"></i><span> Facebook</span>
              </div>
              <div
                class="drag-drawflow"
                draggable="true"
                ondragstart="drag(event)"
                data-node="slack"
              >
                <i class="fab fa-slack"></i><span> Slack receive message</span>
              </div>
              <div
                class="drag-drawflow"
                draggable="true"
                ondragstart="drag(event)"
                data-node="github"
              >
                <i class="fab fa-github"></i><span> Github Star</span>
              </div>
              <div
                class="drag-drawflow"
                draggable="true"
                ondragstart="drag(event)"
                data-node="telegram"
              >
                <i class="fab fa-telegram"></i
                ><span> Telegram send message</span>
              </div>
              <div
                class="drag-drawflow"
                draggable="true"
                ondragstart="drag(event)"
                data-node="aws"
              >
                <i class="fab fa-aws"></i><span> AWS</span>
              </div>
              <div
                class="drag-drawflow"
                draggable="true"
                ondragstart="drag(event)"
                data-node="log"
              >
                <i class="fas fa-file-signature"></i><span> File Log</span>
              </div>
              <div
                class="drag-drawflow"
                draggable="true"
                ondragstart="drag(event)"
                data-node="google"
              >
                <i class="fab fa-google-drive"></i
                ><span> Google Drive save</span>
              </div>
              <div
                class="drag-drawflow"
                draggable="true"
                ondragstart="drag(event)"
                data-node="email"
              >
                <i class="fas fa-at"></i><span> Email send</span>
              </div>
              <div
                class="drag-drawflow"
                draggable="true"
                ondragstart="drag(event)"
                data-node="template"
              >
                <i class="fas fa-code"></i><span> Template</span>
              </div>
              <div
                class="drag-drawflow"
                draggable="true"
                ondragstart="drag(event)"
                data-node="multiple"
              >
                <i class="fas fa-code-branch"></i
                ><span> Multiple inputs/outputs</span>
              </div>
              <div
                class="drag-drawflow"
                draggable="true"
                ondragstart="drag(event)"
                data-node="personalized"
              >
                <i class="fas fa-fill"></i><span> Personalized</span>
              </div>
              <div
                class="drag-drawflow"
                draggable="true"
                ondragstart="drag(event)"
                data-node="dbclick"
              >
                <i class="fas fa-mouse"></i><span> DBClick!</span>
              </div>
            </div>
            <div class="col-right">
              <div class="menu">
                <ul>
                  <li
                    onclick="editor.changeModule('Home'); changeModule(event);"
                    class="selected"
                  >
                    Home
                  </li>
                  <li
                    onclick="editor.changeModule('Other'); changeModule(event);"
                  >
                    Other Module
                  </li>
                </ul>
              </div>
              <div
                id="drawflow"
                ondrop="drop(event)"
                ondragover="allowDrop(event)"
              >
                <div
                  class="btn-export"
                  onclick="Swal.fire({ title: 'Export',
        html: '<pre><code>'+JSON.stringify(editor.export(), null,4)+'</code></pre>'
        })"
                >
                  Export
                </div>
                <div class="btn-clear" onclick="editor.clearModuleSelected()">
                  Clear
                </div>
                <div class="btn-lock">
                  <i
                    id="lock"
                    class="fas fa-lock"
                    onclick="editor.editor_mode='fixed'; changeMode('lock');"
                  ></i>
                  <i
                    id="unlock"
                    class="fas fa-lock-open"
                    onclick="editor.editor_mode='edit'; changeMode('unlock');"
                    style="display: none"
                  ></i>
                </div>
                <div class="bar-zoom">
                  <i
                    class="fas fa-search-minus"
                    onclick="editor.zoom_out()"
                  ></i>
                  <i class="fas fa-search" onclick="editor.zoom_reset()"></i>
                  <i class="fas fa-search-plus" onclick="editor.zoom_in()"></i>
                </div>
              </div>
            </div>
          </div>

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

// * Definindo variáveis
const supabase = useSupabaseClient();
const toast = useToast();

onMounted(() => {
  const drawflowDiv = document.getElementById("step-2");

  drawflowDiv.style.display = "none";
});

// * Controle de estágio do processo
const step = ref(1);

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

// * Manipulando o grafico
const setDrawFlowSpace = () => {
  const drawFlowElement = document.getElementById("drawflow");

  const editor = new Drawflow(drawFlowElement);

  console.log(editor);

  editor.reroute = true;
  const dataToImport = {
    drawflow: {
      Home: {
        data: {
          "1": {
            id: 1,
            name: "welcome",
            data: {},
            class: "welcome",
            html: '\n    <div>\n      <div class="title-box">👏 Welcome!!</div>\n      <div class="box">\n        <p>Simple flow library <b>demo</b>\n        <a href="https://github.com/jerosoler/Drawflow" target="_blank">Drawflow</a> by <b>Jero Soler</b></p><br>\n\n        <p>Multiple input / outputs<br>\n           Data sync nodes<br>\n           Import / export<br>\n           Modules support<br>\n           Simple use<br>\n           Type: Fixed or Edit<br>\n           Events: view console<br>\n           Pure Javascript<br>\n        </p>\n        <br>\n        <p><b><u>Shortkeys:</u></b></p>\n        <p>🎹 <b>Delete</b> for remove selected<br>\n        💠 Mouse Left Click == Move<br>\n        ❌ Mouse Right == Delete Option<br>\n        🔍 Ctrl + Wheel == Zoom<br>\n        📱 Mobile support<br>\n        ...</p>\n      </div>\n    </div>\n    ',
            typenode: false,
            inputs: {},
            outputs: {},
            pos_x: 50,
            pos_y: 50,
          },
          "2": {
            id: 2,
            name: "slack",
            data: {},
            class: "slack",
            html: '\n          <div>\n            <div class="title-box"><i class="fab fa-slack"></i> Slack chat message</div>\n          </div>\n          ',
            typenode: false,
            inputs: {
              input_1: { connections: [{ node: "7", input: "output_1" }] },
            },
            outputs: {},
            pos_x: 1028,
            pos_y: 87,
          },
          "3": {
            id: 3,
            name: "telegram",
            data: { channel: "channel_2" },
            class: "telegram",
            html: '\n          <div>\n            <div class="title-box"><i class="fab fa-telegram-plane"></i> Telegram bot</div>\n            <div class="box">\n              <p>Send to telegram</p>\n              <p>select channel</p>\n              <select df-channel>\n                <option value="channel_1">Channel 1</option>\n                <option value="channel_2">Channel 2</option>\n                <option value="channel_3">Channel 3</option>\n                <option value="channel_4">Channel 4</option>\n              </select>\n            </div>\n          </div>\n          ',
            typenode: false,
            inputs: {
              input_1: { connections: [{ node: "7", input: "output_1" }] },
            },
            outputs: {},
            pos_x: 1032,
            pos_y: 184,
          },
          "4": {
            id: 4,
            name: "email",
            data: {},
            class: "email",
            html: '\n            <div>\n              <div class="title-box"><i class="fas fa-at"></i> Send Email </div>\n            </div>\n            ',
            typenode: false,
            inputs: {
              input_1: { connections: [{ node: "5", input: "output_1" }] },
            },
            outputs: {},
            pos_x: 1033,
            pos_y: 439,
          },
          "5": {
            id: 5,
            name: "template",
            data: { template: "Write your template" },
            class: "template",
            html: '\n            <div>\n              <div class="title-box"><i class="fas fa-code"></i> Template</div>\n              <div class="box">\n                Ger Vars\n                <textarea df-template></textarea>\n                Output template with vars\n              </div>\n            </div>\n            ',
            typenode: false,
            inputs: {
              input_1: { connections: [{ node: "6", input: "output_1" }] },
            },
            outputs: {
              output_1: {
                connections: [
                  { node: "4", output: "input_1" },
                  { node: "11", output: "input_1" },
                ],
              },
            },
            pos_x: 607,
            pos_y: 304,
          },
          "6": {
            id: 6,
            name: "github",
            data: { name: "https://github.com/jerosoler/Drawflow" },
            class: "github",
            html: '\n          <div>\n            <div class="title-box"><i class="fab fa-github "></i> Github Stars</div>\n            <div class="box">\n              <p>Enter repository url</p>\n            <input type="text" df-name>\n            </div>\n          </div>\n          ',
            typenode: false,
            inputs: {},
            outputs: {
              output_1: { connections: [{ node: "5", output: "input_1" }] },
            },
            pos_x: 341,
            pos_y: 191,
          },
          "7": {
            id: 7,
            name: "facebook",
            data: {},
            class: "facebook",
            html: '\n        <div>\n          <div class="title-box"><i class="fab fa-facebook"></i> Facebook Message</div>\n        </div>\n        ',
            typenode: false,
            inputs: {},
            outputs: {
              output_1: {
                connections: [
                  { node: "2", output: "input_1" },
                  { node: "3", output: "input_1" },
                  { node: "11", output: "input_1" },
                ],
              },
            },
            pos_x: 347,
            pos_y: 87,
          },
          "11": {
            id: 11,
            name: "log",
            data: {},
            class: "log",
            html: '\n            <div>\n              <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>\n            </div>\n            ',
            typenode: false,
            inputs: {
              input_1: {
                connections: [
                  { node: "5", input: "output_1" },
                  { node: "7", input: "output_1" },
                ],
              },
            },
            outputs: {},
            pos_x: 1031,
            pos_y: 363,
          },
        },
      },
      Other: {
        data: {
          "8": {
            id: 8,
            name: "personalized",
            data: {},
            class: "personalized",
            html: "\n            <div>\n              Personalized\n            </div>\n            ",
            typenode: false,
            inputs: {
              input_1: {
                connections: [
                  { node: "12", input: "output_1" },
                  { node: "12", input: "output_2" },
                  { node: "12", input: "output_3" },
                  { node: "12", input: "output_4" },
                ],
              },
            },
            outputs: {
              output_1: { connections: [{ node: "9", output: "input_1" }] },
            },
            pos_x: 764,
            pos_y: 227,
          },
          "9": {
            id: 9,
            name: "dbclick",
            data: { name: "Hello World!!" },
            class: "dbclick",
            html: '\n            <div>\n            <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>\n              <div class="box dbclickbox" ondblclick="showpopup(event)">\n                Db Click here\n                <div class="modal" style="display:none">\n                  <div class="modal-content">\n                    <span class="close" onclick="closemodal(event)">&times;</span>\n                    Change your variable {name} !\n                    <input type="text" df-name>\n                  </div>\n\n                </div>\n              </div>\n            </div>\n            ',
            typenode: false,
            inputs: {
              input_1: { connections: [{ node: "8", input: "output_1" }] },
            },
            outputs: {
              output_1: { connections: [{ node: "12", output: "input_2" }] },
            },
            pos_x: 209,
            pos_y: 38,
          },
          "12": {
            id: 12,
            name: "multiple",
            data: {},
            class: "multiple",
            html: '\n            <div>\n              <div class="box">\n                Multiple!\n              </div>\n            </div>\n            ',
            typenode: false,
            inputs: {
              input_1: { connections: [] },
              input_2: { connections: [{ node: "9", input: "output_1" }] },
              input_3: { connections: [] },
            },
            outputs: {
              output_1: { connections: [{ node: "8", output: "input_1" }] },
              output_2: { connections: [{ node: "8", output: "input_1" }] },
              output_3: { connections: [{ node: "8", output: "input_1" }] },
              output_4: { connections: [{ node: "8", output: "input_1" }] },
            },
            pos_x: 179,
            pos_y: 272,
          },
        },
      },
    },
  };
  editor.start();
  editor.import(dataToImport);

  // Events
  editor.on("nodeCreated", function (id) {
    console.log("Node created " + id);
  });

  editor.on("nodeRemoved", function (id) {
    console.log("Node removed " + id);
  });

  editor.on("nodeSelected", function (id) {
    console.log("Node selected " + id);
  });

  editor.on("moduleCreated", function (name) {
    console.log("Module Created " + name);
  });

  editor.on("moduleChanged", function (name) {
    console.log("Module Changed " + name);
  });

  editor.on("connectionCreated", function (connection) {
    console.log("Connection created");
    console.log(connection);
  });

  editor.on("connectionRemoved", function (connection) {
    console.log("Connection removed");
    console.log(connection);
  });

  editor.on("mouseMove", function (position) {
    console.log("Position mouse x:" + position.x + " y:" + position.y);
  });

  editor.on("nodeMoved", function (id) {
    console.log("Node moved " + id);
  });

  editor.on("zoom", function (zoom) {
    console.log("Zoom level " + zoom);
  });

  editor.on("translate", function (position) {
    console.log("Translate x:" + position.x + " y:" + position.y);
  });

  editor.on("addReroute", function (id) {
    console.log("Reroute added " + id);
  });

  editor.on("removeReroute", function (id) {
    console.log("Reroute removed " + id);
  });

  /* DRAG EVENT */

  /* Mouse and Touch Actions */

  var elements = document.getElementsByClassName("drag-drawflow");
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("touchend", drop, false);
    elements[i].addEventListener("touchmove", positionMobile, false);
    elements[i].addEventListener("touchstart", drag, false);
  }

  var mobile_item_selec = "";
  var mobile_last_move = null;
  function positionMobile(ev) {
    mobile_last_move = ev;
  }

  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev) {
    if (ev.type === "touchstart") {
      mobile_item_selec = ev.target
        .closest(".drag-drawflow")
        .getAttribute("data-node");
    } else {
      ev.dataTransfer.setData("node", ev.target.getAttribute("data-node"));
    }
  }

  function drop(ev) {
    if (ev.type === "touchend") {
      var parentdrawflow = document
        .elementFromPoint(
          mobile_last_move.touches[0].clientX,
          mobile_last_move.touches[0].clientY,
        )
        .closest("#drawflow");
      if (parentdrawflow != null) {
        addNodeToDrawFlow(
          mobile_item_selec,
          mobile_last_move.touches[0].clientX,
          mobile_last_move.touches[0].clientY,
        );
      }
      mobile_item_selec = "";
    } else {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("node");
      addNodeToDrawFlow(data, ev.clientX, ev.clientY);
    }
  }

  function addNodeToDrawFlow(name, pos_x, pos_y) {
    if (editor.editor_mode === "fixed") {
      return false;
    }
    pos_x =
      pos_x *
        (editor.precanvas.clientWidth /
          (editor.precanvas.clientWidth * editor.zoom)) -
      editor.precanvas.getBoundingClientRect().x *
        (editor.precanvas.clientWidth /
          (editor.precanvas.clientWidth * editor.zoom));
    pos_y =
      pos_y *
        (editor.precanvas.clientHeight /
          (editor.precanvas.clientHeight * editor.zoom)) -
      editor.precanvas.getBoundingClientRect().y *
        (editor.precanvas.clientHeight /
          (editor.precanvas.clientHeight * editor.zoom));

    switch (name) {
      case "facebook":
        var facebook = `
        <div>
          <div class="title-box"><i class="fab fa-facebook"></i> Facebook Message</div>
        </div>
        `;
        editor.addNode(
          "facebook",
          0,
          1,
          pos_x,
          pos_y,
          "facebook",
          {},
          facebook,
        );
        break;
      case "slack":
        var slackchat = `
          <div>
            <div class="title-box"><i class="fab fa-slack"></i> Slack chat message</div>
          </div>
          `;
        editor.addNode("slack", 1, 0, pos_x, pos_y, "slack", {}, slackchat);
        break;
      case "github":
        var githubtemplate = `
          <div>
            <div class="title-box"><i class="fab fa-github "></i> Github Stars</div>
            <div class="box">
              <p>Enter repository url</p>
            <input type="text" df-name>
            </div>
          </div>
          `;
        editor.addNode(
          "github",
          0,
          1,
          pos_x,
          pos_y,
          "github",
          { name: "" },
          githubtemplate,
        );
        break;
      case "telegram":
        var telegrambot = `
          <div>
            <div class="title-box"><i class="fab fa-telegram-plane"></i> Telegram bot</div>
            <div class="box">
              <p>Send to telegram</p>
              <p>select channel</p>
              <select df-channel>
                <option value="channel_1">Channel 1</option>
                <option value="channel_2">Channel 2</option>
                <option value="channel_3">Channel 3</option>
                <option value="channel_4">Channel 4</option>
              </select>
            </div>
          </div>
          `;
        editor.addNode(
          "telegram",
          1,
          0,
          pos_x,
          pos_y,
          "telegram",
          { channel: "channel_3" },
          telegrambot,
        );
        break;
      case "aws":
        var aws = `
          <div>
            <div class="title-box"><i class="fab fa-aws"></i> Aws Save </div>
            <div class="box">
              <p>Save in aws</p>
              <input type="text" df-db-dbname placeholder="DB name"><br><br>
              <input type="text" df-db-key placeholder="DB key">
              <p>Output Log</p>
            </div>
          </div>
          `;
        editor.addNode(
          "aws",
          1,
          1,
          pos_x,
          pos_y,
          "aws",
          { db: { dbname: "", key: "" } },
          aws,
        );
        break;
      case "log":
        var log = `
            <div>
              <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>
            </div>
            `;
        editor.addNode("log", 1, 0, pos_x, pos_y, "log", {}, log);
        break;
      case "google":
        var google = `
            <div>
              <div class="title-box"><i class="fab fa-google-drive"></i> Google Drive save </div>
            </div>
            `;
        editor.addNode("google", 1, 0, pos_x, pos_y, "google", {}, google);
        break;
      case "email":
        var email = `
            <div>
              <div class="title-box"><i class="fas fa-at"></i> Send Email </div>
            </div>
            `;
        editor.addNode("email", 1, 0, pos_x, pos_y, "email", {}, email);
        break;

      case "template":
        var template = `
            <div>
              <div class="title-box"><i class="fas fa-code"></i> Template</div>
              <div class="box">
                Ger Vars
                <textarea df-template></textarea>
                Output template with vars
              </div>
            </div>
            `;
        editor.addNode(
          "template",
          1,
          1,
          pos_x,
          pos_y,
          "template",
          { template: "Write your template" },
          template,
        );
        break;
      case "multiple":
        var multiple = `
            <div>
              <div class="box">
                Multiple!
              </div>
            </div>
            `;
        editor.addNode(
          "multiple",
          3,
          4,
          pos_x,
          pos_y,
          "multiple",
          {},
          multiple,
        );
        break;
      case "personalized":
        var personalized = `
            <div>
              Personalized
            </div>
            `;
        editor.addNode(
          "personalized",
          1,
          1,
          pos_x,
          pos_y,
          "personalized",
          {},
          personalized,
        );
        break;
      case "dbclick":
        var dbclick = `
            <div>
            <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>
              <div class="box dbclickbox" ondblclick="showpopup(event)">
                Db Click here
                <div class="modal" style="display:none">
                  <div class="modal-content">
                    <span class="close" onclick="closemodal(event)">&times;</span>
                    Change your variable {name} !
                    <input type="text" df-name>
                  </div>

                </div>
              </div>
            </div>
            `;
        editor.addNode(
          "dbclick",
          1,
          1,
          pos_x,
          pos_y,
          "dbclick",
          { name: "" },
          dbclick,
        );
        break;

      default:
    }
  }

  var transform = "";
  function showpopup(e) {
    e.target.closest(".drawflow-node").style.zIndex = "9999";
    e.target.children[0].style.display = "block";
    //document.getElementById("modalfix").style.display = "block";

    //e.target.children[0].style.transform = 'translate('+translate.x+'px, '+translate.y+'px)';
    transform = editor.precanvas.style.transform;
    editor.precanvas.style.transform = "";
    editor.precanvas.style.left = editor.canvas_x + "px";
    editor.precanvas.style.top = editor.canvas_y + "px";
    console.log(transform);

    //e.target.children[0].style.top  =  -editor.canvas_y - editor.container.offsetTop +'px';
    //e.target.children[0].style.left  =  -editor.canvas_x  - editor.container.offsetLeft +'px';
    editor.editor_mode = "fixed";
  }

  function closemodal(e) {
    e.target.closest(".drawflow-node").style.zIndex = "2";
    e.target.parentElement.parentElement.style.display = "none";
    //document.getElementById("modalfix").style.display = "none";
    editor.precanvas.style.transform = transform;
    editor.precanvas.style.left = "0px";
    editor.precanvas.style.top = "0px";
    editor.editor_mode = "edit";
  }

  function changeModule(event) {
    var all = document.querySelectorAll(".menu ul li");
    for (var i = 0; i < all.length; i++) {
      all[i].classList.remove("selected");
    }
    event.target.classList.add("selected");
  }

  function changeMode(option) {
    //console.log(lock.id);
    if (option == "lock") {
      lock.style.display = "none";
      unlock.style.display = "block";
    } else {
      lock.style.display = "block";
      unlock.style.display = "none";
    }
  }
};

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

      const drawflowDiv = document.getElementById("step-2");

      drawflowDiv.style.display = "block";

      setDrawFlowSpace();
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

<style
  scoped
  src="../../../node_modules/drawflow/dist/drawflow.min.css"
></style>

<style scoped>
.wrapper {
  width: 100%;
  height: calc(100vh - 67px);
  display: flex;
}

#drawflow {
  position: relative;
  width: calc(100vw - 301px);
  height: calc(100% - 50px);
  top: 40px;
  background: var(--background-color);
  background-size: 25px 25px;
  background-image: linear-gradient(to right, #f1f1f1 1px, transparent 1px),
    linear-gradient(to bottom, #f1f1f1 1px, transparent 1px);
}

.drag-drawflow {
  line-height: 50px;
  border-bottom: 1px solid var(--border-color);
  padding-left: 20px;
  cursor: move;
  user-select: none;
}

/* Editing Drawflow */

.drawflow .drawflow-node {
  background: var(--background-color);
  border: 1px solid var(--border-color);
  -webkit-box-shadow: 0 2px 15px 2px var(--border-color);
  box-shadow: 0 2px 15px 2px var(--border-color);
  padding: 0px;
  width: 200px;
}

.drawflow .drawflow-node.selected {
  background: white;
  border: 1px solid #4ea9ff;
  -webkit-box-shadow: 0 2px 20px 2px #4ea9ff;
  box-shadow: 0 2px 20px 2px #4ea9ff;
}

.drawflow .drawflow-node.selected .title-box {
  color: #22598c;
  /*border-bottom: 1px solid #4ea9ff;*/
}

.drawflow .connection .main-path {
  stroke: #4ea9ff;
  stroke-width: 3px;
}

.drawflow .drawflow-node .input,
.drawflow .drawflow-node .output {
  height: 15px;
  width: 15px;
  border: 2px solid var(--border-color);
}

.drawflow .drawflow-node .input:hover,
.drawflow .drawflow-node .output:hover {
  background: #4ea9ff;
}

.drawflow .drawflow-node .output {
  right: 10px;
}

.drawflow .drawflow-node .input {
  left: -10px;
  background: white;
}

.drawflow > .drawflow-delete {
  border: 2px solid #43b993;
  background: white;
  color: #43b993;
  -webkit-box-shadow: 0 2px 20px 2px #43b993;
  box-shadow: 0 2px 20px 2px #43b993;
}

.drawflow-delete {
  border: 2px solid #4ea9ff;
  background: white;
  color: #4ea9ff;
  -webkit-box-shadow: 0 2px 20px 2px #4ea9ff;
  box-shadow: 0 2px 20px 2px #4ea9ff;
}

.drawflow-node .title-box {
  height: 50px;
  line-height: 50px;
  background: var(--background-box-title);
  border-bottom: 1px solid #e9e9e9;
  border-radius: 4px 4px 0px 0px;
  padding-left: 10px;
}
.drawflow .title-box svg {
  position: initial;
}
.drawflow-node .box {
  padding: 10px 20px 20px 20px;
  font-size: 14px;
  color: #555555;
}
.drawflow-node .box p {
  margin-top: 5px;
  margin-bottom: 5px;
}

.drawflow-node.welcome {
  width: 250px;
}

.drawflow-node.slack .title-box {
  border-radius: 4px;
}

.drawflow-node input,
.drawflow-node select,
.drawflow-node textarea {
  border-radius: 4px;
  border: 1px solid var(--border-color);
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  width: 158px;
  color: #555555;
}

.drawflow-node textarea {
  height: 100px;
}

.drawflow-node.personalized {
  background: red;
  height: 200px;
  text-align: center;
  color: white;
}
.drawflow-node.personalized .input {
  background: yellow;
}
.drawflow-node.personalized .output {
  background: green;
}

.drawflow-node.personalized.selected {
  background: blue;
}

.drawflow .connection .point {
  stroke: var(--border-color);
  stroke-width: 2;
  fill: white;
}

.drawflow .connection .point.selected,
.drawflow .connection .point:hover {
  fill: #4ea9ff;
}

@media only screen and (max-width: 768px) {
  .col {
    width: 50px;
  }
  .col .drag-drawflow span {
    display: none;
  }
  #drawflow {
    width: calc(100vw - 51px);
  }
}
</style>
