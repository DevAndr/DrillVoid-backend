export class SciFiNameGenerator {
  private static roots = [
    'Astra',
    'Xero',
    'Kry',
    'Zel',
    'Vex',
    'Tal',
    'Thal',
    'Vor',
    'Nex',
    'Qor',
    'Omni',
    'Helio',
    'Elys',
    'Cyra',
    'Teth',
    'Ophi',
    'Zor',
    'Nyx',
    'Sol',
    'Vira',
    'Lux',
    'Pyra',
    'Cer',
    'Fer',
    'Ira',
    'Mora',
    'Aure',
    'Rhae',
    'Vorn',
  ];

  private static suffixes = [
    'us',
    'ion',
    'aeon',
    'ium',
    'ora',
    'ex',
    'ax',
    'ra',
    'on',
    'eth',
    'ara',
    'yx',
  ];

  private static modifiers = [
    'Prime',
    'Minor',
    'Delta',
    'Gamma',
    'Sigma',
    'Epsilon',
    'Omega',
    'Alpha',
    'Proto',
  ];

  private static roman = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
  ];

  private static random<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static generate(rand: () => number): string {
    const p = this.roots[Math.floor(rand() * this.roots.length)];
    const m = this.suffixes[Math.floor(rand() * this.suffixes.length)];
    const s = this.modifiers[Math.floor(rand() * this.modifiers.length)];

    let num = '';

    const chanceRoman = rand() % 100;

    if (chanceRoman > 0.7) {
      num = ' - ' + this.roman[Math.floor(rand() * this.roman.length)];
    }

    return p + m + ' ' + s + num;
  }
}
