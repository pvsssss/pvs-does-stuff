import { QuartzComponentConstructor } from "./types"

export default (() => {
  return () => (
    <>
      <script src="/pvs-does-stuff/static/oneko.js" async />
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener("nav", () => {
          const existing = document.getElementById("oneko");
          if (existing) existing.remove();
          const script = document.createElement("script");
          script.src = "/pvs-does-stuff/static/oneko.js";
          document.body.appendChild(script);
        });
      `}} />
    </>
  )
}) satisfies QuartzComponentConstructor