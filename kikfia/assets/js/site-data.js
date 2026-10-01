/* =====================================================================
   KIKFIA SITE DATA
   ---------------------------------------------------------------------
   This is the ONE file to edit when a fact changes: phone, email,
   prices, homes, photos, reviews, FAQ, form address, booking link and
   analytics IDs. You never need to touch index.html for these.

   Rules for editing:
   - Keep the quote marks around text: 'like this'.
   - Leave a value empty ('') when you don't have it yet. The website
     then shows a clearly marked placeholder instead of guessing.
   - Every line inside a list ends with a comma.
   - See kikfia-docs/HOW-TO-UPDATE.md for step-by-step examples.
   ===================================================================== */

window.KIKFIA = {

  /* ---------- 1. Brand and legal identity ---------- */
  brand: {
    name: 'Kikfia',
    fullName: 'Kikfia Custom Portable Houses',
    legalEntity: 'Sohail Ecom Services LLC',
    legalLine: 'Kikfia Custom Portable Houses is a brand operated by Sohail Ecom Services LLC, a Texas limited liability company.',
    // Your web address, with https:// and no slash at the end. Example: 'https://kikfia.com'
    domain: '',
    // Path to your logo file once you have one, for example 'assets/img/logo.svg'.
    // Leave empty to keep the "Kikfia" text wordmark.
    logo: '',
    mailingAddress: {
      line1: '5900 Balcones Drive #22441',
      city: 'Austin',
      region: 'TX',
      postalCode: '78731',
      country: 'USA'
    }
  },

  /* ---------- 2. Contact details ---------- */
  contact: {
    email: '',            // Example: 'hello@kikfia.com'
    phone: '',            // Shown as written. Example: '+1 512 555 0100'
    whatsapp: '',         // Digits only with country code, no + or spaces. Example: '15125550100'
    bookingUrl: '',       // Your video-call booking link (Calendly, Cal.com, Google Calendar, etc.)
    responseTime: ''      // Optional. Example: 'within one business day'. Leave empty if unsure.
  },

  /* ---------- 3. The person customers talk to ---------- */
  person: {
    name: 'Kashan Ahmed',
    role: 'Your Kikfia contact',
    photo: '',            // Real photo only. Example: 'assets/img/kashan.jpg'
    photoAlt: 'Kashan Ahmed, your Kikfia contact',
    note: "Hi, I'm Kashan. When you contact Kikfia, you talk to me, and you keep talking to me from your first question until your home is handed over. I'll explain your options plainly, put everything in writing and answer you directly.",
    noteApproved: true,   // Approved by the owner with the design package on October 1, 2026
    helloVideo: ''        // Optional real video of Kashan. Example: 'assets/video/kashan-hello.mp4'
  },

  /* ---------- 4. Where form submissions go ---------- */
  form: {
    // Your form service address. With Formspree it looks like 'https://formspree.io/f/abcdwxyz'.
    // While this is empty, the form honestly says it is not connected yet.
    endpoint: ''
  },

  /* ---------- 5. Analytics (leave empty to keep them off) ---------- */
  analytics: {
    ga4: '',              // Example: 'G-XXXXXXXXXX'
    metaPixel: ''         // Example: '123456789012345'
    // Names, emails, phone numbers and messages are NEVER sent to analytics.
  },

  /* ---------- 6. Social links (each one shows only when filled in) ---------- */
  social: {
    instagram: '',
    facebook: '',
    youtube: '',
    tiktok: '',
    linkedin: ''
  },

  /* ---------- 7. Hero media ----------
     Set by Claude from the owner's approved hero video (October 1, 2026).
     The video starts at 1.5 s of the original clip, so it opens on the house. */
  hero: {
    video: 'assets/video/hero-scrub.mp4',
    videoBytes: 5567960,
    poster: 'assets/img/hero-poster',      // first frame (960, 1440, 1920 wide)
    posterWidths: [960, 1440, 1920],
    ending: 'assets/img/hero-ending',      // last frame, also used above the form
    mobile: 'assets/img/hero-mobile',      // tall phone image
    mobileWidths: [480, 608],
    alt: 'Digital rendering of a modern single-story home and its interior'
  },

  /* ---------- 8. Prices ---------- */
  pricing: {
    // Starting prices stay hidden until this is true AND a home has a startingPrice.
    showStartingPrices: false,
    // Shown under any starting price, unless a home's priceIncludes says otherwise.
    homeOnlyNote: 'Home price only. Delivery, foundation, installation, permits and utilities are quoted separately.'
  },

  /* ---------- 9. Home categories (shown as cards until real models exist) ---------- */
  categories: [
    {
      id: 'adu',
      name: 'ADU & Backyard Homes',
      text: 'Extra living space in your own backyard. A place for family, guests, work, or a rental where local rules allow.',
      formValue: 'ADU or backyard home',
      image: '',          // Example: 'assets/img/category-adu'  (Claude adds the sizes)
      imageAlt: 'Digital rendering of a compact modern backyard home behind a family house',
      assetId: 'C1'
    },
    {
      id: 'small',
      name: 'Small Homes',
      text: 'Studio and one-bedroom homes with smart, open layouts that make every square foot count.',
      formValue: 'Small home',
      image: '',
      imageAlt: 'Digital rendering of a small modern home in a meadow clearing',
      assetId: 'C2'
    },
    {
      id: 'family',
      name: 'Family Homes',
      text: 'Two-bedroom, three-bedroom and larger homes with room for the whole family.',
      formValue: 'Family home',
      image: '',
      imageAlt: 'Digital rendering of a larger modern single-story family home',
      assetId: 'C3'
    },
    {
      id: 'guest',
      name: 'Guest & Vacation Homes',
      text: 'A comfortable place for visiting family, or a getaway on your own land.',
      formValue: 'Guest or vacation home',
      image: '',
      imageAlt: 'Digital rendering of a modern guest home above a calm lake',
      assetId: 'C4'
    },
    {
      id: 'studio',
      name: 'Office & Studio Spaces',
      text: 'A quiet home office, studio or workspace a few steps from your door.',
      formValue: 'Office or studio',
      image: '',
      imageAlt: 'Digital rendering of a backyard studio with a full glass wall',
      assetId: 'C5'
    },
    {
      id: 'custom',
      name: 'Custom Homes',
      text: "Have something specific in mind? Start from your own idea, and we'll work through the options together.",
      formValue: 'Custom home',
      image: '',
      imageAlt: 'Digital rendering of an L-shaped modern custom home around a stone patio',
      assetId: 'C6'
    }
  ],

  /* ---------- 10. Verified home models ----------
     Add a model ONLY when every detail is confirmed. Leave out any field you
     are not sure about; empty fields are simply not shown. Copy this example,
     remove the two slashes at the start of each line, and fill it in:

    {
      id: 'model-id-with-dashes',
      name: 'Model Name',
      category: 'adu',               // one of: adu, small, family, guest, studio, custom
      type: 'Prefab ADU',            // the accurate term for this home
      sizeSqFt: 480,
      dimensions: '40 ft x 12 ft',
      bedrooms: 1,
      bathrooms: 1,
      description: 'One or two plain sentences about this home.',
      features: ['Verified feature one', 'Verified feature two', 'Verified feature three'],
      customizable: true,
      specs: [ ['Ceiling height', '9 ft'], ['Roof', 'Shed roof'] ],
      included: ['Verified included item'],
      optional: ['Verified optional upgrade'],
      locationDependent: ['Transport', 'Foundation', 'Installation', 'Utilities', 'Permits'],
      startingPrice: 0,              // number in USD, for example 64900. Shown only if showStartingPrices is true.
      priceIncludes: '',             // leave empty unless you confirm exactly what the price includes
      images: [ { src: 'assets/img/model-name-1', alt: 'Describe the photo' } ],
      isRendering: false             // true if these images are renderings, not real photos
    },
  */
  products: [
  ],

  /* ---------- 11. What's included (general section) ----------
     verified: false  = shows a [CONFIRM BEFORE PUBLICATION] tag.
     Change to true only after you confirm the item. Remove items you don't offer. */
  included: {
    standard: [
      { label: 'Structure', verified: false },
      { label: 'Roof', verified: false },
      { label: 'Walls', verified: false },
      { label: 'Doors', verified: false },
      { label: 'Windows', verified: false },
      { label: 'Flooring', verified: false },
      { label: 'Kitchen', verified: false },
      { label: 'Bathroom', verified: false },
      { label: 'Electrical', verified: false },
      { label: 'Plumbing', verified: false }
    ],
    optional: [
      { label: 'Cabinets and countertops', verified: false },
      { label: 'Appliances', verified: false },
      { label: 'Lighting', verified: false },
      { label: 'Heating and cooling', verified: false },
      { label: 'Furniture', verified: false }
    ],
    // These depend on location by nature, so they need no confirmation.
    locationDependent: [
      'Transport', 'Foundation', 'Site preparation', 'Installation',
      'Utilities', 'Permits', 'Inspections', 'Local requirements'
    ]
  },

  /* ---------- 12. Customization options ----------
     verified: false on an option shows a confirmation tag.
     Systems options are hidden one by one until you set verified: true. */
  customize: [
    { id: 'size', name: 'Size', zone: 'outline', line: 'Pick the footprint that suits your land and your plans.', chips: ['Dimensions', 'Square footage', 'Room sizes'], verified: true },
    { id: 'layout', name: 'Layout', zone: 'rooms', line: 'From an open studio to three bedrooms and more.', chips: ['Studio', '1 bedroom', '2 bedrooms', '3 bedrooms', 'Extra rooms', 'Open plan'], verified: true },
    { id: 'doors', name: 'Doors', zone: 'doors', line: 'Choose entry, interior, sliding and patio doors.', chips: ['Entry', 'Interior', 'Sliding', 'Patio', 'Sizes', 'Styles'], verified: true },
    { id: 'windows', name: 'Windows', zone: 'windows', line: 'Decide how many, how big, what style and where they go.', chips: ['Number', 'Size', 'Style', 'Placement'], verified: true },
    { id: 'kitchen', name: 'Kitchen', zone: 'kitchen', line: 'Cabinets, counters, appliances and storage that suit how you cook.', chips: ['Cabinets', 'Countertops', 'Appliances', 'Storage', 'Layout'], verified: true },
    { id: 'bathroom', name: 'Bathroom', zone: 'bath', line: 'Shower or tub, vanity, fixtures and storage.', chips: ['Shower', 'Tub', 'Vanity', 'Toilet', 'Fixtures', 'Storage'], verified: true },
    { id: 'interior', name: 'Interior', zone: 'floor', line: 'Floors, walls, ceilings, lighting and colors.', chips: ['Flooring', 'Walls', 'Ceiling', 'Lighting', 'Colors'], verified: true },
    { id: 'exterior', name: 'Exterior', zone: 'exterior', line: 'Cladding, colors, roof style, and a deck or porch.', chips: ['Cladding', 'Colors', 'Roof style', 'Deck', 'Porch', 'Finishes'], verified: true },
    { id: 'systems', name: 'Systems', zone: 'systems', line: 'Electrical, plumbing, heating and cooling, water and solar options.', verified: false,
      chips: [
        { label: 'Electrical', verified: false },
        { label: 'Plumbing', verified: false },
        { label: 'Heating & cooling', verified: false },
        { label: 'Water', verified: false },
        { label: 'Solar', verified: false }
      ] },
    { id: 'extras', name: 'Extras', zone: 'extras', line: 'Furniture, appliances, extra storage and accessibility features.', chips: ['Furniture', 'Appliances', 'Storage', 'Accessibility features'], verified: true }
  ],

  /* ---------- 13. Interior gallery ---------- */
  interiors: [
    { label: 'Living', image: '', alt: 'Digital rendering of an open living area with a glass door to a garden', assetId: 'D1' },
    { label: 'Kitchen', image: '', alt: 'Digital rendering of a compact kitchen with sage cabinets and a garden window', assetId: 'D2' },
    { label: 'Bedroom', image: '', alt: 'Digital rendering of a calm bedroom with a window to the trees', assetId: 'D3' },
    { label: 'Bathroom', image: '', alt: 'Digital rendering of a bathroom with a walk-in shower and oak vanity', assetId: 'D4' },
    { label: 'Home office', image: '', alt: 'Digital rendering of a home office desk facing a garden window', assetId: 'D5' }
  ],

  /* ---------- 14. Lifestyle images (optional) ---------- */
  lifestyle: {
    propertyCheck: { image: '', alt: 'Digital rendering of a backyard with a small home site marked out', assetId: 'E1' },
    why: { image: '', alt: 'Digital rendering of a person on a wood deck on a misty morning', assetId: 'E2' }
  },

  /* ---------- 15. Payments ---------- */
  payments: {
    schedule: '',               // Example: 'A deposit when you sign, a milestone payment before delivery, and the balance at handover.'
    cancellation: '',           // Your cancellation and refund terms in plain words
    paymentMethods: '',         // Example: 'Bank transfer or check'
    showSafetyNote: true,       // The "we never ask you to pay a new account by text" note
    safetyNoteVerified: false   // Set to true once you confirm Kikfia will always follow it
  },

  /* ---------- 16. Verified customer reviews ----------
     Add ONLY real reviews from real customers, with their permission.
    {
      name: 'First name and last initial, as the customer approved',
      location: 'City, State',
      project: 'Two-bedroom family home',
      quote: 'Their words, unedited.',
      rating: 0,          // only if the customer actually gave a rating (1 to 5), otherwise 0
      date: '2027-03'
    },
  */
  reviews: [
  ],

  /* ---------- 17. FAQ ----------
     q = question, a = answer. needs = a placeholder tag shown until you add the missing fact
     (delete the needs line once the answer is complete). */
  faq: [
    { q: 'What types of homes does Kikfia offer?',
      a: 'Kikfia offers custom prefab homes and living spaces: ADUs and backyard homes, small homes, family homes, guest and vacation homes, office and studio spaces, and fully custom homes. Tell us what you need, and Kashan will send you the options that match.' },
    { q: 'Can I customize a home?',
      a: 'Yes. Start with a home you like, then adjust it: size, layout, bedrooms, doors, windows, kitchen, bathroom, finishes and more. Available options vary by model, and your quote lists every choice you make.' },
    { q: "What's included with a home?",
      a: "It depends on the model. Every quote separates three things: what's included as standard, the optional upgrades you choose, and location-dependent items like transport, foundation, installation, utilities and permits.",
      needs: 'BUSINESS INFORMATION REQUIRED: standard inclusions' },
    { q: 'What affects the price?',
      a: 'Your final project cost depends on your home, customization, location, transport, site requirements, permits and installation. Your quote lists the home price and these project costs separately, so you can see what each part costs.' },
    { q: 'How does delivery work?',
      a: 'Your home is transported to your property on a planned date. Delivery depends on distance, road access and your site, and some sites need a crane. We look at access during the property and location review, and your quote shows how delivery is handled.',
      needs: 'BUSINESS INFORMATION REQUIRED: delivery areas and who arranges transport' },
    { q: 'How does installation work?',
      a: "When your home arrives, it's set on its foundation, secured and connected as agreed. Your agreement states exactly what installation includes and who handles each part.",
      needs: 'BUSINESS INFORMATION REQUIRED: installation scope' },
    { q: 'What about foundations?',
      a: 'Every home needs a proper, level foundation. The right type depends on the home, your soil, your climate and local rules. Common types include concrete slabs, piers and perimeter foundations. Foundation work is location-dependent and is listed separately in your quote.' },
    { q: 'What permits may be needed?',
      a: 'Most areas require a building permit for a new home or ADU, often with inspections for the foundation, electrical and plumbing. Rules are different in every city and county, so we look at yours early, during the property and location review.' },
    { q: 'Can an ADU go on my property?',
      a: 'It depends on your local zoning rules: lot size, setbacks, height and size limits, parking and utility capacity. Many cities now allow ADUs on single-family lots, but the details vary. The Property Check gives you a first look, and your local planning office has the final say.' },
    { q: 'Can an ADU be used as a rental?',
      a: 'Rental use depends on local rules and property requirements. Some areas allow long-term rentals, some limit short-term rentals, and some require the owner to live on the property. Check with your local planning office before you plan a rental.' },
    { q: 'How long does a project take?',
      a: 'It depends on your home, your customization, your permits and your site work. Permits and site preparation often take longer than people expect. Once your home, options and location are clear, Kashan will give you an estimated timeline for your project.',
      needs: 'VERIFY BEFORE PUBLICATION' },
    { q: 'How do payments work?',
      a: 'Before you pay anything, you receive a written quote and agreement. They cover your home, specifications, price, payment schedule, what\'s included and excluded, responsibilities, and cancellation and refund terms. Payments follow that schedule, which can include a deposit, milestone payments and a final payment.',
      needs: 'BUSINESS INFORMATION REQUIRED: payment schedule' },
    { q: 'Who will I be working with?',
      a: "Kashan Ahmed. You'll work with Kashan from your first question through your project, so you always know who to call." },
    { q: 'Do you serve international customers?',
      a: 'For projects outside the United States, transport, customs, duties, foundations, installation, permits, utilities, inspections and local building rules all vary by country, so we review them before quoting.',
      needs: 'BUSINESS INFORMATION REQUIRED: whether international orders are accepted' },
    { q: 'What happens after I submit an inquiry?',
      a: "Kashan reviews your details and contacts you the way you prefer: phone, WhatsApp or email. You'll talk through your home, your property and your questions, and then decide whether you'd like a project quote.",
      needs: 'BUSINESS INFORMATION REQUIRED: typical response time' }
  ],

  /* ---------- 18. Legal pages ---------- */
  legal: {
    lastUpdated: '',      // Example: 'January 15, 2027'. Fill in after legal review.
    legalReviewDone: false
  }
};
