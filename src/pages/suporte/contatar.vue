<script setup>
// import Message from 'primevue/message';

// function enviarSuporte(){

//     var cargo = document.getElementById('cargo').value;
//     var nome = document.getElementById('nome').value;
//     var reportar = document.getElementById('mensagem').value;

//     if (!cargo || !nome || !reportar) {

//     var toast = document.createElement('div');
//     toast.innerHTML = '<Message severity="error">Erro ao enviar</Message>';
//     document.body.appendChild(toast);
//   } else {
//     var toast = document.createElement('div');
//     toast.innerHTML = '<Message severity="success">Reportado com sucesso</Message>';
//   }
// }
</script>

<template>
  <div class="col-12">
    <div class="card">
      <h5>Advanced</h5>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="firstname2">Firstname</label>
          <InputText id="firstname2" type="text" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="lastname2">Lastname</label>
          <InputText id="lastname2" type="text" />
        </div>
        <div class="field col-12">
          <label for="address">Address</label>
          <Textarea id="address" rows="4" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="city">City</label>
          <InputText id="city" type="text" />
        </div>
        <div class="field col-12 md:col-3">
          <label for="state">State</label>
          <ClientOnly>
            <Dropdown
              id="state"
              v-model="dropdownItem"
              :options="dropdownItems"
              option-label="name"
              placeholder="Select One"
            />
          </ClientOnly>
        </div>
        <div class="field col-12 md:col-3">
          <label for="zip">Zip</label>
          <InputText id="zip" type="text" />
        </div>
      </div>
    </div>
  </div>
</template>
