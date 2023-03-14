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
      
    });
  };

  onDestroy(() => {
    console.log("destruyendo estadisticas");
    Chart1 && Chart1.destroy();
    Chart2 && Chart2.destroy();
  });
</script>

<main class="os">
  <div class="m-md-1 p-md-1 m-lg-2 p-lg-2 m-xl-3 p-xl-3 m-xxl-5 p-xxl-5">
    <canvas use:graph={{ chart: Chart1, type: "bar", name: prueba }} />
    <canvas use:graph={{ chart: Chart2, type: "pie", name: prueba }} />
  </div>
</main>

<style>
  /*   @media (max-width: 578px) {
        .os {
            height: 900px;
            font-size: 0.6rem;
        }
    }
    @media (min-width: 579px) {
        .os {
            height: 1660px;
            font-size: 0.6rem;
        }
    } */
</style>
