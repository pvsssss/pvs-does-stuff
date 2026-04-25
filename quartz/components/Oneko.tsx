import { QuartzComponentConstructor } from "./types"

export default (() => {
  return () => (
    <>
      <script src="/pvs-does-stuff/static/oneko.js" />
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

          function waitForCat() {
            const cat = document.getElementById("oneko");
            if (cat) { applyState(); return; }
            requestAnimationFrame(waitForCat);
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

          initToggle();
          waitForCat();
          document.addEventListener("nav", function() {
            initToggle();
            waitForCat();
          });
        })();
      `}} />
    </>
  )
}) satisfies QuartzComponentConstructor