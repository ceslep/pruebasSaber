<script>
  import { afterUpdate, createEventDispatcher } from "svelte";
  export let PruebaARealizar = [];

  $:console.log(PruebaARealizar)
  const dispatch = createEventDispatcher();
  let letters = ["A", "B", "C", "D"];

  afterUpdate(() => {
    for (var i = 0; i < document.forms.length; i++) {
      document.forms[i].reset();
    }
  });

  function errorImg(img) {
    img.target.src = "./404.png";
    img.target.width = "100";
  }

  const loadImg = (img) => {
    if (img.target.width < 500) img.target.width = 2 * img.target.width;
  };
</script>

<main class="container container-sm container-md">
  {#if PruebaARealizar.length>0}
  <ol>
    {#each PruebaARealizar as { TextoDeLaPregunta, ImagenPregunta, ContinuacionTextoDeLaPregunta, RespuestaA, RespuestaB, RespuestaC, RespuestaD, RespuestaCorrecta }, index}
      <li id={`pregunta${index}`}>
        <div class="text-justify fw-bold text-success">
          {TextoDeLaPregunta}
        </div>
        <hr />
        <section class="text-center mx-auto">
          {#if ImagenPregunta && ImagenPregunta.includes("drive")}
            <img
              src={`http://drive.google.com/uc?export=view&id=${
                ImagenPregunta.split("/")[5].split("?")[0]
              }`}
              alt="imagenPregunta"
              class="img-fluid img-width"
              width="100%"
              loading="lazy"
              on:error={errorImg}
              on:load={loadImg}
            />
          {/if}
        </section>
        <br />
        {#if ContinuacionTextoDeLaPregunta}
          <p class="text-justify fst-italic text-primary fs-5">
            {ContinuacionTextoDeLaPregunta}
          </p>
        {/if}
        <section>
          <ul>
            <input
              type="hidden"
              id="infoRespuesta{index}"
              name="infoRespuesta{index}"
              value={JSON.stringify({
                TextoDeLaPregunta,
                RespuestaCorrecta,
              })}
            />
            {#each [RespuestaA, RespuestaB, RespuestaC, RespuestaD] as respuesta, indexRespuesta}
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="respuesta{index}"
                  id="respuesta{index}{indexRespuesta}"
                  data-id="respuesta{index}{indexRespuesta}"
                  data-pregunta={TextoDeLaPregunta.replace(/\n/g, " ")}
                  data-continuacionpregunta={ContinuacionTextoDeLaPregunta?ContinuacionTextoDeLaPregunta.replace(/\n/g, " "):" "}
                  data-textorespuesta={respuesta.replace(/\n/g, " ")}
                  data-correcta={indexRespuesta ===
                    letters.indexOf(RespuestaCorrecta)}
                  value={indexRespuesta === letters.indexOf(RespuestaCorrecta)}
                  data-searchpregunta={(respuesta.length >= 50
                    ? respuesta
                        .substring(30, 50)
                        .trim()
                        .replaceAll(" ", "1")
                        .replaceAll(".", "2")
                        .replaceAll("/", "3")
                        .replaceAll("+", "4")
                        .replaceAll("(", "5")
                        .replaceAll(")", "6")
                        .replaceAll("-", "7")
                        .replaceAll(",", "8")
                        .replaceAll("??", "")
                        .replaceAll("??", "")
                        .replaceAll("??", "")
                        .replaceAll("??", "")
                        .replaceAll("??", "") + indexRespuesta
                    : respuesta
                        .substring(0, 5)
                        .trim()
                        .replaceAll(" ", "1")
                        .replaceAll(".", "2")
                        .replaceAll("/", "3")
                        .replaceAll("+", "4")
                        .replaceAll("(", "5")
                        .replaceAll(")", "6")
                        .replaceAll("-", "7")
                        .replaceAll(",", "8")
                        .replaceAll("??", "")
                        .replaceAll("??", "")
                        .replaceAll("??", "")
                        .replaceAll("??", "")
                        .replaceAll("??", "") + indexRespuesta
                  ).split('').reverse().join('')}
                  on:click={() => dispatch("clicked", { index })}
                />
                <li class="text-start">
                  {#if respuesta.includes("drive")}
                    {letters[indexRespuesta]}.&nbsp;<img
                      src={"http://drive.google.com/uc?export=view&id=" +
                        respuesta.split("/")[5].split("?")[0]}
                      alt="imagenPregunta"
                      class="img-fluid img-width-r"
                      width="100%"
                      loading="lazy"
                      on:error={errorImg}
                    />
                  {:else}
                    <div class="fs-5">
                      {letters[indexRespuesta]}.&nbsp;{respuesta}
                    </div>
                  {/if}
                </li>
              </div>
            {/each}
          </ul>
        </section>
      </li>
      <br />
      <br />
    {/each}
  </ol>
  {/if}
</main>

<style>
  main {
    display: grid;
    width: 70%;
    justify-content: center;
    margin: 0 auto;
  }

  /* Establece el ancho del elemento en 100% por defecto */
  main {
    width: 100%;
  }

  /* Media query para pantallas entre 720px y 919px */
  @media screen and (min-width: 720px) and (max-width: 919px) {
    main {
      width: 35%; /* Establece el ancho deseado */
    }
  }

  /* Media query para pantallas entre 920px y 1023px */
  @media screen and (min-width: 920px) and (max-width: 1023px) {
    main {
      width: 50%; /* Establece el ancho deseado */
    }
  }

  /* Media query para pantallas entre 1024px y 1240px */
  @media screen and (min-width: 1024px) and (max-width: 1240px) {
    main {
      width: 60%; /* Establece el ancho deseado */
    }
  }

  /* Media query para pantallas superiores a 1240px */
  @media screen and (min-width: 1240px) {
    main {
      width: 75%; /* Establece el ancho deseado */
    }
  }

  ul {
    min-width: 300px;
    max-width: 500px;
    text-align: start;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    list-style-type: none;
  }

  .text-justify {
    text-align: justify;
  }
</style>
