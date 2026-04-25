import { QuartzComponentConstructor } from "./types"

export default (() => {
  return () => (
    <>
      <script src="/pvs-does-stuff/static/oneko.js" async />
      <button id="oneko-toggle" title="toggle cat">🐱</button>
      <script dangerouslySetInnerHTML={{ __html: `
        function onekoApplyState() {
          const enabled = localStorage.getItem("oneko-enabled") !== "false";
          const cat = document.getElementById("oneko");
          const btn = document.getElementById("oneko-toggle");
          if (cat) cat.style.display = enabled ? "block" : "none";
          if (btn) btn.style.opacity = enabled ? "1" : "0.4";
        }

        function onekoInitToggle() {
          const btn = document.getElementById("oneko-toggle");
          if (!btn) return;
          btn.onclick = () => {
            const enabled = localStorage.getItem("oneko-enabled") !== "false";
            localStorage.setItem("oneko-enabled", !enabled);
            onekoApplyState();
          };
          setTimeout(onekoApplyState, 600);
        }

        function onekoReload() {
          const existing = document.getElementById("oneko");
          if (existing) existing.remove();
          const script = document.createElement("script");
          script.src = "/pvs-does-stuff/static/oneko.js";
          document.body.appendChild(script);
          setTimeout(onekoApplyState, 600);
        }

        onekoInitToggle();
        document.addEventListener("nav", () => {
          onekoReload();
          onekoInitToggle();
        });
      `}} />
    </>
  )
}) satisfies QuartzComponentConstructor