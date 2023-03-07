<script>
// @ts-nocheck

  import { URL,_Estudiante } from "./../Stores.js";
 
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

  let loginspn = false;

  const loginet = async (e) => {
    e.preventDefault();
    loginspn = !loginspn;
    try{
    let estudiante = await (
      await fetch(`${$URL}login.php`, {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(e.target))),
      })
    ).json();
    if (!estudiante.acceso)
     Swal.fire({
      icon:"error",
      text:"Acceso Denegado"
     });
    else {
      $_Estudiante=estudiante;
    dispatch("login",{estudiante})
    }
    loginspn = !loginspn;
  }catch(error){
    Swal.fire({
      icon:"error",
      text:"Ha ocurrdio un error, revise su conexión a internet"
    })
  }
  }
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
    <CardFooter class="text-center">Proyecto Pruebas Saber {new Date().getFullYear()}</CardFooter>
  </Card>
</section>

<style>
  .grid {
    min-width: 300px;
    max-width: 400px;
  }
</style>
