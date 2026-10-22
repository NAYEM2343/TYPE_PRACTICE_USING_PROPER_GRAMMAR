if (typeof tailwind !== 'undefined') {
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
              mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
            }
          }
        }
      };
    }

/**
 * TypeWise — Core Typing, Statistics, Letter Frequency, and Grammar Diagnostics Engine
 * Pure, deterministic, testable functions used by both the browser UI and automated Node.js tests.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TypeWiseEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Standard QWERTY layout rows for keyboard rendering & heatmap analytics
  const QWERTY_ROWS = [
    [
      { code: 'Backquote', key: '`', shift: '~', label: '` ~' },
      { code: 'Digit1', key: '1', shift: '!', label: '1 !' },
      { code: 'Digit2', key: '2', shift: '@', label: '2 @' },
      { code: 'Digit3', key: '3', shift: '#', label: '3 #' },
      { code: 'Digit4', key: '4', shift: '$', label: '4 $' },
      { code: 'Digit5', key: '5', shift: '%', label: '5 %' },
      { code: 'Digit6', key: '6', shift: '^', label: '6 ^' },
      { code: 'Digit7', key: '7', shift: '&', label: '7 &' },
      { code: 'Digit8', key: '8', shift: '*', label: '8 *' },
      { code: 'Digit9', key: '9', shift: '(', label: '9 (' },
      { code: 'Digit0', key: '0', shift: ')', label: '0 )' },
      { code: 'Minus', key: '-', shift: '_', label: '- _' },
      { code: 'Equal', key: '=', shift: '+', label: '= +' },
      { code: 'Backspace', key: 'Backspace', label: 'Bksp', wide: 'w-20' }
    ],
    [
      { code: 'Tab', key: 'Tab', label: 'Tab', wide: 'w-14' },
      { code: 'KeyQ', key: 'q', shift: 'Q', label: 'Q', isLetter: true },
      { code: 'KeyW', key: 'w', shift: 'W', label: 'W', isLetter: true },
      { code: 'KeyE', key: 'e', shift: 'E', label: 'E', isLetter: true },
      { code: 'KeyR', key: 'r', shift: 'R', label: 'R', isLetter: true },
      { code: 'KeyT', key: 't', shift: 'T', label: 'T', isLetter: true },
      { code: 'KeyY', key: 'y', shift: 'Y', label: 'Y', isLetter: true },
      { code: 'KeyU', key: 'u', shift: 'U', label: 'U', isLetter: true },
      { code: 'KeyI', key: 'i', shift: 'I', label: 'I', isLetter: true },
      { code: 'KeyO', key: 'o', shift: 'O', label: 'O', isLetter: true },
      { code: 'KeyP', key: 'p', shift: 'P', label: 'P', isLetter: true },
      { code: 'BracketLeft', key: '[', shift: '{', label: '[ {' },
      { code: 'BracketRight', key: ']', shift: '}', label: '] }' },
      { code: 'Backslash', key: '\\', shift: '|', label: '\\ |', wide: 'w-14' }
    ],
    [
      { code: 'CapsLock', key: 'CapsLock', label: 'Caps', wide: 'w-16' },
      { code: 'KeyA', key: 'a', shift: 'A', label: 'A', isLetter: true },
      { code: 'KeyS', key: 's', shift: 'S', label: 'S', isLetter: true },
      { code: 'KeyD', key: 'd', shift: 'D', label: 'D', isLetter: true },
      { code: 'KeyF', key: 'f', shift: 'F', label: 'F', isLetter: true },
      { code: 'KeyG', key: 'g', shift: 'G', label: 'G', isLetter: true },
      { code: 'KeyH', key: 'h', shift: 'H', label: 'H', isLetter: true },
      { code: 'KeyJ', key: 'j', shift: 'J', label: 'J', isLetter: true },
      { code: 'KeyK', key: 'k', shift: 'K', label: 'K', isLetter: true },
      { code: 'KeyL', key: 'l', shift: 'L', label: 'L', isLetter: true },
      { code: 'Semicolon', key: ';', shift: ':', label: '; :' },
      { code: 'Quote', key: "'", shift: '"', label: "' \"" },
      { code: 'Enter', key: 'Enter', label: 'Enter', wide: 'w-20' }
    ],
    [
      { code: 'ShiftLeft', key: 'Shift', label: 'Shift', wide: 'w-24' },
      { code: 'KeyZ', key: 'z', shift: 'Z', label: 'Z', isLetter: true },
      { code: 'KeyX', key: 'x', shift: 'X', label: 'X', isLetter: true },
      { code: 'KeyC', key: 'c', shift: 'C', label: 'C', isLetter: true },
      { code: 'KeyV', key: 'v', shift: 'V', label: 'V', isLetter: true },
      { code: 'KeyB', key: 'b', shift: 'B', label: 'B', isLetter: true },
      { code: 'KeyN', key: 'n', shift: 'N', label: 'N', isLetter: true },
      { code: 'KeyM', key: 'm', shift: 'M', label: 'M', isLetter: true },
      { code: 'Comma', key: ',', shift: '<', label: ', <' },
      { code: 'Period', key: '.', shift: '>', label: '. >' },
      { code: 'Slash', key: '/', shift: '?', label: '/ ?' },
      { code: 'ShiftRight', key: 'Shift', label: 'Shift', wide: 'w-24' }
    ],
    [
      { code: 'Space', key: ' ', label: 'Space', wide: 'w-64' }
    ]
  ];

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Common confusion sets for intelligent grammar error detection vs mechanical typos
  const GRAMMAR_CONFUSION_SETS = {
    prepositions: [
      { words: ['in', 'on', 'at', 'into', 'onto'], category: 'Prepositions (Time & Place)', rule: "Use 'in' for enclosed spaces/months/years, 'on' for surfaces/days/dates, 'at' for specific clock times/points, and 'into' for movement toward the inside." },
      { words: ['to', 'for'], category: 'Prepositions (Direction vs. Purpose)', rule: "Use 'to' for destination/recipient or infinitive verbs, and 'for' for benefit, purpose, or duration." },
      { words: ['since', 'for', 'from'], category: 'Prepositions (Time Duration vs. Starting Point)', rule: "Use 'since' with a specific starting point in time (e.g., since 2020) and 'for' with a length of time (e.g., for three years)." },
      { words: ['between', 'among', 'amongst'], category: 'Prepositions (Two vs. Group)', rule: "Use 'between' for distinct, individual items (often two) and 'among' for items part of an indistinct group of three or more." },
      { words: ['by', 'with'], category: 'Prepositions (Agent vs. Instrument)', rule: "Use 'by' to show the agent or method/deadline, and 'with' to show the tool or instrument used." },
      { words: ['during', 'while'], category: 'Prepositions vs. Conjunctions (during/while)', rule: "Use 'during' before a noun phrase (during the meeting) and 'while' before a clause with a subject/verb or participle (while we met / while waiting)." },
      { words: ['beside', 'besides'], category: 'Prepositions (beside vs. besides)', rule: "'Beside' means next to; 'besides' means in addition to." }
    ],
    articles: [
      { words: ['a', 'an', 'the'], category: 'Articles (a / an / the)', rule: "Use 'a' before consonant sounds (a university), 'an' before vowel sounds (an hour), and 'the' for specific or unique nouns." },
      { words: ['some', 'any'], category: 'Determiners (some / any)', rule: "Use 'some' in affirmative statements and polite offers, and 'any' in negative statements and most open questions." },
      { words: ['much', 'many', 'few', 'little'], category: 'Quantifiers (Countable vs. Uncountable)', rule: "Use 'many' and 'few' with countable plural nouns (many books), and 'much' and 'little' with uncountable nouns (much time)." },
      { words: ['this', 'that', 'these', 'those'], category: 'Demonstratives (Singular vs. Plural)', rule: "Use 'this/that' for singular nouns and 'these/those' for plural nouns." }
    ],
    tenses_agreement: [
      { words: ['is', 'are', 'was', 'were', 'am', 'be', 'been'], category: 'Subject-Verb Agreement & Be-Verbs', rule: "Match singular subjects with 'is/was' and plural subjects (or subjunctive 'if I were') with 'are/were'." },
      { words: ['has', 'have', 'had'], category: 'Auxiliary Agreement & Perfect Tense', rule: "Use 'has' with third-person singular subjects (he/she/it) in present perfect, 'have' with I/you/we/they, and 'had' for past perfect." },
      { words: ['do', 'does', 'did'], category: 'Auxiliary Verbs (do / does / did)', rule: "Use 'does' for third-person singular present, 'do' for plural/I/you, and 'did' for past tense." },
      { words: ['go', 'goes', 'went', 'gone'], category: 'Irregular Verb Forms (go/went/gone)', rule: "Use 'went' for simple past and 'gone' after has/have/had in perfect tenses." },
      { words: ['write', 'writes', 'wrote', 'written'], category: 'Irregular Verb Forms (write/wrote/written)', rule: "Use 'wrote' for simple past and 'written' after has/have/had." },
      { words: ['take', 'takes', 'took', 'taken'], category: 'Irregular Verb Forms (take/took/taken)', rule: "Use 'took' for simple past and 'taken' after has/have/had." }
    ],
    pronouns_conjunctions: [
      { words: ['its', "it's", "its'"], category: "Possessive vs. Contraction (its / it's)", rule: "Use \"it's\" as a contraction for 'it is' or 'it has', and 'its' (no apostrophe) for possession." },
      { words: ['your', "you're"], category: "Possessive vs. Contraction (your / you're)", rule: "Use \"you're\" for 'you are' and 'your' to show possession." },
      { words: ['their', 'there', "they're"], category: "Homophones (their / there / they're)", rule: "Use 'their' for possession, 'there' for place/existence, and \"they're\" for 'they are'." },
      { words: ['who', 'whom', 'whose', "who's"], category: 'Relative Pronouns (who / whom / whose)', rule: "Use 'who' for subjects, 'whom' for objects, 'whose' for possession, and \"who's\" for 'who is'." },
      { words: ['affect', 'effect', 'affects', 'effects'], category: 'Word Choice (affect vs. effect)', rule: "'Affect' is usually a verb meaning to influence; 'effect' is usually a noun meaning the result." }
    ]
  };

  // Built-in equivalent forms so valid English variations aren't falsely flagged as grammar mistakes
  const GLOBAL_EQUIVALENT_PAIRS = [
    ['08:45 a.m.', '8:45 a.m.', '08:45 am', '8:45 am', '08:45 AM', '8:45 AM'],
    ['cannot', 'can not'],
    ['toward', 'towards'],
    ['forward', 'forwards'],
    ['judgment', 'judgement'],
    ['acknowledgment', 'acknowledgement'],
    ['color', 'colour'],
    ['organize', 'organise'],
    ['analyze', 'analyse'],
    ['center', 'centre'],
    ['program', 'programme'],
    ['practice', 'practise'],
    ['21 october 2026', 'october 21, 2026']
  ];

  /**
   * Tokenizes text into whitespace-separated words.
   * Rule: Any contiguous sequence of non-whitespace characters (\S+) is 1 word token.
   */
  function tokenizeWords(text) {
    if (!text || typeof text !== 'string') return [];
    const trimmed = text.trim();
    if (!trimmed) return [];
    return trimmed.split(/\s+/);
  }

  /**
   * Strips surrounding punctuation from a word token to inspect its lexical core.
   */
  function cleanLexicalToken(token) {
    if (!token) return '';
    return token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
  }

  /**
   * Unicode-aware character classification.
   */
  function classifyChar(ch) {
    if (!ch) return 'other';
    if (/\s/u.test(ch)) return 'whitespace';
    if (/\p{L}/u.test(ch)) {
      if (/\p{Lu}/u.test(ch)) return 'uppercase';
      if (/\p{Ll}/u.test(ch)) return 'lowercase';
      return 'letter';
    }
    if (/\p{N}/u.test(ch)) return 'digit';
    if (/[\p{P}\p{S}]/u.test(ch)) return 'punctuation';
    return 'other';
  }

  /**
   * Counts character categories for any string (Unicode-safe via Array.from code points).
   * Explicitly returns internally consistent totals:
   * charsWithSpaces === charsWithoutSpaces + whitespace
   * letters === uppercase + lowercase + otherLetters
   * charsWithoutSpaces === letters + digits + punctuation + otherNonSpace
   */
  function computeTextCounts(text, referenceText = '') {
    const str = typeof text === 'string' ? text : '';
    const refStr = typeof referenceText === 'string' ? referenceText : '';

    const codePoints = Array.from(str);
    const refCodePoints = Array.from(refStr);

    let whitespace = 0;
    let uppercase = 0;
    let lowercase = 0;
    let otherLetters = 0;
    let digits = 0;
    let punctuation = 0;
    let otherNonSpace = 0;

    for (let i = 0; i < codePoints.length; i++) {
      const ch = codePoints[i];
      if (/\s/u.test(ch)) {
        whitespace++;
      } else if (/\p{L}/u.test(ch)) {
        if (/\p{Lu}/u.test(ch)) uppercase++;
        else if (/\p{Ll}/u.test(ch)) lowercase++;
        else otherLetters++;
      } else if (/\p{N}/u.test(ch)) {
        digits++;
      } else if (/[\p{P}\p{S}]/u.test(ch)) {
        punctuation++;
      } else {
        otherNonSpace++;
      }
    }

    const letters = uppercase + lowercase + otherLetters;
    const charsWithSpaces = codePoints.length;
    const charsWithoutSpaces = charsWithSpaces - whitespace;
    const words = tokenizeWords(str).length;
    const refWords = tokenizeWords(refStr).length;
    const refChars = refCodePoints.length;

    // Character-by-character comparison against referenceText
    let correctChars = 0;
    let incorrectChars = 0;
    let extraChars = 0;
    let correctPunctuation = 0;
    let totalRefPunctuationTyped = 0;
    let correctCapitalization = 0;
    let totalRefCapitalsTyped = 0;
    let correctSpacing = 0;
    let totalRefSpacesTyped = 0;

    for (let i = 0; i < codePoints.length; i++) {
      const typedChar = codePoints[i];
      if (i < refCodePoints.length) {
        const targetChar = refCodePoints[i];
        const isMatch = typedChar === targetChar;
        if (isMatch) {
          correctChars++;
        } else {
          incorrectChars++;
        }

        // Track specialized category accuracy on positions covered so far
        if (/[\p{P}\p{S}]/u.test(targetChar)) {
          totalRefPunctuationTyped++;
          if (isMatch) correctPunctuation++;
        }
        if (/\p{Lu}/u.test(targetChar)) {
          totalRefCapitalsTyped++;
          if (isMatch) correctCapitalization++;
        }
        if (/\s/u.test(targetChar)) {
          totalRefSpacesTyped++;
          if (isMatch) correctSpacing++;
        }
      } else {
        incorrectChars++;
        extraChars++;
      }
    }

    const remainingChars = Math.max(0, refChars - codePoints.length);
    const remainingWords = Math.max(0, refWords - words);

    return {
      charsWithSpaces,
      charsWithoutSpaces,
      letters,
      uppercase,
      lowercase,
      digits,
      punctuation,
      whitespace,
      otherNonSpace,
      words,
      correctChars,
      incorrectChars,
      extraChars,
      refChars,
      refWords,
      remainingChars,
      remainingWords,
      correctPunctuation,
      totalRefPunctuationTyped,
      punctuationAccuracy: totalRefPunctuationTyped > 0
        ? Number(((correctPunctuation / totalRefPunctuationTyped) * 100).toFixed(1))
        : 100,
      correctCapitalization,
      totalRefCapitalsTyped,
      capitalizationAccuracy: totalRefCapitalsTyped > 0
        ? Number(((correctCapitalization / totalRefCapitalsTyped) * 100).toFixed(1))
        : 100,
      correctSpacing,
      totalRefSpacesTyped,
      spacingAccuracy: totalRefSpacesTyped > 0
        ? Number(((correctSpacing / totalRefSpacesTyped) * 100).toFixed(1))
        : 100
    };
  }

  /**
   * Counts countable characters toward a Character Target test, respecting user settings:
   * - includeSpaces (boolean, default true)
   * - includePunctuation (boolean, default true)
   */
  function countTargetCharacters(text, options = {}) {
    const includeSpaces = options.includeSpaces !== undefined ? options.includeSpaces : true;
    const includePunctuation = options.includePunctuation !== undefined ? options.includePunctuation : true;
    const codePoints = Array.from(typeof text === 'string' ? text : '');
    let count = 0;
    for (const ch of codePoints) {
      if (!includeSpaces && /\s/u.test(ch)) continue;
      if (!includePunctuation && /[\p{P}\p{S}]/u.test(ch)) continue;
      count++;
    }
    return count;
  }

  /**
   * Compares typed text against reference text character-by-character and word-by-word.
   */
  function compareTexts(typedText, referenceText) {
    const typed = Array.from(typeof typedText === 'string' ? typedText : '');
    const ref = Array.from(typeof referenceText === 'string' ? referenceText : '');
    const maxLen = Math.max(typed.length, ref.length);

    const charStates = [];
    const errorPositions = [];

    for (let i = 0; i < maxLen; i++) {
      const t = i < typed.length ? typed[i] : null;
      const r = i < ref.length ? ref[i] : null;

      if (t === null) {
        charStates.push({
          index: i,
          expected: r,
          actual: null,
          status: i === typed.length ? 'cursor' : 'pending'
        });
      } else if (r === null) {
        charStates.push({
          index: i,
          expected: null,
          actual: t,
          status: 'extra'
        });
        errorPositions.push({
          index: i,
          expected: '(end of passage)',
          actual: t,
          type: 'extra_char',
          explanation: `Extra character "${t}" typed beyond the end of the target passage.`
        });
      } else if (t === r) {
        charStates.push({
          index: i,
          expected: r,
          actual: t,
          status: 'correct'
        });
      } else {
        const errInfo = classifyCharMismatch(r, t, i, ref, typed);
        charStates.push({
          index: i,
          expected: r,
          actual: t,
          status: 'incorrect',
          errorType: errInfo.type
        });
        errorPositions.push({
          index: i,
          expected: r,
          actual: t,
          type: errInfo.type,
          explanation: errInfo.explanation
        });
      }
    }

    // Word-level comparison using whitespace-separated tokens
    const refWords = tokenizeWords(referenceText);
    const typedWords = tokenizeWords(typedText);
    const endsWithSpace = /\s$/.test(typedText || '');
    const isCompleteLength = typed.length >= ref.length && ref.length > 0;

    let correctWords = 0;
    let incorrectWords = 0;

    // A typed word is evaluated as finalized if followed by space or if passage length is reached.
    // The currently active partial word is evaluated if it already matches the full reference word.
    for (let w = 0; w < typedWords.length; w++) {
      const tw = typedWords[w];
      const rw = w < refWords.length ? refWords[w] : null;
      const isLastTypedWord = w === typedWords.length - 1;
      const isFinalized = !isLastTypedWord || endsWithSpace || isCompleteLength || (rw !== null && tw === rw);

      if (!isFinalized) {
        // Still actively being typed; if it already diverges from prefix of rw, mark as in-progress
        continue;
      }

      if (rw !== null && tw === rw) {
        correctWords++;
      } else {
        incorrectWords++;
      }
    }

    const wordsRemaining = Math.max(0, refWords.length - (correctWords + incorrectWords));

    return {
      charStates,
      errorPositions,
      correctWords,
      incorrectWords,
      wordsRemaining,
      totalRefWords: refWords.length,
      totalTypedWords: typedWords.length
    };
  }

  /**
   * Classifies an individual character mismatch into actionable categories:
   * - case_error (e.g., 't' instead of 'T')
   * - missing_punctuation (typed space or letter where punctuation was expected)
   * - wrong_punctuation (typed ',' where ';' or '.' was expected)
   * - spacing_error (typed non-space where space was expected or vice versa)
   * - digit_symbol_error (number/currency/symbol mismatch)
   * - char_mismatch (general letter/spelling mismatch)
   */
  function classifyCharMismatch(expected, actual, index, refArr, typedArr) {
    if (expected.toLowerCase() === actual.toLowerCase() && expected !== actual) {
      const isStart = index === 0 || (index >= 2 && /[.!?]/.test(refArr[index - 2]) && /\s/.test(refArr[index - 1]));
      return {
        type: 'capitalization',
        subType: 'case_error',
        explanation: isStart
          ? `Sentence-initial capitalization error: expected uppercase "${expected}" at the start of a sentence, but typed "${actual}".`
          : `Capitalization mismatch: expected "${expected}", but typed "${actual}".`
      };
    }

    const expClass = classifyChar(expected);
    const actClass = classifyChar(actual);

    if (expClass === 'punctuation' && actClass === 'whitespace') {
      return {
        type: 'punctuation',
        subType: 'missing_mark',
        explanation: `Missing punctuation mark: omitted "${expected}" and typed a space instead.`
      };
    }
    if (expClass === 'punctuation' && actClass !== 'punctuation') {
      return {
        type: 'punctuation',
        subType: 'missing_mark',
        explanation: `Missing punctuation mark: expected "${expected}", but typed "${actual}".`
      };
    }
    if (expClass === 'punctuation' && actClass === 'punctuation') {
      return {
        type: 'punctuation',
        subType: 'incorrect_mark',
        explanation: `Incorrect punctuation mark: expected "${expected}", but used "${actual}".`
      };
    }
    if (expClass !== 'punctuation' && actClass === 'punctuation') {
      return {
        type: 'punctuation',
        subType: 'extra_mark',
        explanation: `Unexpected punctuation mark "${actual}" where "${expected}" was required.`
      };
    }
    if (expClass === 'whitespace' || actClass === 'whitespace') {
      const prevExpected = index > 0 ? refArr[index - 1] : '';
      const isPunctSpacing = /[\p{P}]/u.test(prevExpected) || /[\p{P}]/u.test(expected);
      return {
        type: 'spacing',
        subType: 'spacing_error',
        explanation: isPunctSpacing
          ? `Spacing error around punctuation: expected "${expected === ' ' ? 'space' : expected}", but typed "${actual === ' ' ? 'space' : actual}".`
          : `Word spacing mismatch: expected "${expected === ' ' ? 'space' : expected}", but typed "${actual === ' ' ? 'space' : actual}".`
      };
    }
    if (expClass === 'digit' || actClass === 'digit') {
      return {
        type: 'number_symbol',
        subType: 'digit_error',
        explanation: `Number/digit mismatch: expected "${expected}", but typed "${actual}".`
      };
    }

    return {
      type: 'spelling_char',
      subType: 'char_mismatch',
      explanation: `Character mismatch: expected "${expected}", but typed "${actual}".`
    };
  }

  /**
   * Computes complete, live typing statistics from actual input, keystroke state, and active elapsed time.
   *
   * Explicit Formulas:
   * - Active Minutes = elapsedActiveMs / 60000
   * - Gross WPM = (totalCharsTyped / 5) / activeMinutes
   * - Net WPM (Primary Formula) = (correctChars / 5) / activeMinutes
   * - Net WPM (Penalty-Adjusted Industry Alternative) = max(0, ((totalCharsTyped / 5) - uncorrectedErrors) / activeMinutes)
   * - Accuracy (%) = totalKeystrokes > 0 ? (correctKeystrokes / totalKeystrokes) * 100 : 100
   *   (Also provides Final Text Accuracy = totalCharsTyped > 0 ? (correctChars / totalCharsTyped) * 100 : 100)
   * - Error Rate (%) = 100 - Accuracy (%)
   * - Corrected Errors = errors that were typed during the session and subsequently fixed via Backspace
   * - Uncorrected Errors = incorrect characters still remaining in the current typed text
   */
  function computeLiveStatistics({
    typedText = '',
    referenceText = '',
    elapsedActiveMs = 0,
    totalKeystrokes = 0,
    correctKeystrokes = 0,
    errorKeystrokes = 0,
    correctedErrors = 0,
    wpmHistory = [],
    limitConfig = { type: 'unlimited', value: 0, includeSpaces: true, includePunctuation: true }
  }) {
    const counts = computeTextCounts(typedText, referenceText);
    const comparison = compareTexts(typedText, referenceText);

    const totalCharsTyped = counts.charsWithSpaces;
    const correctChars = counts.correctChars;
    const uncorrectedErrors = counts.incorrectChars;

    // Safe zero-elapsed-time handling (prevents division by zero or absurd sub-100ms spikes)
    const activeSeconds = Math.max(0, elapsedActiveMs) / 1000;
    const activeMinutes = activeSeconds / 60;

    let grossWpm = 0;
    let netWpm = 0;
    let penaltyNetWpm = 0;

    if (activeMinutes > 0 && totalCharsTyped > 0) {
      grossWpm = Number(((totalCharsTyped / 5) / activeMinutes).toFixed(1));
      netWpm = Number(((correctChars / 5) / activeMinutes).toFixed(1));
      penaltyNetWpm = Number(Math.max(0, ((totalCharsTyped / 5) - uncorrectedErrors) / activeMinutes).toFixed(1));
    }

    // If keystroke counters were not separately passed (e.g., direct string test), derive minimum consistent bounds
    const effectiveTotalKeystrokes = Math.max(totalKeystrokes, totalCharsTyped + correctedErrors);
    const effectiveErrorKeystrokes = Math.max(errorKeystrokes, uncorrectedErrors + correctedErrors);
    const effectiveCorrectKeystrokes = Math.max(0, effectiveTotalKeystrokes - effectiveErrorKeystrokes);

    const keystrokeAccuracy = effectiveTotalKeystrokes > 0
      ? Number(((effectiveCorrectKeystrokes / effectiveTotalKeystrokes) * 100).toFixed(1))
      : 100;

    const finalTextAccuracy = totalCharsTyped > 0
      ? Number(((correctChars / totalCharsTyped) * 100).toFixed(1))
      : 100;

    // Primary accuracy uses keystroke accuracy (does NOT hide corrected mistakes), while clearly exposing both!
    const accuracy = effectiveTotalKeystrokes > 0 ? keystrokeAccuracy : 100;
    const errorRate = Number(Math.max(0, 100 - accuracy).toFixed(1));

    // Current, Average, and Best WPM across the session
    const samples = Array.isArray(wpmHistory) ? wpmHistory.map(s => (typeof s === 'number' ? s : s.netWpm || 0)) : [];
    const currentWpm = samples.length > 0 ? Number(samples[samples.length - 1].toFixed(1)) : netWpm;
    const averageWpm = netWpm;
    const bestWpm = samples.length > 0
      ? Number(Math.max(netWpm, ...samples).toFixed(1))
      : netWpm;

    // Completion percentage & remaining time based on limitConfig
    let completionPercentage = 0;
    let remainingTimeSec = null;

    if (limitConfig && limitConfig.type === 'timed' && limitConfig.value > 0) {
      remainingTimeSec = Math.max(0, Number((limitConfig.value - activeSeconds).toFixed(1)));
      completionPercentage = Math.min(100, Number(((activeSeconds / limitConfig.value) * 100).toFixed(1)));
    } else if (limitConfig && limitConfig.type === 'words' && limitConfig.value > 0) {
      completionPercentage = Math.min(100, Number(((counts.words / limitConfig.value) * 100).toFixed(1)));
    } else if (limitConfig && limitConfig.type === 'chars' && limitConfig.value > 0) {
      const countedChars = countTargetCharacters(typedText, limitConfig);
      completionPercentage = Math.min(100, Number(((countedChars / limitConfig.value) * 100).toFixed(1)));
    } else {
      completionPercentage = counts.refChars > 0
        ? Math.min(100, Number(((totalCharsTyped / counts.refChars) * 100).toFixed(1)))
        : 0;
    }

    return {
      grossWpm,
      netWpm,
      penaltyNetWpm,
      currentWpm,
      averageWpm,
      bestWpm,
      accuracy,
      keystrokeAccuracy,
      finalTextAccuracy,
      errorRate,
      totalCharsTyped,
      correctChars,
      incorrectChars: uncorrectedErrors,
      remainingChars: counts.remainingChars,
      refChars: counts.refChars,
      correctWords: comparison.correctWords,
      incorrectWords: comparison.incorrectWords,
      wordsRemaining: comparison.wordsRemaining,
      totalWordsTyped: counts.words,
      refWords: counts.refWords,
      totalKeystrokes: effectiveTotalKeystrokes,
      correctKeystrokes: effectiveCorrectKeystrokes,
      errorKeystrokes: effectiveErrorKeystrokes,
      correctedErrors,
      uncorrectedErrors,
      activeElapsedMs: Math.max(0, elapsedActiveMs),
      activeElapsedSec: Number(activeSeconds.toFixed(1)),
      remainingTimeSec,
      completionPercentage,
      punctuationAccuracy: counts.punctuationAccuracy,
      capitalizationAccuracy: counts.capitalizationAccuracy,
      spacingAccuracy: counts.spacingAccuracy,
      counts,
      comparison
    };
  }

  /**
   * Computes A–Z Letter-Frequency Analytics & QWERTY Keyboard Heatmap data.
   * Strictly excludes spaces, digits, and punctuation from A–Z letter percentages.
   */
  function computeLetterFrequency(sourceTextOrChars, keypressMap = null) {
    const str = Array.isArray(sourceTextOrChars)
      ? sourceTextOrChars.join('')
      : (typeof sourceTextOrChars === 'string' ? sourceTextOrChars : '');

    const upperCounts = {};
    const lowerCounts = {};
    const totalCounts = {};

    for (const letter of ALPHABET) {
      upperCounts[letter] = 0;
      lowerCounts[letter] = 0;
      totalCounts[letter] = 0;
    }

    let totalAlphabeticLetters = 0;
    let excludedSpaces = 0;
    let excludedDigits = 0;
    let excludedPunctuation = 0;

    const codePoints = Array.from(str);
    for (const ch of codePoints) {
      if (ch >= 'A' && ch <= 'Z') {
        upperCounts[ch]++;
        totalCounts[ch]++;
        totalAlphabeticLetters++;
      } else if (ch >= 'a' && ch <= 'z') {
        const up = ch.toUpperCase();
        lowerCounts[up]++;
        totalCounts[up]++;
        totalAlphabeticLetters++;
      } else if (/\s/u.test(ch)) {
        excludedSpaces++;
      } else if (/\p{N}/u.test(ch)) {
        excludedDigits++;
      } else if (/[\p{P}\p{S}]/u.test(ch)) {
        excludedPunctuation++;
      }
    }

    const lettersData = ALPHABET.map(letter => {
      const count = totalCounts[letter];
      const upper = upperCounts[letter];
      const lower = lowerCounts[letter];
      const percentage = totalAlphabeticLetters > 0
        ? Number(((count / totalAlphabeticLetters) * 100).toFixed(2))
        : 0;
      return {
        letter,
        count,
        upper,
        lower,
        percentage
      };
    });

    const ranked = [...lettersData].sort((a, b) => b.count - a.count || a.letter.localeCompare(b.letter));
    const usedLetters = ranked.filter(item => item.count > 0);
    const mostUsed = usedLetters.length > 0 ? usedLetters[0] : null;
    const leastUsed = usedLetters.length > 0 ? usedLetters[usedLetters.length - 1] : null;

    // Build QWERTY heatmap intensity (0 to 1) from actual keypressMap if provided, else derived from characters
    const keyCounts = {};
    let maxKeyCount = 0;

    QWERTY_ROWS.forEach(row => {
      row.forEach(k => {
        let count = 0;
        if (keypressMap && typeof keypressMap === 'object' && keypressMap[k.code] !== undefined) {
          count = keypressMap[k.code];
        } else if (k.isLetter) {
          count = totalCounts[k.label] || 0;
        } else if (k.code === 'Space') {
          count = excludedSpaces;
        }
        keyCounts[k.code] = count;
        if (count > maxKeyCount) maxKeyCount = count;
      });
    });

    return {
      lettersData,
      ranked,
      mostUsed,
      leastUsed,
      totalAlphabeticLetters,
      excludedSpaces,
      excludedDigits,
      excludedPunctuation,
      keyCounts,
      maxKeyCount
    };
  }

  /**
   * Checks if two strings or tokens match via accepted grammatical alternatives.
   */
  function isAcceptedAlternative(typedStr, referenceStr, itemAlternatives = []) {
    if (!typedStr || !referenceStr) return false;
    const normTyped = typedStr.trim().replace(/\s+/g, ' ');
    const normRef = referenceStr.trim().replace(/\s+/g, ' ');
    if (normTyped === normRef) return true;

    // Check explicit passage-level alternatives
    for (const alt of itemAlternatives) {
      if (typeof alt === 'string' && normTyped.toLowerCase() === alt.trim().toLowerCase()) {
        return true;
      }
      if (alt && typeof alt === 'object' && alt.from && alt.to) {
        const replaced = normRef.replace(alt.from, alt.to);
        if (normTyped === replaced) return true;
      }
    }

    // Check global equivalent token pairs (e.g., US/UK spelling or time formatting)
    let tempTyped = normTyped.toLowerCase();
    let tempRef = normRef.toLowerCase();
    for (const group of GLOBAL_EQUIVALENT_PAIRS) {
      const canonical = group[0].toLowerCase();
      for (const variant of group) {
        const vLow = variant.toLowerCase();
        tempTyped = tempTyped.split(vLow).join(canonical);
        tempRef = tempRef.split(vLow).join(canonical);
      }
    }
    return tempTyped === tempRef;
  }

  /**
   * Calculates Levenshtein edit distance to distinguish 1-char mechanical typos from word-choice/grammar substitutions.
   */
  function editDistance(a, b) {
    const s1 = a.toLowerCase();
    const s2 = b.toLowerCase();
    const dp = Array.from({ length: s1.length + 1 }, () => new Array(s2.length + 1).fill(0));
    for (let i = 0; i <= s1.length; i++) dp[i][0] = i;
    for (let j = 0; j <= s2.length; j++) dp[0][j] = j;
    for (let i = 1; i <= s1.length; i++) {
      for (let j = 1; j <= s2.length; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[s1.length][s2.length];
  }

  /**
   * Analyzes a completed or partial sentence for Grammar vs. Mechanical Typing Mistakes.
   * Returns:
   * - grammarMistakes: list of true grammatical/punctuation/capitalization errors with correct form, user's form, category, reason, and examples
   * - typingMistakes: list of mechanical character slips (typos) that are not conceptual grammar confusions
   * - acceptedVariations: list of valid English alternatives the user typed that differed from the reference text
   * - grammarAccuracy: 0-100 score reflecting grammatical understanding independent of raw typing slips
   */
  function analyzeGrammarAndMechanics(typedText, passageItem) {
    const referenceText = passageItem && passageItem.text ? passageItem.text : (typeof passageItem === 'string' ? passageItem : '');
    const focusSpans = (passageItem && Array.isArray(passageItem.focusSpans)) ? passageItem.focusSpans : [];
    const acceptedAlternatives = (passageItem && Array.isArray(passageItem.acceptedAlternatives)) ? passageItem.acceptedAlternatives : [];

    const grammarMistakes = [];
    const typingMistakes = [];
    const acceptedVariations = [];

    if (!typedText || !referenceText) {
      return {
        grammarMistakes,
        typingMistakes,
        acceptedVariations,
        grammarAccuracy: 100
      };
    }

    // Check if the entire sentence is a recognized valid grammatical alternative
    if (typedText.trim() !== referenceText.trim() && isAcceptedAlternative(typedText, referenceText, acceptedAlternatives)) {
      acceptedVariations.push({
        expected: referenceText,
        actual: typedText,
        note: 'Your phrasing/spelling is grammatically valid English, even though it differs slightly from the reference text.'
      });
      return {
        grammarMistakes,
        typingMistakes,
        acceptedVariations,
        grammarAccuracy: 100
      };
    }

    const refTokens = tokenizeWords(referenceText);
    const typedTokens = tokenizeWords(typedText);
    const numTokens = Math.min(refTokens.length, typedTokens.length);

    for (let i = 0; i < numTokens; i++) {
      const refTok = refTokens[i];
      const typTok = typedTokens[i];
      if (refTok === typTok) continue;

      // Check token-level accepted alternatives
      if (isAcceptedAlternative(typTok, refTok, acceptedAlternatives)) {
        acceptedVariations.push({
          tokenIndex: i,
          expected: refTok,
          actual: typTok,
          note: `"${typTok}" is an accepted valid alternative to "${refTok}".`
        });
        continue;
      }

      const refClean = cleanLexicalToken(refTok);
      const typClean = cleanLexicalToken(typTok);
      const refLow = refClean.toLowerCase();
      const typLow = typClean.toLowerCase();

      // 1. Check if difference is strictly punctuation attached to the token (e.g. missing comma/period/apostrophe)
      if (refClean === typClean && refTok !== typTok) {
        const hasApostropheDiff = refTok.includes("'") !== typTok.includes("'");
        grammarMistakes.push({
          tokenIndex: i,
          expected: refTok,
          actual: typTok,
          category: hasApostropheDiff ? 'Apostrophes & Contractions' : 'Punctuation',
          subType: refTok.length > typTok.length ? 'Missing Punctuation Mark' : 'Incorrect Punctuation Mark',
          reason: hasApostropheDiff
            ? `Use an apostrophe correctly in "${refTok}" to mark a contraction or possession.`
            : `Expected punctuation in "${refTok}" (typed "${typTok}"). Punctuation clarifies clause boundaries and sentence structure.`,
          examples: hasApostropheDiff
            ? ["It's raining outside, so the dog stayed in its shelter.", "The students' projects impressed the panel."]
            : ['After the meeting ended, we reviewed the notes.', 'She brought three items: a notebook, a pen, and a charger.']
        });
        continue;
      }

      // 2. Check if difference is strictly capitalization (e.g., sentence start, proper noun, or pronoun "I")
      if (refLow === typLow && refClean !== typClean) {
        const isFirstWord = i === 0;
        const isPronounI = refClean === 'I';
        grammarMistakes.push({
          tokenIndex: i,
          expected: refTok,
          actual: typTok,
          category: 'Capitalization',
          subType: 'Case Error',
          reason: isFirstWord
            ? `Always capitalize the first word of a sentence ("${refClean}").`
            : isPronounI
              ? 'The personal pronoun "I" is always capitalized in English, regardless of where it appears in the sentence.'
              : `"${refClean}" is a proper noun, title, day, or month and requires a capital letter.`,
          examples: [
            'On Tuesday in October, I visited Dhaka with Dr. Rahman.',
            'Every new sentence must begin with a capital letter.'
          ]
        });
        continue;
      }

      // 3. Check if the token matches an explicit curriculum focusSpan on this passage
      const matchingFocus = focusSpans.find(fs => cleanLexicalToken(fs.token).toLowerCase() === refLow);
      if (matchingFocus) {
        grammarMistakes.push({
          tokenIndex: i,
          expected: refTok,
          actual: typTok,
          category: matchingFocus.category || (passageItem && passageItem.grammarFocus) || 'Grammar Concept',
          subType: 'Grammar Usage Error',
          reason: matchingFocus.rule || (passageItem && passageItem.conciseNote) || `Use "${refTok}" in this grammatical context rather than "${typTok}".`,
          examples: matchingFocus.examples || (passageItem && passageItem.examples) || []
        });
        continue;
      }

      // 4. Check against known grammar confusion families (prepositions, articles, tenses/agreement, pronouns/homophones)
      let matchedConfusion = null;
      for (const familyKey of Object.keys(GRAMMAR_CONFUSION_SETS)) {
        for (const group of GRAMMAR_CONFUSION_SETS[familyKey]) {
          if (group.words.includes(refLow) && group.words.includes(typLow)) {
            matchedConfusion = group;
            break;
          }
        }
        if (matchedConfusion) break;
      }

      if (matchedConfusion) {
        grammarMistakes.push({
          tokenIndex: i,
          expected: refTok,
          actual: typTok,
          category: matchedConfusion.category,
          subType: 'Grammar Confusion',
          reason: matchedConfusion.rule,
          examples: [
            `Correct in context: "${refTok}" (you typed "${typTok}").`,
            (passageItem && passageItem.conciseNote) || 'Check how surrounding nouns and time markers govern this choice.'
          ]
        });
        continue;
      }

      // 5. Otherwise, classify as a Mechanical Typing / Spelling Slip
      const dist = editDistance(refLow, typLow);
      typingMistakes.push({
        tokenIndex: i,
        expected: refTok,
        actual: typTok,
        category: dist <= 2 ? 'Mechanical Keystroke Slip' : 'Spelling / Word Mismatch',
        reason: dist <= 2
          ? `Keystroke slip on "${refTok}" (typed "${typTok}"). Your grammar structure is fine—slow down slightly for finger placement.`
          : `Word/spelling mismatch: expected "${refTok}", typed "${typTok}".`
      });
    }

    // Check spacing errors around punctuation in the raw string
    if (/\s[,.;:!?]/.test(typedText) && !/\s[,.;:!?]/.test(referenceText)) {
      grammarMistakes.push({
        tokenIndex: -1,
        expected: 'No space before punctuation',
        actual: 'Space before punctuation mark',
        category: 'Punctuation Spacing',
        subType: 'Spacing Error',
        reason: 'In standard English typography, place periods, commas, colons, semicolons, question marks, and exclamation marks immediately after the word with no preceding space.',
        examples: ['Correct: "Hello, world!"', 'Incorrect: "Hello , world !"']
      });
    }

    const totalEvaluatedUnits = Math.max(1, refTokens.length);
    const grammarAccuracy = Number(
      Math.max(0, ((totalEvaluatedUnits - grammarMistakes.length) / totalEvaluatedUnits) * 100).toFixed(1)
    );

    return {
      grammarMistakes,
      typingMistakes,
      acceptedVariations,
      grammarAccuracy
    };
  }

  /**
   * Validates imported Custom Practice Set JSON or plain text.
   * Guards against malformed content, missing fields, or empty passages.
   */
  function validateCustomSetPayload(rawInput, format = 'json') {
    if (!rawInput || typeof rawInput !== 'string' || !rawInput.trim()) {
      return { valid: false, error: 'Import content is empty. Please provide valid JSON or plain text passages.' };
    }

    if (format === 'text') {
      const lines = rawInput
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean);
      if (lines.length === 0) {
        return { valid: false, error: 'No non-empty lines found in plain text input.' };
      }
      return {
        valid: true,
        sets: [
          {
            id: 'custom_' + Date.now(),
            name: 'Imported Text Set (' + lines.length + ' items)',
            difficulty: 'Intermediate',
            grammarFocus: 'Custom Practice',
            matchMode: 'relaxed',
            limitType: 'unlimited',
            limitValue: 0,
            targetWpm: 45,
            targetAccuracy: 95,
            items: lines
          }
        ]
      };
    }

    try {
      const parsed = JSON.parse(rawInput);
      const rawSets = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.sets) ? parsed.sets : [parsed]);
      const validatedSets = [];

      for (let i = 0; i < rawSets.length; i++) {
        const s = rawSets[i];
        if (!s || typeof s !== 'object') {
          return { valid: false, error: `Item at index ${i} is not a valid object.` };
        }
        const name = typeof s.name === 'string' && s.name.trim() ? s.name.trim() : `Imported Set ${i + 1}`;
        let items = [];
        if (Array.isArray(s.items)) {
          items = s.items
            .map(it => (typeof it === 'string' ? it.trim() : (it && typeof it.text === 'string' ? it.text.trim() : '')))
            .filter(Boolean);
        } else if (typeof s.text === 'string' && s.text.trim()) {
          items = s.text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        }

        if (items.length === 0) {
          return { valid: false, error: `Practice set "${name}" contains no valid non-empty practice passages.` };
        }

        validatedSets.push({
          id: typeof s.id === 'string' && s.id.trim() ? s.id.trim() : `custom_${Date.now()}_${i}`,
          name,
          difficulty: ['Beginner', 'Intermediate', 'Advanced'].includes(s.difficulty) ? s.difficulty : 'Intermediate',
          grammarFocus: typeof s.grammarFocus === 'string' && s.grammarFocus.trim() ? s.grammarFocus.trim() : 'Mixed Grammar & Mechanics',
          matchMode: s.matchMode === 'strict' ? 'strict' : 'relaxed',
          limitType: ['unlimited', 'timed', 'words', 'chars'].includes(s.limitType) ? s.limitType : 'unlimited',
          limitValue: typeof s.limitValue === 'number' && s.limitValue >= 0 ? s.limitValue : 0,
          targetWpm: typeof s.targetWpm === 'number' && s.targetWpm > 0 ? s.targetWpm : 45,
          targetAccuracy: typeof s.targetAccuracy === 'number' && s.targetAccuracy > 0 && s.targetAccuracy <= 100 ? s.targetAccuracy : 95,
          items
        });
      }

      if (validatedSets.length === 0) {
        return { valid: false, error: 'No valid practice sets found in JSON.' };
      }

      return { valid: true, sets: validatedSets };
    } catch (err) {
      return { valid: false, error: 'Malformed JSON: ' + (err && err.message ? err.message : 'Unable to parse JSON structure.') };
    }
  }

  return {
    QWERTY_ROWS,
    ALPHABET,
    GRAMMAR_CONFUSION_SETS,
    tokenizeWords,
    cleanLexicalToken,
    classifyChar,
    computeTextCounts,
    countTargetCharacters,
    compareTexts,
    classifyCharMismatch,
    computeLiveStatistics,
    computeLetterFrequency,
    isAcceptedAlternative,
    analyzeGrammarAndMechanics,
    validateCustomSetPayload
  };
});


/**
 * TypeWise — Comprehensive Grammar, Punctuation, Spelling, and Numbers Curriculum
 * Covers Modes A–J and all 9 Targeted Punctuation/Capitalization Drill Categories.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TypeWiseCurriculum = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const PRACTICE_MODES = [
    {
      id: 'grammar_sentences',
      code: 'A',
      name: 'Grammar Sentences',
      shortName: 'Grammar',
      description: 'Real, natural English sentences teaching clause structure, pronouns, conjunctions, and modifiers in context.',
      icon: 'book-open'
    },
    {
      id: 'prepositions',
      code: 'B',
      name: 'Confused Prepositions',
      shortName: 'Prepositions',
      description: 'Master in/on/at, to/for, by/with, since/for, between/among, into/in, and during/while.',
      icon: 'compass'
    },
    {
      id: 'articles',
      code: 'C',
      name: 'Articles & Determiners',
      shortName: 'Articles',
      description: 'Practice a/an/the, some/any, much/many, few/little, and this/that/these/those.',
      icon: 'tag'
    },
    {
      id: 'tenses_agreement',
      code: 'D',
      name: 'Verb Tenses & Agreement',
      shortName: 'Tenses & Verbs',
      description: 'Present, past, future, perfect forms, conditionals, subjunctive mood, and subject-verb agreement.',
      icon: 'clock'
    },
    {
      id: 'punctuation_caps',
      code: 'E',
      name: 'Punctuation & Capitalization',
      shortName: 'Punctuation',
      description: 'Commas, colons, semicolons, apostrophes, quotation marks, hyphens, parentheses, and capitalization.',
      icon: 'type'
    },
    {
      id: 'numbers_symbols',
      code: 'F',
      name: 'Numbers, Dates & Currency',
      shortName: 'Numbers & Tk',
      description: 'Practice 2026, 08:45 a.m., 21 October 2026, Tk 1,250.50, 25%, version 4.2, and technical symbols.',
      icon: 'hash'
    },
    {
      id: 'paragraphs',
      code: 'G',
      name: 'Paragraph Practice',
      shortName: 'Paragraphs',
      description: 'Coherent multi-sentence passages combining prepositions, tenses, articles, and punctuation.',
      icon: 'align-left'
    },
    {
      id: 'spelling',
      code: 'H',
      name: 'Difficult Words & Spelling',
      shortName: 'Spelling',
      description: 'High-frequency challenging English spellings in natural sentences with memory cues.',
      icon: 'check-circle'
    },
    {
      id: 'custom_text',
      code: 'I',
      name: 'Custom Practice Text',
      shortName: 'Custom Text',
      description: 'Type your own saved practice sets, custom drills, or pasted study material.',
      icon: 'edit-3'
    },
    {
      id: 'mixed_challenge',
      code: 'J',
      name: 'Mixed Challenge',
      shortName: 'Mixed Challenge',
      description: 'Full-spectrum challenge combining grammar, numbers, currency, capitalization, punctuation, and spelling.',
      icon: 'zap'
    },
    {
      id: 'normal_words',
      code: 'K',
      name: 'Normal Words (No Punctuation)',
      shortName: 'Normal Words (No Punct)',
      description: 'Lowercase everyday English words without punctuation or capital letters for pure word-flow typing.',
      icon: 'align-justify'
    }
  ];

  // High-frequency lowercase English words for Normal Words (No Punctuation) mode & word generator
  const COMMON_ENGLISH_WORDS = [
    'and', 'against', 'do', 'up', 'only', 'so', 'many', 'before', 'give', 'look',
    'little', 'you', 'consider', 'life', 'high', 'present', 'new', 'from', 'keep', 'child',
    'than', 'number', 'fact', 'time', 'year', 'people', 'way', 'day', 'man', 'thing',
    'woman', 'world', 'school', 'state', 'family', 'student', 'group', 'country', 'problem', 'hand',
    'part', 'place', 'case', 'week', 'company', 'system', 'program', 'question', 'work', 'government',
    'night', 'point', 'home', 'water', 'room', 'mother', 'area', 'money', 'story', 'month',
    'right', 'study', 'book', 'eye', 'job', 'word', 'business', 'issue', 'side', 'kind',
    'head', 'house', 'service', 'friend', 'father', 'power', 'hour', 'game', 'line', 'end',
    'member', 'law', 'car', 'city', 'community', 'name', 'president', 'team', 'minute', 'idea',
    'body', 'information', 'back', 'parent', 'face', 'others', 'level', 'office', 'door', 'health',
    'person', 'art', 'history', 'party', 'result', 'change', 'morning', 'reason', 'research', 'moment',
    'air', 'teacher', 'force', 'education', 'think', 'say', 'go', 'come', 'know', 'get',
    'find', 'make', 'take', 'see', 'use', 'want', 'call', 'try', 'ask', 'need',
    'feel', 'become', 'leave', 'put', 'mean', 'let', 'begin', 'seem', 'help', 'talk',
    'turn', 'start', 'show', 'hear', 'play', 'run', 'move', 'like', 'live', 'believe',
    'hold', 'bring', 'happen', 'write', 'provide', 'sit', 'stand', 'lose', 'pay', 'meet',
    'include', 'continue', 'set', 'learn', 'lead', 'understand', 'watch', 'follow', 'stop', 'create',
    'speak', 'read', 'allow', 'add', 'spend', 'grow', 'open', 'walk', 'win', 'offer',
    'remember', 'love', 'appear', 'buy', 'wait', 'serve', 'send', 'expect', 'build', 'stay',
    'fall', 'cut', 'reach', 'remain', 'suggest', 'raise', 'pass', 'sell', 'require', 'report',
    'decide', 'pull', 'good', 'first', 'last', 'long', 'great', 'own', 'other', 'old',
    'big', 'different', 'small', 'large', 'next', 'early', 'young', 'important', 'few', 'public',
    'same', 'able', 'clear', 'sure', 'under', 'between', 'among', 'through', 'during', 'since',
    'without', 'within', 'along', 'across', 'behind', 'beyond', 'near', 'toward', 'always', 'never',
    'often', 'together', 'however', 'almost', 'enough', 'already', 'quite', 'simply', 'early', 'far'
  ];

  function generateRandomWordPassage(wordCount = 28) {
    const count = Math.max(10, Math.min(100, Number(wordCount) || 28));
    const words = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * COMMON_ENGLISH_WORDS.length);
      words.push(COMMON_ENGLISH_WORDS[idx]);
    }
    return words.join(' ');
  }

  // Section 10: 9 Targeted Punctuation & Capitalization Drill Categories
  const PUNCTUATION_DRILL_CATEGORIES = [
    {
      id: 'sentence_caps',
      title: '1. Sentence-Initial Capitals',
      rule: 'Every declarative, interrogative, imperative, or exclamatory sentence must start with an uppercase letter.'
    },
    {
      id: 'proper_nouns_i',
      title: '2. Proper Nouns, Days, Months & Pronoun "I"',
      rule: 'Capitalize specific names of people, places, organizations, days of the week, months, and always capitalize the pronoun "I".'
    },
    {
      id: 'periods_commas_colons_semicolons',
      title: '3. Periods, Commas, Colons & Semicolons',
      rule: 'Use commas after introductory clauses and in series, colons to introduce lists/explanations after a complete clause, and semicolons to link closely related independent clauses.'
    },
    {
      id: 'questions_exclamations',
      title: '4. Question Marks & Exclamation Marks',
      rule: 'Use a question mark at the end of a direct question (not an indirect question) and an exclamation mark for emphatic statements.'
    },
    {
      id: 'apostrophes',
      title: '5. Apostrophes in Contractions & Possession',
      rule: 'Use an apostrophe to show omitted letters in contractions (it\'s, don\'t) and ownership in possessive nouns (the team\'s, researchers\' data).'
    },
    {
      id: 'quotations_dialogue',
      title: '6. Quotation Marks & Dialogue',
      rule: 'Enclose direct speech in quotation marks and place commas and periods inside the closing quotation mark in standard American/international style.'
    },
    {
      id: 'parentheses_hyphens_dashes',
      title: '7. Parentheses, Hyphens & Dashes',
      rule: 'Use hyphens in compound modifiers before a noun (well-documented report) and parentheses for supplementary clarifications.'
    },
    {
      id: 'decimals_currency_separators',
      title: '8. Decimals, Percentages, Currency & Thousands Separators',
      rule: 'Use commas to group thousands (1,250), a period for decimals (1,250.50), and attach % directly to the number (25%).'
    },
    {
      id: 'punctuation_spacing',
      title: '9. Spacing Before & After Punctuation',
      rule: 'Never insert a space before a comma, period, colon, semicolon, question mark, or closing parenthesis; always place one space after.'
    }
  ];

  const PASSAGES = [
    // ==================== MODE A: GRAMMAR-FOCUSED SENTENCES ====================
    {
      id: 'gs_1',
      mode: 'grammar_sentences',
      difficulty: 'Beginner',
      grammarFocus: 'Subordinating Conjunctions (Although vs. Because)',
      conciseNote: 'Do not use "although" and "but" together in the same sentence; "although" alone joins the contrast.',
      hint: 'Notice the comma after the introductory "Although" clause, and avoid adding "but" before the main clause.',
      whyCorrect: 'In English, subordinating conjunctions like "although" or "though" already express contrast. Adding "but" creates a redundant double conjunction. Also, when a dependent clause comes first, follow it with a comma.',
      examples: [
        'Although the traffic was heavy, we reached the station on time.',
        'She finished the assignment early even though the instructions were complex.'
      ],
      text: 'Although the morning rain was heavy, the commuters arrived at the office on time.',
      acceptedAlternatives: [
        'Though the morning rain was heavy, the commuters arrived at the office on time.'
      ],
      focusSpans: [
        { token: 'Although', category: 'Conjunctions & Clause Structure', rule: 'Use "Although" to introduce a contrasting dependent clause without adding "but" later.' },
        { token: 'at', category: 'Prepositions (Time & Place)', rule: 'Use "at" with a specific destination point such as "at the office".' }
      ]
    },
    {
      id: 'gs_2',
      mode: 'grammar_sentences',
      difficulty: 'Intermediate',
      grammarFocus: 'Parallel Structure in Series',
      conciseNote: 'Items in a list joined by coordinating conjunctions must share the same grammatical form.',
      hint: 'All three verbs in the list use base infinitive forms after "to": draft, verify, and publish.',
      whyCorrect: 'Parallelism makes sentences clear and rhythmic. When you start a list after "to", every item in the series should use the same verb form (draft, verify, and publish) rather than mixing infinitives and "-ing" gerunds.',
      examples: [
        'The training improves typing speed, grammatical accuracy, and daily confidence.',
        'Engineers must design the circuit, test the voltage, and document the results.'
      ],
      text: 'Our editorial workflow requires writers to draft clear arguments, verify every source, and publish concise summaries.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'draft', category: 'Parallel Structure', rule: 'Keep verbs in a series parallel: draft, verify, and publish.' },
        { token: 'verify', category: 'Parallel Structure', rule: 'Keep verbs in a series parallel: draft, verify, and publish.' },
        { token: 'publish', category: 'Parallel Structure', rule: 'Keep verbs in a series parallel: draft, verify, and publish.' }
      ]
    },
    {
      id: 'gs_3',
      mode: 'grammar_sentences',
      difficulty: 'Intermediate',
      grammarFocus: 'Relative Pronouns (Who vs. Whom vs. Whose)',
      conciseNote: 'Use "whose" to show possession and "who" as the subject of a verb.',
      hint: '"Whose" modifies "research proposal", showing that the proposal belongs to the candidate.',
      whyCorrect: '"Whose" is the possessive form of "who" (and can refer to people or organizations). Do not confuse it with "who\'s", which is the contraction for "who is" or "who has".',
      examples: [
        'The architect whose design won the award spoke at the conference.',
        'Who is responsible for reviewing the final manuscript?'
      ],
      text: 'The fellowship committee selected the candidate whose research proposal addressed urban water conservation.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'whose', category: 'Relative Pronouns (who / whom / whose)', rule: 'Use "whose" for possession, never "who\'s" (which means "who is").' }
      ]
    },
    {
      id: 'gs_4',
      mode: 'grammar_sentences',
      difficulty: 'Advanced',
      grammarFocus: 'Dangling Participle Prevention',
      conciseNote: 'An introductory participial phrase must directly modify the subject that immediately follows the comma.',
      hint: 'Who reviewed the telemetry logs? "the lead engineer"—so "the lead engineer" must appear right after the comma.',
      whyCorrect: 'When a sentence begins with a modifier like "Having reviewed the telemetry logs,", the noun immediately following the comma must be the person who performed that action ("the lead engineer"), not "the server".',
      examples: [
        'Walking through the archive, the historian discovered an unpublished letter.',
        'After calibrating the sensor, the technician recorded the baseline temperature.'
      ],
      text: 'Having reviewed the telemetry logs carefully, the lead engineer identified the memory bottleneck within ten minutes.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'Having', category: 'Modifier Placement', rule: 'Ensure the introductory participial clause modifies the subject immediately after the comma.' }
      ]
    },

    // ==================== MODE B: COMMONLY CONFUSED PREPOSITIONS ====================
    {
      id: 'prep_1',
      mode: 'prepositions',
      subCategory: 'in / on / at',
      difficulty: 'Beginner',
      grammarFocus: 'Prepositions of Time & Place: in, on, at',
      conciseNote: 'Use "at" for exact clock times, "on" for specific days/dates, and "in" for months, years, and cities.',
      hint: 'Look at the three time/place markers: "at 09:00 a.m.", "on Monday", and "in Dhaka".',
      whyCorrect: 'English prepositions follow a scale of specificity: "at" pinpoints an exact clock time (at 09:00 a.m.), "on" targets a single day or date (on Monday), and "in" encloses larger spans or geographic areas (in Dhaka, in October).',
      examples: [
        'The workshop begins at 08:45 a.m. on Friday in the main auditorium.',
        'She was born on 21 October 2001 in Chattogram.'
      ],
      text: 'The regional strategy meeting starts at 09:00 a.m. on Monday in Dhaka.',
      acceptedAlternatives: [
        'The regional strategy meeting starts at 9:00 a.m. on Monday in Dhaka.'
      ],
      focusSpans: [
        { token: 'at', category: 'Prepositions (Time & Place)', rule: 'Use "at" before specific clock times (at 09:00 a.m.).' },
        { token: 'on', category: 'Prepositions (Time & Place)', rule: 'Use "on" before days of the week and specific dates (on Monday).' },
        { token: 'in', category: 'Prepositions (Time & Place)', rule: 'Use "in" before cities, countries, months, and years (in Dhaka).' }
      ]
    },
    {
      id: 'prep_2',
      mode: 'prepositions',
      subCategory: 'since / for',
      difficulty: 'Beginner',
      grammarFocus: 'Time Prepositions: since vs. for',
      conciseNote: 'Use "for" with a duration of time (four years) and "since" with a specific starting point (2022).',
      hint: '"Four years" measures how long (for); "2022" marks when it began (since).',
      whyCorrect: 'With present perfect verbs ("has worked", "have lived"), use "for" when stating the total quantity of time (for four years, for two hours) and "since" when naming the exact starting moment (since 2022, since Tuesday).',
      examples: [
        'We have waited for twenty minutes since the gates opened.',
        'Dr. Karim has taught linguistics since 2018.'
      ],
      text: 'Nadia has worked as a systems analyst for four years, and she has led the security team since 2024.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'for', category: 'Prepositions (Time Duration vs. Starting Point)', rule: 'Use "for" before a period or duration of time (for four years).' },
        { token: 'since', category: 'Prepositions (Time Duration vs. Starting Point)', rule: 'Use "since" before a specific starting point in time (since 2024).' }
      ]
    },
    {
      id: 'prep_3',
      mode: 'prepositions',
      subCategory: 'between / among',
      difficulty: 'Intermediate',
      grammarFocus: 'Distinction: between vs. among',
      conciseNote: 'Use "between" for distinct, one-to-one relationships and "among" for distribution across a collective group.',
      hint: '"Between" connects two specific departments; "among" distributes copies across all team members.',
      whyCorrect: '"Between" refers to clearly separated entities (such as two departments or specific named partners), whereas "among" describes something shared within an collective group of three or more.',
      examples: [
        'The agreement between the two universities fostered collaboration among the graduate students.',
        'Divide the reference guides among the five table groups.'
      ],
      text: 'The coordinator negotiated a schedule between the two departments and distributed the guidelines among all staff members.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'between', category: 'Prepositions (Two vs. Group)', rule: 'Use "between" for two distinct items or groups.' },
        { token: 'among', category: 'Prepositions (Two vs. Group)', rule: 'Use "among" for three or more items viewed as a group.' }
      ]
    },
    {
      id: 'prep_4',
      mode: 'prepositions',
      subCategory: 'by / with & into / in',
      difficulty: 'Intermediate',
      grammarFocus: 'Agent vs. Instrument (by/with) & Motion vs. Location (into/in)',
      conciseNote: 'Use "by" for the person/agent, "with" for the tool, "into" for inward motion, and "in" for static position.',
      hint: 'She walked "into" the lab (movement), stayed "in" the room (static), and calibrated the lens "with" a micrometer.',
      whyCorrect: '"Into" expresses movement from outside to inside, while "in" indicates static location. Similarly, passive actions are performed "by" an agent using ("with") a physical instrument.',
      examples: [
        'The sample was prepared by the chemist with a calibrated pipette.',
        'He stepped into the quiet library and sat in the corner.'
      ],
      text: 'The technician walked into the cleanroom and adjusted the optical sensor in the chamber with a precision wrench.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'into', category: 'Prepositions (Time & Place)', rule: 'Use "into" to indicate movement from outside to inside.' },
        { token: 'in', category: 'Prepositions (Time & Place)', rule: 'Use "in" for static position inside an enclosed space.' },
        { token: 'with', category: 'Prepositions (Agent vs. Instrument)', rule: 'Use "with" before the tool or instrument used to perform an action.' }
      ]
    },
    {
      id: 'prep_5',
      mode: 'prepositions',
      subCategory: 'during / while & to / for',
      difficulty: 'Advanced',
      grammarFocus: 'During vs. While & To vs. For',
      conciseNote: 'Follow "during" with a noun phrase and "while" with a verb clause; use "to" for transfer and "for" for purpose.',
      hint: '"During the seminar" (noun phrase) vs. "while reviewing" (participle/clause); "sent the report to the client for approval".',
      whyCorrect: '"During" is a preposition and must be followed by a noun ("during the seminar"). "While" is a conjunction and introduces a clause or "-ing" participle ("while taking notes"). Use "to" for the recipient and "for" for the intended purpose.',
      examples: [
        'Please remain quiet during the exam while the proctor distributes the sheets.',
        'I handed the draft to Tariq for a quick grammar check.'
      ],
      text: 'During the quarterly seminar, Maya sent the updated forecast to the director for final approval while taking detailed notes.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'During', category: 'Prepositions vs. Conjunctions (during/while)', rule: 'Use "During" before a noun phrase (During the quarterly seminar).' },
        { token: 'to', category: 'Prepositions (Direction vs. Purpose)', rule: 'Use "to" to indicate the recipient of an action (sent to the director).' },
        { token: 'for', category: 'Prepositions (Direction vs. Purpose)', rule: 'Use "for" to express purpose or reason (for final approval).' },
        { token: 'while', category: 'Prepositions vs. Conjunctions (during/while)', rule: 'Use "while" before a verb clause or "-ing" participial phrase.' }
      ]
    },

    // ==================== MODE C: ARTICLES AND DETERMINERS ====================
    {
      id: 'art_1',
      mode: 'articles',
      subCategory: 'a / an / the',
      difficulty: 'Beginner',
      grammarFocus: 'Phonetic Articles: a vs. an vs. the',
      conciseNote: 'Choose "a" or "an" based on the initial sound (not spelling) of the next word; use "the" for specific known items.',
      hint: '"university" starts with a consonant "yoo" sound ("a university"), whereas "hour" starts with a silent "h" vowel sound ("an hour").',
      whyCorrect: 'Article choice depends on pronunciation: "university" begins with the consonant sound /juː/, so it takes "a". "Hour" has a silent "h" and begins with a vowel sound, so it takes "an". "The" points to a specific, identifiable noun ("the main library").',
      examples: [
        'It takes an hour to reach a European embassy from the airport.',
        'She is an honest researcher at a reputable institute.'
      ],
      text: 'It takes an hour by metro to travel from a university campus to the national archive.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'an', category: 'Articles (a / an / the)', rule: 'Use "an" before "hour" because the "h" is silent and the word begins with a vowel sound.' },
        { token: 'a', category: 'Articles (a / an / the)', rule: 'Use "a" before "university" because it begins with a consonant /yoo/ sound.' },
        { token: 'the', category: 'Articles (a / an / the)', rule: 'Use "the" when referring to a specific, unique institution.' }
      ]
    },
    {
      id: 'art_2',
      mode: 'articles',
      subCategory: 'much / many / few / little',
      difficulty: 'Intermediate',
      grammarFocus: 'Countable vs. Uncountable Quantifiers: many/few vs. much/little',
      conciseNote: 'Use "many" and "a few" with countable plural nouns; use "much" and "a little" with uncountable nouns.',
      hint: '"Errors" can be counted individually (many/few); "patience" and "time" are uncountable mass nouns (much/little).',
      whyCorrect: 'Countable nouns have plural forms (errors, sentences) and pair with "many" or "few". Uncountable nouns represent abstract concepts or masses (time, information, equipment) and pair with "much" or "little".',
      examples: [
        'We do not have much time, so let us review a few key examples.',
        'How many articles did you read, and how much research remains?'
      ],
      text: 'Although we did not have much time before the deadline, a few careful edits eliminated many avoidable errors.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'much', category: 'Quantifiers (Countable vs. Uncountable)', rule: 'Use "much" with uncountable nouns like "time".' },
        { token: 'few', category: 'Quantifiers (Countable vs. Uncountable)', rule: 'Use "a few" with plural countable nouns like "edits".' },
        { token: 'many', category: 'Quantifiers (Countable vs. Uncountable)', rule: 'Use "many" with plural countable nouns like "errors".' }
      ]
    },
    {
      id: 'art_3',
      mode: 'articles',
      subCategory: 'some / any & this / these',
      difficulty: 'Intermediate',
      grammarFocus: 'Determiners: some/any & this/that/these/those',
      conciseNote: 'Use "some" in affirmative clauses, "any" in negative clauses, "this" for singular, and "these" for plural.',
      hint: '"This report" is singular affirmative ("some recommendations"), while the negative clause uses "any ambiguity".',
      whyCorrect: '"This" agrees with singular "report" and "these" agrees with plural "guidelines". In standard English, "some" is used in positive statements ("contains some practical recommendations") while "any" is used after negatives ("without any ambiguity").',
      examples: [
        'These exercises provide some helpful hints without causing any confusion.',
        'This module does not require any external plugins.'
      ],
      text: 'This policy brief includes some practical recommendations so that these teams can operate without any ambiguity.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'This', category: 'Demonstratives (Singular vs. Plural)', rule: 'Use "This" before the singular noun "policy brief".' },
        { token: 'some', category: 'Determiners (some / any)', rule: 'Use "some" in affirmative statements.' },
        { token: 'these', category: 'Demonstratives (Singular vs. Plural)', rule: 'Use "these" before the plural noun "teams".' },
        { token: 'any', category: 'Determiners (some / any)', rule: 'Use "any" in negative contexts such as after "without".' }
      ]
    },

    // ==================== MODE D: VERB TENSES AND AGREEMENT ====================
    {
      id: 'verb_1',
      mode: 'tenses_agreement',
      subCategory: 'Subject-Verb Agreement',
      difficulty: 'Beginner',
      grammarFocus: 'Subject-Verb Agreement with Prepositional Phrases',
      conciseNote: 'The verb must agree with the true head subject, not with nouns inside a prepositional phrase.',
      hint: 'The true subject is singular "The summary" (not "metrics"), so the verb is singular "is".',
      whyCorrect: 'A prepositional phrase ("of the quarterly performance metrics") coming between the subject and the verb never changes the number of the subject. Because "The summary" is singular, it takes the singular verb "is" and "shows".',
      examples: [
        'A box of spare mechanical switches is on the workbench.',
        'The quality of these recordings has improved significantly.'
      ],
      text: 'The summary of the quarterly performance metrics is ready and shows steady improvement across all regions.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'is', category: 'Subject-Verb Agreement & Be-Verbs', rule: 'Agree with the singular head noun "summary", not the plural object "metrics".' },
        { token: 'shows', category: 'Subject-Verb Agreement & Be-Verbs', rule: 'Use singular "shows" to match the singular subject "The summary".' }
      ]
    },
    {
      id: 'verb_2',
      mode: 'tenses_agreement',
      subCategory: 'Neither...Nor Agreement',
      difficulty: 'Intermediate',
      grammarFocus: 'Correlative Agreement: Neither...Nor / Either...Or',
      conciseNote: 'With "neither...nor" or "either...or", the verb agrees with the closer subject.',
      hint: 'Compare the two subjects: "the project manager" (singular) and "the engineers" (plural, closer to the verb "were").',
      whyCorrect: 'Proximity rule: when subjects are joined by "neither...nor" or "either...or", match the verb to the subject closest to it. Here, plural "engineers" is right before the verb, so plural "were" is required.',
      examples: [
        'Neither the assistants nor the director was aware of the delay.',
        'Either the cables or the power adapter is causing the flicker.'
      ],
      text: 'Neither the project manager nor the software engineers were satisfied with the initial latency benchmark.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'were', category: 'Subject-Verb Agreement & Be-Verbs', rule: 'After "neither...nor", match the verb to the nearer subject ("engineers" -> plural "were").' }
      ]
    },
    {
      id: 'verb_3',
      mode: 'tenses_agreement',
      subCategory: 'Past Perfect & Conditionals',
      difficulty: 'Advanced',
      grammarFocus: 'Third Conditional (Had + Past Participle -> Would Have + Past Participle)',
      conciseNote: 'In counterfactual past conditionals, use "had + past participle" in the if-clause and "would have + past participle" in the main clause.',
      hint: 'Never write "If we would have..."; use "If we had backed up..." paired with "we would have avoided...".',
      whyCorrect: 'The third conditional describes an unreal past situation and its hypothetical past result. The "if" clause uses the past perfect ("had backed up"), and the result clause uses the modal perfect ("would have avoided").',
      examples: [
        'If she had left ten minutes earlier, she would have caught the express train.',
        'Had the team tested the migration script, the outage would not have occurred.'
      ],
      text: 'If the team had verified the backup configuration earlier, they would have prevented the data synchronization delay.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'had', category: 'Auxiliary Agreement & Perfect Tense', rule: 'Use past perfect ("had verified") in the if-clause of a third conditional, never "would have".' },
        { token: 'would', category: 'Auxiliary Agreement & Perfect Tense', rule: 'Use "would have + past participle" in the result clause.' }
      ]
    },
    {
      id: 'verb_4',
      mode: 'tenses_agreement',
      subCategory: 'Future Perfect & Present Perfect',
      difficulty: 'Intermediate',
      grammarFocus: 'Future Perfect Tense (will have + past participle)',
      conciseNote: 'Use the future perfect to describe an action that will be completed before a specified point in the future.',
      hint: '"By the end of this month" signals completion before a future deadline: "will have completed".',
      whyCorrect: 'Phrases starting with "By..." followed(or implied) by a future time marker require the future perfect ("will have completed") to show that the action finishes prior to that future milestone.',
      examples: [
        'By December, our class will have practiced over five hundred grammar structures.',
        'She will have written the final chapter before the editor arrives.'
      ],
      text: 'By the end of this quarter, the engineering team will have migrated all legacy databases to the new cluster.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'have', category: 'Auxiliary Agreement & Perfect Tense', rule: 'Combine "will have" with the past participle ("migrated") for the future perfect tense.' },
        { token: 'migrated', category: 'Auxiliary Agreement & Perfect Tense', rule: 'Use the past participle "migrated" after "will have".' }
      ]
    },

    // ==================== MODE E: PUNCTUATION AND CAPITALIZATION (ALL 9 DRILL AREAS) ====================
    {
      id: 'punc_1',
      mode: 'punctuation_caps',
      subCategory: 'sentence_caps',
      difficulty: 'Beginner',
      grammarFocus: 'Sentence-Initial Capitalization & Terminal Periods',
      conciseNote: 'Capitalize the first word of every new sentence after a period, question mark, or exclamation mark.',
      hint: 'Watch the three sentence openings: "Clear", "It", and "Always". Each follows a period and a single space.',
      whyCorrect: 'Sentence boundaries require two visual signals: a terminal punctuation mark (like a period) immediately after the final word, and an uppercase letter at the start of the next sentence.',
      examples: [
        'Practice builds muscle memory. Accuracy comes before raw speed.',
        'Read the prompt carefully. Then type each word steadily.'
      ],
      text: 'Clear writing requires deliberate punctuation. It guides the reader through every clause. Always review your capital letters.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'Clear', category: 'Capitalization', rule: 'Start the first sentence with a capital letter.' },
        { token: 'It', category: 'Capitalization', rule: 'Start the second sentence with a capital letter after the period.' },
        { token: 'Always', category: 'Capitalization', rule: 'Start the third sentence with a capital letter after the period.' }
      ]
    },
    {
      id: 'punc_2',
      mode: 'punctuation_caps',
      subCategory: 'proper_nouns_i',
      difficulty: 'Beginner',
      grammarFocus: 'Proper Nouns, Days, Months, and the Pronoun "I"',
      conciseNote: 'Capitalize days (Wednesday), months (October), geographical names (Dhaka), people, and the pronoun "I".',
      hint: 'Check "Wednesday", "October", "Professor Ahmed", "I", and "Dhaka University". Seasons like "autumn" stay lowercase.',
      whyCorrect: 'Proper nouns name specific people, institutions, cities, days, and calendar months, so they always take an initial capital letter. The first-person singular pronoun "I" is always uppercase in English.',
      examples: [
        'On Tuesday in November, I met Dr. Sen in Sylhet.',
        'My colleague and I will attend the symposium on Friday.'
      ],
      text: 'On Wednesday in October, Professor Ahmed and I presented our linguistics study at Dhaka University.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'Wednesday', category: 'Capitalization', rule: 'Days of the week are always capitalized.' },
        { token: 'October,', category: 'Capitalization', rule: 'Months of the year are always capitalized.' },
        { token: 'I', category: 'Capitalization', rule: 'The pronoun "I" must always be capitalized.' },
        { token: 'Dhaka', category: 'Capitalization', rule: 'Proper place and institution names are always capitalized.' }
      ]
    },
    {
      id: 'punc_3',
      mode: 'punctuation_caps',
      subCategory: 'periods_commas_colons_semicolons',
      difficulty: 'Intermediate',
      grammarFocus: 'Commas, Colons, and Semicolons in Complex Sentences',
      conciseNote: 'Use a colon after a complete clause to introduce a list, and a semicolon to link two related independent clauses.',
      hint: 'Notice the colon after "three habits:", the Oxford comma before "and", and the semicolon before "consistency".',
      whyCorrect: 'A colon introduces a list only when preceded by a complete independent clause ("Mastery depends on three habits:"). A semicolon joins two closely connected independent clauses without a coordinating conjunction.',
      examples: [
        'We packed three essentials: a laptop, a notebook, and a charger; everything else stayed behind.',
        'The first draft was finished on time; however, the charts required revision.'
      ],
      text: 'Mastery depends on three habits: steady posture, accurate keystrokes, and mindful review; consistency always beats haste.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'habits:', category: 'Punctuation', rule: 'Use a colon after an independent clause to introduce an explanatory list.' },
        { token: 'review;', category: 'Punctuation', rule: 'Use a semicolon to join two closely related independent clauses.' }
      ]
    },
    {
      id: 'punc_4',
      mode: 'punctuation_caps',
      subCategory: 'questions_exclamations',
      difficulty: 'Beginner',
      grammarFocus: 'Direct Questions vs. Indirect Questions & Exclamations',
      conciseNote: 'End direct questions with "?" and emphatic interjections/exclamations with "!", but end indirect questions with ".".',
      hint: 'The first sentence is a direct question ("?"), the second is an indirect question ("."), and the third is an exclamation ("!").',
      whyCorrect: '"Have you verified the dataset?" asks a direct question and needs a question mark. "She asked whether the dataset was ready." is a declarative sentence reporting a question indirectly, so it takes a period.',
      examples: [
        'Where did you save the configuration file?',
        'He wondered why the build succeeded on the first attempt. What a relief!'
      ],
      text: 'Have you reviewed the updated style guide yet? The editor asked whether we had checked every citation. What a thorough report!',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'yet?', category: 'Punctuation', rule: 'End a direct question with a question mark.' },
        { token: 'citation.', category: 'Punctuation', rule: 'End an indirect question ("asked whether...") with a period, not a question mark.' },
        { token: 'report!', category: 'Punctuation', rule: 'Use an exclamation mark for an emphatic exclamatory phrase ("What a...").' }
      ]
    },
    {
      id: 'punc_5',
      mode: 'punctuation_caps',
      subCategory: 'apostrophes',
      difficulty: 'Intermediate',
      grammarFocus: 'Apostrophes: Contractions (it\'s, don\'t) vs. Possession (its, students\')',
      conciseNote: '"It\'s" means "it is/has"; possessive "its" has no apostrophe. Plural nouns ending in "s" take an apostrophe after the "s".',
      hint: 'Compare "It\'s" (contraction), "its" (possessive pronoun), "committee\'s" (singular possessive), and "researchers\'" (plural possessive).',
      whyCorrect: 'Possessive pronouns (its, yours, theirs, ours) never take an apostrophe. Singular nouns form possession with \'s (committee\'s), while regular plural nouns ending in s add only an apostrophe after the s (researchers\').',
      examples: [
        "It's clear that the company's new software improved its reliability.",
        "The teachers' lounge is next to the principal's office."
      ],
      text: "It's essential that the committee's schedule respects the researchers' deadlines while preserving its own quality standards.",
      acceptedAlternatives: [],
      focusSpans: [
        { token: "It's", category: "Possessive vs. Contraction (its / it's)", rule: 'Use "It\'s" with an apostrophe as the contraction for "It is".' },
        { token: "committee's", category: 'Apostrophes & Contractions', rule: 'Add \'s to singular noun "committee" to show possession.' },
        { token: "researchers'", category: 'Apostrophes & Contractions', rule: 'Place the apostrophe after the "s" for plural possessive "researchers\'".' },
        { token: 'its', category: "Possessive vs. Contraction (its / it's)", rule: 'Use "its" without an apostrophe for possession.' }
      ]
    },
    {
      id: 'punc_6',
      mode: 'punctuation_caps',
      subCategory: 'quotations_dialogue',
      difficulty: 'Intermediate',
      grammarFocus: 'Quotation Marks and Dialogue Punctuation',
      conciseNote: 'Place commas and periods inside closing quotation marks, and capitalize the first word of a complete quoted sentence.',
      hint: 'Notice the comma inside `"We have finalized the grammar engine,"` and the comma after `said,` before continuing the quote.',
      whyCorrect: 'In standard dialogue formatting, a comma separates the quoted speech from the speaker tag (placed inside the quotation marks), and a divided sentence continues with a lowercase word ("and every test...") if the first part was not a complete stop.',
      examples: [
        '"Please check the figures carefully," Rafiq said, "before we export the sheet."',
        'She asked, "Did everyone receive the updated agenda?"'
      ],
      text: '"We have finalized the grammar engine," the lead developer said, "and every automated test passed on the first run."',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'engine,"', category: 'Punctuation', rule: 'Place the comma inside the closing quotation mark before the dialogue tag.' },
        { token: 'run."', category: 'Punctuation', rule: 'Place the terminal period inside the closing quotation mark.' }
      ]
    },
    {
      id: 'punc_7',
      mode: 'punctuation_caps',
      subCategory: 'parentheses_hyphens_dashes',
      difficulty: 'Advanced',
      grammarFocus: 'Parentheses, Compound-Modifier Hyphens, and Dashes',
      conciseNote: 'Hyphenate compound adjectives before a noun ("real-time feedback"), and keep sentence periods outside closing parentheses.',
      hint: 'Hyphenate "real-time" and "well-structured" before their nouns; place the final period outside `(see Section 4).`',
      whyCorrect: 'When two words work together as a single unit modifying a following noun ("real-time analytics", "well-structured guide"), join them with a hyphen. When a parenthetical note sits at the end of a sentence, the terminal period goes outside the closing parenthesis.',
      examples: [
        'We deployed a high-speed parser for the client-facing dashboard (version 2.1).',
        'The decision was well structured (even under tight time constraints).'
      ],
      text: 'The trainer provides real-time feedback and a well-structured study guide for self-paced learners (see Section 4).',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'real-time', category: 'Punctuation', rule: 'Hyphenate compound modifier "real-time" before the noun "feedback".' },
        { token: 'well-structured', category: 'Punctuation', rule: 'Hyphenate "well-structured" when it precedes the noun it modifies.' },
        { token: '4).', category: 'Punctuation', rule: 'Place the sentence period outside the closing parenthesis when the parenthetical is part of the sentence.' }
      ]
    },
    {
      id: 'punc_8',
      mode: 'punctuation_caps',
      subCategory: 'decimals_currency_separators',
      difficulty: 'Intermediate',
      grammarFocus: 'Decimals, Percentages, Currency, and Thousands Separators',
      conciseNote: 'Use commas for thousands (1,250), periods for decimals (.50), and attach % directly to the numeral (25%).',
      hint: 'Type "Tk 1,250.50" with a comma after 1 and a decimal point before 50, and "25%" with no space before %.',
      whyCorrect: 'Standard financial and statistical notation separates thousands with commas to aid readability, uses a point for decimal fractions, and attaches the percent sign directly to the number without a space.',
      examples: [
        'The invoice total was Tk 14,800.75 after a 15% institutional discount.',
        'Output increased by 12.5% across 1,500 measured sessions.'
      ],
      text: 'After applying the 25% educator discount, the annual license cost Tk 1,250.50 for 1,200 registered students.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: '25%', category: 'Numbers & Symbols', rule: 'Attach the percent symbol (%) directly to the number without a space.' },
        { token: '1,250.50', category: 'Numbers & Symbols', rule: 'Use a comma as the thousands separator and a period for the decimal point.' }
      ]
    },
    {
      id: 'punc_9',
      mode: 'punctuation_caps',
      subCategory: 'punctuation_spacing',
      difficulty: 'Beginner',
      grammarFocus: 'Correct Spacing Before and After Punctuation',
      conciseNote: 'Attach commas, periods, semicolons, and colons directly to the preceding word, followed by exactly one space.',
      hint: 'Ensure there is zero space before any comma, colon, or period, and exactly one space after each mark.',
      whyCorrect: 'Trailing punctuation marks belong visually to the word that precedes them. Putting a space before a comma or period causes awkward line breaks and typographical errors.',
      examples: [
        'First, position your wrists naturally; second, keep your eyes on the screen.',
        'Correct spacing makes sentences clean, readable, and professional.'
      ],
      text: 'First, relax your shoulders; second, keep your wrists level: clean spacing makes every comma, colon, and period effortless.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'First,', category: 'Punctuation Spacing', rule: 'Place the comma immediately after "First" with no preceding space.' },
        { token: 'shoulders;', category: 'Punctuation Spacing', rule: 'Place the semicolon immediately after the word, followed by one space.' },
        { token: 'level:', category: 'Punctuation Spacing', rule: 'Place the colon immediately after the word, followed by one space.' }
      ]
    },

    // ==================== MODE F: NUMBERS, DATES, TIMES, CURRENCY, AND SYMBOLS ====================
    {
      id: 'num_1',
      mode: 'numbers_symbols',
      difficulty: 'Intermediate',
      grammarFocus: 'Dates, Clock Times, Currency, Percentages, and Version Numbers',
      conciseNote: 'Use "on" before full dates (21 October 2026), "at" before clock times (08:45 a.m.), and exact currency formatting (Tk 1,250.50).',
      hint: 'Includes all benchmark formats: 21 October 2026, 08:45 a.m., version 4.2, Tk 1,250.50, and 25%.',
      whyCorrect: 'In international and Commonwealth date formatting ("21 October 2026"), the day precedes the month without an internal comma. Abbreviations like "a.m." take periods, and "Tk 1,250.50" pairs the currency code with thousands and decimal separators.',
      examples: [
        'On 21 October 2026 at 08:45 a.m., we deployed version 4.2 of the portal.',
        'The maintenance fee of Tk 1,250.50 reflects a 25% seasonal reduction.'
      ],
      text: 'On 21 October 2026 at 08:45 a.m., we released version 4.2, reducing the subscription fee by 25% to Tk 1,250.50.',
      acceptedAlternatives: [
        'On 21 October 2026 at 8:45 a.m., we released version 4.2, reducing the subscription fee by 25% to Tk 1,250.50.'
      ],
      focusSpans: [
        { token: '2026', category: 'Numbers & Dates', rule: 'Write four-digit calendar years without commas.' },
        { token: '08:45', category: 'Numbers & Times', rule: 'Separate hours and minutes with a colon.' },
        { token: '1,250.50.', category: 'Currency & Decimals', rule: 'Format currency with a thousands comma and two decimal places.' }
      ]
    },
    {
      id: 'num_2',
      mode: 'numbers_symbols',
      difficulty: 'Advanced',
      grammarFocus: 'Technical Metrics, Ratios, Currency & Reference Symbols',
      conciseNote: 'Maintain exact symbol placement for issue numbers (#), percentages (%), ranges, and currency.',
      hint: 'Pay close attention to Ticket #408, 99.4%, 14:30, and Tk 4,500.00.',
      whyCorrect: 'Technical and financial writing requires exact symbol placement: "#" precedes an identifier without a space (#408), "%" follows a numeral without a space (99.4%), and "Tk" precedes the figure with a single space.',
      examples: [
        'Ticket #102 confirmed a 99.8% uptime across 24 servers.',
        'Invoice #890 for Tk 3,400.00 was paid at 11:15 a.m.'
      ],
      text: 'Update #408 improved parsing accuracy to 99.4% at 02:15 p.m., saving Tk 4,500.00 across 120 active workstations.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: '#408', category: 'Numbers & Symbols', rule: 'Attach the hash symbol (#) directly before the ticket/issue number.' },
        { token: '99.4%', category: 'Numbers & Symbols', rule: 'Use a period for the decimal point and attach % directly.' }
      ]
    },

    // ==================== MODE G: PARAGRAPH PRACTICE ====================
    {
      id: 'para_1',
      mode: 'paragraphs',
      difficulty: 'Intermediate',
      grammarFocus: 'Cohesive Multi-Sentence Grammar: Prepositions, Tenses, and Punctuation',
      conciseNote: 'Notice how tense consistency (present perfect to simple present) and transition commas link a complete paragraph.',
      hint: 'Read the flow across all three sentences: present perfect ("has transformed"), contrast ("However,"), and parallel verbs.',
      whyCorrect: 'A coherent paragraph establishes context using the present perfect ("has transformed"), uses a transitional adverb followed by a comma ("However,"), and maintains consistent present-tense verbs for general truths.',
      examples: [
        'Consistent practice builds fluency. Moreover, immediate feedback prevents bad habits from taking root.',
        'Since the semester began, students have written twelve essays; consequently, their grammar has improved.'
      ],
      text: 'Over the past decade, digital communication has transformed how professionals collaborate across time zones. However, clear grammar and accurate punctuation remain indispensable in every message. When writers choose precise prepositions and consistent verb tenses, their readers understand complex ideas without hesitation.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'has', category: 'Auxiliary Agreement & Perfect Tense', rule: 'Use singular "has transformed" with singular uncountable subject "digital communication".' },
        { token: 'However,', category: 'Punctuation', rule: 'Follow an introductory conjunctive adverb ("However,") with a comma.' },
        { token: 'remain', category: 'Subject-Verb Agreement & Be-Verbs', rule: 'Compound subject ("clear grammar and accurate punctuation") takes the plural verb "remain".' }
      ]
    },
    {
      id: 'para_2',
      mode: 'paragraphs',
      difficulty: 'Advanced',
      grammarFocus: 'Analytical Paragraph: Articles, Clauses, and Data Integration',
      conciseNote: 'Combines phonetic articles ("an hour"), specific dates ("on 21 October 2026"), and subordinate clause punctuation.',
      hint: 'Watch the transition from the introductory time phrase to the main clause, plus the semicolon in the second sentence.',
      whyCorrect: 'Analytical writing blends narrative clauses with exact figures. Use commas after introductory prepositional/adverbial phrases and semicolons between balanced independent observations.',
      examples: [
        'During the audit on 15 May 2026, the team reviewed 450 records; only two required correction.'
      ],
      text: 'During the annual review on 21 October 2026, our training team analyzed typing telemetry from 350 learners. Learners who practiced for half an hour each morning improved their net speed by 25%; moreover, their punctuation errors dropped by nearly half. Deliberate accuracy always accelerates long-term fluency.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'on', category: 'Prepositions (Time & Place)', rule: 'Use "on" before a specific calendar date.' },
        { token: 'an', category: 'Articles (a / an / the)', rule: 'Use "an" before "hour" because the initial "h" is silent.' },
        { token: '25%;', category: 'Punctuation', rule: 'Use a semicolon before the conjunctive adverb "moreover," when joining two independent clauses.' }
      ]
    },

    // ==================== MODE H: DIFFICULT WORDS AND SPELLING ====================
    {
      id: 'spell_1',
      mode: 'spelling',
      difficulty: 'Intermediate',
      grammarFocus: 'Double Consonants & Vowel Pairs: accommodate, occurrence, indispensable',
      conciseNote: 'Memory cues: "accommodate" has two c\'s and two m\'s; "occurrence" has two c\'s and two r\'s; "indispensable" ends in -able.',
      hint: 'Double check: a-c-c-o-m-m-o-d-a-t-e, o-c-c-u-r-r-e-n-c-e, and i-n-d-i-s-p-e-n-s-a-b-l-e.',
      whyCorrect: 'Many English words derived from Latin prefixes assimilate consonants: ad + commodare -> accommodate (cc, mm); ob + currere -> occurrence (cc, rr). Remember "-ance" vs "-ence" and "-able" vs "-ible".',
      examples: [
        'The conference hall can accommodate four hundred guests.',
        'Regular maintenance prevents any unexpected occurrence of downtime.'
      ],
      text: 'Reliable documentation is indispensable when engineers must accommodate a rare system occurrence without delay.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'indispensable', category: 'Spelling Rule', rule: 'Spelled with "-sable" (indispensable), not "-sible".' },
        { token: 'accommodate', category: 'Spelling Rule', rule: 'Contains both double "c" and double "m" (accommodate).' },
        { token: 'occurrence', category: 'Spelling Rule', rule: 'Contains double "c", double "r", and ends in "-ence" (occurrence).' }
      ]
    },
    {
      id: 'spell_2',
      mode: 'spelling',
      difficulty: 'Advanced',
      grammarFocus: 'Tricky Stems: conscientious, pronunciation, perseverance, separate',
      conciseNote: 'Note that "pronounce" has "ou", but "pronunciation" drops the "o" ("nun"); "separate" has "a" in the middle ("a rat").',
      hint: 'Watch "pronunciation" (n-u-n, not n-o-u-n), "conscientious", "separate", and "perseverance".',
      whyCorrect: 'English vowel reduction often alters spelling between verbs and nouns ("pronounce" -> "pronunciation"). Keeping a mental cue like "there is A RAT in sepARATe" eliminates one of the most frequent spelling mistakes.',
      examples: [
        'A conscientious student practices pronunciation and grammar in separate drills.',
        'Quiet perseverance turns difficult vocabulary into natural fluency.'
      ],
      text: 'A conscientious learner practices pronunciation and grammar in separate drills with steady perseverance.',
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'conscientious', category: 'Spelling Rule', rule: 'Spelled c-o-n-s-c-i-e-n-t-i-o-u-s (from conscience + -tious).' },
        { token: 'pronunciation', category: 'Spelling Rule', rule: 'Spelled p-r-o-n-u-n-c-i-a-t-i-o-n (no "o" after the first "n").' },
        { token: 'separate', category: 'Spelling Rule', rule: 'Spelled s-e-p-a-r-a-t-e (with an "a" after "p", not "e").' },
        { token: 'perseverance', category: 'Spelling Rule', rule: 'Ends in "-ance" (p-e-r-s-e-v-e-r-a-n-c-e).' }
      ]
    },

    // ==================== MODE J: MIXED CHALLENGE ====================
    {
      id: 'mix_1',
      mode: 'mixed_challenge',
      difficulty: 'Advanced',
      grammarFocus: 'Full-Spectrum Challenge: Grammar, Dates, Currency, Dialogue & Spelling',
      conciseNote: 'Combines dialogue quotation marks, exact date/time prepositions (on/at), Tk currency, and subject-verb agreement.',
      hint: 'Includes quotation marks, "on 21 October 2026 at 08:45 a.m.", "version 4.2", "Tk 1,250.50", and "25%".',
      whyCorrect: 'This comprehensive drill tests whether you can sustain typing rhythm while switching between quotation marks, capital letters, numeric symbols, and accurate prepositions ("on" for date, "at" for time).',
      examples: [
        '"On 21 October 2026 at 08:45 a.m., version 4.2 will go live," the coordinator announced.'
      ],
      text: '"On 21 October 2026 at 08:45 a.m., we will launch version 4.2," the director announced; "furthermore, our Tk 1,250.50 plan includes a 25% scholarship for conscientious students."',
      acceptedAlternatives: [
        '"On 21 October 2026 at 8:45 a.m., we will launch version 4.2," the director announced; "furthermore, our Tk 1,250.50 plan includes a 25% scholarship for conscientious students."'
      ],
      focusSpans: [
        { token: '"On', category: 'Prepositions (Time & Place)', rule: 'Use "On" before the specific date 21 October 2026.' },
        { token: 'at', category: 'Prepositions (Time & Place)', rule: 'Use "at" before the exact clock time 08:45 a.m.' },
        { token: 'announced;', category: 'Punctuation', rule: 'Use a semicolon before "furthermore" when continuing a second independent quoted clause.' },
        { token: 'conscientious', category: 'Spelling Rule', rule: 'Spelled c-o-n-s-c-i-e-n-t-i-o-u-s.' }
      ]
    },
    {
      id: 'mix_2',
      mode: 'mixed_challenge',
      difficulty: 'Advanced',
      grammarFocus: 'Conditional Logic, Correlative Agreement & Financial Precision',
      conciseNote: 'Combines "Neither...nor" proximity agreement, articles ("an hour"), and exact numeric punctuation.',
      hint: 'Check "Neither the analyst nor the auditors were...", "within an hour", and "Tk 9,840.25 (a 15% savings)".',
      whyCorrect: 'Master-level typing requires handling parenthetical numbers, apostrophes, and agreement simultaneously without breaking rhythm.',
      examples: [
        'Neither the manager nor the associates were surprised by the 15% efficiency gain.'
      ],
      text: "Neither the lead analyst nor the external auditors were surprised that the system's upgrade finished within an hour, reducing monthly overhead by Tk 9,840.25 (a 15% savings).",
      acceptedAlternatives: [],
      focusSpans: [
        { token: 'were', category: 'Subject-Verb Agreement & Be-Verbs', rule: 'Agrees with the nearer plural subject "auditors".' },
        { token: "system's", category: 'Apostrophes & Contractions', rule: 'Singular possessive noun takes \'s.' },
        { token: 'an', category: 'Articles (a / an / the)', rule: 'Use "an" before silent-h "hour".' }
      ]
    },

    // ==================== MODE K: NORMAL WORDS (NO PUNCTUATION) ====================
    {
      id: 'nw_1',
      mode: 'normal_words',
      subCategory: 'Top 200 Everyday Words',
      difficulty: 'Beginner',
      grammarFocus: 'Normal Words Without Punctuation (Core High-Frequency Mix)',
      conciseNote: 'Pure lowercase English words with zero punctuation or capital letters—ideal for building raw word-flow rhythm.',
      hint: 'Keep a steady spacebar rhythm between lowercase words; no Shift key or punctuation marks are needed.',
      whyCorrect: 'Practicing high-frequency English sight words in lowercase builds automatic finger transitions for common bigrams and trigrams.',
      examples: [
        'and against do up only so many before give and look little you consider',
        'life high present new many little you from keep child than number fact consider'
      ],
      text: 'and against do up only so many before give and look little you consider life high present new many little you from keep child than number fact consider',
      acceptedAlternatives: [],
      focusSpans: []
    },
    {
      id: 'nw_2',
      mode: 'normal_words',
      subCategory: 'Top 200 Everyday Words',
      difficulty: 'Beginner',
      grammarFocus: 'Normal Words Without Punctuation (Common Nouns & Time Words)',
      conciseNote: 'High-frequency everyday nouns typed in continuous lowercase flow without punctuation.',
      hint: 'Focus on smooth transitions between short 3-to-7 letter everyday words.',
      whyCorrect: 'These core nouns make up a large share of everyday English writing and correspondence.',
      examples: [
        'time year people way day thing world school state family student group'
      ],
      text: 'time year people way day thing world school state family student group country problem hand part place case week company system program question work night point home water',
      acceptedAlternatives: [],
      focusSpans: []
    },
    {
      id: 'nw_3',
      mode: 'normal_words',
      subCategory: 'Verbs & Action Words',
      difficulty: 'Beginner',
      grammarFocus: 'Normal Words Without Punctuation (Essential English Verbs)',
      conciseNote: 'Base-form everyday English verbs without punctuation or uppercase letters.',
      hint: 'Type continuously in lowercase—watch double-letter verbs like "call", "feel", "need", "keep", and "seem".',
      whyCorrect: 'Fluency with core English verbs accelerates both sentence composition and raw typing speed.',
      examples: [
        'think say go come know get give find make take see look use work'
      ],
      text: 'think say go come know get give find make take see look use work want call try ask need feel become leave put mean keep let begin seem help talk turn start show',
      acceptedAlternatives: [],
      focusSpans: []
    },
    {
      id: 'nw_4',
      mode: 'normal_words',
      subCategory: 'Connectors & Prepositions',
      difficulty: 'Intermediate',
      grammarFocus: 'Normal Words Without Punctuation (Prepositions & Connectors)',
      conciseNote: 'Practice English prepositions and linking words in pure lowercase format without punctuation.',
      hint: 'Great for building speed on connecting words like between, among, through, during, before, and without.',
      whyCorrect: 'Prepositions and conjunctions link clauses in every sentence; typing them effortlessly frees mental focus for grammar.',
      examples: [
        'in on at to for with by from about into over after under between among'
      ],
      text: 'in on at to for with by from about into over after under between among through during before since without within along across behind beyond near toward',
      acceptedAlternatives: [],
      focusSpans: []
    },
    {
      id: 'nw_5',
      mode: 'normal_words',
      subCategory: 'Adjectives & Modifiers',
      difficulty: 'Intermediate',
      grammarFocus: 'Normal Words Without Punctuation (Common Adjectives)',
      conciseNote: 'Everyday descriptive adjectives in lowercase without commas or periods.',
      hint: 'Maintain even timing across longer words like "different", "important", and "possible".',
      whyCorrect: 'Mastering common English adjectives improves finger agility across varied vowel-consonant patterns.',
      examples: [
        'good new first last long great little own other old right big high'
      ],
      text: 'good new first last long great little own other old right big high different small large next early young important few public bad same able clear sure',
      acceptedAlternatives: [],
      focusSpans: []
    },
    {
      id: 'nw_6',
      mode: 'normal_words',
      subCategory: 'Extended Word Flow',
      difficulty: 'Advanced',
      grammarFocus: 'Normal Words Without Punctuation (Extended Vocabulary Stream)',
      conciseNote: 'Longer everyday words without punctuation or capital letters to build sustained endurance.',
      hint: 'Stay relaxed and avoid rushing on multi-syllable words like "information", "community", "government", and "understand".',
      whyCorrect: 'Longer lowercase word streams train rhythm and accuracy without the interruption of Shift or symbol keys.',
      examples: [
        'system order study book word issue side kind house service friend power'
      ],
      text: 'system order study book word issue side kind house service friend power hour game line end member city team minute idea information level office health person history result change morning reason research',
      acceptedAlternatives: [],
      focusSpans: []
    }
  ];

  // Default editable Custom Practice Sets stored locally and restorable anytime
  const DEFAULT_CUSTOM_SETS = [
    {
      id: 'custom_set_prepositions',
      name: 'Daily Preposition & Article Booster',
      difficulty: 'Beginner',
      grammarFocus: 'Prepositions & Articles (in/on/at, a/an/the)',
      matchMode: 'relaxed',
      limitType: 'unlimited',
      limitValue: 0,
      targetWpm: 45,
      targetAccuracy: 96,
      items: [
        'The orientation session begins at 08:45 a.m. on Monday in Room 302.',
        'It takes an hour to walk from the old railway station to a university library.',
        'She has lived in Dhaka since 2021, and she has studied English grammar for five years.'
      ]
    },
    {
      id: 'custom_set_business_numbers',
      name: 'Dhaka Business, Dates & Currency Drill',
      difficulty: 'Intermediate',
      grammarFocus: 'Numbers, Dates, Currency (Tk) & Professional Punctuation',
      matchMode: 'strict',
      limitType: 'timed',
      limitValue: 60,
      targetWpm: 50,
      targetAccuracy: 97,
      items: [
        'On 21 October 2026 at 08:45 a.m., version 4.2 was approved with a budget of Tk 1,250.50 and a 25% reserve.',
        'Please send the quarterly audit (see Appendix B) to the finance committee before 04:30 p.m. on Thursday.',
        '"We have reduced processing latency by 25%," the operations lead reported; "consequently, unit costs fell to Tk 420.75."'
      ]
    },
    {
      id: 'custom_set_academic_clauses',
      name: 'Academic Writing & Complex Punctuation',
      difficulty: 'Advanced',
      grammarFocus: 'Semicolons, Colons, Apostrophes & Agreement',
      matchMode: 'relaxed',
      limitType: 'words',
      limitValue: 50,
      targetWpm: 55,
      targetAccuracy: 98,
      items: [
        "Although the researchers' initial hypothesis was plausible, the longitudinal data revealed three unexpected patterns: seasonal drift, sensor noise, and sampling bias.",
        "Neither the primary investigator nor the lab assistants were willing to publish the manuscript before verifying its statistical significance.",
        "If the archive had digitized those nineteenth-century letters earlier, historians would have resolved the chronology debate decades ago."
      ]
    }
  ];

  return {
    PRACTICE_MODES,
    PUNCTUATION_DRILL_CATEGORIES,
    PASSAGES,
    DEFAULT_CUSTOM_SETS,
    COMMON_ENGLISH_WORDS,
    generateRandomWordPassage
  };
});


/**
 * TypeWise — Local Persistence & History Aggregation Module
 * Safely wraps localStorage in try/catch for sandboxed iframe compatibility.
 * Note: Browser localStorage is device/browser-specific and does not use cloud sync.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(root.TypeWiseCurriculum);
  } else {
    root.TypeWiseStorage = factory(root.TypeWiseCurriculum);
  }
})(typeof self !== 'undefined' ? self : this, function (Curriculum) {
  'use strict';

  const STORAGE_KEYS = {
    PREFS: 'typewise_prefs_v1',
    CUSTOM_SETS: 'typewise_custom_sets_v1',
    SESSIONS: 'typewise_sessions_v1',
    TELEMETRY: 'typewise_telemetry_v1'
  };

  const memoryFallback = {};

  function safeGet(key, defaultVal) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(key);
        if (raw !== null) return JSON.parse(raw);
      }
    } catch (err) {
      // Ignore storage errors in restricted iframes
    }
    return memoryFallback[key] !== undefined ? memoryFallback[key] : defaultVal;
  }

  function safeSet(key, val) {
    memoryFallback[key] = val;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(val));
        return true;
      }
    } catch (err) {
      // Ignore quota/security errors
    }
    return false;
  }

  function defaultPrefs() {
    return {
      theme: 'light',
      lightThemeMigratedV2: true,
      soundEnabled: false,
      countdownEnabled: false,
      showPreHint: true,
      showKeyboard: true,
      keyboardViewMode: 'live', // 'live' | 'heatmap'
      matchMode: 'relaxed', // 'relaxed' | 'strict'
      plainWordsNoPunct: false,
      limitType: 'unlimited', // 'unlimited' | 'timed' | 'words' | 'chars'
      limitValue: 60,
      includeSpacesInTarget: true,
      includePunctuationInTarget: true,
      countPanelSource: 'final', // 'final' | 'raw' | 'reference'
      selectedMode: 'grammar_sentences',
      selectedSubCategory: 'all',
      selectedDifficulty: 'all',
      activeCustomSetId: 'custom_set_prepositions'
    };
  }

  function defaultTelemetry() {
    return {
      allTimeTypedText: '',
      keypressCounts: {},
      errorCategories: {
        punctuation: 0,
        capitalization: 0,
        spelling_char: 0,
        spacing: 0,
        number_symbol: 0,
        grammar_confusion: 0
      },
      grammarWeaknesses: {
        'Prepositions (Time & Place)': 0,
        'Prepositions (Direction vs. Purpose)': 0,
        'Articles (a / an / the)': 0,
        'Subject-Verb Agreement & Be-Verbs': 0,
        'Auxiliary Agreement & Perfect Tense': 0,
        'Punctuation': 0,
        'Capitalization': 0,
        'Apostrophes & Contractions': 0,
        'Spelling Rule': 0
      },
      recurringMistakes: [] // { id, expected, actual, category, reason, count, lastSeen }
    };
  }

  function loadPrefs() {
    const saved = safeGet(STORAGE_KEYS.PREFS, null);
    const merged = Object.assign({}, defaultPrefs(), saved || {});
    if (!saved || !saved.lightThemeMigratedV2) {
      merged.theme = 'light';
      merged.lightThemeMigratedV2 = true;
      safeSet(STORAGE_KEYS.PREFS, merged);
    }
    return merged;
  }

  function savePrefs(prefs) {
    const merged = Object.assign({}, loadPrefs(), prefs);
    safeSet(STORAGE_KEYS.PREFS, merged);
    return merged;
  }

  function loadCustomSets() {
    const saved = safeGet(STORAGE_KEYS.CUSTOM_SETS, null);
    if (Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    const defaults = JSON.parse(JSON.stringify(Curriculum ? Curriculum.DEFAULT_CUSTOM_SETS : []));
    safeSet(STORAGE_KEYS.CUSTOM_SETS, defaults);
    return defaults;
  }

  function saveCustomSets(sets) {
    safeSet(STORAGE_KEYS.CUSTOM_SETS, sets);
    return sets;
  }

  function loadSessions() {
    const saved = safeGet(STORAGE_KEYS.SESSIONS, null);
    if (Array.isArray(saved)) return saved;
    safeSet(STORAGE_KEYS.SESSIONS, []);
    return [];
  }

  function saveSession(sessionRecord) {
    const sessions = loadSessions();
    sessions.unshift(sessionRecord); // newest first
    safeSet(STORAGE_KEYS.SESSIONS, sessions);
    return sessions;
  }

  function loadTelemetry() {
    const saved = safeGet(STORAGE_KEYS.TELEMETRY, null);
    const def = defaultTelemetry();
    if (!saved || typeof saved !== 'object') return def;
    return {
      allTimeTypedText: typeof saved.allTimeTypedText === 'string' ? saved.allTimeTypedText : '',
      keypressCounts: Object.assign({}, def.keypressCounts, saved.keypressCounts || {}),
      errorCategories: Object.assign({}, def.errorCategories, saved.errorCategories || {}),
      grammarWeaknesses: Object.assign({}, def.grammarWeaknesses, saved.grammarWeaknesses || {}),
      recurringMistakes: Array.isArray(saved.recurringMistakes) ? saved.recurringMistakes : []
    };
  }

  function recordTelemetryFromSession({
    typedText = '',
    keypressMap = {},
    comparisonErrors = [],
    grammarAnalysis = { grammarMistakes: [], typingMistakes: [] }
  }) {
    const tel = loadTelemetry();
    // Cap stored all-time character stream at 100k chars to keep localStorage fast
    tel.allTimeTypedText = (tel.allTimeTypedText + ' ' + typedText).slice(-100000);

    for (const [code, cnt] of Object.entries(keypressMap || {})) {
      tel.keypressCounts[code] = (tel.keypressCounts[code] || 0) + cnt;
    }

    for (const err of comparisonErrors || []) {
      const t = err.type || 'spelling_char';
      if (tel.errorCategories[t] !== undefined) {
        tel.errorCategories[t]++;
      } else {
        tel.errorCategories.spelling_char++;
      }
    }

    for (const gm of (grammarAnalysis && grammarAnalysis.grammarMistakes) || []) {
      tel.errorCategories.grammar_confusion = (tel.errorCategories.grammar_confusion || 0) + 1;
      const cat = gm.category || 'Grammar Concept';
      tel.grammarWeaknesses[cat] = (tel.grammarWeaknesses[cat] || 0) + 1;

      const key = `${(gm.expected || '').toLowerCase()}__${(gm.actual || '').toLowerCase()}__${cat}`;
      const existing = tel.recurringMistakes.find(m => m.id === key);
      if (existing) {
        existing.count += 1;
        existing.lastSeen = new Date().toISOString();
      } else {
        tel.recurringMistakes.unshift({
          id: key,
          expected: gm.expected,
          actual: gm.actual,
          category: cat,
          reason: gm.reason,
          examples: gm.examples || [],
          count: 1,
          lastSeen: new Date().toISOString()
        });
      }
    }

    tel.recurringMistakes.sort((a, b) => b.count - a.count);
    tel.recurringMistakes = tel.recurringMistakes.slice(0, 30);

    safeSet(STORAGE_KEYS.TELEMETRY, tel);
    return tel;
  }

  /**
   * Computes Daily, Weekly, and Monthly progress summaries, personal bests, and trends.
   */
  function computeHistorySummaries(sessions) {
    const list = Array.isArray(sessions) ? sessions : [];
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const msDay = 86400000;
    let dailySessions = 0, dailySeconds = 0, dailyWords = 0, dailyWpmSum = 0, dailyAccSum = 0;
    let weeklySessions = 0, weeklySeconds = 0, weeklyWords = 0, weeklyWpmSum = 0, weeklyAccSum = 0;
    let monthlySessions = 0, monthlySeconds = 0, monthlyWords = 0, monthlyWpmSum = 0, monthlyAccSum = 0;

    let bestNetWpm = 0;
    let bestGrossWpm = 0;
    let bestAccuracy = 0;

    // Group by YYYY-MM-DD for Daily Practice Chart (Chart F)
    const byDateMap = {};

    for (const s of list) {
      const sDate = s.timestamp ? new Date(s.timestamp) : now;
      const dateKey = s.dateKey || sDate.toISOString().slice(0, 10);
      const ageDays = Math.max(0, (now.getTime() - sDate.getTime()) / msDay);

      const durSec = Number(s.activeElapsedSec || 0);
      const words = Number(s.totalWordsTyped || 0);
      const net = Number(s.netWpm || 0);
      const gross = Number(s.grossWpm || 0);
      const acc = Number(s.accuracy || 0);

      if (net > bestNetWpm) bestNetWpm = net;
      if (gross > bestGrossWpm) bestGrossWpm = gross;
      if (acc > bestAccuracy) bestAccuracy = acc;

      if (!byDateMap[dateKey]) {
        byDateMap[dateKey] = { date: dateKey, totalSeconds: 0, totalMinutes: 0, totalWords: 0, sessions: 0 };
      }
      byDateMap[dateKey].totalSeconds += durSec;
      byDateMap[dateKey].totalMinutes = Number((byDateMap[dateKey].totalSeconds / 60).toFixed(2));
      byDateMap[dateKey].totalWords += words;
      byDateMap[dateKey].sessions += 1;

      if (dateKey === todayStr || ageDays < 1) {
        dailySessions++;
        dailySeconds += durSec;
        dailyWords += words;
        dailyWpmSum += net;
        dailyAccSum += acc;
      }
      if (ageDays <= 7) {
        weeklySessions++;
        weeklySeconds += durSec;
        weeklyWords += words;
        weeklyWpmSum += net;
        weeklyAccSum += acc;
      }
      if (ageDays <= 30) {
        monthlySessions++;
        monthlySeconds += durSec;
        monthlyWords += words;
        monthlyWpmSum += net;
        monthlyAccSum += acc;
      }
    }

    // Improvement trend: compare most recent 3 sessions vs earliest 3 sessions
    let wpmTrendDelta = 0;
    if (list.length >= 2) {
      const latestNet = Number(list[0].netWpm || 0);
      const prevNet = Number(list[1].netWpm || 0);
      wpmTrendDelta = Number((latestNet - prevNet).toFixed(1));
    }

    const dailySeries = Object.values(byDateMap).sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalSessions: list.length,
      bestNetWpm: Number(bestNetWpm.toFixed(1)),
      bestGrossWpm: Number(bestGrossWpm.toFixed(1)),
      bestAccuracy: Number(bestAccuracy.toFixed(1)),
      wpmTrendDelta,
      daily: {
        sessions: dailySessions,
        minutes: Number((dailySeconds / 60).toFixed(1)),
        words: dailyWords,
        avgWpm: dailySessions > 0 ? Number((dailyWpmSum / dailySessions).toFixed(1)) : 0,
        avgAccuracy: dailySessions > 0 ? Number((dailyAccSum / dailySessions).toFixed(1)) : 0
      },
      weekly: {
        sessions: weeklySessions,
        minutes: Number((weeklySeconds / 60).toFixed(1)),
        words: weeklyWords,
        avgWpm: weeklySessions > 0 ? Number((weeklyWpmSum / weeklySessions).toFixed(1)) : 0,
        avgAccuracy: weeklySessions > 0 ? Number((weeklyAccSum / weeklySessions).toFixed(1)) : 0
      },
      monthly: {
        sessions: monthlySessions,
        minutes: Number((monthlySeconds / 60).toFixed(1)),
        words: monthlyWords,
        avgWpm: monthlySessions > 0 ? Number((monthlyWpmSum / monthlySessions).toFixed(1)) : 0,
        avgAccuracy: monthlySessions > 0 ? Number((monthlyAccSum / monthlySessions).toFixed(1)) : 0
      },
      dailySeries
    };
  }

  function resetAllData() {
    const defaults = JSON.parse(JSON.stringify(Curriculum ? Curriculum.DEFAULT_CUSTOM_SETS : []));
    safeSet(STORAGE_KEYS.PREFS, defaultPrefs());
    safeSet(STORAGE_KEYS.CUSTOM_SETS, defaults);
    safeSet(STORAGE_KEYS.SESSIONS, []);
    safeSet(STORAGE_KEYS.TELEMETRY, defaultTelemetry());
  }

  return {
    STORAGE_KEYS,
    loadPrefs,
    savePrefs,
    loadCustomSets,
    saveCustomSets,
    loadSessions,
    saveSession,
    loadTelemetry,
    recordTelemetryFromSession,
    computeHistorySummaries,
    resetAllData
  };
});


/**
 * TypeWise — Real Visual Analytics & Charting Engine (Chart.js v4.4.1 + Native Canvas 2D Fallback)
 * Renders all 8 required charts (A–H) using real calculated session and historical telemetry.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TypeWiseCharts = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const chartInstances = {};

  function getThemeColors() {
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    return {
      isDark,
      text: isDark ? '#cbd5e1' : '#334155',
      muted: isDark ? '#64748b' : '#94a3b8',
      grid: isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(100, 116, 139, 0.15)',
      emerald: '#10b981',
      emeraldBg: 'rgba(16, 185, 129, 0.2)',
      sky: '#0ea5e9',
      skyBg: 'rgba(14, 165, 233, 0.2)',
      amber: '#f59e0b',
      amberBg: 'rgba(245, 158, 11, 0.25)',
      rose: '#f43f5e',
      roseBg: 'rgba(244, 63, 94, 0.25)',
      violet: '#8b5cf6',
      violetBg: 'rgba(139, 92, 246, 0.25)',
      indigo: '#6366f1'
    };
  }

  /**
   * Native Canvas 2D Fallback Renderer when Chart.js CDN is unavailable (e.g. offline test environment)
   * Ensures charts are always visually rendered with accurate axes, labels, and data points.
   */
  function drawFallbackCanvasChart(canvas, config) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement ? canvas.parentElement.getBoundingClientRect() : { width: 420, height: 260 };
    const width = Math.max(300, Math.floor(rect.width || 420));
    const height = Math.max(200, Math.floor(rect.height || 260));
    canvas.width = width;
    canvas.height = height;

    const colors = getThemeColors();
    ctx.clearRect(0, 0, width, height);

    const labels = (config.data && config.data.labels) || [];
    const datasets = (config.data && config.data.datasets) || [];
    const padLeft = 44;
    const padRight = 18;
    const padTop = 28;
    const padBottom = 36;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    // Draw axes
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, padTop + plotH);
    ctx.lineTo(padLeft + plotW, padTop + plotH);
    ctx.stroke();

    // Find max value
    let maxVal = 10;
    datasets.forEach(ds => {
      (ds.data || []).forEach(v => {
        if (typeof v === 'number' && v > maxVal) maxVal = v;
      });
    });
    maxVal = Math.ceil(maxVal * 1.15) || 10;

    // Y-axis ticks
    ctx.fillStyle = colors.text;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let t = 0; t <= 4; t++) {
      const val = Math.round((maxVal / 4) * t);
      const y = padTop + plotH - (t / 4) * plotH;
      ctx.fillText(String(val), padLeft - 6, y + 4);
      ctx.strokeStyle = colors.grid;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + plotW, y);
      ctx.stroke();
    }

    if (labels.length === 0) {
      ctx.textAlign = 'center';
      ctx.fillStyle = colors.muted;
      ctx.fillText('No measured data points yet — type to populate chart', padLeft + plotW / 2, padTop + plotH / 2);
      return;
    }

    if (config.type === 'bar') {
      const ds = datasets[0] || { data: [] };
      const count = labels.length;
      const slotW = plotW / Math.max(1, count);
      const barW = Math.max(4, Math.min(36, slotW * 0.68));

      for (let i = 0; i < count; i++) {
        const val = Number(ds.data[i] || 0);
        const h = (val / maxVal) * plotH;
        const x = padLeft + i * slotW + (slotW - barW) / 2;
        const y = padTop + plotH - h;
        ctx.fillStyle = Array.isArray(ds.backgroundColor)
          ? ds.backgroundColor[i % ds.backgroundColor.length]
          : (ds.backgroundColor || colors.emerald);
        ctx.fillRect(x, y, barW, Math.max(2, h));

        if (count <= 14 || i % 2 === 0) {
          ctx.fillStyle = colors.text;
          ctx.textAlign = 'center';
          ctx.font = '10px Inter, sans-serif';
          ctx.fillText(String(labels[i]).slice(0, 10), x + barW / 2, padTop + plotH + 16);
        }
      }
    } else {
      // Line chart fallback
      datasets.forEach((ds, idx) => {
        const pts = ds.data || [];
        if (pts.length === 0) return;
        ctx.strokeStyle = ds.borderColor || (idx === 0 ? colors.emerald : colors.sky);
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
          const x = padLeft + (pts.length === 1 ? plotW / 2 : (i / (pts.length - 1)) * plotW);
          const y = padTop + plotH - (Number(pts[i] || 0) / maxVal) * plotH;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    }
  }

  function renderOrUpdateChart(canvasId, config) {
    if (typeof document === 'undefined') return null;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    if (typeof window !== 'undefined' && window.Chart) {
      if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
        delete chartInstances[canvasId];
      }
      chartInstances[canvasId] = new window.Chart(canvas, config);
      return chartInstances[canvasId];
    } else {
      drawFallbackCanvasChart(canvas, config);
      return null;
    }
  }

  /**
   * Renders all 8 required analytics charts (A–H) using real session, letter frequency, and history data.
   */
  function updateAllCharts({
    timeSeries = [],
    liveStats = null,
    letterFreq = null,
    telemetry = null,
    sessions = [],
    historySummaries = null
  }) {
    const colors = getThemeColors();
    const commonScales = (yLabel, xLabel, suggestedMax) => ({
      x: {
        ticks: { color: colors.text, font: { size: 11 } },
        grid: { color: colors.grid },
        title: { display: Boolean(xLabel), text: xLabel, color: colors.muted, font: { size: 11 } }
      },
      y: {
        beginAtZero: true,
        suggestedMax: suggestedMax || undefined,
        ticks: { color: colors.text, font: { size: 11 } },
        grid: { color: colors.grid },
        title: { display: Boolean(yLabel), text: yLabel, color: colors.muted, font: { size: 11 } }
      }
    });

    // Ensure at least current snapshot if user has typed <2s
    const effectiveSeries = (Array.isArray(timeSeries) && timeSeries.length > 0)
      ? timeSeries
      : (liveStats && liveStats.totalCharsTyped > 0
          ? [{ label: `${liveStats.activeElapsedSec}s`, grossWpm: liveStats.grossWpm, netWpm: liveStats.netWpm, accuracy: liveStats.accuracy }]
          : []);

    // A. WPM over time (Chart A)
    renderOrUpdateChart('chart-wpm-time', {
      type: 'line',
      data: {
        labels: effectiveSeries.map(p => p.label),
        datasets: [
          {
            label: 'Net WPM (Correct Chars / 5 / Min)',
            data: effectiveSeries.map(p => p.netWpm),
            borderColor: colors.emerald,
            backgroundColor: colors.emeraldBg,
            fill: true,
            tension: 0.25
          },
          {
            label: 'Gross WPM (All Chars / 5 / Min)',
            data: effectiveSeries.map(p => p.grossWpm),
            borderColor: colors.sky,
            backgroundColor: 'transparent',
            borderDash: [4, 4],
            tension: 0.25
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: colors.text, boxWidth: 12 } } },
        scales: commonScales('Words Per Minute (WPM)', 'Active Elapsed Time (2s intervals)')
      }
    });

    // B. Accuracy over time (Chart B)
    renderOrUpdateChart('chart-acc-time', {
      type: 'line',
      data: {
        labels: effectiveSeries.map(p => p.label),
        datasets: [
          {
            label: 'Keystroke Accuracy (%)',
            data: effectiveSeries.map(p => p.accuracy),
            borderColor: colors.violet,
            backgroundColor: colors.violetBg,
            fill: true,
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: colors.text, boxWidth: 12 } } },
        scales: commonScales('Accuracy (%)', 'Active Elapsed Time (2s intervals)', 100)
      }
    });

    // C. Character performance (Chart C)
    const correctChars = liveStats ? liveStats.correctChars : 0;
    const uncorrected = liveStats ? liveStats.uncorrectedErrors : 0;
    const corrected = liveStats ? liveStats.correctedErrors : 0;
    const extraChars = liveStats && liveStats.counts ? liveStats.counts.extraChars : 0;

    renderOrUpdateChart('chart-char-perf', {
      type: 'bar',
      data: {
        labels: ['Correct Chars', 'Corrected (Bksp)', 'Uncorrected Errors', 'Extra Chars'],
        datasets: [
          {
            label: 'Character Count (Current Session)',
            data: [correctChars, corrected, uncorrected, extraChars],
            backgroundColor: [colors.emerald, colors.amber, colors.rose, colors.violet]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: colors.text, boxWidth: 12 } } },
        scales: commonScales('Characters', 'Character Classification')
      }
    });

    // D. Letter frequency A-Z bar chart (Chart D)
    const lettersData = (letterFreq && Array.isArray(letterFreq.lettersData)) ? letterFreq.lettersData : [];
    renderOrUpdateChart('chart-letter-freq', {
      type: 'bar',
      data: {
        labels: lettersData.map(d => d.letter),
        datasets: [
          {
            label: 'Letter Count (A–Z)',
            data: lettersData.map(d => d.count),
            backgroundColor: colors.sky
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: colors.text, boxWidth: 12 } },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const item = lettersData[ctx.dataIndex];
                if (!item) return '';
                return `Count: ${item.count} (${item.percentage}% of letters | Upper: ${item.upper}, Lower: ${item.lower})`;
              }
            }
          }
        },
        scales: commonScales('Occurrences', 'Alphabet (A–Z, Excluding Spaces/Digits/Punct)')
      }
    });

    // E. Error categories (Chart E)
    // Combine live session errors with cumulative telemetry
    const liveErrs = (liveStats && liveStats.comparison && liveStats.comparison.errorPositions) || [];
    const catCounts = {
      punctuation: (telemetry && telemetry.errorCategories && telemetry.errorCategories.punctuation) || 0,
      capitalization: (telemetry && telemetry.errorCategories && telemetry.errorCategories.capitalization) || 0,
      spelling_char: (telemetry && telemetry.errorCategories && telemetry.errorCategories.spelling_char) || 0,
      spacing: (telemetry && telemetry.errorCategories && telemetry.errorCategories.spacing) || 0,
      number_symbol: (telemetry && telemetry.errorCategories && telemetry.errorCategories.number_symbol) || 0,
      grammar_confusion: (telemetry && telemetry.errorCategories && telemetry.errorCategories.grammar_confusion) || 0
    };
    liveErrs.forEach(e => {
      const k = e.type || 'spelling_char';
      if (catCounts[k] !== undefined) catCounts[k]++;
    });

    renderOrUpdateChart('chart-error-cats', {
      type: 'bar',
      data: {
        labels: ['Punctuation', 'Capitalization', 'Char/Spelling', 'Spacing', 'Numbers/Symbols', 'Grammar Rules'],
        datasets: [
          {
            label: 'Detected Errors',
            data: [
              catCounts.punctuation,
              catCounts.capitalization,
              catCounts.spelling_char,
              catCounts.spacing,
              catCounts.number_symbol,
              catCounts.grammar_confusion
            ],
            backgroundColor: [colors.amber, colors.sky, colors.rose, colors.indigo, colors.emerald, colors.violet]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: colors.text, boxWidth: 12 } } },
        scales: commonScales('Error Count', 'Error Category')
      }
    });

    // F. Daily practice: total minutes and words typed per day (Chart F)
    const dailySeries = (historySummaries && Array.isArray(historySummaries.dailySeries)) ? historySummaries.dailySeries : [];
    renderOrUpdateChart('chart-daily-practice', {
      type: 'bar',
      data: {
        labels: dailySeries.map(d => d.date),
        datasets: [
          {
            label: 'Words Typed',
            data: dailySeries.map(d => d.totalWords),
            backgroundColor: colors.emerald
          },
          {
            label: 'Active Practice Minutes',
            data: dailySeries.map(d => d.totalMinutes),
            backgroundColor: colors.sky
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: colors.text, boxWidth: 12 } } },
        scales: commonScales('Words / Minutes', 'Practice Date (YYYY-MM-DD)')
      }
    });

    // G. Progress over time: compare session WPM and accuracy (Chart G)
    const chronological = [...(sessions || [])].reverse().slice(-20);
    renderOrUpdateChart('chart-progress-time', {
      type: 'line',
      data: {
        labels: chronological.map((s, idx) => `#${idx + 1} (${(s.dateKey || '').slice(5)})`),
        datasets: [
          {
            label: 'Session Net WPM',
            data: chronological.map(s => s.netWpm),
            borderColor: colors.emerald,
            backgroundColor: colors.emeraldBg,
            tension: 0.25
          },
          {
            label: 'Session Accuracy (%)',
            data: chronological.map(s => s.accuracy),
            borderColor: colors.amber,
            backgroundColor: 'transparent',
            tension: 0.25
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: colors.text, boxWidth: 12 } } },
        scales: commonScales('WPM / Accuracy %', 'Completed Sessions (Chronological)')
      }
    });

    // H. Grammar weakness chart: frequency of identified grammar error categories (Chart H)
    const gw = (telemetry && telemetry.grammarWeaknesses) || {};
    const gwEntries = Object.entries(gw);
    renderOrUpdateChart('chart-grammar-weakness', {
      type: 'bar',
      data: {
        labels: gwEntries.map(([k]) => k.replace(/\s*\(.*?\)/, '')),
        datasets: [
          {
            label: 'Grammar Rule Mistakes',
            data: gwEntries.map(([, v]) => v),
            backgroundColor: colors.rose
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: colors.text, boxWidth: 12 } } },
        scales: commonScales('Frequency', 'Grammar Domain')
      }
    });
  }

  return {
    updateAllCharts
  };
});


/**
 * TypeWise — Interactive Application Controller
 * Wires UI, high-precision active timer, real-time keystroke & Backspace tracking,
 * grammar coach, on-screen QWERTY keyboard, custom practice studio, and visual analytics.
 */

(function () {
  'use strict';

  const Engine = window.TypeWiseEngine;
  const Curriculum = window.TypeWiseCurriculum;
  const Storage = window.TypeWiseStorage;
  const Charts = window.TypeWiseCharts;

  // Application State
  const state = {
    prefs: Storage.loadPrefs(),
    customSets: Storage.loadCustomSets(),
    sessions: Storage.loadSessions(),
    telemetry: Storage.loadTelemetry(),

    activeTab: 'trainer',
    filteredPassages: [],
    currentPassageIndex: 0,
    currentPassage: null,

    // Live Session State
    sessionStatus: 'idle', // 'idle' | 'countdown' | 'running' | 'paused' | 'completed'
    typedText: '',
    rawKeystrokeStream: '',
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    errorKeystrokes: 0,
    correctedErrors: 0,
    sessionKeypressMap: {},

    // Active Timer State (strictly excludes paused duration)
    elapsedActiveMs: 0,
    lastTickTimestamp: null,
    timerIntervalId: null,
    countdownIntervalId: null,
    lastRecordedSampleSec: 0,
    wpmHistory: [], // { sec, label, grossWpm, netWpm, accuracy }

    // Analytics & UI Sub-states
    freqFilter: 'session', // 'session' | 'ref' | 'custom' | 'alltime'
    freqCaseBreakdown: false,
    editingCustomSetId: null,
    recommendedAction: null,

    // Web Audio Synthesizer Context
    audioCtx: null
  };

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showToast(message) {
    const banner = $('toast-banner');
    if (!banner) return;
    banner.textContent = message;
    banner.classList.remove('hidden');
    if (banner._hideTimer) clearTimeout(banner._hideTimer);
    banner._hideTimer = setTimeout(() => {
      banner.classList.add('hidden');
    }, 3200);
  }

  // Synthesized Web Audio feedback (zero external audio files needed)
  function playTone(type) {
    if (!state.prefs.soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!state.audioCtx) state.audioCtx = new AudioContextClass();
      if (state.audioCtx.state === 'suspended') state.audioCtx.resume();

      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      const now = state.audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.connect(gain);
        gain.connect(state.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(190, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(state.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.085);
      } else if (type === 'complete') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.09);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(state.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      // Ignore audio errors when blocked by browser autoplay policy
    }
  }

  // =========================================================================
  // THEME, NAVIGATION & GLOBAL CONTROLS
  // =========================================================================
  function applyTheme() {
    const isDark = state.prefs.theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    const label = $('theme-toggle-label');
    if (label) label.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }

  function applySoundLabel() {
    const label = $('sound-toggle-label');
    if (label) label.textContent = state.prefs.soundEnabled ? 'Sound: On' : 'Sound: Off';
  }

  function updateMistakeDrillBadge() {
    const badge = $('mistake-drill-badge');
    if (!badge) return;
    const count = (state.telemetry.recurringMistakes || []).length;
    badge.textContent = String(count);
  }

  function switchTab(tabName) {
    state.activeTab = tabName;
    const tabs = ['trainer', 'inspector', 'analytics', 'custom', 'history'];
    tabs.forEach(t => {
      const sec = $(`view-${t}`);
      const btn = $(`nav-btn-${t}`);
      if (sec) sec.classList.toggle('hidden', t !== tabName);
      if (btn) {
        if (t === tabName) {
          btn.className = 'nav-tab-btn px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-sky-400 border border-blue-200 dark:border-slate-700 shadow-sm';
        } else {
          btn.className = 'nav-tab-btn px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent';
        }
      }
    });

    if (tabName === 'inspector') {
      renderTargetPassageAndStats();
      renderQwertyKeyboard();
    } else if (tabName === 'analytics') {
      renderAnalyticsDashboard();
    } else if (tabName === 'custom') {
      renderCustomSetsList();
    } else if (tabName === 'history') {
      renderHistoryView();
    }
  }

  // =========================================================================
  // MODE SELECTION, SUB-DRILLS, AND PASSAGE LOADING
  // =========================================================================
  function renderModeButtons() {
    const container = $('mode-buttons-container');
    if (!container) return;

    container.innerHTML = Curriculum.PRACTICE_MODES.map((m, idx) => {
      const isActive = state.prefs.selectedMode === m.id;
      const spanCls = idx === Curriculum.PRACTICE_MODES.length - 1 ? 'col-span-2' : '';
      const cls = isActive
        ? `${spanCls} w-full h-full flex items-center text-left px-3.5 py-2 rounded-xl text-xs xl:text-[13px] font-bold bg-blue-600 text-white border border-blue-600 shadow-sm transition truncate`
        : `${spanCls} w-full h-full flex items-center text-left px-3.5 py-2 rounded-xl text-xs xl:text-[13px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600 dark:hover:text-white transition truncate`;
      return `<button type="button" data-mode-id="${m.id}" class="mode-pill-btn ${cls}">
        <span class="opacity-85 mr-1.5 font-semibold">${m.code}.</span><span class="truncate">${escapeHtml(m.shortName)}</span>
      </button>`;
    }).join('');

    const activeModeObj = Curriculum.PRACTICE_MODES.find(m => m.id === state.prefs.selectedMode);
    const descEl = $('active-mode-description');
    if (descEl && activeModeObj) {
      descEl.textContent = `${activeModeObj.code}. ${activeModeObj.name}: ${activeModeObj.description}`;
    }

    container.querySelectorAll('.mode-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modeId = btn.getAttribute('data-mode-id');
        selectPracticeMode(modeId, 'all');
      });
    });
  }

  function populateSubDrillOptions() {
    const select = $('select-subdrill');
    if (!select) return;
    const mode = state.prefs.selectedMode;

    const options = [{ value: 'all', label: 'All Topics in Mode' }];
    if (mode === 'punctuation_caps') {
      Curriculum.PUNCTUATION_DRILL_CATEGORIES.forEach(cat => {
        options.push({ value: cat.id, label: cat.title });
      });
    } else {
      const subCats = new Set();
      Curriculum.PASSAGES.filter(p => p.mode === mode).forEach(p => {
        if (p.subCategory) subCats.add(p.subCategory);
      });
      subCats.forEach(sc => options.push({ value: sc, label: sc }));
    }

    select.innerHTML = options.map(o =>
      `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`
    ).join('');

    if (options.some(o => o.value === state.prefs.selectedSubCategory)) {
      select.value = state.prefs.selectedSubCategory;
    } else {
      state.prefs.selectedSubCategory = 'all';
      select.value = 'all';
    }

    // Show/hide Custom Set Quick Picker when mode === 'custom_text'
    const customWrap = $('custom-set-quick-wrap');
    if (customWrap) {
      customWrap.classList.toggle('hidden', mode !== 'custom_text');
      if (mode === 'custom_text') {
        populateActiveCustomSetSelect();
      }
    }
  }

  function populateActiveCustomSetSelect() {
    const sel = $('select-active-custom-set');
    if (!sel) return;
    state.customSets = Storage.loadCustomSets();
    sel.innerHTML = state.customSets.map(s =>
      `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name)} (${s.items.length})</option>`
    ).join('');
    if (state.customSets.some(s => s.id === state.prefs.activeCustomSetId)) {
      sel.value = state.prefs.activeCustomSetId;
    } else if (state.customSets[0]) {
      state.prefs.activeCustomSetId = state.customSets[0].id;
      sel.value = state.customSets[0].id;
    }
  }

  function buildPassagesForCurrentSelection() {
    const mode = state.prefs.selectedMode;
    const subCat = state.prefs.selectedSubCategory;
    const diff = state.prefs.selectedDifficulty;

    if (mode === 'custom_text') {
      const activeSet = state.customSets.find(s => s.id === state.prefs.activeCustomSetId) || state.customSets[0];
      if (activeSet && Array.isArray(activeSet.items) && activeSet.items.length > 0) {
        return activeSet.items.map((line, idx) => ({
          id: `${activeSet.id}_${idx}`,
          mode: 'custom_text',
          customSetId: activeSet.id,
          customSetName: activeSet.name,
          difficulty: activeSet.difficulty || 'Intermediate',
          grammarFocus: activeSet.grammarFocus || `Custom Set: ${activeSet.name}`,
          conciseNote: `Custom Practice Set "${activeSet.name}" • Target Goal: ${activeSet.targetWpm || 45} WPM at ${activeSet.targetAccuracy || 96}% accuracy.`,
          hint: 'Focus on steady rhythm, exact punctuation spacing, and clean capitalization.',
          whyCorrect: 'Custom practice passages use TypeWise\'s grammar and punctuation analyzer to distinguish conceptual errors (prepositions, articles, agreement, capitalization, and punctuation) from mechanical keystroke slips.',
          examples: [
            'You can edit or add more sentences to this set anytime in the Custom Studio tab.'
          ],
          text: line,
          acceptedAlternatives: [],
          focusSpans: []
        }));
      }
    }

    let list = Curriculum.PASSAGES.filter(p => p.mode === mode);
    if (subCat && subCat !== 'all') {
      list = list.filter(p => p.subCategory === subCat);
    }
    if (diff && diff !== 'all') {
      list = list.filter(p => p.difficulty === diff);
    }
    if (list.length === 0) {
      list = Curriculum.PASSAGES.filter(p => p.mode === mode);
    }
    if (list.length === 0) {
      list = Curriculum.PASSAGES;
    }
    return list;
  }

  function selectPracticeMode(modeId, subCategory = 'all', customPassageList = null) {
    state.prefs.selectedMode = modeId;
    state.prefs.selectedSubCategory = subCategory;

    // If switching to Custom Text mode and active set has custom match/limit settings, apply them
    if (modeId === 'custom_text') {
      const activeSet = state.customSets.find(s => s.id === state.prefs.activeCustomSetId) || state.customSets[0];
      if (activeSet) {
        state.prefs.matchMode = activeSet.matchMode === 'strict' ? 'strict' : 'relaxed';
        if (activeSet.limitType && activeSet.limitType !== 'unlimited' && activeSet.limitValue > 0) {
          state.prefs.limitType = activeSet.limitType;
          state.prefs.limitValue = activeSet.limitValue;
        }
      }
    }

    Storage.savePrefs(state.prefs);
    renderModeButtons();
    populateSubDrillOptions();
    syncLimitControlsFromPrefs();
    syncMatchModeButton();
    syncPlainWordsButton();

    state.filteredPassages = Array.isArray(customPassageList) && customPassageList.length > 0
      ? customPassageList
      : buildPassagesForCurrentSelection();
    state.currentPassageIndex = 0;
    loadPassageAtIndex(0);
  }

  function stripPunctuationAndCaps(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]+/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function syncPlainWordsButton() {
    const btn = $('btn-plain-words-toggle');
    if (!btn) return;
    const isPlain = Boolean(state.prefs.plainWordsNoPunct) || state.prefs.selectedMode === 'normal_words';
    btn.textContent = isPlain ? 'No Punct / Lowercase: On' : 'No Punct / Lowercase: Off';
    btn.className = isPlain
      ? 'w-full px-2 py-1.5 rounded-lg text-[11px] font-bold border border-teal-600/40 bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 transition text-center truncate'
      : 'w-full px-2 py-1.5 rounded-lg text-[11px] font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-500/50 transition text-center truncate';
  }

  function loadPassageAtIndex(index) {
    if (!state.filteredPassages || state.filteredPassages.length === 0) {
      state.filteredPassages = buildPassagesForCurrentSelection();
    }
    const count = state.filteredPassages.length;
    state.currentPassageIndex = ((index % count) + count) % count;
    const basePassage = state.filteredPassages[state.currentPassageIndex];
    if (state.prefs.plainWordsNoPunct && basePassage && basePassage.mode !== 'normal_words') {
      state.currentPassage = Object.assign({}, basePassage, {
        text: stripPunctuationAndCaps(basePassage.text),
        conciseNote: 'Plain Words Active — Punctuation and capital letters have been removed for lowercase word-flow practice.',
        acceptedAlternatives: [],
        focusSpans: []
      });
    } else {
      state.currentPassage = basePassage;
    }
    syncPlainWordsButton();
    resetSessionState();
    renderGrammarCoachCard();
    renderTargetPassageAndStats();
  }

  // =========================================================================
  // TEST CONFIGURATION & LIMIT CONTROLS (SECTION 5)
  // =========================================================================
  const LIMIT_PRESETS = {
    timed: [
      { value: '15', label: '15 seconds' },
      { value: '30', label: '30 seconds' },
      { value: '60', label: '60 seconds' },
      { value: '120', label: '2 minutes' },
      { value: '300', label: '5 minutes' },
      { value: 'custom', label: 'Custom Time (s)' }
    ],
    words: [
      { value: '10', label: '10 words' },
      { value: '25', label: '25 words' },
      { value: '50', label: '50 words' },
      { value: '100', label: '100 words' },
      { value: '250', label: '250 words' },
      { value: 'custom', label: 'Custom Words' }
    ],
    chars: [
      { value: '50', label: '50 chars' },
      { value: '100', label: '100 chars' },
      { value: '250', label: '250 chars' },
      { value: '500', label: '500 chars' },
      { value: 'custom', label: 'Custom Chars' }
    ]
  };

  function syncLimitControlsFromPrefs() {
    const typeSel = $('select-limit-type');
    const presetWrap = $('limit-preset-wrap');
    const presetSel = $('select-limit-preset');
    const customInput = $('input-custom-limit');
    const charRulesWrap = $('char-target-rules-wrap');
    const chkSpaces = $('chk-count-spaces');
    const chkPunct = $('chk-count-punct');
    const chkCountdown = $('chk-countdown');

    const limitType = state.prefs.limitType || 'unlimited';
    if (typeSel) typeSel.value = limitType;
    if (chkSpaces) chkSpaces.checked = state.prefs.includeSpacesInTarget !== false;
    if (chkPunct) chkPunct.checked = state.prefs.includePunctuationInTarget !== false;
    if (chkCountdown) chkCountdown.checked = Boolean(state.prefs.countdownEnabled);

    if (limitType === 'unlimited') {
      if (presetWrap) presetWrap.classList.add('hidden');
      if (charRulesWrap) charRulesWrap.classList.add('hidden');
      return;
    }

    if (presetWrap) presetWrap.classList.remove('hidden');
    if (charRulesWrap) charRulesWrap.classList.toggle('hidden', limitType !== 'chars');

    const presets = LIMIT_PRESETS[limitType] || [];
    if (presetSel) {
      presetSel.innerHTML = presets.map(p => `<option value="${p.value}">${p.label}</option>`).join('');
      const valStr = String(state.prefs.limitValue || (limitType === 'timed' ? 60 : 50));
      const hasPreset = presets.some(p => p.value === valStr);
      if (hasPreset) {
        presetSel.value = valStr;
        if (customInput) customInput.classList.add('hidden');
      } else {
        presetSel.value = 'custom';
        if (customInput) {
          customInput.classList.remove('hidden');
          customInput.value = valStr;
        }
      }
    }
  }

  function syncMatchModeButton() {
    const btn = $('btn-match-mode');
    if (!btn) return;
    const isStrict = state.prefs.matchMode === 'strict';
    btn.textContent = isStrict ? 'Matching: Strict' : 'Matching: Relaxed';
    btn.className = isStrict
      ? 'w-full px-2 py-1.5 rounded-lg text-[11px] font-bold border border-red-300 bg-red-50 dark:bg-rose-500/15 text-red-700 dark:text-rose-300 transition text-center truncate'
      : 'w-full px-2 py-1.5 rounded-lg text-[11px] font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-500/50 transition text-center truncate';
  }

  // =========================================================================
  // GRAMMAR TEACHING COACH CARD (SECTION 3)
  // =========================================================================
  function renderGrammarCoachCard() {
    const p = state.currentPassage;
    if (!p) return;

    const focusBadge = $('grammar-focus-badge');
    const diffBadge = $('passage-difficulty-badge');
    const indexLabel = $('passage-index-label');
    const conciseNote = $('grammar-concise-note');
    const hintBox = $('grammar-hint-box');
    const hintText = $('grammar-hint-text');
    const toggleHintBtn = $('btn-toggle-hint');
    const whyText = $('grammar-why-text');
    const examplesList = $('grammar-examples-list');
    const altNote = $('grammar-alternatives-note');

    if (focusBadge) focusBadge.textContent = p.grammarFocus || 'Contextual Grammar';
    if (diffBadge) diffBadge.textContent = p.difficulty || 'Intermediate';
    if (indexLabel) {
      indexLabel.textContent = `Passage ${state.currentPassageIndex + 1} of ${state.filteredPassages.length}`;
    }
    if (conciseNote) conciseNote.textContent = p.conciseNote || '';
    if (hintText) hintText.textContent = p.hint || 'Pay attention to prepositions, articles, and punctuation marks.';

    if (hintBox && toggleHintBtn) {
      const show = state.prefs.showPreHint !== false;
      hintBox.classList.toggle('hidden', !show);
      toggleHintBtn.textContent = show ? 'Hide Pre-Typing Hint' : 'Show Pre-Typing Hint';
    }

    if (whyText) whyText.textContent = p.whyCorrect || p.conciseNote || '';
    if (examplesList) {
      const exs = Array.isArray(p.examples) && p.examples.length > 0
        ? p.examples
        : ['Notice how each clause connects cleanly with standard English punctuation.'];
      examplesList.innerHTML = exs.map(ex => `<li>${escapeHtml(ex)}</li>`).join('');
    }
    if (altNote) {
      if (Array.isArray(p.acceptedAlternatives) && p.acceptedAlternatives.length > 0) {
        altNote.textContent = `Accepted valid English variations: "${p.acceptedAlternatives.join('" or "')}" (will not be marked as a grammar mistake).`;
      } else {
        altNote.textContent = 'Standard US/UK spelling equivalents and time notations (e.g., 08:45 a.m. / 8:45 a.m.) are recognized as grammatically valid.';
      }
    }
  }

  // =========================================================================
  // ACTIVE TIMER, PAUSE/RESUME, AND COUNTDOWN (SECTIONS 4 & 5)
  // =========================================================================
  function clearSessionTimers() {
    if (state.timerIntervalId) {
      clearInterval(state.timerIntervalId);
      state.timerIntervalId = null;
    }
    if (state.countdownIntervalId) {
      clearInterval(state.countdownIntervalId);
      state.countdownIntervalId = null;
    }
    state.lastTickTimestamp = null;
  }

  function resetSessionState() {
    clearSessionTimers();
    state.sessionStatus = 'idle';
    state.typedText = '';
    state.rawKeystrokeStream = '';
    state.totalKeystrokes = 0;
    state.correctKeystrokes = 0;
    state.errorKeystrokes = 0;
    state.correctedErrors = 0;
    state.sessionKeypressMap = {};
    state.elapsedActiveMs = 0;
    state.lastRecordedSampleSec = 0;
    state.wpmHistory = [];

    const input = $('typing-input');
    if (input) {
      input.value = '';
      input.disabled = false;
    }
    const overlay = $('countdown-overlay');
    if (overlay) overlay.classList.add('hidden');

    const strictAlert = $('strict-mode-alert');
    if (strictAlert) strictAlert.classList.add('hidden');

    updateSessionStatusUI();
  }

  function updateSessionStatusUI() {
    const badge = $('session-status-badge');
    const pauseBtn = $('btn-pause-resume');
    if (!badge || !pauseBtn) return;

    if (state.sessionStatus === 'idle') {
      badge.textContent = 'Ready — Type directly in the passage or click the highlighted character';
      badge.className = 'px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
      pauseBtn.textContent = 'Pause (Alt+P)';
    } else if (state.sessionStatus === 'countdown') {
      badge.textContent = 'Countdown...';
      badge.className = 'px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-400';
      pauseBtn.textContent = 'Pause (Alt+P)';
    } else if (state.sessionStatus === 'running') {
      badge.textContent = 'Active Typing — Timer Running';
      badge.className = 'px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
      pauseBtn.textContent = 'Pause (Alt+P)';
    } else if (state.sessionStatus === 'paused') {
      badge.textContent = 'Paused — Elapsed Time Frozen';
      badge.className = 'px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-600 dark:text-amber-400';
      pauseBtn.textContent = 'Resume (Alt+P)';
    } else if (state.sessionStatus === 'completed') {
      badge.textContent = 'Completed — Session Recorded';
      badge.className = 'px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/20 text-sky-600 dark:text-sky-400';
      pauseBtn.textContent = 'Pause (Alt+P)';
    }
  }

  function startActiveTimer() {
    if (state.sessionStatus === 'completed') return;
    state.sessionStatus = 'running';
    state.lastTickTimestamp = Date.now();
    updateSessionStatusUI();

    if (state.timerIntervalId) clearInterval(state.timerIntervalId);
    state.timerIntervalId = setInterval(() => {
      if (state.sessionStatus !== 'running') return;
      const now = Date.now();
      const delta = Math.max(0, now - (state.lastTickTimestamp || now));
      state.lastTickTimestamp = now;
      state.elapsedActiveMs += delta;

      // Check timed test expiration
      if (state.prefs.limitType === 'timed' && state.prefs.limitValue > 0) {
        const maxMs = state.prefs.limitValue * 1000;
        if (state.elapsedActiveMs >= maxMs) {
          state.elapsedActiveMs = maxMs;
          renderTargetPassageAndStats();
          completeCurrentSession('Timed test limit reached');
          return;
        }
      }

      // Record 2-second interval sample for WPM & Accuracy Over Time charts
      const elapsedWholeSec = Math.floor(state.elapsedActiveMs / 1000);
      if (elapsedWholeSec >= state.lastRecordedSampleSec + 2) {
        state.lastRecordedSampleSec = elapsedWholeSec;
        recordLiveTimeSeriesSample(elapsedWholeSec);
      }

      renderLiveMetricsOnly();
    }, 100);
  }

  function recordLiveTimeSeriesSample(secMark) {
    const refText = state.currentPassage ? state.currentPassage.text : '';
    const stats = Engine.computeLiveStatistics({
      typedText: state.typedText,
      referenceText: refText,
      elapsedActiveMs: state.elapsedActiveMs,
      totalKeystrokes: state.totalKeystrokes,
      correctKeystrokes: state.correctKeystrokes,
      errorKeystrokes: state.errorKeystrokes,
      correctedErrors: state.correctedErrors,
      wpmHistory: state.wpmHistory,
      limitConfig: getActiveLimitConfig()
    });
    state.wpmHistory.push({
      sec: secMark,
      label: `${secMark}s`,
      grossWpm: stats.grossWpm,
      netWpm: stats.netWpm,
      accuracy: stats.accuracy
    });
  }

  function togglePauseResume() {
    if (state.sessionStatus === 'running') {
      // Accumulate up to exact pause instant, then stop counting
      const now = Date.now();
      if (state.lastTickTimestamp) {
        state.elapsedActiveMs += Math.max(0, now - state.lastTickTimestamp);
      }
      state.lastTickTimestamp = null;
      state.sessionStatus = 'paused';
      updateSessionStatusUI();
      showToast('Session paused. Paused time is excluded from WPM calculations.');
    } else if (state.sessionStatus === 'paused') {
      startActiveTimer();
      const input = $('typing-input');
      if (input) input.focus();
      showToast('Session resumed.');
    }
  }

  function triggerPreStartCountdownIfNeeded(onDone) {
    if (!state.prefs.countdownEnabled || state.sessionStatus !== 'idle') {
      onDone();
      return;
    }
    state.sessionStatus = 'countdown';
    updateSessionStatusUI();
    const overlay = $('countdown-overlay');
    const numEl = $('countdown-number');
    const input = $('typing-input');
    if (input) input.disabled = true;
    if (overlay) overlay.classList.remove('hidden');

    let remaining = 3;
    if (numEl) numEl.textContent = String(remaining);

    state.countdownIntervalId = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        if (numEl) numEl.textContent = String(remaining);
      } else {
        clearInterval(state.countdownIntervalId);
        state.countdownIntervalId = null;
        if (overlay) overlay.classList.add('hidden');
        if (input) {
          input.disabled = false;
          input.focus();
        }
        startActiveTimer();
        onDone();
      }
    }, 1000);
  }

  function getActiveLimitConfig() {
    return {
      type: state.prefs.limitType || 'unlimited',
      value: Number(state.prefs.limitValue || 0),
      includeSpaces: state.prefs.includeSpacesInTarget !== false,
      includePunctuation: state.prefs.includePunctuationInTarget !== false
    };
  }

  // =========================================================================
  // REAL-TIME TYPING INPUT, BACKSPACE TRACKING & TARGET COMPARISON
  // =========================================================================
  function handleTypingInputChange(newText) {
    if (state.sessionStatus === 'completed' || state.sessionStatus === 'countdown') {
      const input = $('typing-input');
      if (input) input.value = state.typedText;
      return;
    }

    const prevText = state.typedText;
    if (newText === prevText) return;

    // Start timer on first character typed (or resume if paused)
    if ((state.sessionStatus === 'idle' || state.sessionStatus === 'paused') && newText.length > 0) {
      startActiveTimer();
    }

    const refText = state.currentPassage ? state.currentPassage.text : '';
    const prevArr = Array.from(prevText);
    const newArr = Array.from(newText);
    const refArr = Array.from(refText);

    if (newArr.length > prevArr.length) {
      // Characters were added (single keystroke or paste)
      const addedSlice = newArr.slice(prevArr.length);
      for (let k = 0; k < addedSlice.length; k++) {
        const idx = prevArr.length + k;
        const ch = addedSlice[k];
        state.totalKeystrokes++;
        state.rawKeystrokeStream += ch;

        const isCorrect = idx < refArr.length && ch === refArr[idx];
        if (isCorrect) {
          state.correctKeystrokes++;
          playTone('click');
        } else {
          state.errorKeystrokes++;
          playTone('error');
        }
      }
    } else if (newArr.length < prevArr.length) {
      // Characters were deleted (e.g., Backspace)
      // Count how many deleted positions were previously incorrect -> they become correctedErrors!
      for (let idx = newArr.length; idx < prevArr.length; idx++) {
        const wasChar = prevArr[idx];
        const expectedChar = idx < refArr.length ? refArr[idx] : null;
        if (expectedChar === null || wasChar !== expectedChar) {
          state.correctedErrors++;
        }
      }
    } else {
      // Same length replacement
      for (let idx = 0; idx < newArr.length; idx++) {
        if (newArr[idx] !== prevArr[idx]) {
          state.totalKeystrokes++;
          state.rawKeystrokeStream += newArr[idx];
          const wasCorrect = idx < refArr.length && prevArr[idx] === refArr[idx];
          const isNowCorrect = idx < refArr.length && newArr[idx] === refArr[idx];
          if (!wasCorrect && isNowCorrect) state.correctedErrors++;
          if (isNowCorrect) state.correctKeystrokes++;
          else state.errorKeystrokes++;
        }
      }
    }

    state.typedText = newText;
    renderTargetPassageAndStats();
    checkAutoCompletionConditions();
  }

  function checkAutoCompletionConditions() {
    if (state.sessionStatus !== 'running') return;
    const refText = state.currentPassage ? state.currentPassage.text : '';
    const limitConfig = getActiveLimitConfig();
    const counts = Engine.computeTextCounts(state.typedText, refText);

    // 1. Word Target Completion
    if (limitConfig.type === 'words' && limitConfig.value > 0) {
      if (counts.words >= limitConfig.value) {
        completeCurrentSession(`Word target (${limitConfig.value} words) reached`);
        return;
      }
    }

    // 2. Character Target Completion
    if (limitConfig.type === 'chars' && limitConfig.value > 0) {
      const countedChars = Engine.countTargetCharacters(state.typedText, limitConfig);
      if (countedChars >= limitConfig.value) {
        completeCurrentSession(`Character target (${limitConfig.value} chars) reached`);
        return;
      }
    }

    // 3. Passage Length Reached
    const typedLen = Array.from(state.typedText).length;
    const refLen = Array.from(refText).length;

    if (refLen > 0 && typedLen >= refLen) {
      const isAcceptedAlt = Engine.isAcceptedAlternative(
        state.typedText,
        refText,
        state.currentPassage ? state.currentPassage.acceptedAlternatives : []
      );

      if (state.prefs.matchMode === 'strict') {
        if (counts.incorrectChars === 0 || isAcceptedAlt) {
          completeCurrentSession('Passage completed with exact match');
        } else {
          const strictAlert = $('strict-mode-alert');
          if (strictAlert) strictAlert.classList.remove('hidden');
        }
      } else {
        // Relaxed mode completes when user reaches end of passage and last character matches (or is accepted alternative)
        if (counts.incorrectChars === 0 || isAcceptedAlt || state.typedText.endsWith(refText.slice(-1))) {
          completeCurrentSession('Passage completed');
        }
      }
    } else {
      const strictAlert = $('strict-mode-alert');
      if (strictAlert) strictAlert.classList.add('hidden');
    }
  }

  // =========================================================================
  // RENDERING TARGET PASSAGE, LIVE TELEMETRY, COUNTS & DIAGNOSTICS
  // =========================================================================
  function getCurrentLiveStats() {
    const refText = state.currentPassage ? state.currentPassage.text : '';
    return Engine.computeLiveStatistics({
      typedText: state.typedText,
      referenceText: refText,
      elapsedActiveMs: state.elapsedActiveMs,
      totalKeystrokes: state.totalKeystrokes,
      correctKeystrokes: state.correctKeystrokes,
      errorKeystrokes: state.errorKeystrokes,
      correctedErrors: state.correctedErrors,
      wpmHistory: state.wpmHistory,
      limitConfig: getActiveLimitConfig()
    });
  }

  function formatElapsedMMSS(seconds) {
    const totalSec = Math.max(0, Math.floor(Number(seconds) || 0));
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }

  function setCircularRingProgress(ringId, ratio) {
    const ringEl = $(ringId);
    if (!ringEl) return;
    const circumference = 207.35; // 2 * Math.PI * 33
    const clamped = Math.min(1, Math.max(0, Number(ratio) || 0));
    const offset = circumference * (1 - clamped);
    ringEl.style.strokeDashoffset = offset.toFixed(2);
  }

  function renderLiveMetricsOnly() {
    const stats = getCurrentLiveStats();
    const limitConfig = getActiveLimitConfig();

    const setTxt = (id, val) => {
      const el = $(id);
      if (el) el.textContent = String(val);
    };

    // 1. WPM Circle (Bright Cyan)
    const wpmDisplay = stats.totalCharsTyped > 0 ? Math.round(stats.netWpm) : 0;
    setTxt('stat-net-wpm', wpmDisplay);
    const wpmRatio = stats.totalCharsTyped > 0 ? Math.min(1, stats.netWpm / 100) : 0;
    setCircularRingProgress('ring-wpm', wpmRatio);
    const wpmCard = $('circle-card-wpm');
    if (wpmCard) {
      wpmCard.title = `Net WPM: ${stats.netWpm.toFixed(1)} | Gross WPM: ${stats.grossWpm.toFixed(1)} | Best: ${stats.bestWpm.toFixed(1)}`;
    }

    // 2. Accuracy Circle (Teal Green)
    const accDisplay = `${Math.round(stats.accuracy)}%`;
    setTxt('stat-accuracy', accDisplay);
    const accRatio = Math.min(1, Math.max(0, stats.accuracy / 100));
    setCircularRingProgress('ring-accuracy', accRatio);
    const accCard = $('circle-card-accuracy');
    if (accCard) {
      accCard.title = `Keystroke Accuracy: ${stats.accuracy}% | Final Text Accuracy: ${stats.finalTextAccuracy}% | Error Rate: ${stats.errorRate}%`;
    }

    // 3. Time Circle (Electric Blue)
    setTxt('stat-elapsed-time', formatElapsedMMSS(stats.activeElapsedSec));
    let timeRatio = 0;
    if (limitConfig.type === 'timed' && limitConfig.value > 0) {
      timeRatio = Math.min(1, stats.activeElapsedSec / limitConfig.value);
    } else if (stats.activeElapsedSec > 0) {
      timeRatio = Math.min(1, ((stats.activeElapsedSec % 60) || 60) / 60);
    }
    setCircularRingProgress('ring-time', timeRatio);
    const timeCard = $('circle-card-time');
    if (timeCard) {
      timeCard.title = stats.remainingTimeSec !== null
        ? `Elapsed: ${stats.activeElapsedSec.toFixed(1)}s | Remaining: ${stats.remainingTimeSec.toFixed(1)}s`
        : `Active Elapsed Time: ${stats.activeElapsedSec.toFixed(1)}s`;
    }

    // 4. Words Circle (Purple)
    const targetWords = (limitConfig.type === 'words' && limitConfig.value > 0)
      ? limitConfig.value
      : Math.max(1, stats.refWords);
    setTxt('stat-words-summary', stats.correctWords);
    const wordsRatio = Math.min(1, stats.correctWords / targetWords);
    setCircularRingProgress('ring-words', wordsRatio);
    const wordsCard = $('circle-card-words');
    if (wordsCard) {
      wordsCard.title = `Correct Words: ${stats.correctWords} / Target: ${targetWords} (${stats.wordsRemaining} remaining)`;
    }

    // 5. Errors Circle (Red)
    const totalMistakes = stats.errorKeystrokes;
    setTxt('stat-errors-summary', totalMistakes);
    const errRatio = totalMistakes > 0 ? Math.min(1, totalMistakes / 15) : 0;
    setCircularRingProgress('ring-errors', errRatio);
    const errCard = $('circle-card-errors');
    if (errCard) {
      errCard.title = `Typing Mistakes: ${totalMistakes} (${stats.uncorrectedErrors} active, ${stats.correctedErrors} fixed via Backspace)`;
    }

    // Update top-right Live Stats header target progress summary
    const targetHintEl = $('live-stats-target-hint');
    if (targetHintEl) {
      if (limitConfig.type === 'timed' && stats.remainingTimeSec !== null) {
        targetHintEl.textContent = `${stats.remainingTimeSec.toFixed(0)}s left • ${stats.completionPercentage}%`;
      } else {
        targetHintEl.textContent = `${stats.correctWords}/${targetWords} words • ${stats.completionPercentage}%`;
      }
    }

    // Update auxiliary telemetry bindings
    setTxt('stat-gross-wpm', stats.grossWpm.toFixed(1));
    setTxt('stat-penalty-wpm', stats.penaltyNetWpm.toFixed(1));
    setTxt('stat-final-accuracy', `${stats.finalTextAccuracy}%`);
    setTxt('stat-error-rate', `Err: ${stats.errorRate}%`);
    setTxt('stat-current-wpm', stats.currentWpm.toFixed(1));
    setTxt('stat-avg-wpm', stats.averageWpm.toFixed(1));
    setTxt('stat-best-wpm', stats.bestWpm.toFixed(1));
    setTxt('stat-remaining-time', stats.remainingTimeSec !== null ? `(${stats.remainingTimeSec.toFixed(1)}s left)` : '');
    setTxt('stat-completion-pct', `${stats.completionPercentage}%`);

    const progBar = $('stat-progress-bar');
    if (progBar) progBar.style.width = `${Math.min(100, stats.completionPercentage)}%`;

    setTxt('stat-chars-summary', `${stats.correctChars} / ${stats.incorrectChars} / ${stats.remainingChars}`);
    setTxt(
      'stat-mechanics-summary',
      `P:${stats.punctuationAccuracy}% C:${stats.capitalizationAccuracy}% S:${stats.spacingAccuracy}%`
    );
  }

  function renderTargetPassageAndStats() {
    const stats = getCurrentLiveStats();
    renderLiveMetricsOnly();

    // Render character-by-character target passage in the single merged box
    const display = $('target-passage-display');
    if (display) {
      const htmlParts = stats.comparison.charStates.map(cs => {
        const rawChar = cs.status === 'extra' ? cs.actual : cs.expected;
        const visibleChar = rawChar === ' ' ? ' ' : escapeHtml(rawChar);
        const dataAttrs = `data-char-index="${cs.index}"`;
        if (cs.status === 'correct') {
          return `<span ${dataAttrs} class="tw-char tw-char-correct">${visibleChar}</span>`;
        } else if (cs.status === 'incorrect') {
          const title = escapeHtml(`Expected "${cs.expected}", typed "${cs.actual}"`);
          return `<span ${dataAttrs} class="tw-char tw-char-incorrect" title="${title}">${visibleChar}</span>`;
        } else if (cs.status === 'extra') {
          return `<span ${dataAttrs} class="tw-char tw-char-extra" title="Extra character beyond target">${visibleChar}</span>`;
        } else if (cs.status === 'cursor') {
          return `<span ${dataAttrs} class="tw-char tw-char-cursor" title="Current character — press key or click to type">${visibleChar}</span>`;
        } else {
          return `<span ${dataAttrs} class="tw-char tw-char-pending">${visibleChar}</span>`;
        }
      });
      display.innerHTML = htmlParts.join('');
    }

    renderCharacterAndWordCountPanel(stats);
    renderLiveDiagnosticInspector(stats);
    if (state.prefs.keyboardViewMode === 'heatmap') {
      renderQwertyKeyboard();
    }
  }

  function renderCharacterAndWordCountPanel(liveStats) {
    const refText = state.currentPassage ? state.currentPassage.text : '';
    const sourceMode = state.prefs.countPanelSource || 'final';

    let inspectedText = state.typedText;
    let caption = 'Showing counts for the current final corrected text in the input box. Words are tokenized by contiguous non-whitespace sequences (\\S+).';
    if (sourceMode === 'raw') {
      inspectedText = state.rawKeystrokeStream;
      caption = 'Showing counts for the entire raw keystroke history (including characters later deleted with Backspace).';
    } else if (sourceMode === 'reference') {
      inspectedText = refText;
      caption = 'Showing exact baseline counts for the target reference passage.';
    }

    const c = Engine.computeTextCounts(inspectedText, refText);
    const capEl = $('count-source-caption');
    if (capEl) capEl.textContent = caption;

    // Update source toggle button styles
    const modes = [
      { id: 'btn-count-source-final', key: 'final' },
      { id: 'btn-count-source-raw', key: 'raw' },
      { id: 'btn-count-source-ref', key: 'reference' }
    ];
    modes.forEach(m => {
      const btn = $(m.id);
      if (!btn) return;
      btn.className = sourceMode === m.key
        ? 'px-2 py-0.5 rounded-md font-semibold bg-emerald-500 text-slate-950'
        : 'px-2 py-0.5 rounded-md font-medium text-slate-600 dark:text-slate-400';
    });

    const setTxt = (id, val) => {
      const el = $(id);
      if (el) el.textContent = String(val);
    };

    setTxt('cnt-chars-with-spaces', c.charsWithSpaces);
    setTxt('cnt-chars-no-spaces', c.charsWithoutSpaces);
    setTxt('cnt-words', c.words);
    setTxt('cnt-letters', c.letters);
    setTxt('cnt-upper-lower', `${c.uppercase} / ${c.lowercase}`);
    setTxt('cnt-digits', c.digits);
    setTxt('cnt-punctuation', c.punctuation);
    setTxt('cnt-whitespace', c.whitespace);
    setTxt('cnt-correct-incorrect', `${liveStats.correctChars} / ${liveStats.incorrectChars}`);
    setTxt('cnt-ref-chars-words', `${c.refChars} chars / ${c.refWords} words`);
    setTxt('cnt-rem-chars-words', `${liveStats.remainingChars} chars / ${liveStats.wordsRemaining} words`);
  }

  function renderLiveDiagnosticInspector(liveStats) {
    const diag = Engine.analyzeGrammarAndMechanics(state.typedText, state.currentPassage);

    const gScoreEl = $('diag-grammar-score');
    const tScoreEl = $('diag-typing-score');
    if (gScoreEl) gScoreEl.textContent = `${diag.grammarAccuracy}%`;
    if (tScoreEl) tScoreEl.textContent = `${liveStats.finalTextAccuracy}%`;

    const altEl = $('diag-accepted-alternatives');
    if (altEl) {
      if (diag.acceptedVariations.length > 0) {
        altEl.classList.remove('hidden');
        altEl.innerHTML = diag.acceptedVariations.map(v =>
          `<div><strong>Valid English Alternative Recognized:</strong> You typed <code class="font-mono-typing">${escapeHtml(v.actual)}</code> instead of reference <code class="font-mono-typing">${escapeHtml(v.expected)}</code>. ${escapeHtml(v.note)}</div>`
        ).join('');
      } else {
        altEl.classList.add('hidden');
      }
    }

    const gmContainer = $('diag-grammar-mistakes');
    if (gmContainer) {
      if (diag.grammarMistakes.length === 0) {
        gmContainer.innerHTML = `<div class="text-emerald-600 dark:text-emerald-400 font-medium">✓ No grammatical, punctuation, or capitalization rule mistakes detected so far.</div>`;
      } else {
        gmContainer.innerHTML = diag.grammarMistakes.map(m => `
          <div class="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 space-y-1">
            <div class="flex flex-wrap items-center justify-between gap-1">
              <span class="font-bold text-rose-600 dark:text-rose-400">${escapeHtml(m.category)} (${escapeHtml(m.subType || 'Rule')})</span>
              <span class="font-mono-typing text-[11px]">Your form: <del class="text-rose-500">${escapeHtml(m.actual)}</del> → Correct: <strong class="text-emerald-500">${escapeHtml(m.expected)}</strong></span>
            </div>
            <p class="text-slate-700 dark:text-slate-200">${escapeHtml(m.reason)}</p>
          </div>
        `).join('');
      }
    }

    const tmContainer = $('diag-typing-mistakes');
    if (tmContainer) {
      if (diag.typingMistakes.length === 0) {
        tmContainer.innerHTML = `<div class="text-slate-500 dark:text-slate-400">No mechanical keystroke slips detected.</div>`;
      } else {
        tmContainer.innerHTML = diag.typingMistakes.map(t => `
          <div class="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-0.5">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-amber-600 dark:text-amber-400">${escapeHtml(t.category)}</span>
              <span class="font-mono-typing text-[11px]">Typed: "${escapeHtml(t.actual)}" vs "${escapeHtml(t.expected)}"</span>
            </div>
            <p class="text-slate-600 dark:text-slate-300">${escapeHtml(t.reason)}</p>
          </div>
        `).join('');
      }
    }
  }

  // =========================================================================
  // ON-SCREEN QWERTY KEYBOARD & HEATMAP (SECTIONS 4 & 8)
  // =========================================================================
  function renderQwertyKeyboard() {
    const container = $('qwerty-keyboard-container');
    if (!container) return;

    const show = state.prefs.showKeyboard !== false;
    container.classList.toggle('hidden', !show);
    const toggleBtn = $('btn-toggle-keyboard');
    if (toggleBtn) toggleBtn.textContent = show ? 'Hide' : 'Show';

    const mode = state.prefs.keyboardViewMode || 'live';
    const liveBtn = $('btn-kb-mode-live');
    const heatBtn = $('btn-kb-mode-heatmap');
    if (liveBtn && heatBtn) {
      liveBtn.className = mode === 'live'
        ? 'px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950'
        : 'px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300';
      heatBtn.className = mode === 'heatmap'
        ? 'px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950'
        : 'px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300';
    }

    // Compute heatmap frequencies if in heatmap mode
    const freqData = Engine.computeLetterFrequency(
      state.rawKeystrokeStream || state.telemetry.allTimeTypedText,
      Object.keys(state.sessionKeypressMap).length > 0 ? state.sessionKeypressMap : state.telemetry.keypressCounts
    );

    container.innerHTML = Engine.QWERTY_ROWS.map(row => {
      const keysHtml = row.map(k => {
        const count = freqData.keyCounts[k.code] || 0;
        let heatStyle = '';
        let subLabel = '';
        if (mode === 'heatmap' && freqData.maxKeyCount > 0 && count > 0) {
          const ratio = Math.min(1, count / freqData.maxKeyCount);
          const alpha = (0.18 + ratio * 0.68).toFixed(2);
          heatStyle = `background-color: rgba(16, 185, 129, ${alpha}); border-color: rgba(16, 185, 129, 0.8); color: #ffffff;`;
          subLabel = `<span class="text-[9px] font-mono-typing opacity-90">${count}</span>`;
        }
        return `<div id="qwerty-key-${k.code}" data-key-code="${k.code}" class="qwerty-key ${k.wide || ''}" style="${heatStyle}">
          <span>${escapeHtml(k.label)}</span>
          ${subLabel}
        </div>`;
      }).join('');
      return `<div class="flex items-center justify-center gap-1.5">${keysHtml}</div>`;
    }).join('');
  }

  function highlightKeyOnScreen(event, isDown) {
    if (!event) return;
    const code = event.code;
    const keyEl = $(`qwerty-key-${code}`);
    if (keyEl) {
      if (isDown) {
        keyEl.classList.add('active-key');
        if (keyEl._releaseTimer) clearTimeout(keyEl._releaseTimer);
        keyEl._releaseTimer = setTimeout(() => keyEl.classList.remove('active-key'), 180);
      } else {
        keyEl.classList.remove('active-key');
      }
    }

    // Check Caps Lock state
    if (typeof event.getModifierState === 'function') {
      const capsOn = event.getModifierState('CapsLock');
      const warn = $('caps-lock-warning');
      if (warn) warn.classList.toggle('hidden', !capsOn);
    }
  }

  // =========================================================================
  // SESSION COMPLETION, RESULTS MODAL & RECOMMENDATION ENGINE (SECTION 12)
  // =========================================================================
  function completeCurrentSession(reasonLabel = 'Session completed') {
    if (state.sessionStatus === 'completed') return;
    if (state.sessionStatus === 'running' && state.lastTickTimestamp) {
      state.elapsedActiveMs += Math.max(0, Date.now() - state.lastTickTimestamp);
    }
    clearSessionTimers();

    // Ensure non-zero minimum elapsed time if user pasted or finished instantaneously
    if (state.typedText.length > 0 && state.elapsedActiveMs < 500) {
      state.elapsedActiveMs = 1000;
    }

    state.sessionStatus = 'completed';
    updateSessionStatusUI();
    playTone('complete');

    const refText = state.currentPassage ? state.currentPassage.text : '';
    const finalStats = getCurrentLiveStats();
    const diag = Engine.analyzeGrammarAndMechanics(state.typedText, state.currentPassage);
    const sessionLetterFreq = Engine.computeLetterFrequency(state.rawKeystrokeStream || state.typedText, state.sessionKeypressMap);

    // Record final point in time series
    const finalSec = Math.max(1, Math.round(finalStats.activeElapsedSec));
    state.wpmHistory.push({
      sec: finalSec,
      label: `${finalSec}s`,
      grossWpm: finalStats.grossWpm,
      netWpm: finalStats.netWpm,
      accuracy: finalStats.accuracy
    });

    // Compare against previous session before saving
    const prevSession = state.sessions.length > 0 ? state.sessions[0] : null;

    // Build session record
    const nowIso = new Date().toISOString();
    const modeObj = Curriculum.PRACTICE_MODES.find(m => m.id === state.prefs.selectedMode);
    const sessionRecord = {
      id: 'sess_' + Date.now(),
      timestamp: nowIso,
      dateKey: nowIso.slice(0, 10),
      modeId: state.prefs.selectedMode,
      modeName: modeObj ? modeObj.name : state.prefs.selectedMode,
      customSetId: state.currentPassage && state.currentPassage.customSetId ? state.currentPassage.customSetId : null,
      customSetName: state.currentPassage && state.currentPassage.customSetName ? state.currentPassage.customSetName : null,
      passageId: state.currentPassage ? state.currentPassage.id : '',
      grammarFocus: state.currentPassage ? state.currentPassage.grammarFocus : 'General Grammar',
      reasonLabel,
      grossWpm: finalStats.grossWpm,
      netWpm: finalStats.netWpm,
      penaltyNetWpm: finalStats.penaltyNetWpm,
      accuracy: finalStats.accuracy,
      finalTextAccuracy: finalStats.finalTextAccuracy,
      errorRate: finalStats.errorRate,
      grammarAccuracy: diag.grammarAccuracy,
      correctChars: finalStats.correctChars,
      incorrectChars: finalStats.incorrectChars,
      totalCharsTyped: finalStats.totalCharsTyped,
      correctWords: finalStats.correctWords,
      incorrectWords: finalStats.incorrectWords,
      totalWordsTyped: finalStats.totalWordsTyped,
      correctedErrors: finalStats.correctedErrors,
      uncorrectedErrors: finalStats.uncorrectedErrors,
      activeElapsedSec: finalStats.activeElapsedSec,
      completionPercentage: finalStats.completionPercentage,
      punctuationAccuracy: finalStats.punctuationAccuracy,
      capitalizationAccuracy: finalStats.capitalizationAccuracy,
      spacingAccuracy: finalStats.spacingAccuracy,
      topLetters: sessionLetterFreq.ranked.filter(l => l.count > 0).slice(0, 5).map(l => `${l.letter} (${l.count})`),
      grammarMistakes: diag.grammarMistakes,
      typingMistakes: diag.typingMistakes,
      acceptedVariations: diag.acceptedVariations,
      errorPositions: finalStats.comparison.errorPositions.slice(0, 15)
    };

    state.sessions = Storage.saveSession(sessionRecord);
    state.telemetry = Storage.recordTelemetryFromSession({
      typedText: state.rawKeystrokeStream || state.typedText,
      keypressMap: state.sessionKeypressMap,
      comparisonErrors: finalStats.comparison.errorPositions,
      grammarAnalysis: diag
    });
    updateMistakeDrillBadge();

    openSessionResultsModal(sessionRecord, prevSession);
  }

  function openSessionResultsModal(sessionRecord, prevSession) {
    const modal = $('modal-session-results');
    if (!modal) return;

    const setTxt = (id, val) => {
      const el = $(id);
      if (el) el.textContent = String(val);
    };

    setTxt('res-subtitle', `${sessionRecord.modeName} • ${sessionRecord.grammarFocus} • ${sessionRecord.reasonLabel}`);
    setTxt('res-wpm', `${sessionRecord.netWpm.toFixed(1)} / ${sessionRecord.grossWpm.toFixed(1)}`);

    if (prevSession) {
      const diffWpm = Number((sessionRecord.netWpm - prevSession.netWpm).toFixed(1));
      const diffAcc = Number((sessionRecord.accuracy - prevSession.accuracy).toFixed(1));
      const signWpm = diffWpm >= 0 ? `+${diffWpm}` : `${diffWpm}`;
      const signAcc = diffAcc >= 0 ? `+${diffAcc}%` : `${diffAcc}%`;
      setTxt('res-prev-comparison', `vs. Prev Session: ${signWpm} WPM, ${signAcc} Acc`);
    } else {
      setTxt('res-prev-comparison', 'Baseline session established');
    }

    setTxt('res-accuracy', `${sessionRecord.accuracy}% / ${sessionRecord.errorRate}% Err`);
    setTxt('res-grammar-acc', `Grammar Knowledge Score: ${sessionRecord.grammarAccuracy}%`);
    setTxt('res-words-chars', `${sessionRecord.totalWordsTyped} Words / ${sessionRecord.totalCharsTyped} Chars`);
    setTxt(
      'res-correct-breakdown',
      `Words: ${sessionRecord.correctWords} ok, ${sessionRecord.incorrectWords} err • Chars: ${sessionRecord.correctChars} ok, ${sessionRecord.incorrectChars} err (${sessionRecord.correctedErrors} fixed via Bksp)`
    );
    setTxt('res-time-completion', `${sessionRecord.activeElapsedSec}s (${sessionRecord.completionPercentage}%)`);
    setTxt('res-top-letters', `Top Letters: ${sessionRecord.topLetters.length > 0 ? sessionRecord.topLetters.join(', ') : '—'}`);

    const mechStrip = $('res-mechanics-strip');
    if (mechStrip) {
      mechStrip.innerHTML = `
        <span><strong>Punctuation Accuracy:</strong> ${sessionRecord.punctuationAccuracy}%</span>
        <span><strong>Capitalization Accuracy:</strong> ${sessionRecord.capitalizationAccuracy}%</span>
        <span><strong>Spacing Accuracy:</strong> ${sessionRecord.spacingAccuracy}%</span>
        <span><strong>Final Text Match:</strong> ${sessionRecord.finalTextAccuracy}%</span>
      `;
    }

    // Detailed review of grammar mistakes, accepted variations, and character positions
    const reviewContainer = $('res-mistakes-review');
    if (reviewContainer) {
      const blocks = [];

      if (sessionRecord.acceptedVariations && sessionRecord.acceptedVariations.length > 0) {
        sessionRecord.acceptedVariations.forEach(v => {
          blocks.push(`<div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
            <strong>✓ Valid English Alternative Accepted:</strong> You typed <code class="font-mono-typing">${escapeHtml(v.actual)}</code> (${escapeHtml(v.note)})
          </div>`);
        });
      }

      if (sessionRecord.grammarMistakes && sessionRecord.grammarMistakes.length > 0) {
        sessionRecord.grammarMistakes.forEach(m => {
          const exHtml = (m.examples && m.examples.length > 0)
            ? `<div class="mt-1 text-[11px] opacity-85 font-mono-typing">Example: ${escapeHtml(m.examples[0])}</div>`
            : '';
          blocks.push(`<div class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1">
            <div class="flex items-center justify-between">
              <strong class="text-rose-600 dark:text-rose-400">Grammar / Mechanics Rule: ${escapeHtml(m.category)}</strong>
              <span class="font-mono-typing">Your form: <del>${escapeHtml(m.actual)}</del> → Correct: <strong class="text-emerald-500">${escapeHtml(m.expected)}</strong></span>
            </div>
            <p class="text-slate-700 dark:text-slate-200">${escapeHtml(m.reason)}</p>
            ${exHtml}
          </div>`);
        });
      }

      if (sessionRecord.typingMistakes && sessionRecord.typingMistakes.length > 0) {
        sessionRecord.typingMistakes.forEach(t => {
          blocks.push(`<div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div class="flex items-center justify-between">
              <strong class="text-amber-600 dark:text-amber-400">${escapeHtml(t.category)}</strong>
              <span class="font-mono-typing">Typed "${escapeHtml(t.actual)}" instead of "${escapeHtml(t.expected)}"</span>
            </div>
            <p class="text-slate-600 dark:text-slate-300 mt-0.5">${escapeHtml(t.reason)}</p>
          </div>`);
        });
      }

      if (blocks.length === 0 && sessionRecord.errorPositions && sessionRecord.errorPositions.length > 0) {
        sessionRecord.errorPositions.slice(0, 5).forEach(ep => {
          blocks.push(`<div class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
            Position #${ep.index + 1}: ${escapeHtml(ep.explanation)}
          </div>`);
        });
      }

      if (blocks.length === 0) {
        blocks.push(`<div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold">
          Flawless execution! Zero unresolved grammar mistakes or character mismatches.
        </div>`);
      }

      reviewContainer.innerHTML = blocks.join('');
    }

    // Generate concise, actionable recommendation for the next session
    const recEl = $('res-recommendation-text');
    if (sessionRecord.grammarMistakes && sessionRecord.grammarMistakes.length > 0) {
      const firstGm = sessionRecord.grammarMistakes[0];
      let targetMode = 'grammar_sentences';
      if (/Preposition/i.test(firstGm.category)) targetMode = 'prepositions';
      else if (/Article|Determiner|Quantifier/i.test(firstGm.category)) targetMode = 'articles';
      else if (/Verb|Agreement|Tense/i.test(firstGm.category)) targetMode = 'tenses_agreement';
      else if (/Punctuation|Capitalization|Apostrophe/i.test(firstGm.category)) targetMode = 'punctuation_caps';
      else if (/Spelling/i.test(firstGm.category)) targetMode = 'spelling';

      state.recommendedAction = { mode: targetMode, subCategory: 'all' };
      if (recEl) {
        recEl.textContent = `Focus your next drill on "${firstGm.category}" to reinforce "${firstGm.expected}" vs. "${firstGm.actual}".`;
      }
    } else if (sessionRecord.punctuationAccuracy < 95 || sessionRecord.capitalizationAccuracy < 95) {
      state.recommendedAction = { mode: 'punctuation_caps', subCategory: 'all' };
      if (recEl) {
        recEl.textContent = 'Practice Mode E (Punctuation & Capitalization) to sharpen comma, apostrophe, and uppercase precision.';
      }
    } else if (sessionRecord.accuracy < 94) {
      state.recommendedAction = { mode: state.prefs.selectedMode, subCategory: state.prefs.selectedSubCategory };
      if (recEl) {
        recEl.textContent = `Repeat ${sessionRecord.modeName} at a slightly steadier pace to push keystroke accuracy above 96%.`;
      }
    } else {
      state.recommendedAction = { mode: 'mixed_challenge', subCategory: 'all' };
      if (recEl) {
        recEl.textContent = 'Strong accuracy and grammar mastery! Challenge yourself with Mode J (Mixed Challenge) or Paragraph Practice.';
      }
    }

    modal.classList.remove('hidden');
  }

  // =========================================================================
  // VIEW 2: GRAMMAR & PUNCTUATION ACADEMY + FOCUSED MISTAKE DRILLS
  // =========================================================================
  function launchFocusedMistakeDrill() {
    const mistakes = state.telemetry.recurringMistakes || [];
    const customPassages = [];

    if (mistakes.length > 0) {
      // Find curriculum passages matching the user's top mistake categories
      const topCategories = mistakes.map(m => m.category.toLowerCase());
      Curriculum.PASSAGES.forEach(p => {
        const focusLow = (p.grammarFocus || '').toLowerCase();
        const spanMatch = (p.focusSpans || []).some(fs =>
          topCategories.some(tc => (fs.category || '').toLowerCase().includes(tc.slice(0, 8)))
        );
        if (spanMatch || topCategories.some(tc => focusLow.includes(tc.slice(0, 8)))) {
          customPassages.push(p);
        }
      });
    }

    const drillPassages = customPassages.length > 0
      ? customPassages
      : Curriculum.PASSAGES.filter(p => ['prepositions', 'articles', 'tenses_agreement', 'punctuation_caps'].includes(p.mode));

    switchTab('trainer');
    selectPracticeMode(drillPassages[0].mode, 'all', drillPassages);
    showToast(`Focused Mistake Drill launched (${drillPassages.length} targeted sentences).`);
  }

  // =========================================================================
  // VIEW 3: LETTER-FREQUENCY & VISUAL ANALYTICS (SECTIONS 8 & 9)
  // =========================================================================
  function getFilteredLetterFrequencyData() {
    let sourceText = '';
    let kpMap = null;

    if (state.freqFilter === 'session') {
      sourceText = state.rawKeystrokeStream || state.typedText;
      kpMap = state.sessionKeypressMap;
    } else if (state.freqFilter === 'ref') {
      sourceText = state.currentPassage ? state.currentPassage.text : '';
    } else if (state.freqFilter === 'custom') {
      const activeSet = state.customSets.find(s => s.id === state.prefs.activeCustomSetId) || state.customSets[0];
      sourceText = activeSet ? activeSet.items.join(' ') : '';
    } else {
      sourceText = (state.telemetry.allTimeTypedText || '') + ' ' + (state.rawKeystrokeStream || '');
      kpMap = state.telemetry.keypressCounts;
    }

    return Engine.computeLetterFrequency(sourceText, kpMap);
  }

  function renderAnalyticsDashboard() {
    const freq = getFilteredLetterFrequencyData();

    // Update filter button styles
    const filterButtons = [
      { id: 'btn-freq-filter-session', key: 'session' },
      { id: 'btn-freq-filter-ref', key: 'ref' },
      { id: 'btn-freq-filter-custom', key: 'custom' },
      { id: 'btn-freq-filter-alltime', key: 'alltime' }
    ];
    filterButtons.forEach(fb => {
      const btn = $(fb.id);
      if (!btn) return;
      btn.className = state.freqFilter === fb.key
        ? 'px-2.5 py-1 rounded-lg font-semibold bg-emerald-500 text-slate-950'
        : 'px-2.5 py-1 rounded-lg font-medium text-slate-600 dark:text-slate-400';
    });

    const caseBtn = $('btn-freq-case-toggle');
    if (caseBtn) {
      caseBtn.textContent = state.freqCaseBreakdown
        ? 'View: Uppercase / Lowercase Breakdown'
        : 'View: Case-Insensitive (A–Z)';
    }

    const totalEl = $('freq-total-letters');
    const mostEl = $('freq-most-used');
    const leastEl = $('freq-least-used');
    const exclEl = $('freq-excluded-nonletters');

    if (totalEl) totalEl.textContent = String(freq.totalAlphabeticLetters);
    if (mostEl) {
      mostEl.textContent = freq.mostUsed
        ? `${freq.mostUsed.letter} (${freq.mostUsed.count} • ${freq.mostUsed.percentage}%)`
        : '—';
    }
    if (leastEl) {
      leastEl.textContent = freq.leastUsed
        ? `${freq.leastUsed.letter} (${freq.leastUsed.count} • ${freq.leastUsed.percentage}%)`
        : '—';
    }
    if (exclEl) {
      exclEl.textContent = `${freq.excludedSpaces} spaces, ${freq.excludedDigits} digits, ${freq.excludedPunctuation} punct`;
    }

    // Render Ranked A–Z Grid
    const grid = $('letter-freq-ranked-grid');
    if (grid) {
      const maxCount = freq.mostUsed ? Math.max(1, freq.mostUsed.count) : 1;
      grid.innerHTML = freq.ranked.map((item, idx) => {
        const isTop = freq.mostUsed && item.letter === freq.mostUsed.letter && item.count > 0;
        const isLeast = freq.leastUsed && item.letter === freq.leastUsed.letter && item.count > 0 && freq.mostUsed.letter !== freq.leastUsed.letter;
        const borderCls = isTop
          ? 'border-emerald-500 bg-emerald-500/10'
          : isLeast
            ? 'border-amber-500 bg-amber-500/10'
            : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60';
        const barWidth = Math.round((item.count / maxCount) * 100);
        const caseSub = state.freqCaseBreakdown
          ? `<div class="text-[10px] font-mono-typing text-sky-500">U:${item.upper} L:${item.lower}</div>`
          : '';
        return `
          <div class="p-2.5 rounded-xl border ${borderCls} flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-sm font-extrabold font-mono-typing text-slate-900 dark:text-white">${item.letter}</span>
              <span class="text-[10px] font-mono-typing text-slate-400">#${idx + 1}</span>
            </div>
            <div class="mt-1 text-xs font-bold font-mono-typing text-emerald-600 dark:text-emerald-400">
              ${item.count} <span class="text-[10px] font-normal text-slate-500">(${item.percentage}%)</span>
            </div>
            ${caseSub}
            <div class="mt-1.5 w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
              <div class="bg-emerald-500 h-full" style="width: ${barWidth}%"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Update all 8 Charts (A–H)
    const liveStats = getCurrentLiveStats();
    const historySummaries = Storage.computeHistorySummaries(state.sessions);
    Charts.updateAllCharts({
      timeSeries: state.wpmHistory,
      liveStats,
      letterFreq: freq,
      telemetry: state.telemetry,
      sessions: state.sessions,
      historySummaries
    });
  }

  // =========================================================================
  // VIEW 4: CUSTOM PRACTICE STUDIO (SECTION 11)
  // =========================================================================
  function renderCustomSetsList() {
    state.customSets = Storage.loadCustomSets();
    const listEl = $('custom-sets-list');
    if (!listEl) return;

    if (!state.editingCustomSetId && state.customSets[0]) {
      loadCustomSetIntoEditor(state.customSets[0].id);
    }

    listEl.innerHTML = state.customSets.map((s, idx) => {
      const isEditing = state.editingCustomSetId === s.id;
      const borderCls = isEditing
        ? 'border-emerald-500 bg-emerald-500/10'
        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60';
      return `
        <div class="p-3.5 rounded-xl border ${borderCls} space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">${escapeHtml(s.name)}</h3>
              <div class="text-[11px] text-slate-500 dark:text-slate-400">
                ${escapeHtml(s.difficulty)} • ${escapeHtml(s.grammarFocus)} • ${s.items.length} item(s) • Goal: ${s.targetWpm} WPM / ${s.targetAccuracy}%
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono-typing uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              ${escapeHtml(s.matchMode)}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-1.5 pt-1">
            <button type="button" data-cset-action="practice" data-cset-id="${escapeHtml(s.id)}"
              class="cset-action-btn px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950">
              Practice
            </button>
            <button type="button" data-cset-action="edit" data-cset-id="${escapeHtml(s.id)}"
              class="cset-action-btn px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              Edit
            </button>
            <button type="button" data-cset-action="duplicate" data-cset-id="${escapeHtml(s.id)}"
              class="cset-action-btn px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              Duplicate
            </button>
            <button type="button" data-cset-action="up" data-cset-id="${escapeHtml(s.id)}" ${idx === 0 ? 'disabled' : ''}
              class="cset-action-btn px-2 py-1 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40">
              ↑
            </button>
            <button type="button" data-cset-action="down" data-cset-id="${escapeHtml(s.id)}" ${idx === state.customSets.length - 1 ? 'disabled' : ''}
              class="cset-action-btn px-2 py-1 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40">
              ↓
            </button>
            <button type="button" data-cset-action="delete" data-cset-id="${escapeHtml(s.id)}"
              class="cset-action-btn px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/15 text-rose-500 hover:bg-rose-500/25">
              Delete
            </button>
          </div>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('.cset-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-cset-action');
        const id = btn.getAttribute('data-cset-id');
        handleCustomSetAction(action, id);
      });
    });
  }

  function loadCustomSetIntoEditor(setId) {
    const s = state.customSets.find(item => item.id === setId);
    if (!s) return;
    state.editingCustomSetId = s.id;
    const titleEl = $('custom-editor-title');
    const idBadge = $('custom-editor-id-badge');
    if (titleEl) titleEl.textContent = `Editing: ${s.name}`;
    if (idBadge) idBadge.textContent = s.id;

    $('input-custom-name').value = s.name || '';
    $('input-custom-grammar-focus').value = s.grammarFocus || '';
    $('select-custom-difficulty').value = s.difficulty || 'Intermediate';
    $('select-custom-match').value = s.matchMode === 'strict' ? 'strict' : 'relaxed';
    $('select-custom-limit-type').value = s.limitType || 'unlimited';
    $('input-custom-limit-val').value = String(s.limitValue || 0);
    $('input-custom-target-wpm').value = String(s.targetWpm || 45);
    $('input-custom-target-acc').value = String(s.targetAccuracy || 96);
    $('textarea-custom-items').value = (s.items || []).join('\n');

    hideCustomValidationBanner();
  }

  function startNewCustomSetInEditor() {
    state.editingCustomSetId = 'custom_' + Date.now();
    $('custom-editor-title').textContent = 'Create New Custom Practice Set';
    $('custom-editor-id-badge').textContent = 'New Set';
    $('input-custom-name').value = '';
    $('input-custom-grammar-focus').value = 'Custom Grammar & Punctuation';
    $('select-custom-difficulty').value = 'Intermediate';
    $('select-custom-match').value = 'relaxed';
    $('select-custom-limit-type').value = 'unlimited';
    $('input-custom-limit-val').value = '0';
    $('input-custom-target-wpm').value = '45';
    $('input-custom-target-acc').value = '96';
    $('textarea-custom-items').value = '';
    hideCustomValidationBanner();
    $('input-custom-name').focus();
  }

  function showCustomValidationBanner(msg, isError) {
    const el = $('custom-validation-msg');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    el.className = isError
      ? 'rounded-xl px-3 py-2 text-xs font-medium bg-rose-500/15 text-rose-500 border border-rose-500/30'
      : 'rounded-xl px-3 py-2 text-xs font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
  }

  function hideCustomValidationBanner() {
    const el = $('custom-validation-msg');
    if (el) el.classList.add('hidden');
  }

  function saveEditorCustomSet(andPractice = false) {
    const name = ($('input-custom-name').value || '').trim();
    const grammarFocus = ($('input-custom-grammar-focus').value || '').trim() || 'Custom Grammar & Mechanics';
    const difficulty = $('select-custom-difficulty').value || 'Intermediate';
    const matchMode = $('select-custom-match').value === 'strict' ? 'strict' : 'relaxed';
    const limitType = $('select-custom-limit-type').value || 'unlimited';
    const limitValue = Math.max(0, Number($('input-custom-limit-val').value || 0));
    const targetWpm = Math.max(5, Number($('input-custom-target-wpm').value || 45));
    const targetAccuracy = Math.min(100, Math.max(50, Number($('input-custom-target-acc').value || 96)));
    const rawLines = ($('textarea-custom-items').value || '')
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);

    if (!name) {
      showCustomValidationBanner('Please enter a name for your custom practice set.', true);
      return;
    }
    if (rawLines.length === 0) {
      showCustomValidationBanner('Please enter at least one non-empty sentence or paragraph to practice.', true);
      return;
    }

    const setObj = {
      id: state.editingCustomSetId || ('custom_' + Date.now()),
      name,
      grammarFocus,
      difficulty,
      matchMode,
      limitType,
      limitValue,
      targetWpm,
      targetAccuracy,
      items: rawLines
    };

    const existingIdx = state.customSets.findIndex(s => s.id === setObj.id);
    if (existingIdx >= 0) {
      state.customSets[existingIdx] = setObj;
    } else {
      state.customSets.unshift(setObj);
    }

    Storage.saveCustomSets(state.customSets);
    state.editingCustomSetId = setObj.id;
    state.prefs.activeCustomSetId = setObj.id;
    Storage.savePrefs(state.prefs);

    renderCustomSetsList();
    showCustomValidationBanner(`Saved "${setObj.name}" (${rawLines.length} passages) to local storage.`, false);

    if (andPractice) {
      switchTab('trainer');
      selectPracticeMode('custom_text', 'all');
      showToast(`Practicing custom set: "${setObj.name}"`);
    }
  }

  function handleCustomSetAction(action, id) {
    const idx = state.customSets.findIndex(s => s.id === id);
    if (idx < 0) return;

    if (action === 'practice') {
      state.prefs.activeCustomSetId = id;
      Storage.savePrefs(state.prefs);
      switchTab('trainer');
      selectPracticeMode('custom_text', 'all');
      showToast(`Practicing "${state.customSets[idx].name}"`);
    } else if (action === 'edit') {
      loadCustomSetIntoEditor(id);
      renderCustomSetsList();
    } else if (action === 'duplicate') {
      const orig = state.customSets[idx];
      const copy = JSON.parse(JSON.stringify(orig));
      copy.id = 'custom_' + Date.now();
      copy.name = orig.name + ' (Copy)';
      state.customSets.splice(idx + 1, 0, copy);
      Storage.saveCustomSets(state.customSets);
      state.editingCustomSetId = copy.id;
      loadCustomSetIntoEditor(copy.id);
      renderCustomSetsList();
      showToast(`Duplicated "${orig.name}".`);
    } else if (action === 'up' && idx > 0) {
      const temp = state.customSets[idx - 1];
      state.customSets[idx - 1] = state.customSets[idx];
      state.customSets[idx] = temp;
      Storage.saveCustomSets(state.customSets);
      renderCustomSetsList();
    } else if (action === 'down' && idx < state.customSets.length - 1) {
      const temp = state.customSets[idx + 1];
      state.customSets[idx + 1] = state.customSets[idx];
      state.customSets[idx] = temp;
      Storage.saveCustomSets(state.customSets);
      renderCustomSetsList();
    } else if (action === 'delete') {
      if (state.customSets.length <= 1) {
        showCustomValidationBanner('At least one custom practice set must remain.', true);
        return;
      }
      const removed = state.customSets.splice(idx, 1)[0];
      Storage.saveCustomSets(state.customSets);
      if (state.editingCustomSetId === id && state.customSets[0]) {
        loadCustomSetIntoEditor(state.customSets[0].id);
      }
      renderCustomSetsList();
      showToast(`Deleted "${removed.name}".`);
    }
  }

  // =========================================================================
  // VIEW 5: SESSION HISTORY & PROGRESS (SECTION 13)
  // =========================================================================
  function populateHistoryFilterOptions() {
    const modeSel = $('filter-history-mode');
    if (modeSel) {
      modeSel.innerHTML = `<option value="all">All Practice Modes</option>` +
        Curriculum.PRACTICE_MODES.map(m => `<option value="${m.id}">${m.code}. ${escapeHtml(m.name)}</option>`).join('');
    }
    const csetSel = $('filter-history-custom-set');
    if (csetSel) {
      csetSel.innerHTML = `<option value="all">All Custom Sets</option>` +
        state.customSets.map(s => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name)}</option>`).join('');
    }
  }

  function renderHistoryView() {
    state.sessions = Storage.loadSessions();
    const summaries = Storage.computeHistorySummaries(state.sessions);

    const renderSummaryBox = (elId, data) => {
      const el = $(elId);
      if (!el) return;
      el.innerHTML = `
        <div class="flex justify-between"><span>Sessions:</span><strong class="font-mono-typing text-slate-900 dark:text-white">${data.sessions}</strong></div>
        <div class="flex justify-between"><span>Active Time:</span><strong class="font-mono-typing text-slate-900 dark:text-white">${data.minutes} min</strong></div>
        <div class="flex justify-between"><span>Words Typed:</span><strong class="font-mono-typing text-slate-900 dark:text-white">${data.words}</strong></div>
        <div class="flex justify-between"><span>Avg Net WPM:</span><strong class="font-mono-typing text-emerald-600 dark:text-emerald-400">${data.avgWpm}</strong></div>
        <div class="flex justify-between"><span>Avg Accuracy:</span><strong class="font-mono-typing text-sky-600 dark:text-sky-400">${data.avgAccuracy}%</strong></div>
      `;
    };

    renderSummaryBox('hist-daily-summary', summaries.daily);
    renderSummaryBox('hist-weekly-summary', summaries.weekly);
    renderSummaryBox('hist-monthly-summary', summaries.monthly);

    const pbEl = $('hist-personal-bests');
    if (pbEl) {
      const sign = summaries.wpmTrendDelta >= 0 ? `+${summaries.wpmTrendDelta}` : `${summaries.wpmTrendDelta}`;
      pbEl.innerHTML = `
        <div class="flex justify-between"><span>Total Sessions:</span><strong class="font-mono-typing text-slate-900 dark:text-white">${summaries.totalSessions}</strong></div>
        <div class="flex justify-between"><span>Best Net WPM:</span><strong class="font-mono-typing text-emerald-600 dark:text-emerald-400">${summaries.bestNetWpm}</strong></div>
        <div class="flex justify-between"><span>Best Gross WPM:</span><strong class="font-mono-typing text-slate-900 dark:text-white">${summaries.bestGrossWpm}</strong></div>
        <div class="flex justify-between"><span>Best Accuracy:</span><strong class="font-mono-typing text-sky-600 dark:text-sky-400">${summaries.bestAccuracy}%</strong></div>
        <div class="flex justify-between"><span>Latest Trend:</span><strong class="font-mono-typing text-amber-500">${sign} WPM</strong></div>
      `;
    }

    // Apply table filters
    const dateVal = ($('filter-history-date') && $('filter-history-date').value) || '';
    const modeVal = ($('filter-history-mode') && $('filter-history-mode').value) || 'all';
    const csetVal = ($('filter-history-custom-set') && $('filter-history-custom-set').value) || 'all';

    const filtered = state.sessions.filter(s => {
      if (dateVal && s.dateKey !== dateVal) return false;
      if (modeVal !== 'all' && s.modeId !== modeVal) return false;
      if (csetVal !== 'all' && s.customSetId !== csetVal) return false;
      return true;
    });

    const tbody = $('history-table-body');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="py-8 text-center text-slate-500 dark:text-slate-400">
            No sessions match the selected filters yet. Complete a passage in the Typing Workspace or click <strong>"+ Add Sample Multi-Day History"</strong> above to explore multi-day analytics.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(s => {
      const dt = s.timestamp ? new Date(s.timestamp).toLocaleString([], { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : s.dateKey;
      const modeBadge = s.customSetName ? `${s.modeName} (${s.customSetName})` : s.modeName;
      return `
        <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
          <td class="py-2.5 px-3 font-mono-typing whitespace-nowrap">${escapeHtml(dt)}</td>
          <td class="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">${escapeHtml(modeBadge)}</td>
          <td class="py-2.5 px-3 text-slate-600 dark:text-slate-300">${escapeHtml(s.grammarFocus)}</td>
          <td class="py-2.5 px-3 text-right font-mono-typing">${Number(s.activeElapsedSec || 0).toFixed(1)}s</td>
          <td class="py-2.5 px-3 text-right font-mono-typing">
            <strong class="text-emerald-600 dark:text-emerald-400">${Number(s.netWpm || 0).toFixed(1)}</strong> / ${Number(s.grossWpm || 0).toFixed(1)}
          </td>
          <td class="py-2.5 px-3 text-right font-mono-typing text-sky-600 dark:text-sky-400 font-semibold">${s.accuracy}%</td>
          <td class="py-2.5 px-3 text-right font-mono-typing text-emerald-600 dark:text-emerald-400">${s.grammarAccuracy !== undefined ? s.grammarAccuracy + '%' : '100%'}</td>
          <td class="py-2.5 px-3 text-right font-mono-typing">${s.totalWordsTyped}W / ${s.totalCharsTyped}C</td>
          <td class="py-2.5 px-3 text-right">
            <button type="button" data-review-sess-id="${escapeHtml(s.id)}"
              class="review-sess-btn px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-slate-950 transition">
              Report
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.review-sess-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sId = btn.getAttribute('data-review-sess-id');
        const idx = state.sessions.findIndex(x => x.id === sId);
        if (idx >= 0) {
          openSessionResultsModal(state.sessions[idx], state.sessions[idx + 1] || null);
        }
      });
    });
  }

  function seedSampleMultiDayHistory() {
    const now = Date.now();
    const dayMs = 86400000;
    const samples = [
      {
        daysAgo: 3,
        modeId: 'prepositions',
        modeName: 'Confused Prepositions',
        grammarFocus: 'Prepositions of Time & Place: in, on, at',
        text: 'The regional strategy meeting starts at 09:00 a.m. on Monday in Dhaka.',
        elapsedSec: 18.5,
        netWpm: 45.4,
        grossWpm: 47.0,
        accuracy: 96.6,
        grammarAccuracy: 92.3,
        words: 12,
        chars: 70
      },
      {
        daysAgo: 2,
        modeId: 'articles',
        modeName: 'Articles & Determiners',
        grammarFocus: 'Phonetic Articles: a vs. an vs. the',
        text: 'It takes an hour by metro to travel from a university campus to the national archive.',
        elapsedSec: 21.0,
        netWpm: 48.6,
        grossWpm: 49.5,
        accuracy: 98.1,
        grammarAccuracy: 100,
        words: 16,
        chars: 85
      },
      {
        daysAgo: 1,
        modeId: 'punctuation_caps',
        modeName: 'Punctuation & Capitalization',
        grammarFocus: 'Commas, Colons, and Semicolons in Complex Sentences',
        text: 'Mastery depends on three habits: steady posture, accurate keystrokes, and mindful review; consistency always beats haste.',
        elapsedSec: 26.4,
        netWpm: 52.3,
        grossWpm: 53.2,
        accuracy: 98.3,
        grammarAccuracy: 100,
        words: 16,
        chars: 117
      },
      {
        daysAgo: 0,
        modeId: 'numbers_symbols',
        modeName: 'Numbers, Dates & Currency',
        grammarFocus: 'Dates, Clock Times, Currency, Percentages, and Version Numbers',
        text: 'On 21 October 2026 at 08:45 a.m., we released version 4.2, reducing the subscription fee by 25% to Tk 1,250.50.',
        elapsedSec: 24.0,
        netWpm: 55.5,
        grossWpm: 56.0,
        accuracy: 99.1,
        grammarAccuracy: 100,
        words: 20,
        chars: 111
      }
    ];

    samples.forEach((sp, idx) => {
      const ts = new Date(now - sp.daysAgo * dayMs).toISOString();
      Storage.saveSession({
        id: `sample_${Date.now()}_${idx}`,
        timestamp: ts,
        dateKey: ts.slice(0, 10),
        modeId: sp.modeId,
        modeName: sp.modeName,
        customSetId: null,
        customSetName: null,
        passageId: `sample_p_${idx}`,
        grammarFocus: sp.grammarFocus,
        reasonLabel: 'Sample completed session',
        grossWpm: sp.grossWpm,
        netWpm: sp.netWpm,
        penaltyNetWpm: sp.netWpm,
        accuracy: sp.accuracy,
        finalTextAccuracy: 100,
        errorRate: Number((100 - sp.accuracy).toFixed(1)),
        grammarAccuracy: sp.grammarAccuracy,
        correctChars: sp.chars,
        incorrectChars: 0,
        totalCharsTyped: sp.chars,
        correctWords: sp.words,
        incorrectWords: 0,
        totalWordsTyped: sp.words,
        correctedErrors: 1,
        uncorrectedErrors: 0,
        activeElapsedSec: sp.elapsedSec,
        completionPercentage: 100,
        punctuationAccuracy: 100,
        capitalizationAccuracy: 100,
        spacingAccuracy: 100,
        topLetters: ['E (12)', 'T (10)', 'A (9)', 'I (8)', 'N (7)'],
        grammarMistakes: sp.grammarAccuracy < 100 ? [{
          expected: 'on',
          actual: 'in',
          category: 'Prepositions (Time & Place)',
          subType: 'Grammar Confusion',
          reason: "Use 'on' before days of the week (on Monday).",
          examples: ['The meeting is on Monday at 09:00 a.m.']
        }] : [],
        typingMistakes: [],
        acceptedVariations: [],
        errorPositions: []
      });

      Storage.recordTelemetryFromSession({
        typedText: sp.text,
        keypressMap: { KeyE: 12, KeyT: 10, KeyA: 9, KeyO: 8, KeyI: 8, KeyN: 7, KeyS: 7, KeyR: 6 },
        comparisonErrors: [],
        grammarAnalysis: {
          grammarMistakes: sp.grammarAccuracy < 100 ? [{
            expected: 'on',
            actual: 'in',
            category: 'Prepositions (Time & Place)',
            reason: "Use 'on' before days of the week (on Monday).",
            examples: ['The meeting is on Monday at 09:00 a.m.']
          }] : []
        }
      });
    });

    state.sessions = Storage.loadSessions();
    state.telemetry = Storage.loadTelemetry();
    updateMistakeDrillBadge();
    renderHistoryView();
    showToast('Added 4 multi-day sample sessions to history & charts.');
  }

  // =========================================================================
  // EVENT WIRING & INITIALIZATION
  // =========================================================================
  function bindEvents() {
    // Navigation Tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-nav-tab');
        if (tab) switchTab(tab);
      });
    });

    // Header Quick Controls
    $('btn-focused-drill').addEventListener('click', () => launchFocusedMistakeDrill());
    $('btn-sound-toggle').addEventListener('click', () => {
      state.prefs.soundEnabled = !state.prefs.soundEnabled;
      Storage.savePrefs(state.prefs);
      applySoundLabel();
      if (state.prefs.soundEnabled) playTone('click');
    });
    $('btn-theme-toggle').addEventListener('click', () => {
      state.prefs.theme = state.prefs.theme === 'light' ? 'dark' : 'light';
      Storage.savePrefs(state.prefs);
      applyTheme();
      if (state.activeTab === 'analytics') renderAnalyticsDashboard();
    });
    $('btn-shortcuts-help').addEventListener('click', () => {
      $('modal-shortcuts').classList.remove('hidden');
    });
    $('btn-close-shortcuts-modal').addEventListener('click', () => {
      $('modal-shortcuts').classList.add('hidden');
    });

    // Sub-drill, Difficulty & Active Custom Set Pickers
    $('select-subdrill').addEventListener('change', e => {
      state.prefs.selectedSubCategory = e.target.value;
      Storage.savePrefs(state.prefs);
      state.filteredPassages = buildPassagesForCurrentSelection();
      loadPassageAtIndex(0);
    });
    $('select-difficulty').addEventListener('change', e => {
      state.prefs.selectedDifficulty = e.target.value;
      Storage.savePrefs(state.prefs);
      state.filteredPassages = buildPassagesForCurrentSelection();
      loadPassageAtIndex(0);
    });
    $('select-active-custom-set').addEventListener('change', e => {
      state.prefs.activeCustomSetId = e.target.value;
      Storage.savePrefs(state.prefs);
      selectPracticeMode('custom_text', 'all');
    });

    // Test Limit & Target Rules
    $('select-limit-type').addEventListener('change', e => {
      state.prefs.limitType = e.target.value;
      if (state.prefs.limitType === 'timed') state.prefs.limitValue = 60;
      else if (state.prefs.limitType === 'words') state.prefs.limitValue = 25;
      else if (state.prefs.limitType === 'chars') state.prefs.limitValue = 100;
      else state.prefs.limitValue = 0;
      Storage.savePrefs(state.prefs);
      syncLimitControlsFromPrefs();
      resetSessionState();
      renderTargetPassageAndStats();
    });

    $('select-limit-preset').addEventListener('change', e => {
      const val = e.target.value;
      const customInp = $('input-custom-limit');
      if (val === 'custom') {
        customInp.classList.remove('hidden');
        state.prefs.limitValue = Math.max(5, Number(customInp.value || 60));
      } else {
        customInp.classList.add('hidden');
        state.prefs.limitValue = Number(val);
      }
      Storage.savePrefs(state.prefs);
      resetSessionState();
      renderTargetPassageAndStats();
    });

    $('input-custom-limit').addEventListener('input', e => {
      const v = Math.max(1, Number(e.target.value || 30));
      state.prefs.limitValue = v;
      Storage.savePrefs(state.prefs);
      renderTargetPassageAndStats();
    });

    $('chk-count-spaces').addEventListener('change', e => {
      state.prefs.includeSpacesInTarget = e.target.checked;
      Storage.savePrefs(state.prefs);
      renderTargetPassageAndStats();
    });

    $('chk-count-punct').addEventListener('change', e => {
      state.prefs.includePunctuationInTarget = e.target.checked;
      Storage.savePrefs(state.prefs);
      renderTargetPassageAndStats();
    });

    $('btn-plain-words-toggle').addEventListener('click', () => {
      if (state.prefs.selectedMode === 'normal_words') {
        state.prefs.plainWordsNoPunct = false;
        selectPracticeMode('grammar_sentences', 'all');
        showToast('Switched back to standard sentences with punctuation.');
      } else {
        state.prefs.plainWordsNoPunct = !state.prefs.plainWordsNoPunct;
        Storage.savePrefs(state.prefs);
        syncPlainWordsButton();
        loadPassageAtIndex(state.currentPassageIndex);
        showToast(
          state.prefs.plainWordsNoPunct
            ? 'No Punct / Lowercase enabled: practicing plain lowercase words.'
            : 'Restored original punctuation and capitalization.'
        );
      }
    });

    $('btn-match-mode').addEventListener('click', () => {
      state.prefs.matchMode = state.prefs.matchMode === 'strict' ? 'relaxed' : 'strict';
      Storage.savePrefs(state.prefs);
      syncMatchModeButton();
      renderTargetPassageAndStats();
    });

    $('chk-countdown').addEventListener('change', e => {
      state.prefs.countdownEnabled = e.target.checked;
      Storage.savePrefs(state.prefs);
    });

    // Grammar Coach Buttons
    $('btn-toggle-hint').addEventListener('click', () => {
      state.prefs.showPreHint = !state.prefs.showPreHint;
      Storage.savePrefs(state.prefs);
      renderGrammarCoachCard();
    });

    $('btn-why-correct').addEventListener('click', () => {
      const box = $('grammar-why-box');
      if (box) box.classList.toggle('hidden');
    });

    // Single Merged Box: Clicking the exact target character in the passage types it & starts counting immediately
    $('target-passage-display').addEventListener('click', e => {
      const input = $('typing-input');
      if (input) input.focus({ preventScroll: true });

      const charSpan = e.target.closest('.tw-char');
      if (!charSpan || state.sessionStatus === 'completed' || state.sessionStatus === 'countdown') return;

      const clickedIdx = Number(charSpan.getAttribute('data-char-index'));
      const refText = state.currentPassage ? state.currentPassage.text : '';
      const refArr = Array.from(refText);
      const curIdx = Array.from(state.typedText).length;

      if (curIdx < refArr.length && !Number.isNaN(clickedIdx)) {
        const expectedChar = refArr[curIdx];
        const clickedChar = clickedIdx < refArr.length ? refArr[clickedIdx] : null;
        // Advance and start counting when clicking the active character or any character matching the exact expected character
        if (clickedIdx === curIdx || clickedChar === expectedChar) {
          const applyChar = () => {
            const nextVal = state.typedText + expectedChar;
            if (input) input.value = nextVal;
            handleTypingInputChange(nextVal);
          };
          if (state.prefs.countdownEnabled && state.sessionStatus === 'idle') {
            triggerPreStartCountdownIfNeeded(applyChar);
          } else {
            applyChar();
          }
        }
      }
    });

    // Typing Input Handlers
    const typingInput = $('typing-input');
    typingInput.addEventListener('keydown', e => {
      // Record physical keycode for QWERTY heatmap & highlight
      if (e.code) {
        state.sessionKeypressMap[e.code] = (state.sessionKeypressMap[e.code] || 0) + 1;
      }
      highlightKeyOnScreen(e, true);

      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        completeCurrentSession('Completed manually');
        return;
      }

      // If countdown is enabled and session is idle on first printable keystroke
      if (
        state.prefs.countdownEnabled &&
        state.sessionStatus === 'idle' &&
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        const firstChar = e.key;
        triggerPreStartCountdownIfNeeded(() => {
          typingInput.value = firstChar;
          handleTypingInputChange(firstChar);
        });
      }
    });

    typingInput.addEventListener('keyup', e => {
      highlightKeyOnScreen(e, false);
    });

    typingInput.addEventListener('input', e => {
      handleTypingInputChange(e.target.value);
    });

    // Workspace Controls
    $('btn-pause-resume').addEventListener('click', () => togglePauseResume());
    $('btn-restart-passage').addEventListener('click', () => {
      resetSessionState();
      renderTargetPassageAndStats();
      typingInput.focus();
    });
    $('btn-prev-passage').addEventListener('click', () => {
      loadPassageAtIndex(state.currentPassageIndex - 1);
      typingInput.focus();
    });
    $('btn-next-passage').addEventListener('click', () => {
      loadPassageAtIndex(state.currentPassageIndex + 1);
      typingInput.focus();
    });
    $('btn-shuffle-words').addEventListener('click', () => {
      const wordCount = state.prefs.limitType === 'words' && state.prefs.limitValue > 0
        ? Math.min(100, state.prefs.limitValue)
        : 28;
      const randomText = Curriculum.generateRandomWordPassage
        ? Curriculum.generateRandomWordPassage(wordCount)
        : 'and against do up only so many before give and look little you consider life high present new many little you from keep child than number fact consider';
      const generatedPassage = {
        id: 'nw_rand_' + Date.now(),
        mode: 'normal_words',
        subCategory: 'Top 200 Everyday Words',
        difficulty: 'Beginner',
        grammarFocus: 'Normal Words Without Punctuation (Random Word Flow)',
        conciseNote: 'Randomly generated lowercase English words with zero punctuation or capital letters.',
        hint: 'Keep a steady spacebar rhythm between lowercase words; no Shift key or punctuation marks are needed.',
        whyCorrect: 'Practicing randomized high-frequency lowercase words trains pure word-level recognition and finger flow.',
        examples: [randomText],
        text: randomText,
        acceptedAlternatives: [],
        focusSpans: []
      };
      state.prefs.selectedMode = 'normal_words';
      state.prefs.selectedSubCategory = 'all';
      Storage.savePrefs(state.prefs);
      renderModeButtons();
      populateSubDrillOptions();
      const baseList = buildPassagesForCurrentSelection();
      state.filteredPassages = [generatedPassage, ...baseList];
      loadPassageAtIndex(0);
      typingInput.focus();
      showToast('Generated a fresh set of normal lowercase words without punctuation.');
    });
    $('btn-finish-session').addEventListener('click', () => {
      completeCurrentSession('Completed & reviewed');
    });
    $('btn-open-inspector-page').addEventListener('click', () => {
      switchTab('inspector');
    });
    $('btn-back-to-trainer').addEventListener('click', () => {
      switchTab('trainer');
      typingInput.focus();
    });

    // Character & Word Count Source Toggle
    $('btn-count-source-final').addEventListener('click', () => {
      state.prefs.countPanelSource = 'final';
      Storage.savePrefs(state.prefs);
      renderTargetPassageAndStats();
    });
    $('btn-count-source-raw').addEventListener('click', () => {
      state.prefs.countPanelSource = 'raw';
      Storage.savePrefs(state.prefs);
      renderTargetPassageAndStats();
    });
    $('btn-count-source-ref').addEventListener('click', () => {
      state.prefs.countPanelSource = 'reference';
      Storage.savePrefs(state.prefs);
      renderTargetPassageAndStats();
    });

    // On-Screen Keyboard Controls
    $('btn-kb-mode-live').addEventListener('click', () => {
      state.prefs.keyboardViewMode = 'live';
      Storage.savePrefs(state.prefs);
      renderQwertyKeyboard();
    });
    $('btn-kb-mode-heatmap').addEventListener('click', () => {
      state.prefs.keyboardViewMode = 'heatmap';
      Storage.savePrefs(state.prefs);
      renderQwertyKeyboard();
    });
    $('btn-toggle-keyboard').addEventListener('click', () => {
      state.prefs.showKeyboard = !state.prefs.showKeyboard;
      Storage.savePrefs(state.prefs);
      renderQwertyKeyboard();
    });

    // Analytics Letter-Frequency Filters
    ['session', 'ref', 'custom', 'alltime'].forEach(fKey => {
      const btn = $(`btn-freq-filter-${fKey}`);
      if (btn) {
        btn.addEventListener('click', () => {
          state.freqFilter = fKey;
          renderAnalyticsDashboard();
        });
      }
    });
    $('btn-freq-case-toggle').addEventListener('click', () => {
      state.freqCaseBreakdown = !state.freqCaseBreakdown;
      renderAnalyticsDashboard();
    });

    // Custom Practice Studio Controls
    $('btn-new-custom-set').addEventListener('click', () => startNewCustomSetInEditor());
    $('btn-save-custom-set').addEventListener('click', () => saveEditorCustomSet(false));
    $('btn-save-and-practice-custom').addEventListener('click', () => saveEditorCustomSet(true));

    const appendSnippet = text => {
      const ta = $('textarea-custom-items');
      if (!ta) return;
      ta.value = (ta.value.trim() ? ta.value.trim() + '\n' : '') + text;
    };
    $('btn-insert-prep-sample').addEventListener('click', () => {
      appendSnippet('The delegation arrived at the airport on Tuesday and stayed in Dhaka for three days.');
    });
    $('btn-insert-num-sample').addEventListener('click', () => {
      appendSnippet('On 21 October 2026 at 08:45 a.m., version 4.2 reduced unit costs by 25% to Tk 1,250.50.');
    });
    $('btn-insert-punct-sample').addEventListener('click', () => {
      appendSnippet('"Accuracy comes first," the instructor reminded us; "speed follows naturally with practice."');
    });

    // Custom Import / Export Modal
    $('btn-open-import-modal').addEventListener('click', () => {
      $('io-modal-title').textContent = 'Import Practice Sets (JSON or Plain Text)';
      $('textarea-modal-io').value = '';
      $('io-modal-feedback').classList.add('hidden');
      $('modal-import-export').classList.remove('hidden');
    });

    $('btn-export-all-json').addEventListener('click', () => {
      $('io-modal-title').textContent = 'Export All Custom Practice Sets (JSON)';
      $('select-import-format').value = 'json';
      $('textarea-modal-io').value = JSON.stringify(state.customSets, null, 2);
      $('io-modal-feedback').classList.add('hidden');
      $('modal-import-export').classList.remove('hidden');
    });

    $('btn-export-active-txt').addEventListener('click', () => {
      const s = state.customSets.find(item => item.id === state.editingCustomSetId) || state.customSets[0];
      $('io-modal-title').textContent = `Export "${s ? s.name : 'Set'}" (Plain Text)`;
      $('select-import-format').value = 'text';
      $('textarea-modal-io').value = s ? s.items.join('\n') : '';
      $('io-modal-feedback').classList.add('hidden');
      $('modal-import-export').classList.remove('hidden');
    });

    $('btn-close-io-modal').addEventListener('click', () => {
      $('modal-import-export').classList.add('hidden');
    });

    $('btn-copy-export').addEventListener('click', () => {
      const ta = $('textarea-modal-io');
      if (!ta) return;
      ta.select();
      try {
        document.execCommand('copy');
        showToast('Copied content to clipboard.');
      } catch (e) {
        showToast('Selected text — press Ctrl+C to copy.');
      }
    });

    $('btn-confirm-import').addEventListener('click', () => {
      const raw = $('textarea-modal-io').value;
      const fmt = $('select-import-format').value;
      const res = Engine.validateCustomSetPayload(raw, fmt);
      const fb = $('io-modal-feedback');
      if (!res.valid) {
        fb.textContent = res.error;
        fb.className = 'rounded-xl px-3 py-2 text-xs font-medium bg-rose-500/15 text-rose-500 border border-rose-500/30';
        fb.classList.remove('hidden');
        return;
      }
      res.sets.forEach(newSet => {
        state.customSets.unshift(newSet);
      });
      Storage.saveCustomSets(state.customSets);
      state.editingCustomSetId = res.sets[0].id;
      loadCustomSetIntoEditor(res.sets[0].id);
      renderCustomSetsList();
      $('modal-import-export').classList.add('hidden');
      showToast(`Imported ${res.sets.length} custom practice set(s).`);
    });

    // Session History Filters & Reset Modal
    ['filter-history-date', 'filter-history-mode', 'filter-history-custom-set'].forEach(id => {
      const el = $(id);
      if (el) el.addEventListener('change', () => renderHistoryView());
    });
    $('btn-clear-history-filters').addEventListener('click', () => {
      $('filter-history-date').value = '';
      $('filter-history-mode').value = 'all';
      $('filter-history-custom-set').value = 'all';
      renderHistoryView();
    });
    $('btn-seed-demo-history').addEventListener('click', () => seedSampleMultiDayHistory());

    $('btn-open-reset-modal').addEventListener('click', () => {
      $('modal-reset-confirm').classList.remove('hidden');
    });
    $('btn-cancel-reset-modal').addEventListener('click', () => {
      $('modal-reset-confirm').classList.add('hidden');
    });
    $('btn-confirm-reset-data').addEventListener('click', () => {
      Storage.resetAllData();
      state.prefs = Storage.loadPrefs();
      state.customSets = Storage.loadCustomSets();
      state.sessions = Storage.loadSessions();
      state.telemetry = Storage.loadTelemetry();
      $('modal-reset-confirm').classList.add('hidden');
      updateMistakeDrillBadge();
      renderHistoryView();
      renderCustomSetsList();
      showToast('All local session history and custom data have been reset.');
    });

    // Session Results Modal Actions
    $('btn-close-results-modal').addEventListener('click', () => {
      $('modal-session-results').classList.add('hidden');
    });
    $('btn-res-retry-passage').addEventListener('click', () => {
      $('modal-session-results').classList.add('hidden');
      resetSessionState();
      renderTargetPassageAndStats();
      typingInput.focus();
    });
    $('btn-res-next-passage').addEventListener('click', () => {
      $('modal-session-results').classList.add('hidden');
      loadPassageAtIndex(state.currentPassageIndex + 1);
      typingInput.focus();
    });
    $('btn-res-practice-recommended').addEventListener('click', () => {
      $('modal-session-results').classList.add('hidden');
      if (state.recommendedAction) {
        switchTab('trainer');
        selectPracticeMode(state.recommendedAction.mode, state.recommendedAction.subCategory || 'all');
      } else {
        loadPassageAtIndex(state.currentPassageIndex + 1);
      }
      typingInput.focus();
    });

    // Global Keyboard Shortcuts & Direct Single-Box Typing Capture
    window.addEventListener('keydown', e => {
      // Allow direct typing in the single passage box whenever Trainer view is active and no modal/form control is focused
      const activeEl = document.activeElement;
      const isFormTag = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'SELECT' ||
        (activeEl.tagName === 'TEXTAREA' && activeEl.id !== 'typing-input')
      );
      const anyModalOpen = ['modal-session-results', 'modal-import-export', 'modal-reset-confirm', 'modal-shortcuts'].some(mId => {
        const m = $(mId);
        return m && !m.classList.contains('hidden');
      });

      if (
        state.activeTab === 'trainer' &&
        !isFormTag &&
        !anyModalOpen &&
        activeEl !== typingInput &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        (e.key.length === 1 || e.key === 'Backspace')
      ) {
        typingInput.focus({ preventScroll: true });
      }

      if (e.key === 'Escape') {
        ['modal-session-results', 'modal-import-export', 'modal-reset-confirm', 'modal-shortcuts'].forEach(mId => {
          const m = $(mId);
          if (m && !m.classList.contains('hidden')) m.classList.add('hidden');
        });
      } else if (e.altKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        resetSessionState();
        renderTargetPassageAndStats();
        typingInput.focus();
      } else if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        togglePauseResume();
      } else if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        loadPassageAtIndex(state.currentPassageIndex + 1);
        typingInput.focus();
      } else if (e.altKey && (e.key === 'w' || e.key === 'W')) {
        e.preventDefault();
        const box = $('grammar-why-box');
        if (box) box.classList.toggle('hidden');
      }
    });
  }

  function init() {
    applyTheme();
    applySoundLabel();
    updateMistakeDrillBadge();
    renderModeButtons();
    populateSubDrillOptions();
    syncLimitControlsFromPrefs();
    syncMatchModeButton();
    populateHistoryFilterOptions();
    renderQwertyKeyboard();

    state.filteredPassages = buildPassagesForCurrentSelection();
    loadPassageAtIndex(0);

    if (state.customSets[0]) {
      loadCustomSetIntoEditor(state.customSets[0].id);
    }

    bindEvents();
  }

  // Expose controller for automated browser integration tests
  window.TypeWiseApp = {
    state,
    switchTab,
    selectPracticeMode,
    loadPassageAtIndex,
    handleTypingInputChange,
    togglePauseResume,
    completeCurrentSession,
    getCurrentLiveStats
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
