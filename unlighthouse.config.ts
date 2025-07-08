import { defineConfig } from "unlighthouse";

export default defineConfig({
  site: "http://localhost:3000",
  scans: {
    sitemap: false,
    robotsTxt: false,
    pages: ["/"],
  },
  lighthouseOptions: {
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  },
  outputPath: ".unlighthouse",
});
