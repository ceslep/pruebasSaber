<script>
  import { onMount, afterUpdate } from "svelte";
  import { Accordion, AccordionItem, Alert } from "sveltestrap";
  import { _Evaluacion } from "../Stores";
  import TablaRespuestas from "./TablaRespuestas.svelte";
  export let pruebas = [];
  export let resultados;

  onMount(() => {});

  afterUpdate(() => {
    console.log({ resultados:resultados.length>0&&resultados });
  });

  let Valoraciones = [];

  $: if (resultados.length > 0) {
    Valoraciones = resultados.map((r) => {
      return {
        prueba: r.prueba,
        analisis: r.respuesta.respuestas.map(r=>{
          return r.respuestas.respuestas.map(re=>console.log({re}))
        }),
        total: r.respuesta.respuestas && r.respuesta.respuestas.length,
      };
    });
  }

  $: if (Valoraciones.length > 0) console.log({ Valoraciones });
</script>

<main>
  {#if pruebas && pruebas.length > 0}
    <Accordion>
      {#each pruebas as prueba}
        <AccordionItem header={`${prueba} ${JSON.stringify($_Evaluacion)}`}>
          <TablaRespuestas
            respuestas={resultados
              .filter((r) => r.prueba === prueba)
              .map((r) => r.respuesta.respuestas)}
            on:evaluacion={(e) => {
              console.log({ evaluacion: e.detail });
            }}
            {prueba}
          />
        </AccordionItem>
      {:else}
        <Alert color={"primary"}>
          <h4 class="alert-heading text-capitalize">Sin resultados</h4>
          No hay resultados para observar de este estudiante
        </Alert>
      {/each}
    </Accordion>
  {/if}
</main>
