<script>
  import { AccordionItem, Column, Table } from "sveltestrap";

  export let grupo;
  export let estudiantes;
  export let resultados;

  $:console.log({estudiantes})
</script>

<AccordionItem header={grupo}>
  <Table rows={estudiantes} let:row>
    <Column header="Identificación">
      {row}
    </Column>
    <Column header="Nombres">
      {resultados[resultados.findIndex(r=>r.estudiante===row)].nombres}
    </Column>
  </Table>
</AccordionItem>
