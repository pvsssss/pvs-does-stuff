import { QuartzComponentConstructor } from "./types"

export default (() => {
  return () => (
    <>
      <button id="oneko-toggle">🐱</button>
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
            localStorage.setItem("oneko-enabled", String(!enabled));
            onekoApplyState();
          };
        }

        function onekoLoad() {
          const existing = document.getElementById("oneko");
          if (existing) existing.remove();
          const oldScript = document.getElementById("oneko-script");
          if (oldScript) oldScript.remove();

          const script = document.createElement("script");
          script.id = "oneko-script";
          script.src = "/pvs-does-stuff/static/oneko.js";

          const observer = new MutationObserver(() => {
            const cat = document.getElementById("oneko");
            if (cat) {
              observer.disconnect();
              onekoApplyState();
            }
          });
          observer.observe(document.body, { childList: true });

          document.body.appendChild(script);
        }

        onekoInitToggle();
        onekoLoad();

        document.addEventListener("nav", () => {
          onekoLoad();
          onekoInitToggle();
        });
      `}} />
    </>
  )
}) satisfies QuartzComponentConstructor