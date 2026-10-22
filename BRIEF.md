# Sparø: story and website brief

*Handover for the agent working on the Sparø website (www.sparø.dk). Written 22 October 2026.*

This brief sits in the root of the website repository. It covers what Sparø is, the story behind it,
what the app really does, the brand, and how the website is built. It ends with open questions to help
you decide how to improve the story.

Only the website is in scope here. The app's source code isn't included; the app is described below
so the website stays accurate about it.

---

## 1. Sparø in one paragraph

Sparø is a free Danish grocery app that brings every supermarket's weekly offer leaflet (*tilbudsavis*)
together in one search, plus Stop madspild: food that Netto, føtex and Bilka mark down before it
goes to waste. You type what you need, in Danish or English, and see where it's on offer near you
this week, sorted by distance, price or price per kilo. Then you put it on your shopping list. No
account, no ads, no tracking: your location and your list stay on your phone.

## 2. The story behind it

- **Where it came from.** Sparø began as a personal project. The founder checks offers every week
  like many people in Denmark, flicking through five or six leaflets to find where milk, coffee or
  chicken is cheapest this week. Sparø turns that habit into a single search.
- **Why it's different.** Leaflet apps already exist. Sparø adds two things that matter:
  1. **Stop madspild in the same search:** short-dated, marked-down food from shops near you, next
     to the regular offers. Good for your wallet and against food waste.
  2. **Real bilingual search:** many people in Denmark don't read Danish well. Sparø translates
     product names into English and understands English searches ("minced beef" finds *hakket
     oksekød*), entirely on the phone.
- **Spirit.** Free and non-commercial. A proof of concept by someone who wanted the tool for
  themselves, and wanted to see if they could build an app. No business model, no sponsored
  placements, no data collection.
- **Scope.** Denmark only. Ten chains: REMA 1000, Netto, føtex, Bilka, Lidl, Coop 365discount,
  SuperBrugsen, Kvickly, Løvbjerg and Let-Køb. Roughly 4,000 offers a week nationwide; the app shows
  the ones near you.

## 3. What the app actually does today

Use this to keep the website's claims true.

| Area | What it does |
|---|---|
| **Search** | One search across all ten chains' current leaflets. Danish and English. Handles plurals, Danish compound words (*kyllingebrystfilet* = chicken breast fillet), small typos ("Did you mean Kaffe?"), and whole categories ("snacks", "grøntsager", "dairy"). |
| **Suggestions** | While typing, suggests words that actually find offers nearby ("ch" → Cheese, Chicken, Chocolate). |
| **Results** | Cards show shop, distance, how long the offer runs, the product, price and price per kg/l. Clear matches come first; related products follow under "Related offers". A yellow arrow marks the cheapest per kg/l, a red one the priciest. |
| **Sort and filter** | Sort by nearest, lowest price, lowest price per kg/l, or biggest saving. Filter by shop, pack size, distance and category. |
| **Stop madspild** | Marked-down, short-dated items at Netto, føtex and Bilka near you, with "before" price, stock left and when it ends. |
| **Not on offer?** | The app says so and lets you put the item on your list anyway. It then checks again for offers later. |
| **Shopping list** | One list for offers and your own items, grouped by type of food (as a shop is laid out), with a hint for the best shop for your list. Tick off as you shop. |
| **English mode** | The whole app in Danish or English, including product names translated from the leaflets. |
| **Little touches** | A greeting with the live weather where you are; haptic feedback when adding and ticking items. |
| **Privacy** | No account, no ads, no analytics. Location (GPS or postcode) is used and stored only on the phone. Only a rounded location (~1 km) goes to the weather service Open-Meteo. |

**Status:** working builds exist (TestFlight on iPhone, an APK on Android), but **Sparø is not yet
in the App Store or Google Play.** Publishing is waiting on permission to show the leaflet images and
data publicly (ShelfAtlas, Salling Group, possibly Tjek).

### Where the current site and the app differ

Check these before keeping or rewriting the related copy:

- **"Nu på Google Play" / "Hent i App Store"**: the store buttons suggest the app is available. It
  isn't yet. The buttons currently scroll to the footer (`STORE_LINKS` in `main.js` is empty).
  Consider "Kommer snart" / "Coming soon" until launch.
- **"Få en liste pr. butik" / "Åbn lige netop dén liste" (a list per store):** the app has **one**
  shopping list grouped by food type, with shop filter chips and a best-shop hint, not separate
  lists per store. The "sorted by store" section and the in-store section overstate this.
- **The hero phone mock-up** uses an older card layout. The app now shows the shop name on top,
  then the product name, then the price.
- **Stop madspild**, the strongest differentiator, appears only in the new "Alle aviser. Én
  søgning." section and in a tiny attribution line. It isn't in the hero or "how it works".
- **English search and translation** isn't mentioned outside that new section.

## 4. Brand

- **Name:** Sparø. It reads as *spar* (save) with a Danish *ø*, and goes with the sparrow mascot.
  The domain is www.sparø.dk (internationalised; the ASCII form is `www.xn--spar-jra.dk`).
- **Mascot:** a hand-drawn sparrow in several poses (`assets/illustrations/`: perched, pecking,
  hopping, curious), each with a dark-mode version.
- **Colours:** deep green `#00422E` (brand), soft green `#EAF0E9`, page `#F7F6F2`, sage `#E6EBDD`,
  lime `#D8E8AB`, highlight yellow `#FEE951` (used for Stop madspild and the "cheapest" marker).
  The full set is in `styles.css` (`:root`, with dark-mode overrides).
- **Type:** Plus Jakarta Sans 400/500/600/700, served from the site itself.
- **Voice:** calm, practical, friendly, Danish-first. Short sentences. No hype, no exclamation marks,
  no "revolutionary". Talks about everyday shopping, not technology.
- **Languages:** Danish is the default; English sits alongside with equal care.

## 5. The website today

### Repository status

- **Repo:** `github.com/nusenselabs/spar-_web` (public), served by **GitHub Pages** from `main`;
  `CNAME` is `www.xn--spar-jra.dk`.
- **Not live yet:**
  - The domain was bought at one.com and isn't connected. It needs a CNAME `www` →
    `nusenselabs.github.io`, plus GitHub's four A records for the bare domain.
  - GitHub Pages isn't switched on yet in the repo settings.
- **Latest work is on `main`:** commit `a16a6b4` added the privacy, terms and help pages, the new
  home section and the self-hosted font. `mararanupama` is a collaborator with push access.

### Structure

```
index.html            One-page site: hero, how it works, sorted by store, in the store,
                      "every leaflet" (new), FAQ, footer with app card
privacy/index.html    Privacy policy (DA/EN) - required by the app stores
terms/index.html      Terms of use (DA/EN)
support/index.html    Help & contact + FAQ (DA/EN) - the stores' "support URL"
styles.css            All styles: tokens, sections, motion, responsive, dark mode, legal pages
i18n.js               English text for every data-i18n key (Danish lives in the HTML)
main.js               Language switch, theme switch, menu, scroll reveal, parallax, FAQ
assets/fonts/         Plus Jakarta Sans (self-hosted, SIL OFL)
assets/icons/         UI icons (+ dark/ variants)
assets/illustrations/ Sparrow mascot (+ dark/ variants)
assets/images/        Photos and product packshots (DA/EN label versions)
CNAME, .nojekyll      GitHub Pages
```

### How the home page tells the story now (in order)

1. **Hero:** "Små indkøb. Stor forskel i hverdagen." / "Small buys. A big difference every day."
   Find nearby offers, pick what you want, and Sparø builds your list split by store. A phone
   mock-up of a milk search sits over a grocery photo.
2. **How it works** (4 steps): find offers nearby → pick what you need → get a list per store →
   take the list with you.
3. **Sorted by store** (dark green panel): "Du vælger tilbuddene. Vi holder styr på butikkerne." /
   "You pick the offers. We keep track of the stores." Shows five picked items, then the same
   items grouped per store with totals.
4. **In the store:** "I butikken? Åbn lige netop dén liste." / "In the store? Open the list for
   that store." Photo of a shopper with the app on their phone.
5. **Every leaflet. One search.** (*new*): three cards (search every leaflet; Stop madspild;
   one shopping list) and the promise "Gratis, uden reklamer og uden konto" / "Free, no ads, no
   account", linking to the privacy policy.
6. **FAQ:** are the prices real (no, examples); must I visit every store (no); do I pay in Sparø (no).
7. **Footer:** app card "Hent appen." / "Get the app." with store buttons; links to how it works,
   FAQ, help, privacy and terms; note that prices are examples and shop names don't imply
   partnerships; language toggle.

### How it's built (things to know before editing)

- **Plain static HTML/CSS/JS**, no build step. Bump the `?v=25` cache-buster on `styles.css`,
  `i18n.js` and `main.js` when you change them.
- **Translations:** Danish is written in the HTML; every translatable element carries
  `data-i18n="key"` (or `data-i18n-aria`, `data-i18n-alt`, `data-i18n-content`, `data-i18n-src`), and
  its English text goes in `i18n.js` under the same key. A missing English key logs a console
  warning. Amounts with `data-i18n-num` switch "9,00 kr" ↔ "9.00 kr" automatically.
- **Legal and help pages** hold both languages in the page (`.only-da` / `.only-en` blocks) and use
  the same header, footer and scripts as the home page. Without JavaScript, the Danish shows.
- **Theme:** light or dark, from the system or the visitor's choice (stored in `localStorage`).
  Icons and sparrows with a `dark/` copy swap automatically (`DARK_ASSETS` in `main.js`).
- **Motion:** elements with `data-reveal` / `data-stagger` animate in on scroll. Everything respects
  "reduce motion".
- **Phone mock-ups** are fixed-size "stages" scaled to fit their column (`data-stage-width/height`).

## 6. Rules the website must keep

1. **Privacy promise.** The privacy policy states the site uses **no cookies, no analytics, and no
   fonts or scripts from anyone else**. Adding Google Fonts, analytics, embeds (YouTube, maps), a chat
   widget or a cookie banner would make the policy untrue. Any of those needs the policy updated
   first. The language and theme choices in `localStorage` are already covered by the policy.
2. **Fixed addresses.** `/privacy/`, `/terms/` and `/support/` are (or will be) registered with
   Apple and Google. They must keep working at those paths.
3. **Legal text.** The wording of the privacy policy and terms describes exactly what the app does.
   Change it only together with the app. Publisher: **Mahesh Marath**, under the name Nusense Labs.
   Contact: **nusense.labs@gmail.com**.
4. **Honesty about prices.** Prices on the site are examples (the footer and FAQ say so). Shop names
   must not suggest partnerships. Sparø isn't affiliated with any chain, Salling Group, ShelfAtlas
   or Tjek.
5. **Images.** Leaflet (avis) images belong to the chains and are **not** cleared for use on the
   website. Use your own photos, illustrations and app mock-ups.
6. **Credits.** Data credits (ShelfAtlas, Salling Group, OpenStreetMap contributors, GeoNames,
   Open-Meteo) must stay visible wherever app data or screenshots appear.
7. **Bilingual.** Every visible text needs both Danish and English.

## 7. Open questions for improving the story

For you to decide. These are observations, not instructions.

- **Lead with what's unique.** The hero sells "a list per store", which other apps also do, and
  which the app only partly does (see section 3). Would the story be stronger leading with **one
  search across every leaflet, plus Stop madspild**?
- **Food waste as a value.** Stop madspild lets the site speak to saving money *and* wasting less
  food. Should that be a headline theme or a supporting one?
- **The personal origin.** "Built by someone who checks the leaflets every week" is warm and
  credible. Is there room for a short "why Sparø exists" note? Keep it modest; it's a proof of
  concept.
- **Internationals in Denmark.** English search and translated product names are a real gap in the
  Danish market. Is this worth its own section, or a strong line in the hero?
- **Privacy as trust.** "No account, no ads, no tracking, your list stays on your phone" is unusual
  for a free app. Lead with it, or keep it as reassurance near the end?
- **Accuracy fixes** (section 3): the store buttons, the "list per store" claims, and the outdated
  mock-up.
- **Numbers.** "10 chains" is safe to state. "4,000 offers a week" changes weekly; use it carefully
  ("thousands of offers") if at all.
- **FAQ gaps:** which shops are included; is it free; does it work in English; what is Stop
  madspild; what happens with my location. The support page already answers these, so the home FAQ
  could reuse them.
- **Basics not yet done:** social-sharing tags (Open Graph image and description), a favicon set,
  and a page `<title>` per language (the home page already switches its title).

## 8. Contact

Questions about the product or the policy: **nusense.labs@gmail.com**.
