<script>
  import { onMount } from "svelte";
  import { Accordion } from "sveltestrap";
  import { _Docente, URL } from "./../Stores.js";
  import ItemrespuestaGrados from "./ItemrespuestaGrados.svelte";

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
</script>

<main>
  <h1>Resultados</h1>
  {#if Grupos.length === 0}
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  {:else}
    <Accordion>
      {#each Grupos as grupo}
        <ItemrespuestaGrados
          {grupo}
          estudiantes={[
            ...new Set(
              resultados.filter(r=>r.grupo===grupo).sort((a,b)=>a.nombres>b.nombres?1:-1).map(r=>r.estudiante))
            ,
          ]}
          {resultados}
        />
      {/each}
    </Accordion>
  {/if}
</main>
