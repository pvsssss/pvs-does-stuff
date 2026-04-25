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

          function waitForCat(cb) {
            const cat = document.getElementById("oneko");
            if (cat) { cb(); return; }
            setTimeout(() => waitForCat(cb), 50);
          }

          function initToggle() {
            const old = document.getElementById("oneko-toggle");
            if (!old) return;
            const btn = old.cloneNode(true);
            old.parentNode.replaceChild(btn, old);
            btn.addEventListener("click", () => {
              const enabled = localStorage.getItem("oneko-enabled") !== "false";
              localStorage.setItem("oneko-enabled", String(!enabled));
              applyState();
            });
          }

          function reloadCat() {
            const oldCat = document.getElementById("oneko");
            const oldScript = document.getElementById("oneko-script");
            if (oldCat) oldCat.remove();
            if (oldScript) oldScript.remove();
            const s = document.createElement("script");
            s.id = "oneko-script";
            s.src = "/pvs-does-stuff/static/oneko.js";
            document.body.appendChild(s);
          }

          initToggle();
          waitForCat(applyState);

          document.addEventListener("nav", function() {
            reloadCat();
            initToggle();
            waitForCat(applyState);
          });
        })();
      `}} />
    </>
  )
}) satisfies QuartzComponentConstructor