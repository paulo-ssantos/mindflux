<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h1 id="titulo">MindFlux</h1>
        <section class="w-full">
          <h2>Sobre</h2>
          <div id="image">
            <img src="/images/pages/gestao-do-conhecimento.png" alt="" />
          </div>

          <div id="paragrafo" class="w-full">
            <p class="w-full">
              O MindFlux é uma poderosa ferramenta baseada na web projetada para
              simplificar e otimizar a gestão do conhecimento em sua empresa.
              Com recursos avançados de autenticação, categorização e pesquisa,
              o MindFlux permite que sua equipe encontre e compartilhe
              informações de forma eficiente, melhorando a colaboração e
              impulsionando o sucesso dos projetos.
            </p>
            <p class="">
              A segurança dos dados é nossa prioridade. Com a autenticação
              segura do MindFlux, você pode ter a tranquilidade de que apenas
              usuários autorizados têm acesso aos conteúdos relevantes. Atribua
              diferentes níveis de acesso com base nas funções de cada usuário
              na empresa, garantindo a confidencialidade e integridade das
              informações.
            </p>
            <p class="">
              Facilite a busca e a navegação através da organização inteligente
              do conteúdo. Com recursos de categorização e tags, o MindFlux
              permite que você classifique e agrupe informações de maneira
              intuitiva, tornando mais simples encontrar o que você precisa,
              quando você precisa.
            </p>
            <p class="">
              Encontre rapidamente o conteúdo desejado com nossa poderosa função
              de pesquisa avançada. Utilize palavras-chave, filtros e critérios
              avançados para refinar os resultados e localizar exatamente o que
              você está procurando, economizando tempo e aumentando a
              produtividade.
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
#titulo {
  text-align: center;
}

/* Estilos para os títulos das seções */
h2 {
  text-align: center;
  margin-top: 25px;
}

/* Estilos para os parágrafos */
p {
  font-size: 20px;
  line-height: 1.6;
  margin-bottom: 15px;
  max-width: 500px;
  text-align: center;
}

#paragrafo {
  width: 100%; /* Garante que a largura da div seja 100% do seu contêiner pai */
  max-width: 800px; /* Define a largura máxima da div */
  margin: 0 auto; /* Margem automática nas laterais para centralizar a div */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
}

/* Estilos para as seções */
section {
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#image {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

#image > img {
  min-width: 40%;
  max-width: 40%;
  height: auto;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
