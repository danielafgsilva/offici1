// Runs before the page paints: first visit of the session, and motion allowed, switches the intro on
export const introScript = `try{if(!sessionStorage.getItem("intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="1";sessionStorage.setItem("intro","1")}}catch(e){}`;
