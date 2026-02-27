Hi,

Cross-platform odds display with live API data is the part most React Native MVPs get wrong — I built a working version for your use case before reaching out: https://soccer-odds-mvp.vercel.app

The demo covers real-time odds rendering, match filtering, and the kind of clean, responsive layout your design specs describe. Previously built a live API monitor with sub-minute alert delivery, so I know where the polling-vs-WebSocket tradeoffs bite you.

One question before scoping: does your Odds API push updates via WebSocket or does the app need to poll? That changes the data layer significantly.

10-minute call or I can scope the first sprint in a doc — your pick.

Humam
