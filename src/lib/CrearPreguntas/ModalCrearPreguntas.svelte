<script>
  import { _Docente } from "./../../Stores.js";
  import FormularioPreguntas from "./FormularioPreguntas.svelte";
  import { URL, _Estudiante } from "../../Stores";
  import {
    onMount,
    onDestroy,
    createEventDispatcher,
    afterUpdate,
  } from "svelte";
  import "animate.css";
  import Modal from "bootstrap/js/dist/modal";
  import { Popover } from "sveltestrap";
  import pregunta from "./DataObject";
  import BuscarPreguntas from "./BuscarPreguntas.svelte";
  import axios from "axios";
  import Swal from "sweetalert2";

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
  let nuevaPregunta = true;
  let buscaPreguntas = false;
  let Pregunta = pregunta;

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
    let response = await fetch(`${$URL}getRespuestasFull.php`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    return await response.json();
  };

  const getPruebas = async () => {
    let response = await fetch(`${$URL}getPruebas.php`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    return await response.json();
  };

  const cbg = (node) => {
    console.log(node.classList);
    node.parentElement.classList.value = node.classList.value;
    node.parentElement.parentElement.classList.value = node.classList.value;
  };

  let preguntaJSON;
  let forma;

  const guardar = async () => {
    if (preguntaJSON && preguntaJSON.id !== "") {
      let { isConfirmed } = await Swal.fire({
        title: "Actualizar",
        text: "Se modificará la pregunta existente",
        showDenyButton: true,
        confirmButtonText: "Actualizar",
        denyButtonText: `Cerrar`,
      });
      if (!isConfirmed) return;
    } else {
      preguntaJSON.Nombre_Del_Docente = $_Docente.data[0].nombres;
      preguntaJSON.Identificacion = $_Docente.data[0].identificacion;
      preguntaJSON.email = $_Docente.data[0].email;
      console.log(preguntaJSON);
      console.log(forma.elements['TextoDeLaPregunta'].classList.contains("is-valid"))
      console.log(forma.checkValidity());
      if ((!forma.checkValidity()) || (!forma.elements['TextoDeLaPregunta'].classList.contains("is-valid"))) {
        Swal.fire({
          icon: "error",
          title: "Formulario Incompleto",
          text: "Falta completar los campos requeridos de la pregunta",
          footer: `Pruebas Saber ${new Date().getFullYear()}`,
        });
        return;
      }
    }
    
    let { data } = await axios.post(
      `${$URL}guardarPregunta.php`,
      JSON.stringify(preguntaJSON)
    );
    if (data["msg"]) {
      Swal.fire({
        icon: "error",
        title: "Error de servidor",
        text: data["error"],
      });
    }
    if (data && data.msg === "Exito")
      Swal.fire({
        icon:"success",
        title: "Preguntas",
        text: "Se ha guardado con éxito",
        timer: 3000,
      });
  };
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
          modal-fullscreen-xl-down
          modal-dialog-centered
          modal-lg
                 animate__animated {animated}
                "
  >
    <div class="modal-content">
      <header class="modal-header bg-primary bg-gradient bg-opacity-25">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">
          <span class="fs-6">Crear/Editar Preguntas</span>
        </h1>
        <span>
          <button
            type="button"
            class="btn btn-outline-secondary"
            id="btn-plus"
            on:click={() => {
              nuevaPregunta = true;
              buscaPreguntas = false;
              for (let llave in Pregunta) {
                Pregunta[llave] = "";
              }
            }}
          >
            <i class="fa-solid fa-plus text-white" />
          </button>
          <Popover
            trigger="hover"
            placement="bottom"
            target="btn-plus"
            title="Agregar una pregunta"
          >
            <div
              use:cbg
              slot="title"
              class="bg-warning bg-gradient bg-opacity-75 fs-6"
            >
              Agregar Pregunta
            </div>
            <div use:cbg class="bg-warning bg-gradient bg-opacity-25">
              Haga click aquí para crear una nueva pregunta.
            </div>
          </Popover>
          <button
            type="button"
            class="btn btn-outline-primary"
            on:click={() => {
              buscaPreguntas = true;
              nuevaPregunta = false;
            }}
          >
            <i class="fa-solid fa-magnifying-glass text-white" />
          </button>
        </span>
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
        {#if nuevaPregunta}
          <FormularioPreguntas
            pregunta={Pregunta}
            on:pregunta={(e) => {
              //Pregunta={...e.detail.pregunta};
              preguntaJSON = { ...e.detail.pregunta };
              forma = e.detail.forma;
            }}
          />
        {:else if buscaPreguntas}
          <BuscarPreguntas
            on:ver={(e) => {
              console.log(e.detail.pregunta);
              buscaPreguntas = false;
              nuevaPregunta = true;
              Pregunta = e.detail.pregunta;
              preguntaJSON = e.detail.pregunta;
            }}
          />
        {/if}
      </main>

      <footer class="modal-footer bg-info bg-gradient bg-opacity-25">
        <button
          class="btn btn-success bg-gradient bg-opacity-25 rounded-0"
          on:click={guardar}
          ><i class="fa-solid fa-cloud-arrow-up" />
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
