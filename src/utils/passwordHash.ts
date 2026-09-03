export function createPasswordSalt() {
  return `${Date.now().toString(36)}-${Array.from({ length: 4 }, () => Math.floor(Math.random() * 0xffffffff).toString(36)).join('-')}`;
}

export function derivePasswordVerifier(password: string, salt: string) {
  const source = `${salt}:${password}`;
  const seeds = [0x811c9dc5, 0x9e3779b9, 0x85ebca6b, 0xc2b2ae35];
  const values = seeds.map(seed => {
    let hash = seed >>> 0;
    for (let round = 0; round < 12000; round += 1) {
      for (let index = 0; index < source.length; index += 1) {
        hash ^= source.charCodeAt(index) + round;
        hash = Math.imul(hash, 0x01000193);
        hash ^= hash >>> 13;
      }
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  });
  return values.join('');
}
