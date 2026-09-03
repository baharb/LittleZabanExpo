# Farsi Tracing

This screen keeps the existing route and UI, but swaps the tracing engine to a two-layer glyph model:

- `outlinePath` is the visible letter shape.
- `strokes[]` contains the curated centerline tracing paths.

The tracer renders the outline as a white glyph, then clips the guide and traced progress strokes inside that shape so the fill stays inside the letter.

## Data

`src/data/farsiLetters.ts` is the source of truth for the screen. Each letter includes:

- `outlinePath`
- one or more tracing strokes
- optional dot targets
- example text and color metadata

## Generated assets

- `src/data/persianLetterOutlines.generated.ts`
  - generated from Vazirmatn outlines with `scripts/generate-persian-letter-outlines.js`
- `src/data/vazirmatnTracePaths.generated.ts`
  - generated centerline tracing paths used by the screen

The generated centerlines are still approximations and can be replaced later with hand-authored teaching paths.

## Useful scripts

- `node scripts/generate-persian-letter-outlines.js`
- `python scripts/generate-vazirmatn-trace-paths.py`

## Notes

- The app does not generate perfect centerlines at runtime.
- The current implementation is designed to be easy to replace letter-by-letter later without changing the screen route or navigation.
