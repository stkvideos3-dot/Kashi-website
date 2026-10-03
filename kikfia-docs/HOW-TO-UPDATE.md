# How to Update the Kikfia Website

**The easiest way:** tell Claude in one plain sentence, like "Change the phone number to +1 512 555 0100" or "Add our new two-bedroom model." Claude makes the change and puts it live.

**If you want to do it yourself,** almost everything lives in **one file**:

```
kikfia/assets/js/site-data.js
```

Open it in any text editor: GitHub's web editor, VS Code, Notepad or TextEdit. Change the text between the quote marks, save the file, then put the site back online (see "After any change" at the bottom).

### Three rules that prevent almost every mistake

1. Keep the quote marks: `'like this'`. If your text contains an apostrophe, like `I'm`, use double quotes around it: `"I'm Kashan"`.
2. Every item in a list ends with a comma.
3. Leave a value empty (`''`) when you don't know it yet. The site shows a clear placeholder instead of guessing.

---

## Change the phone or WhatsApp number

Find the `contact:` block (section 2).

```js
phone: '+1 512 555 0100',      // shown exactly as you type it
whatsapp: '15125550100',       // digits only, with country code, no + or spaces
```

When `whatsapp` is filled in, a WhatsApp button appears in the phone bottom bar, the contact section and the footer.

## Change the email

```js
email: 'hello@kikfia.com',
```

## Change the contact person's name or role

Find `person:` (section 3).

```js
name: 'Kashan Ahmed',
role: 'Your Kikfia contact',
```

## Add a contact photo (optional)

The Meet Kashan section has no photo for now. If you want one later:

1. Send the photo to Claude, which resizes and compresses it for you. Or put a JPG in `kikfia/assets/img/` yourself.
2. In `person:`, set:

```js
photo: 'assets/img/kashan.jpg',
photoAlt: 'Kashan Ahmed, your Kikfia contact',
```

Only ever use a **real** photo of the real person. Leave `photo: ''` to keep the section text only.

## Change the personal note

```js
note: "Hi, I'm Kashan. ...",
noteApproved: true,
```

If `noteApproved` is `false`, the site shows a "needs approval" tag under the note.

## Change prices / turn on starting prices

Prices stay hidden until **both** of these are true:

1. In `pricing:`, set `showStartingPrices: true,`
2. The home has a real number in `startingPrice:`. Use a number with no $ and no commas: `startingPrice: 64900,`

Under each price the site adds: "Home price only. Delivery, foundation, installation, permits and utilities are quoted separately." If you have **confirmed** that a price includes more than the home, write exactly what it includes in that home's `priceIncludes: ''`.

To hide all prices again: `showStartingPrices: false,`

## Add a home model

Go to `products: [` (section 10). There's a full example in the comment just above it.
1. Copy the example.
2. Paste it between `products: [` and `],`.
3. Remove the `//` and fill it in.

Only add details you have confirmed. Leave out anything you're not sure of; empty fields are simply not shown.

`category` must be one of: `adu`, `small`, `family`, `guest`, `studio`, `custom`.

As soon as a category has a model, its model cards appear in The Homes instead of the category card.

## Replace an image

Send the new image to Claude. It makes the web sizes (AVIF, WebP and JPG at four widths) and updates the path for you.

Doing it by hand: put a JPG in `kikfia/assets/img/` and set the full path, including `.jpg`, in the right place. For example:

```js
image: 'assets/img/adu-backyard.jpg',
```

Image spots and where they live in `site-data.js`:

| Spot on the site | Setting |
|---|---|
| Category cards | `categories` → each `image` |
| Model cards and drawer | `products` → `images` |
| See What's Inside | `interiors` → each `image` |
| Delivery and installation photos (Your Simple Plan) | `process` → each `image` |
| Hero video, phone video, still images and the image above the form | `hero` (Claude prepares these files) |
| Walk-through video in See What's Inside | `insideVideo` (set `video: ''` to hide it) |

## Add customer reviews

The simpler page doesn't have a reviews section yet. When you have real reviews from real customers (with their permission), send them to Claude and a reviews section will be added.

## Edit the FAQ

Go to `faq: [` (section 17). Each question looks like:

```js
{ q: 'The question?',
  a: 'The answer.',
  needs: 'BUSINESS INFORMATION REQUIRED: what is missing' },
```

- To change an answer, edit the text after `a:`.
- When an answer is complete, delete the whole `needs:` line so the placeholder tag disappears.
- To add a question, copy one block and paste it below. Keep the comma between blocks.

## Change where the form goes

1. Create a free account at formspree.io and make a new form. It gives you an address like `https://formspree.io/f/abcdwxyz`.
2. In `form:` (section 4), set:

```js
endpoint: 'https://formspree.io/f/abcdwxyz',
```

3. Send yourself a test inquiry from the live site. The first time, Formspree asks you to confirm your email.

While `endpoint` is empty, the form honestly says it isn't connected.

## Update analytics IDs

In `analytics:` (section 5):

```js
ga4: 'G-XXXXXXXXXX',
metaPixel: '123456789012345'
```

Once an ID is filled in, visitors see a small "Accept / Decline" analytics notice. Nothing loads unless they accept. Names, emails, phone numbers and messages are never sent to analytics.

The site sends these events:
- `cta_click`: which button was clicked
- `property_check_start` and `property_check_complete`
- `lead_step_1_complete`
- `generate_lead`, which Meta receives as "Lead"
- `faq_open`
- `view_home`

## Change the social links

In `social:`, paste the full link for each one you use. Each link shows in the footer only when it's filled in.

## Things that are NOT in site-data.js

- **Section headlines and the approved page copy** live in `kikfia/index.html`, because they are part of the design. Ask Claude to change them, so the layout and the copy check stay intact.
- **The Privacy Policy and Terms** are `kikfia/privacy.html` and `kikfia/terms.html`. Update them after your legal review. When the review is done, set `legal.legalReviewDone: true` and `legal.lastUpdated` in `site-data.js` to remove the review banner.

---

## After any change

1. Save the file.
2. Ask Claude to "check and publish the site." Claude re-tests it and puts the new version online.
3. Open the live site and refresh. If you still see the old version, do a hard refresh: Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac, or pull down to refresh on a phone.
