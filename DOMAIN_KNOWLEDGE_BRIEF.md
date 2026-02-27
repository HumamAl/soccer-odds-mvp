# Domain Knowledge Brief — Soccer Odds / Sports Betting Platform

## Sub-Domain Classification

Consumer-facing soccer betting odds aggregator and tracker — specifically a cross-platform app that pulls from the Odds API (or similar), displays pre-match and live in-play odds across multiple bookmakers, covers major European and international soccer leagues (Premier League, Champions League, La Liga, Serie A, Bundesliga, Ligue 1), and surfaces market types beyond basic 1X2 (totals, Asian handicap, BTTS, corners, cards). Target users are sports bettors ranging from casual punters to semi-sharp recreational bettors who shop odds across books.

This is NOT a sportsbook operator dashboard — it is a bettor-side data/odds aggregator, closer to OddsPortal, OddsJam, or ActionNetwork than to DraftKings admin console.

---

## Job Analyst Vocabulary — Confirmed and Extended

No Job Analyst brief was provided, so this section builds the full vocabulary from domain research.

### Confirmed Primary Entity Names

- Primary record type: **Fixture** (not "game", not "match event" — "fixture" is the term used by APIs and professional bettors; "match" is also acceptable in UI headers)
- Competitions: **League** (Premier League, La Liga) / **Tournament** (Champions League, Europa League)
- Betting units: **Market** (1X2, Over/Under 2.5, BTTS, Asian Handicap)
- Odds source: **Bookmaker** (not "bookie" in formal UI; not "vendor")
- Betting lines: **Odds** (decimal/fractional/American format toggle)
- Best available odds: **Best Odds** (BBO — Best Bookmaker Odds)
- Wager being tracked: **Bet** (in a bet tracker context)
- Bundle of bets: **Accumulator** (UK/EU term) / **Parlay** (US term)
- Probability derived from odds: **Implied Probability** (shown as %)
- Bookmaker profit margin: **Margin** (also: Overround, Vig, Juice)
- Live match context: **In-Play** (not "live" alone — "In-Play Odds" is the standard API term)
- Odds comparison: **Odds Board** / **Odds Grid**
- Value opportunity: **Value Bet** (when implied probability < estimated true probability)

### Expanded KPI Vocabulary

| KPI Name | What It Measures | Typical Format |
|---|---|---|
| Best Available Odds | Highest decimal odds for a given outcome across all tracked bookmakers | Decimal (e.g., 2.34) |
| Implied Probability | Chance of outcome as implied by odds (1 / decimal odds) | % (e.g., 42.7%) |
| Bookmaker Margin | Sum of all outcome implied probabilities minus 100% | % (e.g., 5.4%) |
| Odds Movement | Change in odds from opening line to current | +/- delta (e.g., -0.12) |
| Live Fixtures | Count of currently in-play matches with open markets | Count (e.g., 14) |
| Upcoming Fixtures | Fixtures kicking off within next 24 hours | Count |
| Markets per Fixture | Average number of open bet markets per match | Count (e.g., 22 markets) |
| Value Bet Count | Number of fixtures where best odds beat the no-vig line | Count |
| Bookmakers Tracked | Number of sportsbooks providing odds for a given fixture | Count (e.g., 12 books) |
| Sharp Movement | Odds that moved opposite public betting direction (reverse line movement) | Tag / Flag |

### Status Label Vocabulary

**Match / Fixture States:**
- Pre-match states: `Scheduled`, `Upcoming`, `Early Lines` (odds open days before kickoff)
- Active states: `In-Play`, `Live`, `Half Time`, `Extra Time`, `Penalties`
- Problem states: `Suspended`, `Abandoned`, `Interrupted`
- Terminal states: `Full Time`, `Postponed`, `Cancelled`, `Void`

**Market / Odds States:**
- Active: `Open`, `Trading`
- Problem: `Suspended` (market paused mid-match for odds recalculation), `Restricted` (bet limits lowered)
- Terminal: `Settled`, `Void`, `Resulted`

**Odds Movement Labels:**
- `Drifted` — odds got longer (favorite became less favored), e.g., 1.80 → 2.10
- `Firmed` / `Shortened` — odds got shorter (favorite firmed up), e.g., 2.10 → 1.80
- `Steam Move` — rapid sharp-money-driven line movement
- `Early Price` — odds released well before kickoff (4-7 days out)
- `Suspended` — temporarily halted, typically during goals, red cards, VAR reviews

### Workflow and Action Vocabulary

**Primary actions:**
- `View Odds` — open odds comparison for a fixture
- `Track Fixture` — add to watchlist
- `Set Odds Alert` — notify when odds hit threshold
- `Add to Betslip` — add selection to pending wager
- `Compare Books` — open side-by-side bookmaker grid
- `Switch Format` — toggle between Decimal / Fractional / American display

**Secondary actions:**
- `Filter by League` — narrow fixture list
- `Filter by Market` — show only specific bet types
- `View History` — historical odds movement chart
- `Share Odds` — share fixture odds snapshot
- `Flag Value` — mark as value bet

### Sidebar Navigation Candidates

- **Match Centre** (replaces generic "Dashboard" — industry-standard name for live fixture overview)
- **Odds Board** (comparison grid for all bookmakers on a fixture)
- **Live In-Play** (dedicated in-play odds feed)
- **Leagues** (browse fixtures by competition — EPL, UCL, La Liga, etc.)
- **Bet Tracker** (personal bet log with P&L tracking)
- **Value Finder** (filtered view of fixtures with sharp odds movement or value indicators)
- **Results** (settled fixtures with final odds and outcomes)

---

## Design Context — Visual Language of This Industry

### What "Premium" Looks Like in This Domain

The sports betting industry has converged on a dark, high-contrast visual language that practitioners immediately read as "serious." The reasoning is functional: bettors read odds in real-time and under time pressure — dark backgrounds reduce eye strain during extended sessions, and high-contrast text makes numerical scanning faster. Apps that use light backgrounds (like a generic SaaS dashboard) read as "beginner" or "wrong domain" to an experienced bettor within seconds.

Premium looks like bet365, Betfair Exchange, or OddsPortal: dark slate or near-black sidebars, tightly spaced rows of fixture data, monospace or tabular-numerals-enabled fonts for all odds values, and color coding that communicates odds movement direction (green = shortened/favorite firmed, red = drifted/lengthened). The odds themselves are the hero element — they should be visually prominent (larger type, bold weight), not tucked inside a table column.

Real-time signals are the second premium marker. Live fixtures show a pulsing green "Live" badge, odds that animate when they change (a brief flash of yellow/amber on the odds cell), and a running match clock. The UI is expected to handle constant state updates without layout shifts. Apps that show static screenshots feel obviously fake to anyone who has used a real betting platform.

The third marker of "premium" in this space is breadth of market coverage — a fixture should surface not just 1X2 but also Asian Handicap, Over/Under at multiple goal lines (1.5, 2.5, 3.5), Both Teams to Score, Corners, and Correct Score. Showing only 1X2 odds reads as entry-level. The sidebar navigation should reflect this depth with named market categories.

### Real-World Apps Clients Would Recognize as "Premium"

1. **bet365** — The industry benchmark for live soccer betting UI. Dark green/black theme, match timeline with live stats inline, markets tabbed within each fixture (Match Result, Goals, Corners, Specials). The in-play centre is the defining UI pattern: a scrolling list of live fixtures each showing score, elapsed time, and top-line odds inline on the row.

2. **OddsPortal** — The reference app for odds comparison. Grid layout with bookmaker columns across the top and outcome rows below; each cell shows the decimal odds for that book/outcome combination with background color showing relative value (best odds are highlighted). Bettor community uses it to "shop" odds.

3. **ActionNetwork** — US-market odds tracking and sharp money analysis. Clean dark UI showing line movement history as a mini chart within each fixture row. Has introduced the concept of "consensus percentages" (public betting split) and "sharp indicator" badges that practitioners understand immediately.

### Aesthetic Validation

- **Job Analyst chose**: Dark Premium (recommended based on domain)
- **Domain validation**: Confirmed — soccer betting is the canonical Dark Premium domain. Every major bookmaker (bet365, Betway, Unibet, Bet-at-home) uses dark backgrounds as baseline. This is not a trend choice — it is functional convention. Light-theme betting apps are regional exceptions (some US newcomers like DraftKings use mixed themes) but are not the global standard for soccer betting.
- **Color adjustment**: The default Dark Premium electric blue works, but deep green (`oklch(0.58 0.18 145)`) is also deeply conventional in this space (bet365, SkyBet, Paddy Power all use green as primary). Consider using deep green as primary with electric blue as accent — this reads as "soccer-native" versus generic dark-mode SaaS. Alternatively, deep violet/indigo reads as premium without the green cliche.

### Density and Layout Expectations

This domain expects **compact-to-standard density** — closer to a trading terminal than a consumer app. Practitioners scan many fixtures quickly; each row carries a lot of information (league, teams, kickoff time, top-line 1X2 odds, in-play indicator). Padding on fixture rows should be tight. Cards for individual matches can be slightly more generous (when expanded/selected) but the overview list is compact.

Layout is **list-heavy with tabbed expansion**: the main view is a scrollable list of fixtures organized by league, each row showing inline odds. Clicking a fixture expands into a full odds comparison panel (the "odds board") with bookmaker columns. This is NOT a card-heavy domain — cards are used for featured/promoted matches, not as the default browse pattern.

---

## Entity Names (10+ realistic names)

### Leagues / Competitions (Real Names)

- English Premier League (EPL)
- UEFA Champions League (UCL)
- Spanish La Liga (LaLiga)
- Italian Serie A
- German Bundesliga (Bundesliga 1)
- French Ligue 1 (L1)
- UEFA Europa League (UEL)
- UEFA Conference League (UECL)
- Dutch Eredivisie
- Portuguese Primeira Liga
- Scottish Premiership
- MLS (Major League Soccer)

### Real Teams (per league, realistic for fixture data)

**EPL:** Manchester City, Arsenal, Liverpool, Chelsea, Manchester United, Tottenham Hotspur, Newcastle United, Aston Villa, West Ham United, Brighton & Hove Albion

**La Liga:** Real Madrid, FC Barcelona, Atletico Madrid, Real Betis, Athletic Club, Valencia CF, Real Sociedad, Villarreal CF

**Serie A:** Inter Milan, AC Milan, Juventus, Napoli, AS Roma, Lazio, Atalanta, Fiorentina

**Bundesliga:** Bayer Leverkusen, Bayern Munich, Borussia Dortmund, RB Leipzig, Eintracht Frankfurt, VfB Stuttgart

**UCL (fixture pairings for mock data):**
- Arsenal vs. Inter Milan
- Real Madrid vs. Bayern Munich
- Manchester City vs. PSG
- Liverpool vs. Atletico Madrid

### Bookmakers (Real Names — tracked in odds comparison)

- bet365
- Betway
- William Hill
- Unibet
- Pinnacle
- Paddy Power
- SkyBet
- Betfair Exchange
- DraftKings
- FanDuel
- PointsBet
- BetMGM

### Market Types (for mock data market names)

- Match Result (1X2)
- Both Teams to Score (BTTS)
- Over/Under 2.5 Goals
- Over/Under 1.5 Goals
- Over/Under 3.5 Goals
- Asian Handicap -1
- Asian Handicap +0.5
- Draw No Bet
- Double Chance (1X / X2 / 12)
- Correct Score
- Half Time Result
- Total Corners Over/Under 9.5
- Total Cards Over/Under 3.5
- First Goalscorer
- Anytime Goalscorer
- Match Result & Both Teams to Score

---

## Realistic Metric Ranges

| Metric | Low | Typical | High | Notes |
|--------|-----|---------|------|-------|
| Decimal odds — strong favorite (e.g., Man City vs. bottom side) | 1.15 | 1.32 | 1.65 | Heavy favorites rarely go below 1.10 in soccer |
| Decimal odds — slight favorite | 1.65 | 1.85 | 2.10 | Competitive matches typical range |
| Decimal odds — moderate underdog | 2.50 | 3.40 | 5.00 | Away underdogs typical range |
| Decimal odds — heavy underdog | 5.00 | 7.00 | 15.00 | Relegation side vs. top-4 |
| Decimal odds — draw | 2.90 | 3.30 | 3.80 | Draw pricing fairly consistent; rarely below 2.8 |
| Bookmaker margin (major league 1X2) | 3.5% | 5.2% | 7.8% | Premier League ~4-5%; lower leagues 6-8% |
| Bookmaker margin (Asian handicap) | 1.8% | 3.2% | 4.5% | AH tighter than 1X2 — this is widely known by bettors |
| Odds movement magnitude (steam move) | 0.05 | 0.18 | 0.40 | From opening to closing line |
| Markets per fixture (major league) | 15 | 24 | 45+ | Bet365 offers 40+ markets per EPL match |
| Bookmakers tracked per fixture | 8 | 12 | 18 | Major leagues have more coverage |
| Implied probability — favorite (1X2) | 52% | 61% | 78% | After removing margin |
| Live fixtures (typical weekend afternoon) | 8 | 22 | 40 | Peak Saturday 2-5pm GMT saturates |
| Odds update frequency (in-play) | 2s | 8s | 30s | High-action moments trigger near-instant updates |

---

## Industry Terminology Glossary

| Term | Definition | Usage Context |
|------|-----------|---------------|
| 1X2 | Soccer match result market: 1 = home win, X = draw, 2 = away win | The primary bet type in soccer; labeled "Match Result" in most apps |
| Asian Handicap (AH) | Handicap bet that eliminates the draw by giving one team a fractional goal start/deficit | AH -1 means team must win by 2+ goals; AH +0.5 means team must not lose |
| Both Teams to Score (BTTS) | Market predicting whether both teams will score at least one goal | "Yes" = both score; "No" = at least one team blanks |
| Overround / Margin / Vig | Bookmaker profit margin embedded in odds (sum of all implied probabilities > 100%) | Displayed as %, tells bettors how much value they're giving up |
| Implied Probability | Percentage chance implied by odds: 1 / decimal odds | Core metric — 2.00 decimal = 50% implied probability |
| No-Vig Odds / Fair Odds | True odds with bookmaker margin removed — the mathematical fair line | Used in value bet calculators; Pinnacle is considered a "sharp" book |
| Closing Line Value (CLV) | Whether a bet placed before kickoff had better odds than the closing line | Gold standard for measuring bettor skill — positive CLV = profitable long-term |
| Line Movement | Change in odds from opening line to current (or closing) | "The line has moved from 1.90 to 1.75" — indicator of sharp action |
| Steam Move | Rapid, coordinated line movement by sharp bettors across multiple books simultaneously | Triggers alerts in odds-tracking tools |
| Reverse Line Movement | When lines move opposite to public betting percentages — indicates sharp money | Bullish signal for value bettors on the side the public is fading |
| Draw No Bet (DNB) | Bet where your stake is returned if the match ends in a draw | Reduces risk on 1X2; offered at lower odds than outright winner |
| Double Chance | Combined bet covering two of three possible 1X2 outcomes (1X, X2, or 12) | Often used to back strong favorites at lower odds |
| Accumulator / Acca | Multiple selections combined into a single bet; all must win | Common parlay structure in UK/EU; each leg's odds multiply |
| Same Game Parlay (SGP) | Multiple bets from the same fixture combined into a parlay | US-market term popularized by DraftKings/FanDuel |
| Outright / Futures | Bet on tournament winner, top scorer, or relegation placed before or during competition | Long-term market; settled at end of season/tournament |
| Betslip | Container showing selected bets, odds, stake, and potential return before confirmation | UI element in every sportsbook; also used as verb "add to betslip" |
| Early Price / EP | Odds released days before a fixture, before sharp money has moved the line | Typically better odds for value bettors; may come with max bet restrictions |
| Handicap | Artificial goal advantage/deficit applied before match starts | Spread equivalent in soccer betting |
| Half Time / Full Time | Combined market predicting both the half-time and full-time result | 9 possible outcomes (e.g., Home/Home, Away/Draw) |
| Correct Score (CS) | Exact final score prediction | High-odds market; 0-0, 1-0, 1-1, 2-0, 2-1, 2-2 most common lines |
| In-Play / Live Betting | Bets placed after a match has started, with real-time odds | Markets suspend briefly during goals, VAR reviews, red cards |
| Market Suspension | Temporary halt to betting on a market during in-play action | Triggered by goal, VAR, red card, injury timeout, or system events |
| Sharp / Square | Sharp = professional/data-driven bettor; Square = casual/public bettor | "Sharp action" is a bullish signal for value |
| Pinnacle | The reference sharp sportsbook — publishes the most accurate lines with lowest margins | Their closing line is used as the industry benchmark for CLV |

---

## Common Workflows

### Workflow 1: Pre-Match Odds Shopping

1. User opens app, sees list of upcoming fixtures organized by league
2. User filters to a specific league (e.g., Premier League) and kickoff window (e.g., next 24 hours)
3. User selects a fixture of interest (e.g., Arsenal vs. Manchester City)
4. App shows odds comparison grid: market types on left, bookmakers as columns, odds values in cells
5. Best odds in each row highlighted (visual prominence — different background color)
6. User toggles between Decimal / Fractional / American format
7. User identifies best odds for their selection (e.g., Arsenal win at 3.40 with Pinnacle vs. 3.20 elsewhere)
8. User taps bet — deep-links to bookmaker OR adds to internal bet tracker
9. User sets an odds alert: notify if Arsenal odds move above 3.50 (value threshold)

### Workflow 2: Live In-Play Tracking

1. User opens "Live In-Play" section — sees live fixture list with match clock, current score, and top-line odds
2. Fixture row shows: teams + score | elapsed time | 1X2 odds | animated indicator if odds recently changed
3. User taps a live fixture → full market view for in-play markets
4. Available markets reduced vs. pre-match (e.g., Correct Score suspended; Next Goal available)
5. Markets flash briefly when odds update (amber highlight on cell)
6. Market status badge shows "Suspended" when odds paused during goal/VAR
7. After event resolves, odds re-open (typically within 30-90 seconds)
8. User adds to betslip → bet confirmed with current odds locked at submission time

### Workflow 3: Value Bet Identification

1. User opens "Value Finder" or "Sharp Alerts" section
2. App compares best available odds against no-vig fair line (derived from Pinnacle or market consensus)
3. Fixtures where best odds imply a lower probability than the fair line are flagged as "Value"
4. Value percentage displayed: "4.3% edge" (best odds implied probability vs. fair implied probability)
5. User sorts by value percentage or filters by league
6. User reviews line movement chart: line drifted = market disagrees; line shortened = sharp action confirms
7. User decides whether to act or watchlist

---

## Common Edge Cases

1. **Suspended Market** — In-play fixture enters VAR review or penalty situation; market shows "Suspended" badge for 15-90 seconds; odds cells gray out; existing selections locked at pre-suspension odds
2. **Postponed Fixture** — Match not played as scheduled due to weather/pitch issues; all pre-match bets voided and stake returned; fixture shows "Postponed" status with originally scheduled time crossed out
3. **Abandoned Match** — Match started but stopped before completion (e.g., power outage, crowd disturbance); different bookmakers have different settlement rules (some void, some settle on score at time of abandonment); "Abandoned — Result Pending" status
4. **Odds Drift** — Heavily tipped favorite drifts from 1.55 to 1.85 before kickoff — injury news, team sheet, weather; shows red downward arrow on odds cell; value bettors may see opportunity
5. **Steam Move** — Rapid line compression: 2.10 → 1.78 across multiple books within 5 minutes; triggered by sharp syndicate action; shown as alert: "Steam Alert: Man City -1 AH"
6. **No Lines Available** — Smaller league fixture where only 2-3 books have odds; limited market depth; show "Limited Coverage" badge
7. **Very High Odds / Big Underdog** — Score predictor or long-shot winner at 25.00+ decimal odds; outlier value in correct score or exact scorer markets; important for data realism
8. **Same Game Parlay Restriction** — Certain correlated markets suspended for SGP (e.g., can't combine "Man City win" + "Man City Over 2.5 Goals" due to correlation); some books restrict these combinations

---

## What Would Impress a Domain Expert

1. **Asian Handicap line display uses quarter-goal increments** — Real AH markets go in 0.25 steps (−0.25, −0.5, −0.75, −1.0). Showing AH −0.5 and AH −1.0 is acceptable but showing AH −0.75 (a split handicap) and explaining it signals insider knowledge. A split handicap means half your stake goes on each adjacent line — this is unique to AH and separates genuine knowledge from surface familiarity.

2. **Margin calculation shown per-fixture** — Real odds traders track margin obsessively. Showing "Bookmaker Margin: 5.4%" on each fixture, calculated correctly from the three 1X2 outcomes (sum of 1/odds1 + 1/oddsX + 1/odds2 − 1), would immediately signal that the developer understands the math. Most developers show odds; few show the derived economics.

3. **Closing Line Value as a bettor metric** — Displaying CLV% (closing line value percentage) in a bet tracker context — comparing the odds you got vs. what the market closed at — is a deeply insider concept. "Your bet closed at +2.3% CLV" tells professional bettors their decision was validated by the market even if the bet lost. This is rarely implemented outside specialized pro-bettor tools.

4. **Pinnacle highlighted as the "sharp line"** — Among serious bettors, Pinnacle is the reference book — highest limits, lowest margins, accepts sharps. Highlighting Pinnacle's line in the odds comparison grid (e.g., with a crown icon or "Pinnacle Line" label) would signal knowledge of how the market actually works.

5. **Market suspension during in-play is treated as a state, not an error** — Novice devs treat "Suspended" as an error state and style it in red. Experienced bettors know suspension is normal (happens 5-10 times per in-play match). The correct treatment is a neutral gray badge with a countdown indicator — it resolves. Styling it correctly shows operational knowledge.

---

## Common Systems & Tools Used

- **The Odds API** — RESTful API providing odds from 40+ bookmakers across sports/leagues. Primary API reference for the client's project. Returns fixtures with bookmaker odds objects per market type.
- **OddsPortal** — Consumer odds comparison site; reference UI for multi-bookmaker odds grids
- **ActionNetwork** — US-focused odds tracking, public betting percentages, sharp movement indicators
- **Betfair Exchange** — Peer-to-peer betting exchange; provides true market prices (no margin) used as fair line reference
- **Pinnacle Sportsbook** — Professional bookmaker with the sharpest closing lines; used as CLV benchmark
- **SBObet / Maxbet** — Asian market operators; important for Asian Handicap line reference
- **OddsJam / Pikkit** — Tools for positive expected value (+EV) betting; show no-vig fair lines vs. best available
- **Sofascore / FlashScore** — Live match data, lineups, and stats APIs commonly used alongside odds APIs
- **Sportradar / Stats Perform** — Enterprise-level sports data feeds for match statistics, lineups, injuries

---

## Geographic / Cultural Considerations

This is a globally-facing soccer application. Key geographic considerations:

- **Odds format by region**: Europe (UK, continental) defaults to Decimal or Fractional. UK specifically uses Fractional (e.g., 5/2). North America expects American (moneyline) format. App must support format toggle with a clear control.
- **Terminology variation**: UK says "accumulator" (acca); US says "parlay". UK says "bookmaker"; US says "sportsbook". UK says "punt"; US says "bet". For a cross-platform app likely targeting US or international bettors, use US/international terms where they differ.
- **Regulatory landscape**: Sports betting legality varies significantly — illegal in many countries, heavily regulated in others. The demo is for a data/odds aggregation app (not a sportsbook), which is less regulated, but any mock "place bet" CTA should be framed as "View at Bookmaker" or "Track Bet" — not as actual bet placement.
- **Currency**: Show GBP (£) for UK leagues; EUR (€) for European leagues; USD ($) for US context. Mock data stakes should be realistic: £10-£50 casual punter range, not $1,000 bets.
- **Kickoff times**: European fixtures cluster at Saturday 12:30, 15:00, 17:30 GMT (EPL) and midweek 20:00 CET (UCL). US market fixtures (MLS) are Eastern/Pacific evenings. Time zone handling is an explicit UX consideration.
- **Seasonal context**: European club soccer season is August–May. Champions League group stage October–December, knockouts Feb–May. International tournaments (World Cup, Euros) every 2 years — 2026 World Cup is active context.

---

## Data Architect Notes

**Entity / dataset structure:**

1. **Fixtures dataset** (18-20 items) — fields: `fixtureId`, `leagueId`, `homeTeam`, `awayTeam`, `kickoffTime` (ISO 8601), `status` (Scheduled / In-Play / Half Time / Full Time / Postponed / Abandoned / Suspended), `homeScore` (nullable for upcoming), `awayScore` (nullable), `elapsed` (minutes string, null for pre-match), `featuredMarket` (string), `bookmakerCount` (integer 8-16)

2. **Leagues dataset** (10 items) — fields: `leagueId`, `name` (full name), `shortCode` (EPL/UCL/LaLiga), `country`, `logoColor` (for badge), `activeFixtures` (count)

3. **Bookmakers dataset** (12 items) — fields: `bookmakerId`, `name`, `region` (UK/EU/US/Global), `marginAvg` (%, e.g., 4.8), `isSharp` (boolean — Pinnacle = true), `logoColor`

4. **Odds dataset** — per fixture × per market × per bookmaker (use a nested structure: `fixture.markets[marketKey].bookmakers[bookmakerId].outcomes`). Realistic decimal odds for each outcome. Include at least 3 market types per fixture (h2h, totals, btts minimum).

5. **Odds movements dataset** (historical) — time-series of odds changes for 4-6 fixtures (opening → current → closing). Used for line movement chart. 8-12 data points per fixture, timestamped at irregular intervals. Include at least one steam move (rapid compression) and one drift.

6. **Bet tracker dataset** (10-12 mock bet records) — fields: `betId`, `fixtureId`, `market`, `selection`, `oddsPlaced` (decimal), `oddsClosing` (nullable), `stake` (£ or $, realistic: £5–£50), `status` (Pending / Won / Lost / Void / Cash Out), `clv` (closing line value %, nullable), `returns` (nullable, calculated)

**Status string conventions — use exactly these strings:**
- Fixture status: `"Scheduled"`, `"In-Play"`, `"Half Time"`, `"Extra Time"`, `"Full Time"`, `"Postponed"`, `"Abandoned"`, `"Suspended"`, `"Cancelled"`
- Market status: `"Open"`, `"Suspended"`, `"Settled"`, `"Void"`
- Bet status: `"Pending"`, `"Won"`, `"Lost"`, `"Void"`, `"Cashed Out"`
- Odds movement: `"Shortened"`, `"Drifted"`, `"Steam"`, `"Stable"`, `"Early Price"`

**Metric ranges for field values:**
- Decimal odds: favorites 1.15–1.90, picks 1.90–2.40, underdogs 2.50–8.00, longshots 8.00–25.00
- Draw odds: 2.90–3.80 (rarely outside this band in major leagues)
- Bookmaker margin per fixture: 3.5%–7.8% (use formula: (1/h + 1/d + 1/a − 1) × 100)
- Stake amounts (mock bet tracker): £5, £10, £15, £20, £25, £30, £50 (realistic punter stakes)
- CLV values: −3.5% to +6.2% (most bets close between −2% and +2%; +4%+ is exceptional)
- Markets per fixture: 14–38 (EPL fixtures have more)

**Edge cases to include as specific records:**
- One fixture with status `"Postponed"` and all bets on it showing `"Void"`
- One fixture with status `"In-Play"` and at least one market with status `"Suspended"`
- One odds movement record showing a steam move: 2.10 → 1.75 in 6 minutes
- One bet with status `"Lost"` but CLV `+2.8%` (correct process, wrong outcome — insider concept)
- One fixture with `bookmakerCount: 3` (low coverage — smaller league)
- One bet with status `"Cashed Out"` at partial return (e.g., £28.50 on a £20 stake)

**Date patterns:** Fixtures should cluster on Saturday and Sunday (peak EPL days), midweek Tuesday/Wednesday (Champions League), with some scattered weekday fixtures. Kickoff times should realistically be 12:30, 15:00, 17:30 (Saturday EPL) and 20:00 (UCL midweek). Time zone: GMT/UTC for base, convert to user's local in the UI.

---

## Layout Builder Notes

**Density:** Compact. This is a data-intensive domain — fixture rows should be tight (8-10px vertical padding), equivalent to how bet365 or OddsPortal display their fixture lists. A user should see 6-8 fixtures per screen height without scrolling. Use `--content-padding: 1rem` and `--nav-item-py: 0.375rem`.

**Sidebar width:** Standard (16rem). Navigation labels are short ("Match Centre", "Odds Board", "Live In-Play"). Slimmer (14rem) is acceptable if an icon-label pattern is used.

**Dark background tones:**
- Primary background: `oklch(0.10 0.02 {hue})` or `oklch(0.12 0.03 {hue})` — near-black with slight color cast
- Sidebar: slightly lighter than main bg, not the same: `oklch(0.14 0.03 {hue})`
- Cards/panels: `oklch(0.16 0.02 {hue})` — differentiated from bg without harsh contrast

**Color primary suggestion:** Deep green (bet365 convention) at `oklch(0.58 0.18 145)` with `--primary-h: 145` OR deep violet at `oklch(0.55 0.20 285)`. Either reads as "soccer betting premium." Avoid electric blue (reads as crypto/fintech, not soccer). Avoid red (reads as warning/loss in this domain — reserve for odds movement down/loss states).

**Status badge patterns bettors expect:**
- Live/In-Play: pulsing green dot + "Live" text — this is table stakes, must exist
- Suspended: neutral gray badge — NOT red (not an error; it's normal state)
- Value bet: amber/gold badge — "Value" tag
- Steam alert: bright orange/amber flash — "Steam" badge

**Odds movement direction coding:**
- Shortened (odds got shorter/better for that side): green text/arrow up
- Drifted (odds got longer): red text/arrow down
- This is REVERSED from typical business dashboards (where green = revenue up). In odds, shorter = more confident market, drifted = weakening position.

**Typography:** Monospace/tabular numerals on all odds values is non-negotiable. Odds like "1.87" and "12.50" must align on decimal point across rows. Use `font-variant-numeric: tabular-nums` or Geist Mono on odds cells. Match clock (elapsed time) also monospace.

---

## Dashboard Builder Notes

**The single most important metric for this domain (largest stat card):**
**Live Fixtures** — number of in-play matches right now. This is the first thing a bettor checks when opening the app. Large number, pulsing green dot beside it.

**Recommended primary chart type:**
Bar chart for "Fixtures by League Today" (category comparison — how many EPL, UCL, La Liga games today). Secondary: Line chart for "Odds Movement" on a selected fixture over time (time-series, 8-12 points, shows opening to current line).

**Dashboard composition (domain-driven, not generic 4+1+1):**
1. **Top KPI row:** Live Fixtures (large) | Today's Fixtures | Markets Tracked | Avg Margin (%)
2. **Live In-Play panel** — compact list of currently live fixtures with score, clock, and 1X2 odds inline. Pulsing dots on each row. This is the centerpiece — not a chart.
3. **Upcoming Fixtures panel** — next 12-24 hours, grouped by league, with inline best odds. Fixtures sortable by kickoff time.
4. **Odds Movement chart** — line chart showing how selected fixture's top odds have moved from opening to now. Allow fixture selector.
5. **Value Alerts strip** — horizontal scrollable list of 3-5 value bet flags (fixtures where best odds beat no-vig line), each with team names + value % badge.

**Domain-specific panel that would impress a practitioner:**
An **Odds Board** for a featured fixture — showing a mini 3×N grid (Home/Draw/Away rows × 4-6 bookmakers as columns) with the best odds cell highlighted in a distinct color. This is exactly how OddsPortal displays odds and is immediately recognizable to anyone who has used a serious odds comparison tool. Put it in the dashboard as a "Featured Match" card.
