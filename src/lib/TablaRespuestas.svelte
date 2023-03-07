<script>
  import { afterUpdate } from 'svelte';
     import { Table } from 'sveltestrap';
    export let respuestas=[];
    afterUpdate(()=>{
        console.log(respuestas);
    })
</script>

<Table bordered hover striped>
    <thead>
        <tr>
          <th>#</th>
          <th>Pregunta</th>
          <th>Valoracion</th>
        </tr>
      </thead>
      <tbody>
        {#each respuestas[0] as {respuesta,searchpregunta},index}
             <tr>
                <th class="text-center" scope="row">{index+1}</th>
                <td>{searchpregunta}</td>
                <td class="text-center">{respuesta}</td>
             </tr>
        {/each}
      </tbody>
</Table>