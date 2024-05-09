
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
        <div class="floatlabel-demo">
            <div class="card">
                <h5>Formulário</h5>
                <div class="grid p-fluid mt-3">
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label">
                            <label for="problema">Escolha o problema:</label>
                            <select id="problema" name="problema">
                                <option value="login">Problemas de Login</option>
                                <option value="bug">Relatar um Bug</option>
                                <option value="outro">Outro</option>
                            </select>
                           
                        </span>
                    </div>

                    <div class="field col-12 md:col-4">
                        <span class="p-float-label">
                            <label for="cargo">Cargo:</label>
                            <input type="text" id="cargo" name="cargo">
                        </span>
                    </div>

                    <div class="field col-12 md:col-4">
                        <span class="p-float-label">
                            <label for="nome">Nome:</label>
                            <input type="text" id="nome" name="nome">

                        </span>
                    </div>

                    <div class="field col-12 md:col-4">
                        <span class="p-float-label">
                            <label for="mensagem">Reporte o Erro:</label>
                            <textarea id="mensagem" name="mensagem"></textarea>
                        </span>
                    </div>

                    <div class="field col-12 md:col-4">
                        <button id="btn" >Enviar</button>
                    </div>
                </div>
            </div>
        </div>
</template>

<style scoped >
.floatlabel-demo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.card {
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  padding: 20px;
}

h5 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #000000
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 20px;
}

.field {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
}

input[type="text"],
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.Message {
  margin-top: 10px;
}

.Message.error {
  color: #ff0000;
}

.Message.success {
  color: #008000;
}

</style>