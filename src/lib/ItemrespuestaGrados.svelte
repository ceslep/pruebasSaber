<script>
  import { _Periodo } from "./../Stores.js";
  import { AccordionItem, Column, Popover, Table } from "sveltestrap";
  import ModalResultados from "./ModalResultados.svelte";
  import TablaConsolidado from "./TablaConsolidado.svelte";
  import { beforeUpdate } from "svelte";
  import "sweetalert2/src/sweetalert2.scss";
  import { get_current_component } from "svelte/internal";
  const self = get_current_component();
  export let grupo;
  export let estudiantes;
  export let resultados;

  let showModalResultados = false;
  let estudiante = {};
  let Puntajes = [];
  let puntajes = [];

  beforeUpdate(() => {
    estudiantes.forEach((est, i, a) => {
      let pnts = [];
      resultados
        .filter((res) => res.estudiante === est)
        .forEach((results) => {
          let resptas = results.respuesta
            ? results.respuesta.respuestas.map((r, c, d) => {
                return r.respuesta === "true" ? 1 / d.length : 0;
              })
            : [0];
          pnts = [...pnts, resptas.reduce((a, b) => a + b).toFixed(2)];
        });
      puntajes = [...puntajes, { estudiante: est, puntaje: pnts }];
    });
    puntajes = [
      ...puntajes.map((p) => {
        let puntaje = 0;
        if (typeof p.puntaje === "object")
          puntaje = p.puntaje.reduce(
            (a, b, i, d) => a + (100 * parseFloat(b)) / d.length,
            0
          );
        return {
          estudiante: p.estudiante,
          puntaje: puntaje.toFixed(1),
        };
      }),
    ];
  });

  $: if (puntajes.length > 0) Puntajes = [...puntajes];

  let Ordenados = [];
  let ordenarPor = "Ordenar por Puntaje";

  const ordenarPorNombre = () => {
    Ordenados = [];
    ordenarPor = "Ordenar por Puntaje";
  };

  let sortDir;
  const ordernarPorPuntaje = (direccion) => {
    sortDir = direccion;
    Ordenados = [];
    ordenarPor = "Ordenar por Nombres";
    estudiantes.forEach((est) => {
      let estudiante = {};
      estudiante.identificacion = est;
      estudiante.nombres =
        resultados[resultados.findIndex((r) => r.estudiante === est)].nombres;
      estudiante.puntaje =
        Puntajes[Puntajes.findIndex((pt) => pt.estudiante === est)].puntaje;
      estudiante.tiempo = resultados
        .filter((r) => r.estudiante == est)
        .reduce((a, b) => a + parseFloat(b.tiempo), 0)
        .toFixed(2);
      Ordenados = [...Ordenados, estudiante];
    });
  };
  $: if (Ordenados.length > 0) {
    if (sortDir)
      Ordenados = [
        ...Ordenados.sort(
          (a, b) => parseFloat(b.puntaje) - parseFloat(a.puntaje)
        ),
      ];
    else
      Ordenados = [
        ...Ordenados.sort(
          (a, b) => -parseFloat(b.puntaje) + parseFloat(a.puntaje)
        ),
      ];
  }
  $: if (Ordenados.length > 0) console.log(Ordenados);
</script>

<AccordionItem>
  <div  slot="header"><img src="./escudo.png" alt="" class="border border-success img-thumbnail rounded-circle" width="15%">
    <span class="fw-bold">{`Grupo ${grupo}`}</span>
  </div>
  <TablaConsolidado
    resultados={[...resultados.filter((r) => r.grupo === grupo)]}
  />
  <button
    class="btn btn-warning"
    on:click={() => {
      if (ordenarPor === "Ordenar por Nombres") ordenarPorNombre();
      else ordernarPorPuntaje(true);
    }}>{ordenarPor}</button
  >
  {#if Ordenados.length === 0}
    {#if Puntajes.length > 0}
      <Table rows={estudiantes} let:row responsive>
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
            {resultados[resultados.findIndex((r) => r.estudiante === row)]
              .nombres}
          </a>
        </Column>
        <Column
          header="Puntaje"
          class="text-success fw-bold text-center"
          style="color:red;text-align:center;"
        >
          {Puntajes[Puntajes.findIndex((pt) => pt.estudiante === row)].puntaje}
        </Column>
        <Column
          header="Tiempo (min.)"
          class="text-center text-secondary fw-bold"
          style="color:red;text-align:center;"
        >
          {resultados
            .filter((r) => r.estudiante == row)
            .reduce((a, b) => a + parseFloat(b.tiempo), 0)
            .toFixed(2)}
        </Column>
      </Table>
    {/if}
  {:else}
    <Table rows={Ordenados} let:row responsive>
      <Column header="Identificación">
        <a href="#!">{row.identificacion}</a>
      </Column>
      <Column header="Nombres">
        <a
          href="#!"
          on:click={() => {
            estudiante.identificacion = row.identificacion;
            estudiante.nombres = row.nombres;
            showModalResultados = true;
          }}
        >
          {row.nombres}
        </a>
      </Column>
      <Column
        header="Puntaje"
        class="text-success fw-bold text-center"
        style="color:red;text-align:center;"
      >
        {row.puntaje}
      </Column>
      <Column
        header="Tiempo (min.)"
        class="text-center text-secondary fw-bold"
        style="color:red;text-align:center;"
      >
        {row.tiempo}
      </Column>
    </Table>
  {/if}
</AccordionItem>

{#if showModalResultados}
  <ModalResultados
    show={showModalResultados}
    on:close={() => (showModalResultados = false)}
    {estudiante}
    periodo={$_Periodo}
  />
{/if}
