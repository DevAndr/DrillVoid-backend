class SciFiNameGenerator {
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

  static generate(seed: string): string {
    // привязываем случайность к seed
    const num = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

    const root = this.roots[num % this.roots.length];
    const suffix = this.suffixes[num % this.suffixes.length];

    let name = root + suffix;

    // 40% шанс на модификатор
    if (num % 100 < 40) {
      name += ' ' + this.random(this.modifiers);
    }

    // 40% шанс на римскую цифру
    if (num % 100 > 60) {
      name += ' ' + this.random(this.roman);
    }

    // 30% шанс на код
    if (num % 10 < 3) {
      name += '-' + ((num % 900) + 100).toString();
      if (num % 5 === 0) {
        name += String.fromCharCode(97 + (num % 5)); // 'a' - 'e'
      }
    }

    return name;
  }
}
