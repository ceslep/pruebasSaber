<script>
  import { _getPruebas } from "../lib/Prueba.svelte";
  import { _Periodo, URL } from "./../Stores.js";
  import { onMount, afterUpdate } from "svelte";
  import { Accordion, AccordionItem, Alert } from "sveltestrap";
  import Graficas from "./Graficas.svelte";
  import ModalPrueba from "./ModalPrueba.svelte";
  import TablaRespuestas from "./TablaRespuestas.svelte";
  export let pruebas = [];
  export let resultados = [];

  onMount(() => {
    console.log({ resultados });
    Valoraciones = [
      ...resultados.map((r, i, a) => {
        return {
          prueba: r.prueba,
          total: r.respuesta ? r.respuesta.respuestas.length : 0,
          analisis: r.respuesta
            ? r.respuesta.respuestas
                .map((re) => (re.respuesta === "true" ? 1 : 0))
                .reduce((a, b) => a + b)
            : 0,
          tiempo: r.tiempo,
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
        const { total, porcentaje, analisis, tiempo } = Fv;
        return { total, porcentaje, analisis, tiempo };
      }),
    ][0][key];
  };

  let verTabla = false;
  const openItem = (id, index) => {
    verTabla = id;
  };

  let colors = [
    "text-success",
    "text-primary",
    "text-dark",
    "text-success",
    "text-danger",
    "text-secondary",
  ];

  const coloring = (div) => {
    let buttons = div.querySelectorAll(".accordion-button");
    [...buttons].forEach((b) => {
      let values = b.innerHTML.split("-");
      let html = "";
      values.forEach((v, index, a) => {
        html += `
              <span class="${colors[index]} ${
          index === a.length - 1 ? "fw-bold" : ""
        }">${v.trim()}</span>&nbsp;
          `;
      });
      b.innerHTML = html;
    });
  };

  let mostrarPrueba = false;
  let estudiante = {};
  let prueba;
  let Pruebas = [];
  let PruebaARealizar = [];

  const verPrueba = async (prb) => {
    estudiante.identificacion =
      resultados[resultados.findIndex((res) => res.prueba === prb)].estudiante;
    estudiante.nivel =
      resultados[resultados.findIndex((res) => res.prueba === prb)].Nivel;
    prueba = prb;
    mostrarPrueba = !mostrarPrueba;
    Pruebas = await _getPruebas($URL, estudiante.nivel, $_Periodo);
    PruebaARealizar = [...Pruebas.filter((p) => p.NucleoComun === prueba)];
  };
</script>

{#if mostrarPrueba}
  <ModalPrueba
    show={mostrarPrueba}
    {estudiante}
    {prueba}
    title={prueba}
    periodo={$_Periodo}
    on:close={() => (mostrarPrueba = false)}
    {PruebaARealizar}
  />
{/if}
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
            )}.-Correctas-${gE(prueba, "analisis")}-${gE(prueba, "tiempo")}m.`}
          >
            <button
              class="btn btn-danger bg-gradient bg-opacity-50 rounded-0 d-block w-100"
              on:click={() => verPrueba(prueba)}
              >Ver Prueba <i class="fa-regular fa-eye" /></button
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
