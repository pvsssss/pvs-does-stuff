import { QuartzComponentConstructor } from "./types"

export default (() => {
  return () => (
    <>
      <button id="oneko-toggle">🐱</button>
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          function applyState() {
            const enabled = localStorage.getItem("oneko-enabled") !== "false";
            const cat = document.getElementById("oneko");
            const btn = document.getElementById("oneko-toggle");
            if (cat) cat.style.display = enabled ? "block" : "none";
            if (btn) btn.style.opacity = enabled ? "1" : "0.4";
          }

          function initToggle() {
            const btn = document.getElementById("oneko-toggle");
            if (!btn) return;
            btn.onclick = () => {
              const enabled = localStorage.getItem("oneko-enabled") !== "false";
              localStorage.setItem("oneko-enabled", String(!enabled));
              applyState();
            };
          }

          function loadOneko() {
            // remove existing cat and script
            const oldCat = document.getElementById("oneko");
            const oldScript = document.getElementById("oneko-script");
            if (oldCat) oldCat.remove();
            if (oldScript) oldScript.remove();

            const script = document.createElement("script");
            script.id = "oneko-script";
            script.src = "/pvs-does-stuff/static/oneko.js?" + Date.now();
            script.onload = function() {
              setTimeout(applyState, 100);
            };
            document.body.appendChild(script);
          }

          initToggle();
          loadOneko();

          document.addEventListener("nav", function() {
            initToggle();
            loadOneko();
          });
        })();
      `}} />
    </>
  )
}) satisfies QuartzComponentConstructor