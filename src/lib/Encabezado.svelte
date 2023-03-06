<script>
  import { loggedin } from "./../Stores.js";
  import { createEventDispatcher, onMount } from "svelte";
  import { Spinner } from "sveltestrap";

  export let linkPruebas = [];
  const dispatch = createEventDispatcher();

  let cargando = true;
  onMount(() => {});

  $: cargando = linkPruebas.length === 0;

  export let estudiante;
  let nombres;
  $: nombres = `${estudiante.apellido1} ${estudiante.apellido2} ${
    estudiante.nombre1
  } ${estudiante.nombre2 ? estudiante.nombre2 : ""}`;

  const setIcon = (text) => {
    return text.includes("Sociales")
      ? '<i class="fa-solid fa-people-group text-warning"></i>'
      : text.includes("Naturales")
      ? '<i class="fa-solid fa-frog text-success"></i>'
      : text.includes("Inglés")
      ? '<i class="fa-solid fa-earth-americas text-primary"></i>'
      : text.includes("Mate")
      ? '<i class="fa-solid fa-brain text-danger"></i>'
      : text.includes("Lectura")
      ? '<i class="fa-solid fa-book text-secondary"></i>'
      : "";
  };

  const logout = async () => {
    // @ts-ignore
    const {isConfirmed} = await Swal.fire({
      title: "Desea cerrar sesión",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    });
    $loggedin=!isConfirmed;
  };
</script>

<div class="fixed-top">
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#!"><span class="fs-7">{nombres}</span></a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item text-start">
            <a
              class="nav-link text-primary fw-bold"
              aria-current="page"
              href="#!"
              ><i class="fa-solid fa-square-poll-vertical" /> Resultados</a
            >
          </li>
          {#each linkPruebas as prueba}
            <li class="nav-item text-start">
              <a
                class="nav-link"
                href="#!"
                data-bs-toggle="collapse"
                data-bs-target=".navbar-collapse.show"
                on:click={() => {
                  dispatch("prueba", { prueba, icon: setIcon(prueba) });
                }}>{@html setIcon(prueba)} {prueba}</a
              >
            </li>
          {/each}
          {#if cargando}
            <Spinner color="primary" type="grow" />
          {/if}
          <li><hr class="dropdown-divider" /></li>
          <li class="nav-item text-start">
            <a
              class="nav-link text-success"
              aria-current="page"
              href="#!"
              on:click={logout}
              ><i class="fa-solid fa-right-from-bracket" /> Cerrar Sesión</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>

<style>
  .fs-7 {
    font-size: 0.85rem;
  }
</style>
