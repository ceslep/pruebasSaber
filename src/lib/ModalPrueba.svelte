<script>
  import { URL } from "./../Stores.js";
  import Preguntas from "./Preguntas.svelte";
  import {
    onMount,
    onDestroy,
    createEventDispatcher,
    afterUpdate,
  } from "svelte";
  import "animate.css";
  import { Spinner } from "sveltestrap";

  const dispatch = createEventDispatcher();

  let Modal;
  let guardando = false;
  const modal = (el) => {
    // @ts-ignore
    Modal = new bootstrap.Modal(el);
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

  let inicio;
  let fin;

  const generarHora = () => {
    let horas = "" + new Date().getHours();
    let minutos = "" + new Date().getMinutes();
    let segundos = "" + new Date().getSeconds();
    horas = parseInt(horas) < 10 ? "0" + horas : horas;
    minutos = parseInt(minutos) < 10 ? "0" + minutos : minutos;
    segundos = parseInt(segundos) < 10 ? "0" + segundos : segundos;
    return `${horas}:${minutos}:${segundos}`;
  };
  let Total;

  onMount(async () => {
    inicio = generarHora();
  });
  afterUpdate(async () => {
    animated = getAnimated();
    let inputs = document.querySelectorAll(".form-check-input");
    Total = inputs.length / 4;
    try {
      let resultados = await JSON.parse(await getResults());
      if (resultados && resultados.respuestas.length > 0) {
        console.log(resultados.respuestas);
        resultados.respuestas.forEach((res) => {
          // @ts-ignore
          let srel = `[data-searchpregunta="${res.searchpregunta}"]`;
          let el = document.querySelector(srel);
          // @ts-ignore
          el.value = true;
          // @ts-ignore
          el.checked = true;
        });
      }
    } catch (error) {
      // console.error(error)
    }
  });

  onDestroy(() => {
    console.log("destruyendo");
    Modal.dispose;
    Modal = undefined;
    dispatch("close");
  });

  export let show = false;
  export let title = "";
  export let icon = "";
  export let PruebaARealizar = [];
  export let estudiante;
  export let prueba;
  export let periodo;
  let animated;

  $: if (Modal) {
    if (show) Modal.show();
    else Modal.hide();
  }

  let form;
  let C;
  const generarJSON = () => {
    let infoRespuestas = {
      prueba,
      estudiante: estudiante.identificacion,
      respuestas: [],
    };
    let resPuestasPrueba = [];
    console.log(form.elements.length);
    C = 0;
    for (let i = 0; i < form.elements.length; i++) {
      if (form.elements[i].checked) {
        let Respuesta = {};
        Respuesta.respuesta = form.elements[i].dataset.correcta;
        Respuesta.searchpregunta = form.elements[i].dataset.searchpregunta;
        console.log(Respuesta);
        resPuestasPrueba = [...resPuestasPrueba, Respuesta];
        C++;
      }
    }

    infoRespuestas.respuestas = [...resPuestasPrueba];
    return infoRespuestas;
  };

  const getParcial = () => {
    let c = 0;
    for (let i = 0; i < form.elements.length; i++) {
      if (form.elements[i].checked) {
        c++;
      }
    }
    return c;
  };

  const enviar = async () => {
    // @ts-ignore
    Swal.fire({
      position: "top-end",
      icon: "info",
      title: "Guardando prueba",
      showConfirmButton: false,
      timer: 3500,
      toast:true
    });
    let fin = generarHora();
    let data = {
      inicio,
      fin,
      estudiante: estudiante.identificacion,
      periodo,
      prueba,
      respuesta: generarJSON(),
    };
    if (C !== Total) {
      // @ts-ignore
      Swal.fire({
        icon: "warning",
        text: "Falta contestar preguntas",
      });
      return;
    }
    console.log(data);
    // guardando=true;
    let response = await fetch(`${$URL}guardarRespuesta.php`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });
    let respuesta = await response.json();
    if (respuesta.guardado)
      // @ts-ignore
      Swal.fire({
        icon: "success",
        text: `Respuestas a la prueba de ${prueba} almacenadas correctamente`,
      });
    // @ts-ignore
    else
    // @ts-ignore
      Swal.fire({
        icon: "error",
        text: `Ha habido un error al guardar la prueba de ${prueba}`,
      });
  };

  const compartir = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Compartir Respuesta de la Prueba",
          text: JSON.stringify(generarJSON()),
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
    let response = await fetch(`${$URL}getRespuestas.php`, {
      method: "POST",
      body: JSON.stringify({
        estudiante: estudiante.identificacion,
        periodo,
        prueba,
      }),
    });
    return await response.json();
  };
  // array para almacenar las fracciones

  const manageClicked = (e) => {
    // @ts-ignore
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: "info",
      title: `Preguntas ${getParcial()} de ${Total} ${Math.floor(
        (getParcial() * 100) / Total
      )}%`,
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
      modal-fullscreen-md-down
      modal-lg
             animate__animated {animated}
            "
  >
    <div class="modal-content">
      <header class="modal-header bg-warning bg-gradient bg-opacity-25">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">
          <span class="fs-6">{@html icon} {title}</span>
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
        <form bind:this={form}>
          <Preguntas {PruebaARealizar} on:clicked={manageClicked} />
        </form>
      </main>
      <footer class="modal-footer  bg-info bg-gradient bg-opacity-25">
        <button class="btn btn-warning rounded-0" on:click={enviar}
          ><i class="fa-solid fa-cloud-arrow-up" />
          {#if guardando}
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          {/if}
        </button>
        <button class="btn btn-danger bg-gradient bg-opacity-25 rounded-0"
          ><i class="fa-solid fa-floppy-disk" /> 
        </button>
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
          }}><i class="fa-solid fa-circle-xmark" /> </button
        >
      </footer>
    </div>
  </div>
</article>
