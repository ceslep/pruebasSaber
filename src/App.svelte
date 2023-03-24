<script>
  import Login from "./lib/Login.svelte";
  import Prueba from "./lib/Prueba.svelte";
  import ResultadosGenerales from "./lib/ResultadosGenerales.svelte";
  import { loggedin, loggedinDocente } from "./Stores";

  let estudiante = {};
  let docente = {};

  const login = (e) => {
    $loggedin = true;
    $loggedinDocente=!$loggedin
    estudiante = e.detail.estudiante.data[0];
  };

  const loginDocente = (e) => {
    $loggedinDocente = true;
    $loggedin = !$loggedinDocente;
    docente = e.detail.docente.data[0];
  };
</script>

<svelte:head>
  <title>
    Proyecto Pruebas Saber {new Date().getFullYear()}
  </title>
</svelte:head>

{#if !$loggedin && !$loggedinDocente}
  <div class="flex-center">
    <Login on:login={login} on:loginDocente={loginDocente} />
  </div>
{/if}  
{#if $loggedin}
  <Prueba {estudiante} />
{:else if $loggedinDocente}
  <ResultadosGenerales />
{/if}

<style>
  :global(body) {
    background: linear-gradient(rgb(204, 246, 204), rgb(150, 255, 150));
    min-height: 90vh;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
  }
</style>
