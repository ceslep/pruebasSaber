<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { URL, _Docente } from "./../../Stores.js";
  import {
    Form,
    FormGroup,
    Label,
    Input,
    Row,
    Col,
    Button,
    Table,
    Column,
    Spinner,
  } from "sveltestrap";

  let pregunta = { NucleoComun: "", Nivel: "", periodo: "" };
  let Preguntas = [];
  let buscando = false;

  const dispatch = createEventDispatcher();

  const ver = (e, pregunta) => {
    e.preventDefault();
    dispatch("ver",{pregunta})
  };

  const getPreguntas=async()=>{
    buscando = !buscando;
      console.log($_Docente);
      let docente = $_Docente.data[0].nombres;
      let response = await fetch(`${$URL}buscaPreguntas.php`, {
        method: "POST",
        body: JSON.stringify({ ...pregunta, docente }),
      });
      Preguntas = await response.json();
      console.log({ Preguntas });
      buscando = !buscando;
    }

    onMount(()=>{
      getPreguntas();
    })
  
</script>

<main>
  <Form
    on:submit={async (e) => {
      e.preventDefault();
      getPreguntas();
     }}
  >
    <FormGroup>
      <Label for="NucleoComun">Nucleo Común</Label>
      <Input
        bind:value={pregunta.NucleoComun}
        type="select"
        name="NucleoComun"
        id="NucleoComun"
      >
        <option value="Sociales y Ciudadanas">Sociales y Ciudadanas</option>
        <option value="Ciencias Naturales">Ciencias Naturales</option>
        <option value="Inglés">Inglés</option>
        <option value="Lectura Crítica">Lectura Crítica</option>
        <option value="Matemáticas">Matemáticas</option>
      </Input>
    </FormGroup>
    <Row>
      <Col>
        <FormGroup>
          <Label for="Nivel">Nivel</Label>
          <Input
            bind:value={pregunta.Nivel}
            type="select"
            name="Nivel"
            id="Nivel"
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
      </Col>
      <Col>
        <FormGroup>
          <Label for="periodo">Período</Label>
          <Input
            bind:value={pregunta.periodo}
            type="select"
            name="periodo"
            id="periodo"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </Input>
        </FormGroup>
      </Col>
    </Row>
    <Row>
      <div class="d-grid gap-1">
        <Button color="primary"
          >Buscar
          {#if !buscando}
            <i class="fa-solid fa-magnifying-glass text-white" />
          {:else}
            <Spinner size="sm" />
          {/if}
        </Button>
      </div>
    </Row>
  </Form>
  {#if Preguntas.length > 0}
    <section class="mt-2">
      <Table rows={Preguntas} let:row responsive hover>
        <Column header="Texto Pregunta" width="40%">
          {row.TextoDeLaPregunta}
        </Column>
        <Column header="Cont Texto Pregunta" width="35%">
          {row.ContinuacionTextoDeLaPregunta ?? ""}
        </Column>
        <Column width="25%">
          <div class="text-center align-middle">
            <Button
              on:click={(e) => {
                ver(e, row);
              }}
            >
              <i class="fa-regular fa-eye" />
            </Button>
          </div>
        </Column>
      </Table>
    </section>
  {/if}
</main>
