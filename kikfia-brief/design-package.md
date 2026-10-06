# KIKFIA design package (Tier 1, single journey)

Every viewer-facing line below ships verbatim. Band ranges are starting points, validated by the flick test.

## 1. Brand premise: "Arrival"

A KIKFIA home arrives finished, on a date you can see coming, at a price you know before it ships. The hero is the arrival itself: the camera drops out of the sky and lands at eye level in front of the house. Every section below answers one buyer question about that arrival: where it lands, what lands, how it gets there, what it costs, and how to start.

Buyer language this site answers (from research): "can I trust a company overseas", "hidden costs", "only 24 hours notice of delivery", "permits", "bring my parents close", "rental income", "guest house".

## 2. Palette (direction; finalize from the approved footage)

Golden-hour valley: meadow sage, morning mist, pine shade, low sun, charcoal steel.

```css
:root{
  --canvas:#EDF0E8;        /* morning mist, tinted sage */
  --panel:#E2E7DB;         /* raised mist */
  --ink:#1C2520;           /* pine shade, primary text */
  --ink-2:#4A564F;         /* secondary text */
  --steel:#2A2F2E;         /* charcoal steel, dark bands */
  --accent:#E3A33B;        /* low sun: CTA, focus, rare emphasis */
  --accent-hover:#EDB458;
  --accent-muted:rgba(227,163,59,.28);
}
```

## 3. Type trio

- Display: **Archivo**, expanded width (112 to 125), weights 600 and 800. Reads like freight stencils and architecture.
- Body: **Instrument Sans** 400, 500, 600.
- Mono labels: **IBM Plex Mono** 400, 500. Reads like a shipping manifest.

## 4. Band map (hero 500vh, scroll range 400vh)

| Band | Range | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.22 | High above the valley, mist below | Kicker "KIKFIA portable homes". Headline "Somewhere down there is your land." | Drift-down (the camera is sinking) |
| 2 | 0.26 to 0.48 | Sinking through the mist veil | "Built in a factory. Checked before it ships." | Blur-to-sharp (mist clearing) |
| 3 | 0.52 to 0.74 | The house grows, valley opens | "Every cost in writing, before you pay." | Grid snap-align (a quote lining up) |
| 4 | 0.80 to 1.00 | Eye level, at rest, lights on | Headline "Your home, delivered." Sub "A guest house, a rental, or a place of your own. Set down on your land, ready to live in." CTA "Get my all-in quote" / "See the homes" | Word rise into staged settle |

## 5. Static-hero copy (phones, reduced motion)

Over the ending frame: kicker "KIKFIA portable homes", headline "Your home, delivered.", sub "A guest house, a rental, or a place of your own. Set down on your land, ready to live in.", CTA "Get my all-in quote".

## 6. Below the hero (in order, all funnel to #quote)

1. **Where will yours land?** Three use cases with images.
   - "Bring your parents close." / "A private home in your backyard, steps from yours."
   - "Let it pay you back." / "Rent it out as a long stay or a getaway."
   - "Your weekend place." / "A cabin by the lake without a second mortgage."
2. **The homes.** Size selector (20, 30, 40 ft) over the interior image with a spec sheet. Headline "Pick your size. We handle the rest." Specs are typical figures for review by the owner.
3. **How it arrives.** Four waypoints on the route line: Choose and get your quote / Built and checked / Shipped and cleared / Set down on your land.
4. **The interactive moment: "Go on, set it down."** Press and hold lowers the house onto its pad; landing lights up what comes with it.
5. **Costs in the open.** Manifest-style breakdown: what is in your KIKFIA quote vs what is handled locally, with our help.
6. **Questions buyers ask first.** FAQ answering trust, total cost, permits, timeline, site prep and delivery notice, weather, seeing it before it ships.
7. **Tell us where it's landing.** Quote form: name, email, phone (optional), ZIP code, home size, use. Button "Send my quote request". Success "Got it. We'll reply with your all-in price."
8. **Footer** with "Photos are design renderings. Real units may vary."

## 7. Vector layer

- The signature: **the route line.** A dashed delivery route in the left gutter that draws itself as you scroll, with manifest-style waypoints that light up per section (Land, Homes, Route, Costs, Quote). Hidden on narrow screens.
- A hand-drawn SVG crane, cable, house, and landing pad for the hold moment.
- A drawn house-and-pad brand mark (favicon + wordmark).
- Whisper-level golden dust motes in the fixed background layer, plus a slow mist glow drift (70s cycle) and grain.

## 8. Engineering list

Blob fetch with loading ring, dt-normalized lerp, gated seeks, delta-gated DOM writes, band pacing with the flick test, the four-layer legibility system, five static-hero gates live in CSS and JS, complete without video, reduced motion live in both directions, quality floor.

## 9. Copy gate

Every line above ships verbatim. The built page must pass the grep gate: zero em dashes, zero stock words, and the body-copy sweep for AI tells.
