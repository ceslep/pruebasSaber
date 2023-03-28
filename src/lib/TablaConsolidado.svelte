<script>
  import { Table, Column } from "sveltestrap";
  import { group } from "group-items";
  import { afterUpdate } from "svelte";
  export let resultados;
  // $:console.log({resultados})
  let res;
  let resTabla;

  afterUpdate(() => {
    res = group(resultados).by("prueba").asObject();
    resTabla = Object.keys(res).map((r, i, result) => {
      let promedio = (res[r] ? res[r].map((r) => r.respuesta) : null)
        .map((t, i, a) => {
          try {
            //   console.log({respuestas:t});
            return {
              respuestas: t
                ? t.respuestas.map((s, i, at) =>
                    s.respuesta === "true" ? 1 : 0
                  )
                : [],
              cantidad: a.length,
            };
          } catch (error) {
            console.log({ error });
            console.log({ i });
            return [];
          }
        })
        .map((r, i, array) => {
          let promedio = r.respuestas
            ? r.respuestas.reduce((a, b, i, at) => a + b / at.length, 0)
            : 0;
          let cantidad = array.length;
          return {
            promedio,
            cantidad,
          };
        })
        .reduce((a, b) => a + parseFloat(b.promedio)*100 / b.cantidad, 0)
        .toFixed(3);
      return {
        nucleo: r,
        promedio,
      };
    });
  });

</script>

<main>
  {#if resTabla && resTabla.length > 0}
    <Table rows={resTabla} let:row striped hover bordered size="sm" responsive>
      <Column header="Nucleo Común" width="8rem">
        {row.nucleo}
      </Column>
      <Column header="Puntaje Promedio" width="8rem" class="text-center">
        {row.promedio}
      </Column>
    </Table>
  {/if}
</main>
