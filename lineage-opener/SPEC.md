GOAL:    A viewer who just saw a screaming outage headline asks why, then can point at the earlier reports that led to it.
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps
TIME:    30 s x 30 fps = 900 frames. No music bed, so no BPM.
LOOK:    Ground #F4F7F8, flat, no grain, no vignette. Ink #1B2428. Muted #3E4C51. Hairline #D5DEE2.
         Accent #C4552A only on the lineage thread, the word "Indefinitely.", the date of the live line, and the PlaceWire rule.
         Display and body: Atkinson Hyperlegible. Alert headline 48–64 px / 700. "Why?" 300 px / 700 / tracking -0.045em.
         Receipt sentences 44 px / 400, live line 64 px / 700, closing line 52 px / 700.
         Medium: a phone (ink-colored body, 14 px bezel, 48 px outer radius, speaker slot) and a white thermal receipt
         (shadow 0 18 px 32 px rgba(27,36,40,0.14)) that feeds out of the phone's bottom slot.
         The orange thread is a 6 px rule beside the printed lines, as long as the lines that exist.
OBJECTS: the phone with the lock-screen alert; the receipt; the orange thread; the PlaceWire name printed at the head of the receipt.
MOTION:  Alert arrives with an 8 px blur clearing in 8 frames, expo.out, then holds dead still.
         "Why?" prints word-blur in 6 frames, power4.out, no slide. Phone shifts left in 14 frames, power3.inOut, as the question lands.
         Each receipt line prints in 10 frames, power4.out, staggered 8 frames, with the thread growing at the same time, linear.
         The live line (Channel File 291) scales 0.96 to 1 in 12 frames, expo.out. No bounce.
         PlaceWire stamps in 8 frames, power4.out. Closing line holds at least 2 s.
         One hero move per shot. Nothing keeps moving after it lands.
SHOTS:   0–120 (0–4s) alert. Hero: the phone and its headline. Read "Worldwide IT outage. / A hostile cyber crisis. / Indefinitely." (0.6–3.6s). Sound: one notification hit at 0.5s. Handoff: the phone is still there when the question arrives.
         120–240 (4–8s) why. Hero: "Why?" Read the word (4.3–7.4s). Sound: one soft key tick as the word lands. Handoff: paper starts leaving the phone slot.
         240–420 (8–14s) first reports. Hero: the receipt. Read 2021 (8.4–10.4s), then 2023 (10.6–13.4s). Sound: printer ticks on each line. Handoff: the thread keeps growing.
         420–600 (14–20s) the file. Hero: "Channel File 291 goes out". Read it (14.4–18.6s). Sound: one heavier tick. Handoff: the thread reaches the headline line.
         600–750 (20–25s) the headline joins the trail. Hero: "The headline calls it an attack". Read it (20.4–24.4s). Sound: one printer tick. Handoff: the name stamps the same paper.
         750–900 (25–30s) PlaceWire. Hero: the name, then "The trail ends at a file update." Read the name (25.2–26.6s) and the closing line (26.8–30s). The muted line under it is the only drift. Sound: one stamp as the name lands, then quiet.
BANNED:  dark void; glow; purple or blue gradients; glass cards; cream paper with a serif and numbered labels;
         everything centred; fade-and-slide-up on every element; type that keeps drifting after it lands;
         corner HUD; three cards; a logo docked in the corner; a full product tour; a second scene for the drift;
         a music bed (declined); voiceover.
QA:      f60 the alert is a phone, "Indefinitely." is orange, nothing else is. f165 "Why?" is still and the phone is still on screen.
         f330 two lineage lines, thread only as long as those lines. f510 the file line is the largest type on the receipt.
         f675 four lines, the fourth is the headline's claim. f840 PlaceWire is on the receipt, the closing line is readable, the drift line is smaller and muted.
