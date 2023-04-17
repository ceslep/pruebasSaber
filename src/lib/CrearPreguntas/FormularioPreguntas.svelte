<script lang="ts">
  import {  SvelteComponent, createEventDispatcher, onMount } from "svelte";
  import { Form, FormGroup, Label, Input, Row, Col } from "sveltestrap";
  import { errorImg, loadImg } from "../Preguntas.svelte";
  export let pregunta;

  onMount(() => {
    console.log({ pregunta });
  });
  let TAtp:SvelteComponentTyped;
  let TAtpA:SvelteComponentTyped;
  let TAtpB:SvelteComponentTyped;
  let TAtpC:SvelteComponentTyped;
  let TAtpD:SvelteComponentTyped;

  $: if (TAtp) {
    let el = document.getElementById("TextoDeLaPregunta");
    let rr = Math.floor((el as HTMLTextAreaElement).value.length / 100) + 3;
    (el as HTMLTextAreaElement).rows = rr;
  }

  $: if (TAtpA) {
    let el = document.getElementById("RespuestaA");
    let rr = Math.floor((el as HTMLTextAreaElement).value.length / 100) + 3;
    (el as HTMLTextAreaElement).rows = rr;
  }

  $: if (TAtpB) {
    let el = document.getElementById("RespuestaB");
    let rr = Math.floor((el as HTMLTextAreaElement).value.length / 100) + 3;
    (el as HTMLTextAreaElement).rows = rr;
  }

  $: if (TAtpC) {
    let el = document.getElementById("RespuestaC");
    let rr = Math.floor((el as HTMLTextAreaElement).value.length / 100) + 3;
    (el as HTMLTextAreaElement).rows = rr;
  }

  $: if (TAtpD) {
    let el = document.getElementById("RespuestaD");
    let rr = Math.floor((el as HTMLTextAreaElement).value.length / 100) + 3;
    (el as HTMLTextAreaElement).rows = rr;
  }

  const dispatch = createEventDispatcher();

  $: {
    dispatch("pregunta", { pregunta });
  }

 
</script>


<Form>
  <input type="hidden" bind:value={pregunta.id} />
  <FormGroup>
    <Label for="NucleoComun" class="text-success fw-bold">Nucleo Común</Label>
    <Input
      bind:value={pregunta.NucleoComun}
      type="select"
      name="NucleoComun"
      id="NucleoComun"
      invalid={pregunta.NucleoComun !== "" ? false : true}
      feedback="Ingrese el Núcleo Común"
      required
    >
      <option value="Sociales y Ciudadanas">Sociales y Ciudadanas</option>
      <option value="Ciencias Naturales">Ciencias Naturales</option>
      <option value="Inglés">Inglés</option>
      <option value="Lectura Crítica">Lectura Crítica</option>
      <option value="Matemáticas">Matemáticas</option>
    </Input>
  </FormGroup>
  <FormGroup>
    <Label for="Nivel" class="text-success fw-bold">Nivel</Label>
    <Input
      bind:value={pregunta.Nivel}
      type="select"
      name="Nivel"
      id="Nivel"
      invalid={pregunta.Nivel !== "" ? false : true}
      feedback="Ingrese el Nivel"
      required
    >
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
      <option value="11">11</option>
    </Input>
  </FormGroup>
  <FormGroup>
    <Label for="periodo" class="text-success fw-bold">Período</Label>
    <Input
      bind:value={pregunta.periodo}
      type="select"
      name="periodo"
      id="periodo"
      invalid={pregunta.periodo !== "" ? false : true}
      feedback="Ingrese el período"
      required
    >
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
    </Input>
  </FormGroup>
  <FormGroup>
    <Label for="TextoDeLaPregunta" class="text-success fw-bold"
      >Texto de La pregunta</Label
    >
    <Input
      bind:this={TAtp}
      bind:value={pregunta.TextoDeLaPregunta}
      type="textarea"
      name="TextoDeLaPregunta"
      id="TextoDeLaPregunta"
      invalid={pregunta.TextoDeLaPregunta !== "" &&
      pregunta.TextoDeLaPregunta.length > 20
        ? false
        : true}
      feedback={pregunta.TextoDeLaPregunta === "" ||
      pregunta.TextoDeLaPregunta.length < 20
        ? "Ingrese el texto de la Pregunta, mínimo 20 caracteres"
        : "Formato correcto de pregunta"}
      valid={pregunta.TextoDeLaPregunta !== "" &&
      pregunta.TextoDeLaPregunta.length > 20
        ? true
        : false}
      required
    />
  </FormGroup>
  <FormGroup>
    <Row>
      <Col
        xs={pregunta.ImagenPregunta && pregunta.ImagenPregunta.includes("drive")
          ? "7"
          : "12"}
      >
        <Label for="ImagenPregunta" class="text-success fw-bold"
          >Imagen de La pregunta</Label
        >
        <Input
          bind:value={pregunta.ImagenPregunta}
          type="textarea"
          name="ImagenPregunta"
          id="ImagenPregunta"
        />
      </Col>
      <Col
        xs={pregunta.ImagenPregunta && pregunta.ImagenPregunta.includes("drive")
          ? "5"
          : "0"}
      >
        {#if pregunta.ImagenPregunta && pregunta.ImagenPregunta.includes("drive")}
          <img
            src={`http://drive.google.com/uc?export=view&id=${
              pregunta.ImagenPregunta.split("/")[5].split("?")[0]
            }`}
            alt="imagenPregunta"
            class="img-fluid img-width mx-1"
            width="100%"
            loading="lazy"
            on:error={errorImg}
            on:load={loadImg}
          />
        {/if}
      </Col>
    </Row>
  </FormGroup>
  <FormGroup>
    <Label for="ContinuacionTextoDeLaPregunta" class="text-success fw-bold"
      >Continuación Texto de La pregunta</Label
    >
    <Input
      bind:value={pregunta.ContinuacionTextoDeLaPregunta}
      type="textarea"
      name="ContinuacionTextoDeLaPregunta"
      id="ContinuacionTextoDeLaPregunta"
    />
  </FormGroup>
  <FormGroup>
    <Row>
      <Col xs={pregunta.RespuestaA.includes("drive") ? "7" : "12"}>
        <Label for="RespuestaA" class="text-success fw-bold">Respuesta A</Label>
        <Input
          bind:this={TAtpA}
          bind:value={pregunta.RespuestaA}
          type="textarea"
          name="RespuestaA"
          id="RespuestaA"
          invalid={pregunta.RespuestaA !== "" ? false : true}
          feedback="Ingrese la respuesta A"
          required
        />
      </Col>

      <Col xs={pregunta.RespuestaA.includes("drive") ? "5" : "0"}>
        {#if pregunta.RespuestaA.includes("drive")}
          <img
            src={"http://drive.google.com/uc?export=view&id=" +
              pregunta.RespuestaA.split("/")[5].split("?")[0]}
            alt="imagenPregunta"
            class="img-fluid img-width"
            width="100%"
            loading="lazy"
            on:error={errorImg}
          />
        {/if}
      </Col>
    </Row>
  </FormGroup>
  <FormGroup>
    <Row>
      <Col xs={pregunta.RespuestaB.includes("drive") ? "7" : "12"}>
        <Label for="RespuestaB" class="text-success fw-bold">Respuesta B</Label>
        <Input
          bind:this={TAtpB}
          bind:value={pregunta.RespuestaB}
          type="textarea"
          name="RespuestaB"
          id="RespuestaB"
          invalid={pregunta.RespuestaB !== "" ? false : true}
          feedback="Ingrese la respuesta B"
          required
        />
      </Col>
      <Col xs={pregunta.RespuestaB.includes("drive") ? "5" : "0"}>
        {#if pregunta.RespuestaB.includes("drive")}
          <img
            src={"http://drive.google.com/uc?export=view&id=" +
              pregunta.RespuestaB.split("/")[5].split("?")[0]}
            alt="imagenPregunta"
            class="img-fluid img-width"
            width="100%"
            loading="lazy"
            on:error={errorImg}
          />
        {/if}
      </Col>
    </Row>
  </FormGroup>
  <FormGroup>
    <Row>
      <Col xs={pregunta.RespuestaC.includes("drive") ? "7" : "12"}>
        <Label for="RespuestaC" class="text-success fw-bold">Respuesta C</Label>
        <Input
          bind:this={TAtpC}
          bind:value={pregunta.RespuestaC}
          type="textarea"
          name="RespuestaC"
          id="RespuestaC"
          invalid={pregunta.RespuestaC !== "" ? false : true}
          feedback="Ingrese la respuesta C"
          required
        />
      </Col>
      <Col xs={pregunta.RespuestaC.includes("drive") ? "5" : "0"}>
        {#if pregunta.RespuestaC.includes("drive")}
          <img
            src={"http://drive.google.com/uc?export=view&id=" +
              pregunta.RespuestaC.split("/")[5].split("?")[0]}
            alt="imagenPregunta"
            class="img-fluid img-width"
            width="100%"
            loading="lazy"
            on:error={errorImg}
          />
        {/if}
      </Col>
    </Row>
  </FormGroup>
  <FormGroup>
    <Row>
      <Col xs={pregunta.RespuestaD.includes("drive") ? "7" : "12"}>
        <Label for="ImagenPregunta" class="text-success fw-bold"
          >Respuesta D</Label
        >
        <Input
          bind:this={TAtpD}
          bind:value={pregunta.RespuestaD}
          type="textarea"
          name="RespuestaD"
          id="RespuestaD"
          invalid={pregunta.RespuestaD !== "" ? false : true}
          feedback="Ingrese la respuesta D"
          required
        />
      </Col>
      <Col xs={pregunta.RespuestaD.includes("drive") ? "5" : "0"}>
        {#if pregunta.RespuestaD.includes("drive")}
          <img
            src={"http://drive.google.com/uc?export=view&id=" +
              pregunta.RespuestaD.split("/")[5].split("?")[0]}
            alt="imagenPregunta"
            class="img-fluid img-width"
            width="100%"
            loading="lazy"
            on:error={errorImg}
          />
        {/if}
      </Col>
    </Row>
  </FormGroup>
  <FormGroup>
    <Label for="RespuestaCorrecta" class="text-success fw-bold"
      >Respuesta Correcta</Label
    >
    <Input
      bind:value={pregunta.RespuestaCorrecta}
      type="select"
      name="RespuestaCorrecta"
      id="RespuestaCorrecta"
      invalid={pregunta.RespuestaCorrecta !== "" ? false : true}
      feedback="Ingrese la respuesta Correcta"
      required
    >
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
      <option value="D">D</option>
    </Input>
  </FormGroup>
</Form>
