<script>
  // @ts-nocheck

  import { URL, _Estudiante, _Docente } from "./../Stores.js";
  import Swal from "sweetalert2";
  import "sweetalert2/src/sweetalert2.scss";
  import axios from "axios";

  // @ts-nocheck

  import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardSubtitle,
    CardText,
    CardTitle,
    Form,
    FormGroup,
    Input,
    Spinner,
  } from "sveltestrap";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let txtSwitch = "Estudiante";

  const chsw = (e) => {
    let { checked } = e.target;
    txtSwitch = checked ? "Docente" : "Estudiante";
  };

  let login = "login.php";

  let Docente;
  let Estudiante;

  $: login = txtSwitch === "Estudiante" ? "login.php" : "loginDocentes.php";

  let loginspn = false;

  $: Estudiante = txtSwitch === "Estudiante";
  $: Docente = txtSwitch === "Docente";

  const loginet = async (e) => {
    e.preventDefault();
    loginspn = !loginspn;
    try {
      let { data } = await axios.post(
        `${$URL}${login}`,
        JSON.stringify(Object.fromEntries(new FormData(e.target)))
      );

      if (!data.acceso)
        Swal.fire({
          icon: "error",
          text: "Acceso Denegado",
        });
      else {
        if (Estudiante) {
          $_Estudiante = info;
          dispatch("login", { estudiante: data });
        } else if (Docente) {
          $_Docente = data;
          dispatch("loginDocente", { docente: data });
        }
      }
      loginspn = !loginspn;
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: "error",
        text: "Ha ocurrido un error, revise su conexión a internet",
      });
      loginspn = !loginspn;
    }
  };
</script>

<section class="grid">
  <Card class="mb-3">
    <CardHeader class="bg-success bg-gradient bg-opacity-25 text-dark">
      <CardTitle class="text-center">Prueba Diagnóstica</CardTitle>
    </CardHeader>
    <Form on:submit={loginet}>
      <CardBody class="text-center">
        <img width="20%" src="./escudo.png" alt="" />
        <CardSubtitle>Instituto Guática</CardSubtitle>
        <CardText>Complete los datos para Ingresar</CardText>
        <FormGroup>
          <Input id="c3" type="switch" label={txtSwitch} on:change={chsw} />
        </FormGroup>
        <FormGroup>
          <Input
            type="text"
            name="identificacion"
            id="identificacion"
            placeholder="Ingresa tu Identificación"
            autocomplete={"off"}
            inputmode="numeric"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            name="pass"
            id="pass"
            placeholder="Ingresa tu contraseña"
            inputmode="numeric"
          />
        </FormGroup>
        <Button color={"success"}
          >Ingresar
          {#if loginspn}
            <Spinner color="light" size="sm" />
          {/if}
        </Button>
      </CardBody>
    </Form>
    <CardFooter class="text-center"
      >Proyecto Pruebas Saber {new Date().getFullYear()}</CardFooter
    >
  </Card>
</section>

<style>
  .grid {
    min-width: 300px;
    max-width: 400px;
  }
</style>
