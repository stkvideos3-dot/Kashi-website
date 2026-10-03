# Kikfia Design Package

**Status:** ✅ Approved by owner as is (Step 6), October 1, 2026
**Concept:** A · Clear Morning
**Hero:** Tier 2, three chained clips (changed from Tier 1 at the owner's request, October 1, 2026)
**Concept board:** https://claude.ai/artifact/6JkRo3ketn6FsyTTRe61x4

This is the single plan the website gets built from. Every line of copy in quotes below goes on the site **exactly as written**. If you want any wording changed, tell me here, before the build.

Placeholders look like `[BUSINESS INFORMATION REQUIRED]`, `[CONFIRM BEFORE PUBLICATION]` or `[VERIFY BEFORE PUBLICATION]`. On the built site they show as clearly marked tags, so nothing missing can slip through to launch.

---

## 1. The brand premise

**One word: Clear.**

Kikfia sells custom homes, and buying one from Kikfia is clear at every step. You can see the homes and your options. You know what affects the price, what happens next and how payments work. You know the one person you're talking to.

The hero shows this literally: morning mist lifts and a home comes into clear light. Every section below answers one question a careful buyer has, in plain words. The page ends with "Let's Plan Your Home."

**The signature element is The Plan Line.** A single thin drawn line, in the Lake color, runs down the whole site like a line on an architect's drawing:

- It starts under the hero buttons and draws itself down into The Homes.
- It becomes the floor plan in Customize.
- It is the progress line in the Property Check.
- It is the path that connects the 10 steps in How It Works.
- It joins "You" to "Kashan" in the contact section.
- It becomes the payment timeline.
- It ends as a roofline above the final call to action.

Take the line away and the page loses its thread. That is the test of a real signature.

---

## 2. Colors

These are drawn from a misty morning: pale stone, morning green, deep pine and lake water, plus one warm cedar note. The exact values get a final tune once your hero video is approved, so the page and the footage match.

```css
:root{
  --canvas:#EEF1EE;          /* Mist Stone: page background (never pure white) */
  --panel:#E1E8E4;           /* Morning: alternate section bands */
  --raised:#F6F8F6;          /* cards and form fields */
  --ink:#132826;             /* Pine Ink: main text, dark sections */
  --ink-2:#1B3532;           /* raised surfaces on dark sections */
  --text-secondary:#4A5C59;  /* supporting text */
  --accent:#1C5A5E;          /* Lake: main buttons, focus rings, The Plan Line */
  --accent-hover:#144549;
  --accent-muted:#A6C2BE;    /* the Plan Line at whisper level, soft borders */
  --accent-on-dark:#8CC7C2;  /* Lake on dark sections: buttons and the Plan Line */
  --cedar:#9C6B43;           /* warm detail: icon accents, small markers, never body text */
  --line:#C9D3CF;            /* decorative hairlines */
  --line-strong:#7A8D88;     /* borders on inputs and buttons (3:1 or better) */
  --on-dark:#EEF1EE;         /* text on Pine Ink */
  --on-dark-2:#B4C4C0;       /* secondary text on Pine Ink */
}
```

**Measured contrast:**

| Pair | Ratio |
|---|---|
| Main text on page | 13.6 : 1 |
| Supporting text on page | 6.2 : 1 |
| Button text on Lake | 6.9 : 1 |
| Input borders | 3.1 : 1 |
| Text on dark sections | 13.6 : 1 |
| Supporting text on dark sections | 8.5 : 1 |
| Lake buttons on dark sections | 8.1 : 1 |

**Rules:**
- Lake is the accent, used in small doses: main buttons, focus rings and The Plan Line. Nothing else.
- Cedar appears only as a warm detail in icons and markers.
- There are two dark Pine Ink bands for rhythm (Property Check and Payments), plus the footer.

---

## 3. Fonts

| Role | Font | Weights | Why |
|---|---|---|---|
| Headlines | **Archivo**, SemiExpanded width (112%) | 600, 500 | Wide, steady letters, like the lettering on an architect's drawing. Confident without being flashy. |
| Reading text | **Hanken Grotesk** | 400, 500, 600 | Warm, very readable at small sizes. |
| Labels, specs, step numbers | **IBM Plex Mono** | 400, 500 | Square feet, bedrooms and step numbers read like real drawing notes. |

The fonts are hosted on your own site (not loaded from Google). That makes the page faster and sends no visitor data to a third party.

**Type scale:**

| Element | Size |
|---|---|
| Hero headline (H1) | 40px on phones up to 84px on large screens, tight line height |
| Section headlines (H2) | 32px up to 56px |
| Card and step titles (H3) | 20px to 24px |
| Body | 17px (16px on phones), line height 1.6, lines kept to about 65 characters |
| Labels | 12px to 13px mono, uppercase, wide letter spacing |

---

## 4. Navigation

**Desktop:**
- Left: the Kikfia wordmark.
- Right: How It Works · Homes · Inside · About · FAQ, then a **Get Your Assessment** button. *(Updated October 3, 2026 for the simpler page.)*
- Over the hero, the bar is clear with Pine Ink text. As soon as you scroll, it becomes a solid Mist Stone bar with a thin hairline.
- The current section's link gets a small Lake underline.

**Phones:**
- Top bar: the wordmark on the left, a menu button on the right (44px tap target).
- The menu opens a full-screen sheet with the five links in large type and the **Get Your Project Assessment** button.
- After the hero, a slim bar sits at the bottom where your thumb is. It holds **Get Your Project Assessment**, plus a WhatsApp button once your phone number is added.
- The bottom bar hides while the visitor is filling in the form, and while the menu is open.

**Wordmark:** "Kikfia" set in Archivo SemiExpanded 600. It's temporary until you supply a logo. It also becomes the site's small browser-tab icon (a "K" in Lake on Mist Stone).

---

## 5. The hero (one screen, autoplay drone loop)

*Updated October 1, 2026 at the owner's request: the hero now works like the reference site the owner shared. A video plays on its own behind the headline and repeats. The earlier scroll-driven walk-through moved to See What's Inside.*

### What the video shows

The owner's drone video: a slow half circle around the portable house at golden hour, misty forest behind, glass door open with warm light inside. It's cut to a 7 second loop, and the end blends into the start, so it repeats with no jump. Laptops and tablets get a 1920 x 1080 version (3.5 MB). Phones get a tall 540 x 960 crop of the same shot (0.9 MB).

### Copy (verbatim)

- Label: "Kikfia Custom Portable Houses"
- H1: "Custom Homes. Built Around Your Life."
- Text: "Explore ADUs, backyard homes, prefab family homes and custom living spaces from Kikfia. Choose your home, make it yours, and see a clear path from first conversation to move-in."
- Buttons: **Get Your Project Assessment** · **Explore Homes**
- Small tag, bottom right: "Digital rendering"

The text rises gently into place on load. There is exactly one H1 on the page.

### Text over the video

Dark Pine Ink text over a soft morning-mist fade on the left side of the video. It's tested on 15 frames across the whole loop, against the darkest pixel behind each text block. Results: headline 5.05 : 1, smaller text 7.3 : 1 on desktop, 4.78 : 1 on phones. All pass.

### Rules

- **Plays only while on screen.** It pauses when you scroll away or switch tabs, so it doesn't drain the battery.
- **Pause button** (bottom right) on every screen size, as accessibility rules require for moving video.
- **Reduce motion or Data Saver:** no autoplay and no video download. The still image of the first frame shows, and the button lets people press play if they want.
- **Loading:** the still image loads first, then the video starts. If the video can't load, the still stays and the page is complete.
- **Phones:** the text sits at the top, the buttons sit low at thumb height, and the hero fills about 92% of the screen height. The tag and the pause button sit in the bottom row.

---

## 6. Every section below the hero (in order, copy verbatim)

> **Simplified October 3, 2026 at the owner's request.** The owner asked for a short, simple page like their reference site, keeping only what the business needs. The page is now: Hero → Your Simple Plan → The Homes → See What's Inside → Meet Kashan → FAQ → Form → Footer.
>
> - **Removed from the page:** Build Your Home Your Way, What's Included, Property Check, How It Works (10 steps), What Happens After You Order?, Clear Payments, Why Kikfia and Customer Stories. Their specs stay below for reference, and the code is in the git history if any of them should come back.
> - **Moved:** the delivery and installation photos now sit inside Your Simple Plan, under the three steps.
> - **October 3, later the same day:** the owner removed video-call booking everywhere (plan, Meet Kashan, form, thank-you message) and the photo area in Meet Kashan, which is now text only. The live address is https://kikfia.com.
> - **Kept in short form:** customization is now one "Make it yours" row of options under the home cards. What's included and payments are answered in the FAQ.

### 1b · Your Simple Plan  `#plan`  *(added October 1, 2026 at the owner's request)*

**Layout:** a Morning band right after the hero. The Plan Line starts at the top of the section and turns into the label, then links three numbered circles from left to right (top to bottom on phones).

- Label: "YOUR SIMPLE PLAN"
- H2: "You need more space, not more stress."
- Intro: "Hidden costs. Unclear steps. No answers after the deposit. Kikfia keeps it simple."
- **1. "Tell us what you need."** "Answer a few quick questions, or book a video call with Kashan."
- **2. "Get your clear quote."** "Your home, your options and your project costs, all in writing."
- **3. "Plan delivery and move in."** "We plan each step with you, so you always know what's next."
- Buttons: **Get Your Project Assessment** · link "Start with the Property Check"

### 2 · The Homes  `#homes`

**Layout:** category tabs, then a grid of large image cards. Page background: Mist Stone. The Plan Line arrives from the hero and ends at the label.

- Label: "THE HOMES"
- H2: "Homes for every stage of life."
- Intro: "Backyard ADUs, small homes, family homes and fully custom designs. Pick a starting point, and we'll shape it around how you live."

**Tabs:** All · ADU & Backyard Homes · Small Homes · Family Homes · Guest & Vacation Homes · Office & Studio Spaces · Custom Homes

**Category cards** (shown until you confirm real models; ADUs lead, larger homes stay clearly visible):

| Category | Card text (verbatim) |
|---|---|
| ADU & Backyard Homes | "Extra living space in your own backyard. A place for family, guests, work, or a rental where local rules allow." |
| Small Homes | "Studio and one-bedroom homes with smart, open layouts that make every square foot count." |
| Family Homes | "Two-bedroom, three-bedroom and larger homes with room for the whole family." |
| Guest & Vacation Homes | "A comfortable place for visiting family, or a getaway on your own land." |
| Office & Studio Spaces | "A quiet home office, studio or workspace a few steps from your door." |
| Custom Homes | "Have something specific in mind? Start from your own idea, and we'll work through the options together." |

- Each card's link: **Ask About This Category**. It jumps to the form with the home type already filled in.
- Each card's price tag: "Request a Project Quote".

**When a tab is selected:** only that category shows. If it has no confirmed models yet, its card widens and adds: "Tell us what you need, and Kashan will send you the options that match."

**One-line note under the grid:** "Some images are digital renderings for illustration. Actual products, materials, colors and configurations may vary."

**Model cards (later, from `site-data.js`, once verified)** show:
- a large image
- the model name
- the type
- about how many square feet
- bedrooms and baths
- a short description
- up to three verified key features
- a "Customizable" tag
- the price status: "Request a Project Quote", or "Starting from $X" when you turn prices on
- a **View Home** button

Nothing is filled in from photos. Empty fields simply don't show.

**Model details drawer** (opens from **View Home**, keyboard accessible, closes with Esc). It shows:
- the images
- verified specifications
- customization options
- Included / Optional / Location-dependent lists
- the price status
- the short disclosure: "Your final project cost depends on your home, customization, location, transport, site requirements, permits and installation."
- a **Get Your Project Assessment** button, with the model already filled in on the form

**Starting prices** are off by default. When one is turned on, it shows as "Starting from $X" with the line: "Home price only. Delivery, foundation, installation, permits and utilities are quoted separately." That line is dropped only if you confirm what a price includes.

### 3 · See What's Inside  `#inside`

**Layout:** a full-width gallery. On desktop it's one large image with four smaller ones beside it. On phones it's a swipe gallery. Background: Morning band. A small tag on the gallery reads "Renderings".

- Label: "SEE WHAT'S INSIDE"
- H2: "Picture your life inside."
- Intro: "Open living areas, practical kitchens, quiet bedrooms and clean bathrooms. These renderings show the kind of spaces you can plan with us."
- Image labels (mono): "LIVING" · "KITCHEN" · "BEDROOM" · "BATHROOM" · "HOME OFFICE"
- **Walk-through video** *(added October 1, 2026)*: the owner's first video sits above the gallery. It plays on its own while on screen: in through the glass door to the living room, kitchen and bedroom. It has a pause button and a "Digital rendering" tag. Caption: "Look inside before you decide: living room, kitchen and bedroom."

### 4 · Build Your Home Your Way  `#customize`  **(removed from the page October 3, 2026)**

**Layout:**
- Left: a drawn floor plan (The Plan Line turned into walls). The area for the selected option lights up in Lake: the kitchen zone for Kitchen, the window marks for Windows, the outline and roof for Exterior, and so on.
- Right: 10 option buttons, each with a drawn icon, and a panel showing that option's choices as chips.
- Background: Mist Stone.

- Label: "CUSTOMIZE"
- H2: "Build your home your way."
- Intro: "Start with a home you like. Then choose what changes."

| Option | Line (verbatim) | Chips |
|---|---|---|
| Size | "Pick the footprint that suits your land and your plans." | Dimensions · Square footage · Room sizes |
| Layout | "From an open studio to three bedrooms and more." | Studio · 1 bedroom · 2 bedrooms · 3 bedrooms · Extra rooms · Open plan |
| Doors | "Choose entry, interior, sliding and patio doors." | Entry · Interior · Sliding · Patio · Sizes · Styles |
| Windows | "Decide how many, how big, what style and where they go." | Number · Size · Style · Placement |
| Kitchen | "Cabinets, counters, appliances and storage that suit how you cook." | Cabinets · Countertops · Appliances · Storage · Layout |
| Bathroom | "Shower or tub, vanity, fixtures and storage." | Shower · Tub · Vanity · Toilet · Fixtures · Storage |
| Interior | "Floors, walls, ceilings, lighting and colors." | Flooring · Walls · Ceiling · Lighting · Colors |
| Exterior | "Cladding, colors, roof style, and a deck or porch." | Cladding · Colors · Roof style · Deck · Porch · Finishes |
| Systems | "Electrical, plumbing, heating and cooling, water and solar options." `[CONFIRM BEFORE PUBLICATION]` | Electrical · Plumbing · Heating & cooling · Water · Solar (each shows only once you confirm it) |
| Extras | "Furniture, appliances, extra storage and accessibility features." | Furniture · Appliances · Storage · Accessibility features |

- Note under the panel: "Available options vary by model. Your quote lists every choice you make."
- Button: **Get Your Project Assessment**

### 5 · What's Included  `#included`  **(removed from the page October 3, 2026)**

**Layout:** three columns on desktop, and three tabs on phones. A row of 8 drawn cost-factor icons sits below them. Background: Morning band.

- Label: "WHAT'S INCLUDED"
- H2: "What's included with your home?"
- Intro: "Every quote separates three things, so you know exactly what you're getting."

| Column | Subtitle (verbatim) | Items |
|---|---|---|
| **Included** | "Standard with your home." | Structure · Roof · Walls · Doors · Windows · Flooring · Kitchen · Bathroom · Electrical · Plumbing. Each is tagged `[CONFIRM BEFORE PUBLICATION]` until you confirm it. |
| **Optional upgrades** | "Your choice, priced in your quote." | Cabinets and countertops · Appliances · Lighting · Heating and cooling · Furniture. Each is tagged `[CONFIRM BEFORE PUBLICATION]`. |
| **Location-dependent** | "Depends on your property and local rules." | Transport · Foundation · Site preparation · Installation · Utilities · Permits · Inspections · Local requirements |

- Line under the columns: "Your quote states who handles each item."

**Sub-block: what affects your project cost**
- H3: "What affects your project cost?"
- Eight icons: Home · Customization · Transport · Foundation · Site preparation · Installation · Permits · Utilities
- Text: "Your final project cost depends on your home, customization, location, transport, site requirements, permits and installation."
- Text: "Your home price and your project costs are listed separately in your quote."
- Small print: "Prices and specifications are subject to confirmation and may vary based on configuration, location, transport, installation and local requirements."

### 6 · Property Check  `#property-check`  (the one signature interaction)  **(removed from the page October 3, 2026)**

**Layout:** a dark Pine Ink band with one large card. It asks one question per screen. The Plan Line along the top fills in as you answer, with 7 marks, one per question. There are big tap targets, Back and Next buttons, and full keyboard support.

- Label: "PROPERTY CHECK"
- H2: "Can this home work for your property?"
- Intro: "Answer seven quick questions. You'll get a first look at what to check, what affects your cost and what to do next."
- Small print (shown at the start and on the result): "This is a first look, not a zoning, permit or engineering approval."

| # | Question (verbatim) | Answers |
|---|---|---|
| 1 | "Where is your property?" | Country (United States first) · State or region · ZIP or postal code |
| 2 | "What type of home interests you?" | ADU or backyard home · Small home · Family home · Guest or vacation home · Office or studio · Custom home · Not sure yet |
| 3 | "How many bedrooms?" | Studio · 1 · 2 · 3 · 4 or more · Not sure yet |
| 4 | "About how much space is available?" | A small backyard · A large backyard · A full lot · Acreage or rural land · Not sure yet. Optional: "Approximate open area (sq ft)" |
| 5 | "What will you use it for?" (pick any) | A home for a family member · Guest space · Home office or studio · My main home · Vacation home · Rental, where local rules allow · Something else |
| 6 | "When are you hoping to start?" | As soon as possible · In 3 to 6 months · In 6 to 12 months · Just exploring |
| 7 | "Do you have a budget range in mind?" (optional) | Under $75,000 · $75,000 to $150,000 · $150,000 to $300,000 · Over $300,000 · Prefer not to say. Small note: "Your total project budget, not just the home." |

Buttons: "Back" · "Next" · on the last question "See My First Look".

**Result screen (built from the answers, verbatim parts):**
- Headline: "Your project looks worth a closer look."
- "Suggested starting point: {category}". The rules:
  - 3 or more bedrooms points to Family Homes.
  - Office or studio use points to Office & Studio Spaces.
  - An ADU answer points to ADU & Backyard Homes.
  - "Custom home" points to Custom Homes.
  - Otherwise it follows the home type chosen.
- **"Things to check locally":** a tailored list.
  - Always shown:
    - "Zoning rules and setbacks for your lot"
    - "Building permits and inspections in your area"
    - "Water, power, and sewer or septic connections"
    - "Delivery access: road width, gates, trees and overhead lines"
    - "The right foundation for your soil and climate"
  - For ADUs: "Whether your city allows an ADU on your lot, and its size limits"
  - For rental use: "Local rules on renting an ADU or second home"
  - For acreage: "Distance from the road and from utility lines"
  - Outside the US: "Import, customs and duties, plus local building approval"
- **"What can affect your cost":**
  - "Home size and layout"
  - "Your customization choices"
  - "Transport distance and site access"
  - "Site preparation and foundation"
  - "Installation"
  - "Utility connections"
  - "Permits and local requirements"
- **"Your next step":** "Send this to Kashan and get your project assessment. Your answers come with it, so you won't have to repeat yourself."
- Button: **Get Your Project Assessment**. It fills both steps of the form with these answers.
- Link: "Start over"

**Words this tool never uses:** approved, guaranteed, permitted, legal, guaranteed to fit, engineering approved.

### 7 · How It Works  `#how-it-works`  **(removed from the page October 3, 2026)**

**Layout:**
- Desktop: the headline stays pinned on the left while the 10 steps scroll on the right. The Plan Line runs down through all 10 numbered marks and draws itself as you scroll.
- Phones: the line runs down the left edge.
- Background: Mist Stone.

- Label: "HOW IT WORKS"
- H2: "From first look to moving in, step by step."
- Intro: "Here's the whole path, so you always know what comes next."

| Step | Title | Line (verbatim) |
|---|---|---|
| 01 | Explore homes | "Browse the categories and find a starting point you like." |
| 02 | Choose | "Pick the home or design that suits your needs." |
| 03 | Customize | "Decide on size, layout, finishes and options." |
| 04 | Property & location review | "We review your location, site access and what your area requires." |
| 05 | Itemized quote | "You get a written, itemized quote. Location-dependent items are listed separately." |
| 06 | Agreement | "You review the agreement, payment schedule and terms before you pay anything." |
| 07 | Project preparation | "Your home's details are finalized and your project is prepared." |
| 08 | Quality & documentation review | "Your home and its documents are reviewed before delivery." |
| 09 | Delivery | "Your home is transported to your property on a planned date." |
| 10 | Installation & handover | "Your home is installed, connected as agreed and handed over to you." |

- Note (pinned under the intro on desktop): "Your written quote and agreement confirm the exact scope and responsibilities for your project."
- Button: **Get Your Project Assessment**

### 8 · What Happens After You Order?  `#after-order`  **(removed from the page October 3, 2026)**

**Layout:** a grid of 8 tiles (4 × 2) on desktop and a single column on phones. Each tile has a drawn icon. Background: Morning band.

- Label: "AFTER YOU ORDER"
- H2: "What happens after you order?"
- Intro: "Once your agreement is signed, these are the things that get planned for your project."

| Tile | Text (verbatim) |
|---|---|
| Project preparation | "Your final specifications are locked in and your project is scheduled." |
| Transport planning | "The route, timing and delivery method are planned for your property." |
| Site access | "Trucks, and sometimes a crane, need a clear path to your site. Narrow roads, gates, trees and overhead lines all matter." |
| Foundation | "Your home needs a level, prepared base. The right type depends on the home, your soil and local rules." |
| Installation | "Your home is set in place, secured and finished on site as agreed." |
| Utilities | "Power, water, and sewer or septic connections are made to your local requirements." |
| Inspections | "Many areas inspect the foundation, utilities and final installation before move-in." |
| Local requirements | "Permits, zoning and building rules are different in every area. We help you understand what yours require." |

- Line under the grid: "Your agreement spells out who handles each of these."

### 9 · Meet the Person You'll Talk To  `#kashan`

**Layout:** a large real portrait on one side and the note on the other. The Plan Line runs between two small mono labels, "YOU" and "KASHAN", ending at his photo. Background: Mist Stone.

- Label: "WHO YOU'LL TALK TO"
- H2: "Meet Kashan."
- Line: "One person. One clear line of communication."
- Photo: a real photo of Kashan. Until it arrives, a designed frame reads `[REAL PHOTO OF KASHAN TO BE PROVIDED]`.
- Name: "Kashan Ahmed"
- Role line: "Your Kikfia contact"
- **Personal note (draft, needs your approval before publishing):**
  > "Hi, I'm Kashan. When you contact Kikfia, you talk to me, and you keep talking to me from your first question until your home is handed over. I'll explain your options plainly, put everything in writing and answer you directly."
- Buttons: **Book a Video Call** · **Get Your Project Assessment**
- Contact row: Email `[EMAIL]` · Phone / WhatsApp `[PHONE]`

### 10 · Clear Payments. Clear Terms.  `#payments`  **(removed from the page October 3, 2026)**

**Layout:** a dark Pine Ink band. A three-point timeline is drawn by The Plan Line, left to right on desktop and top to bottom on phones.

- Label: "PAYMENTS"
- H2: "Clear payments. Clear terms."
- Intro: "Before you pay anything, you get it all in writing. You'll know what you're paying, when you're paying it and what each payment covers."

| Point | Title | Text (verbatim) |
|---|---|---|
| 1 | "In writing first" | "Your quote and agreement list your home, specifications, customization, price, payment schedule, what's included and excluded, responsibilities, and cancellation and refund terms." |
| 2 | "Paid on a clear schedule" | "Payments follow the schedule in your agreement. That can include a deposit, milestone payments and a final payment." `[BUSINESS INFORMATION REQUIRED: payment schedule]` |
| 3 | "Paid to the right place" | "Your agreement and payment instructions name exactly who receives each payment." |

- Small print: "Cancellation and refund terms are set out in writing before any payment." `[BUSINESS INFORMATION REQUIRED: cancellation and refund terms]`
- Safety note box: "Kikfia will never ask you to send money to a new or different account by text or phone call. If payment details ever look different, call Kashan before you pay." `[VERIFY BEFORE PUBLICATION]`

### 11 · Why Kikfia  `#why`  **(removed from the page October 3, 2026)**

**Layout:** a short headline row, then five columns, each with a drawn icon, title and line. On phones they stack. Background: Mist Stone.

- Label: "WHY KIKFIA"
- H2: "What you can count on."

| Pillar | Text (verbatim) |
|---|---|
| One person, start to finish | "You work with Kashan from your first question through your project. One person. One clear line of communication." |
| Clear information | "Specifications, options, what's included and what affects the price, explained plainly before you commit." |
| A clear project process | "You see every major step from first inquiry to handover, and you know which step you're on." |
| Real customization | "Shape your home around your needs, within each model's available options." |
| Clear payment terms | "You know what you're paying, when, and what it covers, before you pay." |

### 12 · Customer Stories  `#stories`  **(removed from the page October 3, 2026)**

**Layout:** a slim, quiet, centered band with The Plan Line passing through. Background: Morning band.

- H2: "Customer Stories"
- Text: "Verified customer experiences will appear here as Kikfia completes projects."

When you add verified reviews to `site-data.js`, this becomes a row of review cards. Each card shows the name as the customer approves it, the location, the project type, their words and a "Verified customer" tag. There are no stars unless the customer actually gave a rating.

### 13 · FAQ  `#faq`

**Layout:** the headline is pinned on the left and the questions open and close on the right. Background: Mist Stone.

- Label: "FAQ"
- H2: "Straight answers to common questions."

1. **"What types of homes does Kikfia offer?"**
   "Kikfia offers custom prefab homes and living spaces: ADUs and backyard homes, small homes, family homes, guest and vacation homes, office and studio spaces, and fully custom homes. Tell us what you need, and Kashan will send you the options that match."
2. **"Can I customize a home?"**
   "Yes. Start with a home you like, then adjust it: size, layout, bedrooms, doors, windows, kitchen, bathroom, finishes and more. Available options vary by model, and your quote lists every choice you make."
3. **"What's included with a home?"**
   "It depends on the model. Every quote separates three things: what's included as standard, the optional upgrades you choose, and location-dependent items like transport, foundation, installation, utilities and permits." `[BUSINESS INFORMATION REQUIRED: standard inclusions]`
4. **"What affects the price?"**
   "Your final project cost depends on your home, customization, location, transport, site requirements, permits and installation. Your quote lists the home price and these project costs separately, so you can see what each part costs."
5. **"How does delivery work?"**
   "Your home is transported to your property on a planned date. Delivery depends on distance, road access and your site, and some sites need a crane. We look at access during the property and location review, and your quote shows how delivery is handled." `[BUSINESS INFORMATION REQUIRED: delivery areas and who arranges transport]`
6. **"How does installation work?"**
   "When your home arrives, it's set on its foundation, secured and connected as agreed. Your agreement states exactly what installation includes and who handles each part." `[BUSINESS INFORMATION REQUIRED: installation scope]`
7. **"What about foundations?"**
   "Every home needs a proper, level foundation. The right type depends on the home, your soil, your climate and local rules. Common types include concrete slabs, piers and perimeter foundations. Foundation work is location-dependent and is listed separately in your quote."
8. **"What permits may be needed?"**
   "Most areas require a building permit for a new home or ADU, often with inspections for the foundation, electrical and plumbing. Rules are different in every city and county, so we look at yours early, during the property and location review."
9. **"Can an ADU go on my property?"**
   "It depends on your local zoning rules: lot size, setbacks, height and size limits, parking and utility capacity. Many cities now allow ADUs on single-family lots, but the details vary. The Property Check gives you a first look, and your local planning office has the final say."
10. **"Can an ADU be used as a rental?"**
    "Rental use depends on local rules and property requirements. Some areas allow long-term rentals, some limit short-term rentals, and some require the owner to live on the property. Check with your local planning office before you plan a rental."
11. **"How long does a project take?"**
    "It depends on your home, your customization, your permits and your site work. Permits and site preparation often take longer than people expect. Once your home, options and location are clear, Kashan will give you an estimated timeline for your project." `[VERIFY BEFORE PUBLICATION]`
12. **"How do payments work?"**
    "Before you pay anything, you receive a written quote and agreement. They cover your home, specifications, price, payment schedule, what's included and excluded, responsibilities, and cancellation and refund terms. Payments follow that schedule, which can include a deposit, milestone payments and a final payment." `[BUSINESS INFORMATION REQUIRED: payment schedule]`
13. **"Who will I be working with?"**
    "Kashan Ahmed. You'll work with Kashan from your first question through your project, so you always know who to call."
14. **"Do you serve international customers?"**
    `[BUSINESS INFORMATION REQUIRED: whether international orders are accepted]` "For projects outside the United States, transport, customs, duties, foundations, installation, permits, utilities, inspections and local building rules all vary by country, so we review them before quoting."
15. **"What happens after I submit an inquiry?"**
    "Kashan reviews your details and contacts you the way you prefer: phone, WhatsApp or email. You'll talk through your home, your property and your questions, and then decide whether you'd like a project quote." `[BUSINESS INFORMATION REQUIRED: typical response time]`

### 14 · Final call to action and form  `#start`

**Layout:** the hero's final frame returns as a wide image across the top, with The Plan Line drawing the home's roofline over it. The form card overlaps the image's lower edge. On phones, the image comes first and the form follows below it.

- H2: "Let's Plan Your Home."
- Text: "Tell us about your property and the home you have in mind. Kashan will get back to you, answer your questions and help you plan your next step. No pressure, no obligation."
- Link near the form: **Book a Video Call with Kashan**

**Lead form, step 1 of 2: "Your details"**

| Field | Label (verbatim) | Notes |
|---|---|---|
| Name | "Full name" | required |
| Email | "Email" | required, email keyboard |
| Phone | "Phone or WhatsApp" | required, phone keyboard |
| Contact method | "How should Kashan contact you?" | required: Phone · WhatsApp · Email |
| Country | "Country" | required, United States first |
| ZIP | "ZIP or postal code" | required |
| Home type | "What type of home?" | required: ADU or backyard home · Small home · Family home · Guest or vacation home · Office or studio · Custom home · Not sure yet |
| Consent | "I agree that Kikfia may contact me about my inquiry by phone, text/WhatsApp or email." | required checkbox |

- Button: "Continue"
- Under the button: "Step 1 of 2. The next step is optional."

**Lead form, step 2 of 2: "Your project (optional)"**

Fields: "Bedrooms" · "Approximate size" (placeholder "For example, 600 sq ft") · "What will you use it for?" · "When are you hoping to start?" · "Budget range" · "Customization wishes" · "Anything else you'd like Kashan to know?"

- Buttons: **Get Your Project Assessment** · link "Skip and send"
- Privacy line: "We use your details only to respond to your inquiry. See our Privacy Policy."
- Answers from the Property Check are filled in automatically. The visitor can change any of them.

**Messages (verbatim):**

| When | Message |
|---|---|
| Name missing | "Please enter your name." |
| Email missing or wrong | "Please enter a valid email address." |
| Phone missing | "Please enter a phone or WhatsApp number." |
| No contact method | "Please choose how Kashan should contact you." |
| No country | "Please choose your country." |
| No ZIP | "Please enter your ZIP or postal code." |
| No home type | "Please choose a home type." |
| Consent unchecked | "Please check the box so Kashan can contact you." |
| Sent | "Thank you, {first name}. Your request is in. Kashan will contact you by {method}." Then a **Book a Video Call** button. |
| Send failed | "Your request didn't go through. Please try again, or email us at [EMAIL]." |
| Form not connected yet | "This form isn't connected yet, so nothing was sent." Shown only until you add the form address in `site-data.js`. |

**Where submissions go:** to a form service address you set in `site-data.js`. I recommend Formspree, which has a free plan, delivers each inquiry to your email and needs a free account you create. Until you add that address, the form honestly says it isn't connected.

### 15 · Footer

- Wordmark "Kikfia", then "Kikfia Custom Portable Houses".
- Contact: Email `[EMAIL]` · Phone / WhatsApp `[PHONE]` · Contact: Kashan Ahmed
- "Mailing address: 5900 Balcones Drive #22441, Austin, TX 78731, USA"
- "Kikfia Custom Portable Houses is a brand operated by Sohail Ecom Services LLC, a Texas limited liability company."
- "Some images are digital renderings for illustration. Actual products, materials, colors and configurations may vary."
- "Prices and specifications are subject to confirmation and may vary based on configuration, location, transport, installation and local requirements."
- Links: Privacy Policy · Terms · social links (shown only once added)
- "© 2026 Sohail Ecom Services LLC" (the year updates itself)

### Legal pages (separate pages: `privacy.html`, `terms.html`)

These are designed placeholder pages that:
- name Sohail Ecom Services LLC as the operator of the Kikfia brand
- use the mailing address
- explain what the form collects and why

Each has a clear banner: `[LEGAL REVIEW REQUIRED BEFORE LAUNCH]`. A cookie notice appears only if you turn on analytics that set cookies.

---

## 7. The drawn layer and motion

**The Plan Line:** a 1.5px Lake line with rounded ends.
- It draws itself as each section scrolls in, then stays drawn.
- A tiny Lake dot at its leading end breathes slowly (5-second cycle). That's the one "living" detail per section, very quiet.

**Icons:** all drawn by me, in one style.
- 1.6px Pine Ink lines on a 24px grid, with one Cedar or Lake detail each.
- Sets: 10 for Customize, 8 for cost factors, 8 for After You Order and 5 for Why Kikfia.
- No stock icons and no emoji.

**Floor plan:** a simple drawn plan with kitchen, bath, bedroom and living zones that light up per option. It is clearly a diagram, not a real model's plan.

**Page background:** one fixed, barely visible layer behind everything: a fine paper grain and a soft morning-light glow that drifts across over 90 seconds. Scrolling feels like moving through one place.

**Entrances:** sections ease in once as they arrive.
- Text rises 16px and fades in.
- Cards follow one after another, 80ms apart.
- Images shift up to 20px as you scroll.
- Two easing curves are used everywhere. Nothing snaps.

**Never:** particles, glow effects, bouncing, flashing or auto-playing sliders.

**Reduced motion:** everything shows in its finished state, lines fully drawn and no video. This updates live if the setting changes while the page is open.

---

## 8. The engineering list (how it's built)

- **Files:** one `index.html` plus `assets/` (`css/`, `js/`, `img/`, `video/`, `fonts/`). Plain HTML, CSS and JavaScript, with no framework and no build step.
- **One data file:** every changeable fact lives in `assets/js/site-data.js`: brand, contact, Kashan's photo and note, booking link, categories, models, prices (off by default), inclusions, options, reviews, FAQ, social links, form address and analytics IDs. Changing a phone number or a price never needs a redesign.
- **Videos (hero and walk-through):** muted, looping and set to play inline. They only download and play while on screen, with a pause/play button. They don't autoplay with reduced motion or Data Saver. Each has a still image underneath, so the page is complete without them.
- **The page is complete without the video.**
- **Images:** modern formats (AVIF/WebP) with JPEG fallback, sized per screen, lazy-loaded below the fold.
- **Fonts:** self-hosted, trimmed to the weights above, with the key ones preloaded.
- **Accessibility:**
  - a skip link and proper landmarks, with one H1 and a logical heading order
  - visible Lake focus rings and 44px touch targets
  - accessible tabs, accordion and drawer, with focus trapped and Esc to close
  - labeled form fields with clear errors
  - contrast measured, not guessed
- **No sideways scrolling** at any width, with overflow clipped safely on both `html` and `body`.
- **SEO:**
  - Title: "Kikfia Custom Portable Houses | Prefab ADUs & Custom Homes"
  - Description: "Explore prefab ADUs, backyard homes and custom prefab family homes from Kikfia. Customize your home, see what affects the price and plan with one person."
  - Open Graph and X cards, `sitemap.xml` and `robots.txt`.
  - Organization structured data using the brand name, the LLC's legal name and the mailing address.
  - No fake LocalBusiness, product, rating or review data.
- **Analytics:** placeholders for GA4 and Meta Pixel. They stay off until real IDs are added. They track a lead-submit event and button clicks, and never send names, emails, phone numbers or messages.
- **Before you see it:** a full self-test, covering every width from 375px to large desktop, console errors, broken links and images, the form, the drawer, the tabs, reduced motion and the video-missing state.

---

## 9. The copy gate

Every viewer-facing line in this package ships verbatim. Before you see the built site, the whole page must pass these checks:

- zero em dashes
- zero stock words: leverage, seamless, empower, unlock, robust, actionable, data-driven, solutions, revolutionary, game-changing, world-class
- a sweep for AI tells and corporate filler

Three deliberate brand devices stay because they were chosen on purpose:
- "Clear steps. Clear terms. One person to call."
- "One person. One clear line of communication."
- "Clear payments. Clear terms."

---

## What I need from you to approve

1. **The look:** colors, fonts and The Plan Line (see the concept board).
2. **The copy:** read the quoted lines. Change anything that doesn't sound like Kikfia.
3. **Kashan's note** in section 9: approve it as is, or tell me what to change.
4. **One small addition I made:** the "What affects your project cost?" block inside What's Included. It shows the cost factors visually, as your brief asked, without adding a 16th section.
5. **The payment safety note** in section 10: keep it only if Kikfia will truly follow it.
