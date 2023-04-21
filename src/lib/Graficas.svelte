<script>
  import Chart from "chart.js/auto";
  import { onDestroy } from "svelte";

  let Chart1;
  let Chart2;
  export let prueba;
  export let porcentaje;
  export let data = [];

  const graph = (canvas, arg) => {
    arg.chart = new Chart(canvas, {
      type: arg.type,
      data: {
        labels:
          arg.type === "bar"
            ? data.map((d, i) => (i + 1).toString())
            : [
                `${parseInt(porcentaje)} % Correctas`,
                `${100 - parseInt(porcentaje)} % Incorrectas`,
              ],
        datasets: [
          {
            label: arg.name,
            data:
              arg.type === "bar"
                ? data
                : [parseInt(porcentaje), 100 - parseInt(porcentaje)],
          },
        ],
      },
      options:{
        radius:"75%",
        responsive:true,
        maintainAspectRatio:false,
       
      }
    });
  };

  onDestroy(() => {
    console.log("destruyendo estadisticas");
    Chart1 && Chart1.destroy();
    Chart2 && Chart2.destroy();
  });
</script>

<main class="os w-50 text-center">
  <div class="">
    <div class="grid">
      <canvas use:graph={{ chart: Chart1, type: "bar", name: prueba }} />
      <canvas use:graph={{ chart: Chart2, type: "pie", name: prueba }} />
    </div>
  </div>
</main>

<style>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    place-items: center;
    column-gap: 5px;
  }
</style>
