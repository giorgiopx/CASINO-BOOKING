export function casinoHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | CasinoBooking.com` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | CasinoBooking.com` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}