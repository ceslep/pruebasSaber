<script>
  import Login from "./lib/Login.svelte";
  import Prueba from "./lib/Prueba.svelte";
  import { loggedin } from "./Stores";

  let estudiante = {};

  const login = (e) => {
    $loggedin = true;
    estudiante = e.detail.estudiante.data[0];
  };
</script>

<svelte:head>
  <title>
    Proyecto Pruebas Saber {new Date().getFullYear()}
  </title>
</svelte:head>

{#if !$loggedin}
  <div class="flex-center">
    <Login on:login={login} />
  </div>
{:else}
  <Prueba {estudiante} />
{/if}

<style>
  :global(body) {
    background: linear-gradient(rgb(204, 246, 204), rgb(150, 255, 150));
    min-height: 90vh;
  }

  .flex-center {
    display:flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
  }
</style>
