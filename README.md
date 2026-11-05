# הרחוב הראשון

Original small 3D mobile-browser walking prototype, inspired by Modiin Illit. One fictional street and a clothed animated character. No GTA assets or affiliation.

Left joystick: walk. Drag right side: look. WASD/arrows on computer. Reset and fullscreen controls at bottom right.

Serve this directory with any static web server. index.html loads the part*.js files, joins their base64 strings and decompresses the self-contained HTML using the browser gzip DecompressionStream. The complete game code and licensed assets are in that decompressed HTML, with no runtime CDN dependency. To inspect the code, concatenate the quoted part strings, base64-decode, and gzip-decompress.

Original procedural environment. Businessman 01 and idle/walk clips: Copyright (c) 2020 Microsoft, MIT. Three.js: MIT. Full notices in THIRD-PARTY-NOTICES.txt.

Tested in a mobile-shaped browser, not on a physical phone. This is an early walking prototype, not a full GTA-style game.
