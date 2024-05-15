<script setup>
definePageMeta({
  layout: "empty",
});

const { $appState } = useNuxtApp();

const email = ref("");
const passwordValue = ref("");
const checked = ref(false);

const router = useRouter();

const login = async () => {
  const supabase = useSupabaseClient();

  const authResponse = await supabase.auth.signInWithPassword({
    email: email.value,
    password: passwordValue.value,
  });

  if (authResponse.error) {
    return;
  } else {
    console.log("Login success");
    router.push("/");
  }
};
</script>

<template>
  <div
    class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <div class="grid justify-content-center p-2 lg:p-0" style="min-width: 80%">
      <div class="col-12 mt-5 xl:mt-0 text-center">
        <!-- <img :src="`/images/logo-${logoColor}.svg`" alt="Mindflux logo" class="mb-5" style="width:81px; height:60px;"> -->
        <img
          src="/images/logo.png"
          alt="Mindflux logo"
          class="mb-5"
          style="width: 81px; height: 60px"
        />
      </div>
      <div
        class="col-12 xl:col-6"
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(
            180deg,
            var(--primary-color),
            rgba(33, 150, 243, 0) 30%
          );
        "
      >
        <div
          class="h-full w-full m-0 py-7 px-4"
          style="
            border-radius: 53px;
            background: linear-gradient(
              180deg,
              var(--surface-50) 38.9%,
              var(--surface-0)
            );
          "
        >
          <div class="text-center mb-5">
            <img
              src="@/assets/images/avatar/avatar.jpg"
              alt="Image"
              height="120"
              style="border-radius: 50%"
              class="mb-3"
            />
            <div class="text-900 text-3xl font-medium mb-3">Bem vindo!</div>
            <span class="text-600 font-medium"
              >Insira suas credenciais para continuar</span
            >
          </div>

          <div class="w-full md:w-10 mx-auto">
            <label for="email1" class="block text-900 text-xl font-medium mb-2"
              >E-mail</label
            >
            <InputText
              id="email1"
              v-model="email"
              type="text"
              class="w-full mb-3"
              placeholder="E-mail"
              style="padding: 1rem"
            />

            <label
              for="password"
              class="block text-900 font-medium text-xl mb-2"
              >Senha</label
            >
            <Password
              id="password"
              v-model="passwordValue"
              class="w-full mb-3"
              input-class="w-full"
              weak
            />

            <!-- <div class="flex align-items-center justify-content-between mb-5">
              <div class="flex align-items-center">
                <Checkbox
                  id="rememberme1"
                  v-model="checked"
                  :binary="true"
                  class="mr-2"
                />
                <label for="rememberme1">Lembrar credencial</label>
              </div>
              <a
                class="font-medium no-underline ml-2 text-right cursor-pointer"
                style="color: var(--primary-color)"
                >Esqueceu a senha?</a
              >
            </div> -->
            <Button @click="login" label="Acessar" class="w-full p-3 text-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
