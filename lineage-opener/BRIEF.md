---
workflow: general-video
flow: automation
storyboard: yes
message: "Fourteen airport hubs went down. The paper trail ends at a file update, not an attack."
destination: pitch
aspect: 1920x1080
language: en
audience: "People about to watch the PlaceWire pitch"
length: 30s
angle: narrative
---

## Intent

A 30-second opener that plays before the product pitch. A phone alert carries a catchy headline, the film asks why it happened, and a receipt prints the lineage out of the phone. PlaceWire is the name on that receipt. The lineage is the body of the film. The drift is one closing line: the trail ends at a file update, and the headline called it an attack.

The mix is the phone-alert opening with PlaceWire as the answer. Easily understandable. No tour of the app.

## Assets

- frontend/src/index.css — PlaceWire color and type. Paper #F4F7F8, ink #1B2428, thread #C4552A, Atkinson Hyperlegible. The video uses these, not a separate preset.
- assets/fonts/atkinson-hyperlegible-400.woff2 — body weight of that face.
- assets/fonts/atkinson-hyperlegible-700.woff2 — display weight of that face.
- backend/app/data/flagship_story.json — the outage demo the four receipt lines are taken from.

## Customizations

- The phone alert is the cold open. The receipt that prints out of it is the lineage.
- Each scene uses a proven reveal: the alert clears, the question prints, each report prints, the name stamps. Nothing keeps moving after it lands.
- Printer ticks on each receipt line. One notification hit on the alert. One stamp when PlaceWire lands. No music bed. No voiceover.
- Drift stays a single muted line under the closing sentence.

## Notes

- Four receipt lines, not the whole archive: 2021 kernel telemetry moves into the system; 2023 new rules, no new signed program; 04:09 Channel File 291 goes out; the headline calls it an attack.
- Alert copy: "Worldwide IT outage. A hostile cyber crisis. Indefinitely."
- Closing copy: "The trail ends at a file update." Then, smaller: "The headline called it an attack."
- Review the stills on the live board before animation.
