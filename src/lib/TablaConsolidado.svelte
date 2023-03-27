<script>
  import { Table, Column } from "sveltestrap";
  import { group } from "group-items";
  export let resultados;
  // $:console.log({resultados})
  let res;
  let resTabla;
  $: res = group(resultados).by("prueba").asObject();
 

  $: restabla = Object.keys(res).map((r, i, result) => {
    
      let promedio=(res[r] ? res[r].map((r) => r.respuesta) : null)
        .map((t,i,a) => {
        try{
         //   console.log({respuestas:t});
          return { respuestas:t
              ? t.respuestas.map((s,i,at) => (s.respuesta === "true" ? 1 : 0))
              : [],
              cantidad:a.length
          }
          } catch (error) {
            console.log({error});
            console.log({i})
            return []
          }
        })
        .reduce((a, b,i,array) => {
          console.log(array.length)
          return a + parseFloat(b)}, 0)
        return{
          nucleo:r,
          promedio
        }
  });

   $:console.log(restabla);
</script>

<!-- <Table rows={resultados} let:row>
    <Column header="Nucleo Común" width="8rem">
      {row.nucleo}
    </Column>
    <Column header="Promedio" width="8rem">
      {row.promedio}
    </Column>
    <Column header="General">
      {row.general}
    </Column>
  </Table>

 -->
