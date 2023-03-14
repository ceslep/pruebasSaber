<script>
  import { onMount, afterUpdate } from "svelte";
  import { Accordion, AccordionItem, Alert } from "sveltestrap";
  import Graficas from "./Graficas.svelte";
  import TablaRespuestas from "./TablaRespuestas.svelte";
  export let pruebas = [];
  export let resultados = [];

  onMount(() => {
    console.log({ resultados });
    Valoraciones = [
      ...resultados.map((r, i, a) => {
        return {
          prueba: r.prueba,
          total: r.respuesta.respuestas.length,
          analisis: r.respuesta.respuestas
            .map((re) => (re.respuesta === "true" ? 1 : 0))
            .reduce((a, b) => a + b),
        };
      }),
    ].map((V) => {
      let porcentaje = Math.round((V.analisis * 100) / V.total);
      return {
        porcentaje,
        ...V,
      };
    });
    console.log({ Valoraciones });
  });

  afterUpdate(() => {
    //   console.log({ resultados });
  });

  let Valoraciones = [];

  const gE = (prueba, key) => {
    return [
      ...Valoraciones.filter((V) => V.prueba === prueba).map((Fv) => {
        const { total, porcentaje, analisis } = Fv;
        return { total, porcentaje, analisis };
      }),
    ][0][key];
  };

  let verTabla = false;
  const openItem = (id, index) => {
    verTabla = id;
  };

  let colors=['text-success','text-primary','text-dark','text-success','text-danger']

  const coloring=(main)=>{
     let buttons=document.querySelectorAll('.accordion-button');
     [...buttons].forEach(b=>{
      let values=b.innerHTML.split("-");
      let html="";
      values.forEach((v,index,a)=>{
          html+=`
              <span class="${colors[index]} ${index===a.length-1?'fw-bold':''}">${v.trim()}</span>&nbsp;
          `
      });
      b.innerHTML=html;
     })
  }

 
</script>

<main>
  {#if pruebas && pruebas.length > 0 && Valoraciones.length > 0}
  <div use:coloring>
    <Accordion>
      {#each pruebas as prueba, index}
        <AccordionItem
          on:toggle={(e) => {
            openItem(e.detail, index);
          }}
          header={`${prueba}-${gE(prueba, "porcentaje")}% de-${gE(
            prueba,
            "total"
          )}.-Correctas-${gE(prueba, "analisis")}`}
        >
          {#if verTabla}
            <Graficas
              {prueba}
              porcentaje={gE(prueba, "porcentaje")}
              data={[
                ...resultados
                  .filter((r) => r.prueba === prueba)
                  .map((r) =>
                    r.respuesta.respuestas.map((re) =>
                      re.respuesta === "true" ? 1 : 0
                    )
                  )[0],
              ]}
            /> 
            <TablaRespuestas
              respuestas={resultados
                .filter((r) => r.prueba === prueba)
                .map((r) => r.respuesta.respuestas)}
              on:evaluacion={(e) => {
                console.log({ evaluacion: e.detail });
              }}
            />
          {/if}
        </AccordionItem>
      {:else}
        <Alert color={"primary"}>
          <h4 class="alert-heading text-capitalize">Sin resultados</h4>
          No hay resultados para observar de este estudiante
        </Alert>
      {/each}
    </Accordion>
  </div>
  {/if}
</main>
