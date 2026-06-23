# Gainward — Food & Weight Tracker for Healthy Weight Gain

A mobile-first React app for tracking meals (with optional photos) and
weight, built for people who are intentionally trying to gain weight. Data
lives in Supabase (a hosted Postgres database + file storage), so it
persists across browser sessions and devices — there's no login; instead,
each device gets a private random ID that scopes its own data.

---

## 1. What's inside

```
weight-gain-tracker/
├── index.html
├── package.json
├── postcss.config.js          # Tailwind v4 PostCSS plugin
├── vite.config.js
├── .env.example                # template — copy to .env.local with your own Supabase values
├── supabase/
│   └── setup.sql                # run this once in the Supabase SQL Editor
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Router + providers + layout shell
    ├── index.css                # Design tokens (colors, fonts) + Tailwind import
    │
    ├── types/
    │   └── index.js             # JSDoc type definitions + shared constants
    │
    ├── services/
    │   ├── supabaseClient.js     # Supabase client init from env vars
    │   ├── deviceId.js           # generates/persists the per-device ID (replaces login)
    │   └── storageService.js     # ALL Supabase reads/writes go through here
    │
    ├── utils/
    │   ├── dateUtils.js          # date formatting, range filtering (day/week/month)
    │   └── formatUtils.js        # id generation, fraction/quantity parsing, formatting
    │
    ├── context/
    │   ├── AppDataContext.jsx    # foodLogs, weightLogs, settings + CRUD actions, loading/error state
    │   └── ThemeContext.jsx      # dark mode / light / system theme
    │
    ├── hooks/
    │   ├── useFoodLogStats.js       # filtered logs + summary stats for Dashboard
    │   └── useWeightStats.js        # latest weight, delta, chart data
    │
    ├── components/
    │   ├── common/         # Button, Card, ConfirmDialog, EmptyState, FAB, BottomNav, PageHeader, ThemeToggle, LoadingGate
    │   ├── dashboard/      # WeightSummaryCard, RangeFilterTabs, SummaryStatsGrid, FoodLogListItem
    │   ├── foodlog/        # FoodNameAutocomplete, QuantitySelector, UnitSelector, DateTimePicker, RecentFoodsQuickSelect, PhotoCapture
    │   └── weight/         # WeightChart, AddWeightForm, WeightLogListItem
    │
    └── pages/
        ├── Dashboard.jsx        # Page 1
        ├── AddFoodLog.jsx       # Page 2 (also handles editing via /edit/:id)
        ├── FoodLogDetail.jsx    # Page 3
        └── WeightTracking.jsx   # Page 4
```

**Data models** (see `src/types/index.js`; columns in `supabase/setup.sql`):

```js
FoodLog {
  id: string
  foodName: string
  quantity: number      // supports fractions, e.g. 0.5
  unit: string          // one of the Thai unit presets, or custom text
  eatDateTime: string   // ISO 8601
  photoPath: string|null   // path inside the Supabase 'photos' storage bucket
  photoUrl: string|null    // public URL derived from photoPath, for display
  createdAt: string     // ISO 8601
  updatedAt: string     // ISO 8601
}

WeightLog {
  id: string
  weight: number        // kg
  recordDate: string    // ISO 8601
}
```

Every row in Supabase also has a `device_id` column — see section 3 below.

---

## 2. Installation — step by step

### Step 1 — Install Node.js
You need Node.js 18 or newer. Check with:
```bash
node -v
```
If you don't have it, download it from [nodejs.org](https://nodejs.org).

### Step 2 — Get the project files
Copy the `weight-gain-tracker` folder to your computer (or clone it if you put
it in a git repo).

### Step 3 — Set up Supabase
This app stores everything in Supabase (Postgres + file storage) instead of
the browser, so your logs survive across devices/browsers.

1. Go to [supabase.com](https://supabase.com) → **New Project**. Name it
   anything (e.g. `gainward`), pick a region near you, and wait for it to
   finish provisioning.
2. Open **SQL Editor** in the project dashboard → **New query** → paste in
   the entire contents of `supabase/setup.sql` from this project → **Run**.
   This creates the `food_logs`, `weight_logs`, and `settings` tables, the
   Row Level Security policies, and a public `photos` storage bucket.
3. Go to **Project Settings → API** and copy two values:
   - **Project URL**
   - **anon public key**
4. In the `weight-gain-tracker` folder, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and paste in your Project URL and anon key.

   **Keep this file private.** `.env.local` is already in `.gitignore`, so it
   won't get committed if you put this project in git. Don't paste these
   values into chats, screenshots, or anywhere public — the anon key is
   *meant* to be embedded in frontend code, but there's no reason to expose
   it anywhere beyond that.

### Step 4 — Install dependencies
```bash
cd weight-gain-tracker
npm install
```

### Step 5 — Run it locally
```bash
npm run dev
```
Vite will print a local URL, typically `http://localhost:5173`. Open it in
your browser. For the most realistic mobile experience, open dev tools (F12)
and toggle device emulation, or open the printed "Network" URL directly on
your phone (same Wi-Fi as your computer).

The first time it loads, it'll fetch from Supabase — if you see a "Supabase
isn't set up yet" message, double check Step 3. If you see "Couldn't
connect," check your internet connection and that the SQL script actually
ran without errors.

### Step 6 — Build for production (optional)
```bash
npm run build
```
Outputs a static `dist/` folder you can deploy anywhere that serves static
files (Netlify, Vercel, GitHub Pages, etc). **Remember to set the same
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` as environment variables on
your hosting provider** — `.env.local` only works for local dev, it never
gets deployed.

To preview the production build locally:
```bash
npm run preview
```

---

## 3. How the app is organized, conceptually

- **`storageService.js`** is the *only* file that talks to Supabase
  directly (tables and the `photos` storage bucket). Everything else goes
  through it, or through `AppDataContext`, which wraps it. Table/column
  names and snake_case↔camelCase mapping all live here.
- **`deviceId.js`** generates a random UUID the first time the app runs and
  saves it to this browser's localStorage forever. There's no login — this
  ID is the closest thing to a "user id." Every row this device creates in
  Supabase is tagged with it, and every query filters by it.
- **`AppDataContext`** fetches everything from Supabase once on mount (you'll
  see a brief loading spinner), then holds it in memory and keeps it in
  sync as you add/edit/delete. It also tracks `loading`, `loadError`, and
  `configMissing` so the UI can show a spinner, a connection-error message,
  or a "you haven't set up `.env.local` yet" message as appropriate.
- **`ThemeContext`** tracks light/dark/system preference and toggles the
  `dark` class on `<html>`, which Tailwind's `dark:` variants respond to.
- **Pages** are thin: they compose components and hooks. Most of the actual
  logic (filtering, stats, formatting) lives in `hooks/` and `utils/` so it's
  testable and reusable.

### ⚠️ Security model — please read this

This app has **no authentication**. The device ID is just a random UUID
sitting in localStorage — there's no password, no JWT, nothing cryptographic
proving a request actually comes from the device that "owns" that ID. The
Supabase Row Level Security policies in `setup.sql` allow the `anon` role
(i.e. anyone with the public anon key — which is *always* visible in a
deployed frontend's JS bundle) to read and write **any** row in these tables.
Protection relies entirely on:

1. The device ID being long and random enough that nobody can guess it.
2. You never sharing that ID, and the app never displaying it anywhere.

This is **"security by obscurity," not real security.** It's a reasonable
tradeoff for a private app you use yourself, but:

- Don't deploy this somewhere public and link it to other people — anyone
  who got hold of any device's ID (e.g. by inspecting their own browser's
  localStorage, which is trivial) could read/write that device's data, and
  technically (with effort) someone could also just enumerate/guess at
  scale or intercept it over an insecure connection.
- If you ever want real multi-user safety, the fix is adding Supabase Auth
  (email/password or magic link) and changing the RLS policies to check
  `auth.uid()` instead of trusting a client-supplied `device_id`. That's a
  bigger change than this app currently makes — ask if you want it added
  later.

---

## 4. Feature checklist (matches your spec)

**Dashboard**
- Latest weight + target weight (`WeightSummaryCard`)
- Filter by Day / Week / Month (+ All) (`RangeFilterTabs`)
- Total meals, average meals/day, most active weekday (`SummaryStatsGrid`, `useFoodLogStats`)
- Food log history sorted by datetime descending, with photo thumbnails
- Search food history
- Floating action button → Add Food Log

**Add Food Log**
- Photo capture/attach (camera on mobile, file picker on desktop) — `PhotoCapture`
- Food name text input with autocomplete from previous entries — now optional if a photo is attached
- Recent foods quick-select chips (with favorites starred)
- Default current datetime; "Record historical entry" checkbox reveals date + time pickers
- Quantity dropdown with fraction presets + Custom numeric input
- Unit dropdown with all 14 Thai units + custom input for อื่นๆ
- Save / Cancel

**Food Log Detail**
- Shows photo (if attached), name, quantity, unit, eaten-at datetime, created datetime (+ updated, if edited)
- Edit button (routes to the same form, pre-filled, including the existing photo)
- Delete button → confirmation dialog before deleting (also cleans up the photo file in storage)
- Favorite toggle (⭐)

**Weight Tracking**
- Add weight records (inline form)
- Line chart (Recharts) with a dashed target-weight reference line
- Latest weight + change from previous record
- Editable target weight
- History list with delete + confirmation

**Cross-cutting**
- Supabase persistence (Postgres + Storage), synced across devices/browsers
- No login — private per-device ID instead (see security note above)
- Responsive, mobile-first layout (max-width container, scales to tablet/desktop)
- Dark mode (light / dark / system, toggle in the Dashboard header)
- Empty states for no meals / no weight records / no search results
- Loading spinner on first load; clear messages if Supabase isn't configured or unreachable
- Confirmation dialogs before any delete

---

## 5. Customizing

- **Colors** live as CSS variables in `src/index.css` under `@theme`
  (`--color-clay`, `--color-moss`, `--color-gold`, etc.) — change them there
  and the whole app updates.
- **Units list** and **quantity presets** live in `src/types/index.js`
  (`UNIT_OPTIONS`, `QUANTITY_PRESETS`) if you want to add/remove options.
- **Fonts**: currently "Fraunces" (display/numbers) + "Inter" (body), loaded
  from Google Fonts in `index.html`.

---

## 6. Known limitations

- **No real authentication** — see the security note in section 3. This is
  the most important limitation to understand before relying on this app.
- **Photo uploads have no size/compression limit** in the app itself. Very
  large photos (e.g. unedited phone camera shots) will upload slowly on a
  poor connection and use up Supabase Storage quota faster. Consider adding
  client-side image compression before upload if this matters to you.
- **No data export/import yet** — would be a natural next feature (e.g. a
  "Download backup as JSON" button reading from `storageService`).
- **No offline support** — since data now lives in Supabase, the app needs a
  network connection to load or save anything. The old LocalStorage version
  worked offline; this one doesn't (yet). A service worker + local cache
  could be added later if that's important to you.
- The free Supabase tier pauses projects after a week of inactivity — if you
  haven't opened the app in a while and it shows a connection error, check
  your Supabase dashboard and "unpause" the project if needed.
