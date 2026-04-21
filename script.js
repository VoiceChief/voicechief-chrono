const textarea = document.getElementById('sourceText');

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

function formatTime(seconds) {
  if (!seconds || seconds < 60) return `${seconds || 0} сек`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs ? `${mins} мин ${secs} сек` : `${mins} мин`;
}

// 🔥 НОРМАЛЬНАЯ ФУНКЦИЯ ДЛЯ ЧИСЕЛ
function numberToWords(num) {
  num = String(num).replace(/\s/g, '');
  if (!/^\d+$/.test(num)) return num;
  if (num === '0') return 'ноль';

  const unitsMale = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
  const unitsFemale = ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];

  const teens = ['десять','одиннадцать','двенадцать','тринадцать','четырнадцать','пятнадцать','шестнадцать','семнадцать','восемнадцать','девятнадцать'];

  const tens = ['', '', 'двадцать','тридцать','сорок','пятьдесят','шестьдесят','семьдесят','восемьдесят','девяносто'];

  const hundreds = ['', 'сто','двести','триста','четыреста','пятьсот','шестьсот','семьсот','восемьсот','девятьсот'];

  const scales = [
    ['', '', '', 'm'],
    ['тысяча', 'тысячи', 'тысяч', 'f'],
    ['миллион', 'миллиона', 'миллионов', 'm'],
    ['миллиард', 'миллиарда', 'миллиардов', 'm']
  ];

  function getPlural(n, one, two, five) {
    n = n % 100;
    if (n >= 11 && n <= 14) return five;
    n = n % 10;
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return two;
    return five;
  }

  function triadToWords(n, gender) {
    let result = [];
    let h = Math.floor(n / 100);
    let t = Math.floor((n % 100) / 10);
    let u = n % 10;

    if (h) result.push(hundreds[h]);

    if (t === 1) {
      result.push(teens[u]);
    } else {
      if (t) result.push(tens[t]);
      if (u) result.push(gender === 'f' ? unitsFemale[u] : unitsMale[u]);
    }

    return result;
  }

  let parts = [];

  let chunks = num
    .split('')
    .reverse()
    .join('')
    .match(/.{1,3}/g)
    .map(x => x.split('').reverse().join(''))
    .reverse();

  chunks.forEach((chunk, i) => {
    let n = parseInt(chunk);
    if (!n) return;

    let scaleIndex = chunks.length - i - 1;
    let scale = scales[scaleIndex];

    let words = triadToWords(n, scale[3]);
    parts.push(...words);

    if (scaleIndex > 0) {
      parts.push(getPlural(n, scale[0], scale[1], scale[2]));
    }
  });

  return parts.join(' ').trim();
}

// 🔥 ВАЖНО: внутренняя версия текста
function expandNumbers(text) {
  return text.replace(/\b\d[\d ]*\b/g, num => {
    return numberToWords(num.replace(/\s/g, ''));
  });
}

function calculate() {
  const originalText = textarea.value;

  // 👉 скрытая версия для расчёта
  const calculatedText = expandNumbers(originalText);

  const symbols = originalText.length;
  const cleanSymbols = calculatedText.replace(/\s/g, '').length;
  const words = countWords(originalText);

  const timing = Math.round(cleanSymbols / 14.1);
  const fast = Math.round(cleanSymbols / 16.4);
  const slow = Math.round(cleanSymbols / 11.8);
  const pages = +(symbols / 2000).toFixed(1);

  document.getElementById('timingMain').textContent = formatTime(timing);
  document.getElementById('timingFast').textContent = formatTime(fast);
  document.getElementById('timingSlow').textContent = formatTime(slow);

  document.getElementById('wordsCount').textContent = words;
  document.getElementById('symbolsCount').textContent = symbols;
  document.getElementById('cleanSymbolsCount').textContent = cleanSymbols;
  document.getElementById('pagesCount').textContent = pages;
}

textarea.addEventListener('input', calculate);
calculate();
