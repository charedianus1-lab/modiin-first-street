# מודיעין עילית · משחק דפדפן

Original 3D browser-game prototype. Real OpenStreetMap road-centerline basis in Brachfeld, Modiin Illit; buildings, elevation and street furniture are approximate procedural scenery, not a surveyed replica. No GTA assets or affiliation.

Phone: left joystick moves. Drag right side to look. Buttons: run toggle, jump, kick, shoot, vehicle enter/exit. Approach the blue car to enter. Joystick steers and accelerates/reverses while driving. Shooting is non-graphic and can hit yellow practice targets.

Keyboard: WASD/arrows move, Shift runs, Space jumps, Q kicks, F shoots, E enters/exits.

Serve this directory as a static website. index.html loads v2-part*.js and decompresses the embedded HTML. No runtime CDN, backend or tracking. v2.html is the separate staging entry. game-v2.js is readable source using Three.js; assets and bundled dependencies are embedded in the compressed deployment. Concatenate the quoted part strings, base64-decode, gzip-decompress to inspect complete executable HTML.

Map data: © OpenStreetMap contributors, ODbL 1.0. https://www.openstreetmap.org/copyright . geography.json is the extracted/transformed road data, offered under ODbL. Source endpoint and origin coordinates are in that file.

Original procedural environment. Microsoft Businessman 01 and idle/walk/run clips: Copyright (c) 2020 Microsoft, MIT. Three.js: MIT. See THIRD-PARTY-NOTICES.txt.

Tested at mobile-shaped sizes, not on a physical phone. Early prototype, not a full GTA-style game.
