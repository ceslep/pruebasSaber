<script>
  import { onMount,afterUpdate } from "svelte";
  import { Accordion, AccordionItem, Alert } from "sveltestrap";
  import TablaRespuestas from "./TablaRespuestas.svelte";
  export let pruebas = [];
  export let resultados;

  onMount(()=>{
  })

  afterUpdate(()=>{
    console.log(resultados);
  })
</script>

<main>
  {#if pruebas && pruebas.length>0}
  <Accordion>
    {#each pruebas as prueba}
      <AccordionItem header={prueba}>
        <TablaRespuestas respuestas={resultados.filter(r=>r.prueba===prueba).map(r=>r.respuesta.respuestas)}/>
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
