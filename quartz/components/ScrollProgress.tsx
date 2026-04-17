import { QuartzComponentConstructor } from "./types"

export default (() => {
  return () => (
    <>
      <div id="scroll-progress" />
      <script dangerouslySetInnerHTML={{ __html: `
        const bar = document.getElementById('scroll-progress');
        window.addEventListener('scroll', () => {
          const scrolled = window.scrollY;
          const total = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.width = (scrolled / total * 100) + '%';
        });
      `}} />
    </>
  )
}) satisfies QuartzComponentConstructor