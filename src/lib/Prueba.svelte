<script>
  import ModalPrueba from "./ModalPrueba.svelte";
  import { onMount, afterUpdate } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { URL } from "../Stores";
  import Encabezado from "./Encabezado.svelte";
  import Pie from "./Pie.svelte";
  import ModalResultados from "./ModalResultados.svelte";
  export let estudiante;
  let Pruebas = [];
  let linkPruebas = [];
  let consultando = false;
  let icon;
  let PruebaARealizar = [];

  let respuestas;

  let animated;

  let periodo = 1;

  onMount(() => {
    consultando = true;
    showModalPrueba = false;
    showModalResultados = false;
  });

  const getPruebas = async (Nivel) => {
    let response = await fetch(`${$URL}getPruebas.php`, {
      method: "POST",
      body: JSON.stringify({ Nivel, periodo }),
    });
    return await response.json();
  };

  afterUpdate(async () => {
    if (consultando) {
      PruebaARealizar = [];
      Pruebas = await getPruebas(estudiante.Nivel);
      linkPruebas = [...new Set(Pruebas.map((p) => p.NucleoComun))];
      consultando = false;
      showModalPrueba = false;
      showModalResultados = false;
    }
  });

  let prueba;
  let showModalResultados = false;
  let showModalPrueba = false;

  const managePrueba = (e) => {
    prueba = e.detail.prueba;
    icon = e.detail.icon;
    PruebaARealizar = [...Pruebas.filter((p) => p.NucleoComun === prueba)];
    showModalPrueba = true;
  };

  const manageResultados = () => {
    showModalResultados = true;
  };

  $: PruebaARealizar = [...PruebaARealizar.sort(() => Math.random() - 0.5)];
</script>

<main in:fly={{ y: 200, duration: 1000 }} out:fade>
  <Encabezado
    {estudiante}
    {linkPruebas}
    on:prueba={managePrueba}
    on:resultados={manageResultados}
  />
  <div class="flex-center">
    <img class="img-fluid" alt="" src="./escudo.png" width="400" />
  </div>

  {#if showModalResultados}
  <ModalResultados
    show={showModalResultados}
    on:close={() => (showModalResultados = false)}
    {estudiante}
    {periodo}
    {Pruebas}
  />
{/if}
{#if showModalPrueba}
  <ModalPrueba
    show={showModalPrueba}
    title={prueba}
    {icon}
    on:close={() => (showModalPrueba = false)}
    {PruebaARealizar}
    {estudiante}
    {prueba}
    {periodo}
  />
{/if}
  <Pie sede={estudiante.sede} grupo={estudiante.grupo} />
</main>

<style>
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
</style>
