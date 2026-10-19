/** Local AI-generated editorial illustrations; never evidence of a named property. */
export const renderedImage = (slug: string) => `/images/rendered/${slug}.webp`;
export const heroImage = {
  src: renderedImage("mediterranean-casino-sunset"),
  width: 1672,
  height: 941,
} as const;
export const editorialImageNotice = [
  "AI-generated editorial illustration, not a photograph of a named property.",
  "Ενδεικτική εικόνα με τεχνητή νοημοσύνη, όχι φωτογραφία συγκεκριμένου καταλύματος.",
] as const;
export const editorialImageAlt = [
  " — AI-generated destination illustration",
  " — ενδεικτική εικόνα προορισμού με τεχνητή νοημοσύνη",
] as const;
