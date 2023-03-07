<script>
  import { Accordion, AccordionItem, Alert } from "sveltestrap";
  export let pruebas = [];
</script>

<main>
  <Accordion>
    {#each pruebas as prueba}
      <AccordionItem header={prueba}>
        {prueba}
      </AccordionItem>
    {:else}
      <Alert color={"primary"}>
        <h4 class="alert-heading text-capitalize">Sin resultados</h4>
        No hay resultados para observar de este estudiante
      </Alert>
    {/each}
  </Accordion>
</main>
