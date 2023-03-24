<script>
  import { _Periodo } from "./../Stores.js";
  import { AccordionItem, Column, Table } from "sveltestrap";
  import ModalResultados from "./ModalResultados.svelte";
  export let grupo;
  export let estudiantes;
  export let resultados;

  let showModalResultados = false;
  let estudiante = {};

  $: console.log({ estudiantes });
</script>

<AccordionItem header={grupo}>
  <Table rows={estudiantes} let:row>
    <Column header="Identificación">
      <a href="#!">{row}</a>
    </Column>
    <Column header="Nombres">
      <a
        href="#!"
        on:click={() => {
          estudiante.identificacion =
            resultados[
              resultados.findIndex((r) => r.estudiante === row)
            ].estudiante;
          estudiante.nombres =
            resultados[
              resultados.findIndex((r) => r.estudiante === row)
            ].nombres;
          showModalResultados = true;
        }}
      >
        {resultados[resultados.findIndex((r) => r.estudiante === row)].nombres}
      </a>
    </Column>
    <Column header="Tiempo (min.)" class="text-end">
      {(resultados.filter(r=>r.estudiante===row).reduce((a,b)=>a+parseFloat(b.tiempo),0)).toFixed(2)}
    </Column> 
  </Table>
</AccordionItem>

{#if showModalResultados}
  <ModalResultados
    show={showModalResultados}
    on:close={() => (showModalResultados = false)}
    {estudiante}
    periodo={$_Periodo}
  />
{/if}
