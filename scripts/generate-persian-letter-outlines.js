const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const ROOT = path.resolve(__dirname, '..');
const FONT_PATH = process.argv[2] || path.join(ROOT, 'node_modules/@expo-google-fonts/vazirmatn/Vazirmatn_800ExtraBold.ttf');
const OUT_FILE = path.join(ROOT, 'src', 'data', 'persianLetterOutlines.generated.ts');

const LETTERS = [
  ['alef', 'ا'],
  ['be', 'ب'],
  ['pe', 'پ'],
  ['te', 'ت'],
  ['se', 'ث'],
  ['jim', 'ج'],
  ['che', 'چ'],
  ['haa', 'ح'],
  ['khe', 'خ'],
  ['dal', 'د'],
  ['zal', 'ذ'],
  ['re', 'ر'],
  ['ze', 'ز'],
  ['zhe', 'ژ'],
  ['sin', 'س'],
  ['shin', 'ش'],
  ['sad', 'ص'],
  ['zad', 'ض'],
  ['taa', 'ط'],
  ['zaa', 'ظ'],
  ['eyn', 'ع'],
  ['gheyn', 'غ'],
  ['fe', 'ف'],
  ['ghaf', 'ق'],
  ['kaf', 'ک'],
  ['gaf', 'گ'],
  ['lam', 'ل'],
  ['mim', 'م'],
  ['nun', 'ن'],
  ['vav', 'و'],
  ['heh', 'ه'],
  ['ye', 'ی'],
];

const VIEW = 200;
const PAD = 18;

function serialize(commands) {
  return commands
    .map(cmd => {
      if (cmd.type === 'M' || cmd.type === 'L') {
        return `${cmd.type} ${fmt(cmd.x)} ${fmt(cmd.y)}`;
      }
      if (cmd.type === 'Q') {
        return `Q ${fmt(cmd.x1)} ${fmt(cmd.y1)} ${fmt(cmd.x)} ${fmt(cmd.y)}`;
      }
      if (cmd.type === 'C') {
        return `C ${fmt(cmd.x1)} ${fmt(cmd.y1)} ${fmt(cmd.x2)} ${fmt(cmd.y2)} ${fmt(cmd.x)} ${fmt(cmd.y)}`;
      }
      if (cmd.type === 'Z') {
        return 'Z';
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
}

function fmt(n) {
  return Number.isFinite(n) ? Number(n.toFixed(1)) : 0;
}

function normalizePath(font, char) {
  const glyph = font.charToGlyph(char);
  const pathObj = glyph.getPath(0, 0, font.unitsPerEm);
  const bbox = glyph.getBoundingBox();
  const width = Math.max(1, bbox.x2 - bbox.x1);
  const height = Math.max(1, bbox.y2 - bbox.y1);
  const scale = Math.min((VIEW - PAD * 2) / width, (VIEW - PAD * 2) / height);
  const xOffset = (VIEW - width * scale) / 2;
  const yOffset = (VIEW - height * scale) / 2;

  const commands = pathObj.commands.map(cmd => {
    const mapPoint = (x, y) => ({
      x: (x - bbox.x1) * scale + xOffset,
      y: (bbox.y2 - y) * scale + yOffset,
    });
    if (cmd.type === 'M' || cmd.type === 'L') {
      return { type: cmd.type, ...mapPoint(cmd.x, cmd.y) };
    }
    if (cmd.type === 'Q') {
      const p1 = mapPoint(cmd.x1, cmd.y1);
      const p = mapPoint(cmd.x, cmd.y);
      return { type: 'Q', x1: p1.x, y1: p1.y, x: p.x, y: p.y };
    }
    if (cmd.type === 'C') {
      const p1 = mapPoint(cmd.x1, cmd.y1);
      const p2 = mapPoint(cmd.x2, cmd.y2);
      const p = mapPoint(cmd.x, cmd.y);
      return { type: 'C', x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, x: p.x, y: p.y };
    }
    return { type: 'Z' };
  });

  return serialize(commands);
}

function main() {
  const font = opentype.parse(fs.readFileSync(FONT_PATH).buffer);
  const lines = [
    '// Auto-generated from the Vazirmatn font outline using opentype.js.',
    '// Regenerate with: node scripts/generate-persian-letter-outlines.js',
    '',
    'export const PERSIAN_LETTER_OUTLINES = {',
  ];

  for (const [id, char] of LETTERS) {
    lines.push(`  ${JSON.stringify(id)}: ${JSON.stringify(normalizePath(font, char))},`);
  }
  lines.push('} as const;');
  lines.push('');
  fs.writeFileSync(OUT_FILE, lines.join('\n'), 'utf8');
}

main();
