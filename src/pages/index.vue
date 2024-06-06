<script setup lang="ts">

useHead({
  title: "Dashboard",
});

const supabase = useSupabaseClient();
const usuarios = ref("");
const processos = ref("");
const categorias = ref([]);
const tags = ref("");

const lineData = ref({
  labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'],
  datasets: [
    {
      label: 'Usuários',
      data: [5, 9, 11, 11, 19, 13, 16],
      fill: false,
      backgroundColor: '#2f4860',
      borderColor: '#2f4860',
      tension: 0.4
    },
    {
      label: 'Processos',
      data: [15, 13, 20, 24, 22, 23, 27],
      fill: false,
      backgroundColor: '#00bb7e',
      borderColor: '#00bb7e',
      tension: 0.4
    }
  ]
});

// Paleta de cores para as categorias
const colors = [
  '#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#f9a8d4', '#ff9f40'
];

const fetchData = async () => {
  const usuariosResponse = await supabase.from("users").select("*");
  const processosResponse = await supabase.from("processos").select("*");
  const categoriasResponse = await supabase.from("categorias").select("*");
  const tagsResponse = await supabase.from("tags").select("*");

  usuarios.value = usuariosResponse.data.length;
  processos.value = processosResponse.data.length;
  tags.value = tagsResponse.data.length;

  const processosPorCategoria = processosResponse.data.reduce((acc: any, processo: any) => {
    if (!acc[processo.categoria_id]) {
      acc[processo.categoria_id] = 0;
    }
    acc[processo.categoria_id]++;
    return acc;
  }, {});

  categorias.value = categoriasResponse.data
    .filter((categoria: any) => processosPorCategoria.hasOwnProperty(categoria.id))
    .map((categoria: any, index: number) => {
      const quantidade = processosPorCategoria[categoria.id] || 0;
      const porcentagem = quantidade / processos.value * 100;
      return {
        ...categoria,
        quantidade,
        porcentagem,
        cor: colors[index % colors.length] // Atribuir cor da paleta
      };
    });
};

onMounted(() => {
  fetchData();
});
</script>



<template>
  <div class="grid">
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Usuários</span>
            <div class="text-900 font-medium text-xl">{{ usuarios }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Processos</span>
            <div class="text-900 font-medium text-xl">{{ processos }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Categorias</span>
            <div class="text-900 font-medium text-xl">{{ categorias.length }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Quantidade de tags disponíveis</span>
            <div class="text-900 font-medium text-xl">{{ tags }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 xl:col-6">
      <div class="card">
        <div class="flex justify-content-between align-items-center mb-5">
          <h5>Filtro de categorias</h5>
          <div>
            <ClientOnly>
              <Menu ref="menu2" :popup="true" :model="items" />
            </ClientOnly>
          </div>
        </div>
        <ul class="list-none p-0 m-0">
          <li
            v-for="(categoria, index) in categorias"
            :key="index"
            class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
          >
            <div>
              <span class="text-900 font-medium mr-2 mb-1 md:mb-0">{{ categoria.nome }}</span>
            </div>
            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
              <div
                class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                style="height: 8px"
              >
                <div
                  class="h-full"
                  :style="{ width: `${categoria.porcentagem}%`, backgroundColor: categoria.cor }"
                ></div>
              </div>
              <span :style="{ color: categoria.cor }" class="ml-3 font-medium">
                {{ categoria.porcentagem.toFixed(2) }}%
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="col-12 xl:col-6">
      <div class="card">
        <h5>Usuários e processos</h5>
        <Chart type="line" :data="lineData" />
      </div>
    </div>
  </div>
</template>
