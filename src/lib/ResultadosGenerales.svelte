<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { Accordion, Popover } from "sveltestrap";
  import { _Docente, URL } from "./../Stores.js";
  import ModalCrearPreguntas from "./CrearPreguntas/ModalCrearPreguntas.svelte";
  import ItemrespuestaGrados from "./ItemrespuestaGrados.svelte";
  import Swal from "sweetalert2";
  import "sweetalert2/src/sweetalert2.scss";

  const dispatch = createEventDispatcher();
  const getResultados = async () => {
    try {
      let response = await fetch(`${$URL}getRespuestasFull.php`, {
        method: "POST",
        body: JSON.stringify({ todos: true, periodo: 1 }),
      });
      return await response.json();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        text: "Ha ocurrido un error, revise su conexión a internet",
      });
    }
  };

  let resultados = [];
  let Grados = [];
  onMount(async () => {
    resultados = await getResultados();
    console.log({ resultados });
  });

  $: Grupos = [...new Set(resultados.map((r) => r.grupo))].sort(
    (a, b) => b - a
  );

  $: if (Grupos.length>0) console.log({ Grupos });

  const reload = async () => {
    resultados = [];
    resultados = await getResultados();
  };

  let showModalCedit = false;

  const cedit = () => {
    showModalCedit = !showModalCedit;
  };
</script>

<main>
  <nav class="navbar  bg-primary bg-gradient bg-opacity-25">
    <div class="container-fluid">
      <a class="navbar-brand" href="#!">Resultados</a>
      <div class="d-flex gap-1" role="search">
        <button
          id="btn-config"
          class="btn btn-outline-primary"
          type="submit"
          on:click={reload}><i class="fa-solid fa-gear" /></button
        >
        <Popover
          trigger="hover"
          placement="right"
          target="btn-config"
          title="Configuración"
        >
          Haga click aquí para Configurar la prueba.
        </Popover>
        <button
          id="btn-edit"
          class="btn btn-outline-secondary"
          type="submit"
          on:click={cedit}><i class="fa-solid fa-pen-to-square" /></button
        >
        <Popover
          trigger="hover"
          placement="bottom"
          target="btn-edit"
          title="Crear/Editar Preguntas"
        >
          Haga click aquí para editar o crear nuevas preguntas.
        </Popover>
        <button
          id="btn-refresh"
          class="btn btn-outline-success"
          type="submit"
          on:click={reload}><i class="fa-solid fa-repeat" /></button
        >
        <Popover
          trigger="hover"
          placement="left"
          target="btn-refresh"
          title="Refrescar Resultados"
        >
          Haga click aquí para refrescar los resultados Actuales.
        </Popover>
        <button
          id="btn-logout"
          class="btn btn-outline-dark"
          type="submit"
          on:click={() => {
            dispatch("logout");
          }}><i class="fa-solid fa-arrow-right-from-bracket" /></button
        >
        <Popover
          trigger="hover"
          placement="bottom"
          target="btn-logout"
          title="Logout"
        >
          Haga click aquí para cerrar sesión.
        </Popover>
      </div>
    </div>
  </nav>
  {#if Grupos.length === 0}
    <div class="d-flex justify-content-center mt-5 pt-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  {:else}
    <article class="mt-2">
      <Accordion>
        {#each Grupos as grupo}
          <ItemrespuestaGrados
            {grupo}
            estudiantes={[
              ...new Set(
                resultados
                  .filter((r) => r.grupo === grupo)
                  .sort((a, b) => (a.nombres > b.nombres ? 1 : -1))
                  .map((r) => r.estudiante)
              ),
            ]}
            {resultados}
          />
        {/each}
      </Accordion>
    </article>
  {/if}
</main>

{#if showModalCedit}
  <ModalCrearPreguntas
    show={showModalCedit}
    on:close={() => (showModalCedit = false)}
  />
{/if}
