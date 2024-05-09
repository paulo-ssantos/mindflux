<script setup>
const step = ref(0);
</script>

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
                  <InputText id="firstname2" type="text" />
                </div>
                <div class="field col-12 md:col-6">
                  <label for="lastname2">Categoria</label>
                  <Dropdown
                    v-model="dropdownValue"
                    :options="dropdownValues"
                    option-label="name"
                    placeholder="Select"
                  />
                </div>
                <div class="field col-12">
                  <label for="address">Descrição</label>
                  <Textarea id="address" rows="4" />
                </div>
                <div class="field col-12">
                  <label for="city">Tags</label>
                  <MultiSelect
                    v-model="multiselectValue"
                    :options="multiselectValues"
                    option-label="name"
                    placeholder="Selecionar Tags"
                    :filter="true"
                  >
                    <template #value="slotProps">
                      <div
                        v-for="option of slotProps.value"
                        :key="option.code"
                        class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2"
                      >
                        <span
                          :class="`mr-2 flag flag-${option.code.toLowerCase()}`"
                          style="width: 18px; height: 12px"
                        />
                        <div>{{ option.name }}</div>
                      </div>
                      <template
                        v-if="!slotProps.value || slotProps.value.length === 0"
                      >
                        <div class="p-1">Tags</div>
                      </template>
                    </template>
                    <template #option="slotProps">
                      <div class="flex align-items-center">
                        <span
                          :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`"
                          style="width: 18px; height: 12px"
                        />
                        <div>{{ slotProps.option.name }}</div>
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
            @click="step++"
          />
        </div>

        <div v-if="step == 1">
          <ClientOnly fallback-tag="span" fallback="Carregando o editor...">
            <div class="border-2 border-primary rounded-4xl p-2">
              <NuxtEditorJs />
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
            @click="step++"
          />
        </div>

        <div v-if="step == 2">
          <h1>DIAGRAMA</h1>
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
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
