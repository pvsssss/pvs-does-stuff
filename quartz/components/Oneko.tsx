import { QuartzComponentConstructor } from "./types"

export default (() => {
  return () => (
    <>
      <script src="/pvs-does-stuff/static/oneko.js" async />
      <button id="oneko-toggle" title="toggle cat">🐱</button>
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener("DOMContentLoaded", () => {
          const btn = document.getElementById("oneko-toggle");
          let enabled = localStorage.getItem("oneko-enabled") !== "false";

          function applyState() {
            const cat = document.getElementById("oneko");
            if (cat) cat.style.display = enabled ? "block" : "none";
            btn.style.opacity = enabled ? "1" : "0.4";
          }

          btn.addEventListener("click", () => {
            enabled = !enabled;
            localStorage.setItem("oneko-enabled", enabled);
            applyState();
          });

          // wait for oneko to init then apply saved state
          setTimeout(applyState, 500);
        });

        document.addEventListener("nav", () => {
          const existing = document.getElementById("oneko");
          if (existing) existing.remove();
          const script = document.createElement("script");
          script.src = "/pvs-does-stuff/static/oneko.js";
          document.body.appendChild(script);
          setTimeout(() => {
            const enabled = localStorage.getItem("oneko-enabled") !== "false";
            const cat = document.getElementById("oneko");
            if (cat) cat.style.display = enabled ? "block" : "none";
            const btn = document.getElementById("oneko-toggle");
            if (btn) btn.style.opacity = enabled ? "1" : "0.4";
          }, 500);
        });
      `}} />
    </>
  )
}) satisfies QuartzComponentConstructor