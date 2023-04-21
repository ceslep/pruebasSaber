<script>
  import { afterUpdate, createEventDispatcher } from "svelte";
  import { Table } from "sveltestrap";
  export let respuestas = [];

  const dispatch = createEventDispatcher();

  afterUpdate(() => {
    //  console.log(respuestas);
  });

  // @ts-ignore
  String.prototype.decodeUnicode = function () {
    return this.replaceAll("u00e9", "é")
      .replaceAll("u00f3", "ó")
      .replaceAll("u00ed", "í")
      .replaceAll("u00e1", "á")
      .replaceAll("u00fa", "ú")
      .replaceAll("u201d", '"')
      .replaceAll("u201c", '"')
      .replaceAll("u00f1", "ñ")
      .replaceAll("u00bf", "¿")
      .replaceAll("u00c1", "Á")
      .replaceAll("u2014", "—")
      .replaceAll("u2026", "…");
  };

  // @ts-ignore
  String.prototype.leftStr = function (c) {
    if (this.length <= c) {
      return this;
    } else {
      return this.slice(0, c) + "...";
    }
  };

  let analisis;
  let total;
</script>

<Table bordered hover striped responsive>
  <thead>
    <tr>
      <th>#</th>
      <th>Pregunta</th>
      <th>Continuación</th>
      <th>textoRespuesta</th>
      <th>Valoración</th>
    </tr>
  </thead>
  <tbody>
    {#if respuestas[0] && respuestas[0].length}
      {#each respuestas[0] as { respuesta, textodelapregunta, continuaciontextodelapregunta, textorespuesta }, index}
        <tr>
          <th class="text-center align-middle" scope="row">{index + 1}</th>
          <td class="text-justify"
            >{textodelapregunta.decodeUnicode().leftStr(100)}</td
          >
          <td class="text-justify"
            >{continuaciontextodelapregunta.decodeUnicode()}</td
          >
          <td class="text-justify">{textorespuesta.decodeUnicode()}</td>
          <td class="text-center"
            ><img
              width="30%"
              src={respuesta === "true" ? "./feliz.png" : "./triste.png"}
              alt=""
              class="img-fluid"
            /></td
          >
        </tr>
      {/each}
    {/if}
  </tbody>
</Table>

<style>
  .text-justify {
    text-align: justify;
  }
</style>
