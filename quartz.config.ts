import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "pvs does stuff",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "pvsssss.github.io/pvs-does-stuff/",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        title: "Roboto Mono",
        header: "JetBrains Mono",
        body: "Lexend",
        code: "Cascadia Code",
      },
      colors: {
        lightMode: {
          /* Catppuccin Latte – vibrant */
          light: "#1e1e2e",
          lightgray: "#181825",
          gray: "#2f3144",
          darkgray: "#bac2de",
          dark: "#e6e9ff",

          secondary: "#91b6ff", // brighter lavender-blue
          tertiary: "#f9e2af", // punchier teal

          highlight: "rgba(145, 182, 255, 0.22)", // visible but soft
          textHighlight: "#f9e2af99", // warm, readable
        },

        darkMode: {
          /* Catppuccin Mocha – vibrant */
          light: "#1e1e2e",
          lightgray: "#181825",
          gray: "#2f3144",
          darkgray: "#bac2de",
          dark: "#e6e9ff",

          secondary: "#91b6ff", // brighter lavender-blue
          tertiary: "#f9e2af", // punchier teal

          highlight: "rgba(145, 182, 255, 0.22)", // visible but soft
          textHighlight: "#f9e2af99", // warm, readable
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "catppuccin-mocha",
          dark: "catppuccin-mocha",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
