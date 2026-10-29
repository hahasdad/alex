# Hongbo Hao — responsive portfolio

Unzip the folder, then open **index.html** in a current browser. No installation, server, build step, or internet connection is required. Keep the HTML, CSS, JavaScript, fonts, and assets together.

## Included pages

| File | Figma node | Content |
|---|---|---|
| index.html | 25:194 | Home |
| about.html | 25:239 | About the King |
| works.html | 25:247 | Three selected projects |
| film.html | 25:262 | The Making of a Film |
| 2fa-flowchart.html | Not in Figma | Provisional 2FA diagram |

Source design: https://www.figma.com/design/1OwPNdyXJxj9jeyeU1fqkf/web

The original Figma artwork is saved locally in assets/. Typography is bundled locally. Font licenses are in licenses/. The downloaded artwork remains subject to its owner's rights.

## Interactions

- Home, about, works, the H monogram, scroll-to-explore, and back navigate between pages.
- The film project opens the supplied detail design. The other two projects open accessible dialogs containing only the descriptions supplied in Figma.
- The film's central play button opens a local video picker. Choose a browser-supported video to play with native playback, seek, volume, and fullscreen controls. Files stay on your device. Escape or the close button closes the dialog and pauses playback.
- Visible player controls in the original artwork are part of a single supplied PNG. They are preserved as reference artwork; real playback controls appear after selecting a file. No actual film or remote video URL was supplied.

## Missing PRD and provisional 2FA diagram

The referenced conversation returned no attachments, and the workspace contained no PRD. The four Figma nodes describe a personal portfolio and contain no authentication requirements.

**2fa-provisional.svg** and **2fa-provisional.mmd** are explicitly illustrative drafts. They are not PRD-grounded, and none of their steps should be treated as confirmed product requirements. Enrollment, supported factors, conditions for requiring 2FA, expiry, retry limits, recovery, and trusted-device behavior all require the PRD. No authentication backend or simulated login was added to the portfolio.

Provide the PRD to replace the provisional diagram with a traceable requirements-based flow.

## Implementation and validation

Plain HTML, CSS, and JavaScript. styles.css contains page and responsive styling; layers.css preserves Figma artwork placement; fonts.css references local font files. The decorative desktop composition scales with the viewport. Phone layouts adjust typography, spacing, and ornamental frames for readability; these adaptations were not provided as separate mobile Figma designs.

Checked in Microsoft Edge at desktop and phone widths: all images load, fonts load locally, no horizontal page overflow, navigation and dialog interactions work, and no JavaScript errors were observed. This is a front-end implementation, with no server integration. Additional project content and the film itself remain to be supplied.
