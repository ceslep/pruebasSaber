<script>
  import { URL, _Estudiante } from "./../Stores.js";
  import {
    onMount,
    onDestroy,
    createEventDispatcher,
    afterUpdate,
  } from "svelte";
  import "animate.css";
  import DetailResults from "./DetailResults.svelte";
  import Modal from "bootstrap/js/dist/modal";
  import axios from "axios";

  const dispatch = createEventDispatcher();

  let _Modal;
  let guardando = false;
  const modal = (el) => {
    // @ts-ignore
    _Modal = new Modal(el);
  };

  let animates = [
    "animate__fadeInRight",
    "animate__backInDown",
    "animate__backInRight",
    "animate__backInLeft",
    "animate__bounceIn",
    "animate__bounceInDown",
    "animate__bounceInLeft",
    "animate__bounceInRight",
    "animate__bounceInUp",
    "animate__fadeIn",
    "animate__fadeInDown",
    "animate__fadeInDownBig",
    "animate__fadeInLeft",
    "animate__fadeInLeftBig",
    "animate__fadeInRight",
    "animate__fadeInRightBig",
    "animate__fadeInUp",
    "animate__fadeInUpBig",
    "animate__fadeInTopLeft",
    "animate__fadeInTopRight",
    "animate__fadeInBottomLeft",
    "animate__fadeInBottomRight",
    "animate__fadeInBottomRight",
    "animate__flip",
    "animate__flipInX",
    "animate__flipInY",
    "animate__lightSpeedInRight",
    "animate__lightSpeedInLeft",
    "animate__rotateIn",
    "animate__rotateInDownLeft",
    "animate__rotateInDownRight",
    "animate__rotateInUpLeft",
    "animate__rotateInUpRight",
    "animate__jackInTheBox",
    "animate__rollIn",
    "animate__rollIn",
    "animate__zoomInDown",
    "animate__zoomInLeft",
    "animate__zoomInRight",
    "animate__zoomInUp",
    "animate__slideInDown",
    "animate__slideInLeft",
    "animate__slideInRight",
    "animate__slideInUp",
  ];

  const getAnimated = () => {
    return animates[Math.floor(Math.random() * animates.length)];
  };

  let resultados;
  let verRespuestas = false;

  onMount(async () => {
    verRespuestas = true;
  });

  afterUpdate(async () => {
    try {
      if (verRespuestas) {
        animated = getAnimated();
        verRespuestas = false;
        resultados = await getResults();
        //  console.log({resultados})
      }
    } catch (error) {
      console.error(error);
    }
  });

  onDestroy(() => {
    console.log("destruyendo");
    _Modal.dispose;
    _Modal = undefined;
    dispatch("close");
  });

  export let show = false;
  export let estudiante;
  export let periodo;
  let animated;

  $: if (_Modal) {
    if (show) _Modal.show();
    else _Modal.hide();
  }

  let PruebaCodificada;

  const compartir = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Compartir Respuesta de la Prueba",
          text: JSON.stringify({}),
          url: "https://www.ejemplo.com",
        })
        .then(() => console.log("El contenido se compartió correctamente."))
        .catch((error) =>
          console.log("Error al compartir el contenido:", error)
        );
    } else {
      // @ts-ignore
      Swal.fire({ text: "No se puede compartir" });
    }
  };

  const getResults = async () => {
    let { data } = await axios.post(
      `${$URL}getRespuestasFull.php`,
      JSON.stringify({
        estudiante: estudiante.identificacion,
        periodo,
      })
    );
    return data;
  };

  const getPruebas = async () => {
    let {data} = await axios.post(`${$URL}getPruebas.php`, 
      JSON.stringify({
        Nivel: estudiante.nivel,
        periodo,
      }),
    );
    return data;
  };

  let nombresEstudiante;
  let { apellido1, apellido2, nombre1, nombre2 } = $_Estudiante.acceso
    ? $_Estudiante.data[0]
    : { apellido1: "", apellido2: "", nombre1: "", nombre2: "" };
  $: nombresEstudiante = $_Estudiante.acceso
    ? `${apellido1} ${apellido2 ? apellido2 : ""} ${nombre1} ${
        nombre2 ? nombre2 : ""
      }`
    : estudiante.nombres;
</script>

<article
  use:modal
  class="modal"
  id="modalFE"
  data-bs-backdrop="static"
  data-bs-keyboard="false"
  tabindex="-1"
  aria-labelledby="staticBackdropLabel"
  aria-hidden="true"
>
  <div
    class="modal-dialog
        modal-dialog-scrollable
        modal-fullscreen
        modal-dialog-centered
        modal-lg
               animate__animated {animated}
              "
  >
    <div class="modal-content">
      <header class="modal-header bg-warning bg-gradient bg-opacity-25">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">
          <span class="fs-6">Resultados</span>
        </h1>
        <button
          type="button"
          class="btn"
          data-bs-dismiss="modal"
          aria-label="Close"
          on:click={() => {
            dispatch("close");
          }}
        >
          <i class="fa fa-arrow-left" aria-hidden="true" />
        </button>
      </header>

      <main class="modal-body">
        <strong class="text-primary">{nombresEstudiante}</strong>
        {#if resultados}
          <DetailResults
            pruebas={resultados.map((r) => r.prueba)}
            {resultados}
          />
        {:else}
          <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        {/if}
      </main>

      <footer class="modal-footer bg-info bg-gradient bg-opacity-25">
        <button
          class="btn btn-success bg-gradient bg-opacity-25 rounded-0"
          on:click={compartir}
          ><i class="fa-solid fa-share-nodes" />
        </button>
        <button
          type="button"
          class="btn btn-secondary rounded-0"
          data-bs-dismiss="modal"
          on:click={() => {
            dispatch("close");
          }}
          ><i class="fa-solid fa-circle-xmark" />
        </button>
      </footer>
    </div>
  </div>
</article>
