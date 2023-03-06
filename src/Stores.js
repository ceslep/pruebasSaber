import { writable } from "svelte/store";

export let loggedin=writable(false);
export let URL=writable("https://app.iedeoccidente.com/saber/");