<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { Accordion } from "sveltestrap";
  import { _Docente, URL } from "./../Stores.js";
  import ItemrespuestaGrados from "./ItemrespuestaGrados.svelte";


  const dispatch = createEventDispatcher();
  const getResultados = async () => {
    let response = await fetch(`${$URL}getRespuestasFull.php`, {
      method: "POST",
      body: JSON.stringify({ todos: true, periodo: 1 }),
    });
    return await response.json();
  };

  let resultados = [];
  let Grados = [];
  onMount(async () => {
    resultados = await getResultados();
    console.log({ resultados });
  });

  $: Grupos = [...new Set(resultados.map((r) => r.grupo))].sort(
    (a, b) => b - a
  );

  $: console.log({ Grupos });

  const reload=async ()=>{
    resultados=[];
    resultados = await getResultados();
  }
</script>

<main>
  <nav class="navbar  bg-primary bg-gradient bg-opacity-25">
    <div class="container-fluid">
      <a class="navbar-brand" href="#!">Resultados</a>
      <div class="d-flex gap-1" role="search">
        <button class="btn btn-outline-success" type="submit"
        on:click={reload}><i class="fa-solid fa-repeat" /></button
        >
        <button class="btn btn-outline-dark" type="submit"
          on:click={()=>{
            dispatch("logout")
          }}><i class="fa-solid fa-arrow-right-from-bracket"></i></button
        >
      </div>
      
    </div>
  </nav>
  {#if Grupos.length === 0}
    <div class="d-flex justify-content-center mt-5 pt-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  {:else}
    <article class="mt-2">
      <Accordion>
        {#each Grupos as grupo}
          <ItemrespuestaGrados
            {grupo}
            estudiantes={[
              ...new Set(
                resultados
                  .filter((r) => r.grupo === grupo)
                  .sort((a, b) => (a.nombres > b.nombres ? 1 : -1))
                  .map((r) => r.estudiante)
              ),
            ]}
            {resultados}
          />
        {/each}
      </Accordion>
    </article>
  {/if}
</main>
