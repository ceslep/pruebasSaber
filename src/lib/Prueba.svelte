<script context="module" lang="ts">
  //const axios = require("axios");
  import axios from "axios";
  export async function _getPruebas(URL, Nivel, periodo) {
    console.log({ URL, Nivel, periodo });
    let { data } = await axios.post(
      `${URL}getPruebas.php`,
      JSON.stringify({ Nivel, periodo })
    );
    return data;
  }
</script>

<script>
  import { _Periodo } from "./../Stores.js";
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

  let periodo = $_Periodo;

  onMount(() => {
    consultando = true;
    showModalPrueba = false;
    showModalResultados = false;
  });

  const getPruebas = async (Nivel) => {
    return await _getPruebas($URL, Nivel, periodo);
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
      on:close={() => {
        showModalResultados = false;
      }}
      {estudiante}
      periodo={$_Periodo}
    />
  {/if}

  {#if showModalPrueba}
    <ModalPrueba
      show={showModalPrueba}
      title={prueba}
      {icon}
      on:close={() => {
        showModalPrueba = false;
        PruebaARealizar = [];
      }}
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
