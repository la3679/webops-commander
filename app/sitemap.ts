import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://webops-commander.vercel.app", priority: 1 },
    { url: "https://webops-commander.vercel.app/commander", priority: 0.9 },
  ];
}
