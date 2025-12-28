import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "pvs.?",
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
        header: "JetBrains Mono",
        body: "JetBrains Mono",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          /* Catppuccin Latte – tuned for Quartz */
          light: "#f5f7fa", // base (lighter than Latte base)
          lightgray: "#e6e9ef", // mantle
          gray: "#d0d5dd", // surface
          darkgray: "#6c6f85", // subtext
          dark: "#4c4f69", // text

          secondary: "#7287fd", // lavender (links, accents)
          tertiary: "#179299", // teal (secondary accents)

          highlight: "rgba(114, 135, 253, 0.12)", // soft lavender
          textHighlight: "#df8e1d66", // mellow yellow
        },

        darkMode: {
          /* Catppuccin Mocha – tuned for Quartz */
          light: "#1e1e2e", // base
          lightgray: "#181825", // mantle
          gray: "#2a2b3c", // softened surface
          darkgray: "#a6adc8", // subtext
          dark: "#cdd6f4", // primary text

          secondary: "#b4befe", // lavender (links)
          tertiary: "#94e2d5", // teal

          highlight: "rgba(180, 190, 254, 0.14)", // lavender glow
          textHighlight: "#f9e2af66", // soft yellow
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
          light: "github-light",
          dark: "github-dark",
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
