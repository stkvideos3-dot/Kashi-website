# Kikfia Fact Sheet to Fill

Every fact the website still needs, sorted by when it's needed.

**How to send any of it:** paste the answer into the chat, or send the file. Claude puts it in the right place.

Each line shows where the fact lives (mostly `site-data.js`) and the placeholder tag visitors currently see.

**Status today:** design-complete. **Not yet launch-ready.**

---

## MUST HAVE BEFORE LAUNCH

### Contact and identity
- [ ] **Domain**, for example `kikfia.com`. Used for search tags, the sitemap and link previews. → `brand.domain`, plus the `DEPLOY STEP` tags in `index.html`, `robots.txt` and `sitemap.xml`
- [ ] **Business email** → `contact.email` · shown as `[EMAIL]`
- [ ] **Phone / WhatsApp number** → `contact.phone`, `contact.whatsapp` · shown as `[PHONE]`
- [ ] **Real photo of Kashan** (asset G1) → `person.photo` · shown as `[REAL PHOTO OF KASHAN TO BE PROVIDED]`
- [ ] **Video-call booking link** (Calendly, Cal.com or similar) → `contact.bookingUrl` · shown as `[BOOKING LINK REQUIRED]`
- [ ] **Form destination**: a free Formspree form address → `form.endpoint` · the form currently says it isn't connected

### What you sell
- [ ] **Which of the 6 categories you can truly offer at launch**: ADU & Backyard, Small, Family, Guest & Vacation, Office & Studio, Custom. Remove any you can't offer yet → `categories`
- [ ] **Systems options** (Electrical, Plumbing, Heating & cooling, Water, Solar). Hidden from the "Make it yours" row until you confirm them → `customize` → Systems, then `verified: true`
- [ ] **Customization options.** Confirm that the Size, Layout, Doors, Windows, Kitchen, Bathroom, Interior, Exterior and Extras choices on the site match what you can really offer → `customize`

### Process and delivery
- [ ] **Who arranges transport** (FAQ "How does delivery work?") → `faq` · `[BUSINESS INFORMATION REQUIRED: who arranges transport]`
- [ ] **Installation scope** (FAQ "How does installation work?") → `faq` · `[BUSINESS INFORMATION REQUIRED: installation scope]`
- [ ] **Typical response time** after an inquiry, for example "within one business day" → `faq`, `contact.responseTime` · `[BUSINESS INFORMATION REQUIRED: typical response time]`
- [ ] **Timeline answer.** Confirm Kashan will give an estimated timeline once the details are clear → `faq` · `[VERIFY BEFORE PUBLICATION]`

### Payments
- [ ] **Payment schedule** in plain words, for the FAQ answer "How do payments work?". No percentages are shown unless you confirm them → `faq` · `[BUSINESS INFORMATION REQUIRED: payment schedule]`

### Legal
- [ ] **Legal review of the Privacy Policy and Terms**, including:
  - form service name
  - data retention
  - state and international privacy rights
  - liability wording
  - governing law

  `privacy.html` and `terms.html` both carry `[LEGAL REVIEW REQUIRED BEFORE LAUNCH]`.
- [ ] **Consent wording review.** The checkbox text is as you specified. A lawyer should confirm it meets calling and texting rules (for example TCPA) for how you'll actually contact people. The checkbox alone doesn't guarantee compliance.
- [ ] **Legal review date** → `legal.lastUpdated`, then `legal.legalReviewDone: true`

### Media
- [x] **Hero video:** the owner's drone video plays on its own at the top (7 second seamless loop, with a phone version)
- [x] **Walk-through video:** the owner's first video now plays in See What's Inside
- [x] **Owner photos 1 to 5:** Family Homes and Small Homes cards, delivery and installation photos
- [ ] **Owner photos 6 to 23:** please send them again in one new message, so they arrive as files
- [ ] **Category images** (6) and **interior images** (5): the owner will supply them later. Until then, each spot shows a marked placeholder.
- [ ] **Real photo of Kashan** (listed above)

---

## SHOULD HAVE BEFORE LAUNCH

- [ ] **At least one verified home model**: name, type, size, bedrooms, baths, key features, inclusions and options. This is the single biggest boost to trust and leads → `products`
- [ ] **Real photos of real homes** you own or have permission to use (G3)
- [ ] **Logo**, as SVG or a transparent PNG (G2). Until then, the text wordmark is used → `brand.logo`
- [ ] **Social media links** → `social`
- [ ] **Analytics IDs**, if you want tracking (GA4 and Meta Pixel) → `analytics`

---

## CAN ADD LATER

- [ ] **Starting prices**, per model, once confirmed → `startingPrice` plus `pricing.showStartingPrices: true`
- [ ] **What a starting price includes**, if more than the home → `priceIncludes`
- [ ] **Verified customer reviews**: send them to Claude, and a reviews section can be added back
- [ ] **Kashan's short hello video** (G4)
- [ ] **Dedicated SEO pages per model.** The data is already structured for this

---

## Already confirmed

- ✅ Delivery areas: the United States and other countries (owner, October 3, 2026). In the FAQ.
- ✅ The project assessment is free (owner, October 3, 2026). Said in the plan, the form intro and the FAQ.
- ✅ Contact methods: phone, WhatsApp and email (owner, October 3, 2026). The numbers and email address are still needed → `contact.phone`, `contact.whatsapp`, `contact.email`
- ✅ Brand: Kikfia / Kikfia Custom Portable Houses
- ✅ Legal line: "Kikfia Custom Portable Houses is a brand operated by Sohail Ecom Services LLC, a Texas limited liability company."
- ✅ Mailing address: 5900 Balcones Drive #22441, Austin, TX 78731, USA (labeled "Mailing address" only)
- ✅ Contact person: Kashan Ahmed
- ✅ Kashan's personal note (approved with the design package)
- ✅ No EIN, tax numbers or government documents are published anywhere
