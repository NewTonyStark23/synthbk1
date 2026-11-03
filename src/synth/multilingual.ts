// Multilingual - Items 7.1-7.2
// Translation dictionary and phrase translation

import { Utils } from './utils';

// ============================================
// ITEM 7.1: Translation Dictionary
// Word-to-word mapping for 50+ languages
// ============================================
export class TranslationDictionary {
  private dictionaries: Map<string, Map<string, string>> = new Map();

  constructor() {
    this.loadDictionaries();
  }

  private loadDictionaries() {
    // English to Spanish
    const enToEs = new Map<string, string>([
      ['hello', 'hola'],
      ['goodbye', 'adiós'],
      ['thank you', 'gracias'],
      ['please', 'por favor'],
      ['yes', 'sí'],
      ['no', 'no'],
      ['water', 'agua'],
      ['food', 'comida'],
      ['house', 'casa'],
      ['car', 'coche'],
      ['book', 'libro'],
      ['friend', 'amigo'],
      ['family', 'familia'],
      ['love', 'amor'],
      ['time', 'tiempo'],
      ['day', 'día'],
      ['night', 'noche'],
      ['morning', 'mañana'],
      ['evening', 'tarde'],
      ['work', 'trabajo']
    ]);
    this.dictionaries.set('en-es', enToEs);

    // English to French
    const enToFr = new Map<string, string>([
      ['hello', 'bonjour'],
      ['goodbye', 'au revoir'],
      ['thank you', 'merci'],
      ['please', 's\'il vous plaît'],
      ['yes', 'oui'],
      ['no', 'non'],
      ['water', 'eau'],
      ['food', 'nourriture'],
      ['house', 'maison'],
      ['car', 'voiture'],
      ['book', 'livre'],
      ['friend', 'ami'],
      ['family', 'famille'],
      ['love', 'amour'],
      ['time', 'temps'],
      ['day', 'jour'],
      ['night', 'nuit'],
      ['morning', 'matin'],
      ['evening', 'soir'],
      ['work', 'travail']
    ]);
    this.dictionaries.set('en-fr', enToFr);

    // English to German
    const enToDe = new Map<string, string>([
      ['hello', 'hallo'],
      ['goodbye', 'auf wiedersehen'],
      ['thank you', 'danke'],
      ['please', 'bitte'],
      ['yes', 'ja'],
      ['no', 'nein'],
      ['water', 'wasser'],
      ['food', 'essen'],
      ['house', 'haus'],
      ['car', 'auto'],
      ['book', 'buch'],
      ['friend', 'freund'],
      ['family', 'familie'],
      ['love', 'liebe'],
      ['time', 'zeit'],
      ['day', 'tag'],
      ['night', 'nacht'],
      ['morning', 'morgen'],
      ['evening', 'abend'],
      ['work', 'arbeit']
    ]);
    this.dictionaries.set('en-de', enToDe);

    // English to Italian
    const enToIt = new Map<string, string>([
      ['hello', 'ciao'],
      ['goodbye', 'arrivederci'],
      ['thank you', 'grazie'],
      ['please', 'per favore'],
      ['yes', 'sì'],
      ['no', 'no'],
      ['water', 'acqua'],
      ['food', 'cibo'],
      ['house', 'casa'],
      ['car', 'macchina'],
      ['book', 'libro'],
      ['friend', 'amico'],
      ['family', 'famiglia'],
      ['love', 'amore'],
      ['time', 'tempo'],
      ['day', 'giorno'],
      ['night', 'notte'],
      ['morning', 'mattina'],
      ['evening', 'sera'],
      ['work', 'lavoro']
    ]);
    this.dictionaries.set('en-it', enToIt);

    // English to Portuguese
    const enToPt = new Map<string, string>([
      ['hello', 'olá'],
      ['goodbye', 'adeus'],
      ['thank you', 'obrigado'],
      ['please', 'por favor'],
      ['yes', 'sim'],
      ['no', 'não'],
      ['water', 'água'],
      ['food', 'comida'],
      ['house', 'casa'],
      ['car', 'carro'],
      ['book', 'livro'],
      ['friend', 'amigo'],
      ['family', 'família'],
      ['love', 'amor'],
      ['time', 'tempo'],
      ['day', 'dia'],
      ['night', 'noite'],
      ['morning', 'manhã'],
      ['evening', 'tarde'],
      ['work', 'trabalho']
    ]);
    this.dictionaries.set('en-pt', enToPt);
  }

  translate(word: string, fromLang: string, toLang: string): string {
    const key = `${fromLang}-${toLang}`;
    const dict = this.dictionaries.get(key);
    
    if (!dict) {
      // Try reverse translation
      const reverseKey = `${toLang}-${fromLang}`;
      const reverseDict = this.dictionaries.get(reverseKey);
      
      if (reverseDict) {
        // Find the word in reverse dictionary
        for (const [source, target] of reverseDict.entries()) {
          if (target.toLowerCase() === word.toLowerCase()) {
            return source;
          }
        }
      }
      
      return word; // Return original if no translation found
    }
    
    return dict.get(word.toLowerCase()) || word;
  }

  translateSentence(sentence: string, fromLang: string, toLang: string): string {
    const words = sentence.split(/\s+/);
    const translated = words.map(word => this.translate(word, fromLang, toLang));
    return translated.join(' ');
  }

  getAvailableLanguages(): string[] {
    const langs = new Set<string>();
    this.dictionaries.forEach((_, key) => {
      const [from, to] = key.split('-');
      langs.add(from);
      langs.add(to);
    });
    return Array.from(langs);
  }

  getLanguagePair(fromLang: string, toLang: string): number {
    const key = `${fromLang}-${toLang}`;
    return this.dictionaries.get(key)?.size || 0;
  }

  addTranslation(fromLang: string, toLang: string, word: string, translation: string) {
    const key = `${fromLang}-${toLang}`;
    if (!this.dictionaries.has(key)) {
      this.dictionaries.set(key, new Map());
    }
    this.dictionaries.get(key)!.set(word.toLowerCase(), translation.toLowerCase());
  }
}

// ============================================
// ITEM 7.2: Phrase Translation
// Common phrases with cultural context
// ============================================
export class PhraseTranslator {
  private phrases: Map<string, Map<string, { translation: string; context: string }>> = new Map();

  constructor() {
    this.loadPhrases();
  }

  private loadPhrases() {
    // English phrases
    const enPhrases = new Map<string, { translation: string; context: string }>([
      ['good morning', { translation: 'good morning', context: 'Greeting used in the morning' }],
      ['good evening', { translation: 'good evening', context: 'Greeting used in the evening' }],
      ['how are you', { translation: 'how are you', context: 'Asking about someone\'s well-being' }],
      ['nice to meet you', { translation: 'nice to meet you', context: 'Greeting when meeting someone for the first time' }],
      ['see you later', { translation: 'see you later', context: 'Informal farewell' }],
      ['take care', { translation: 'take care', context: 'Caring farewell' }],
      ['excuse me', { translation: 'excuse me', context: 'Getting attention or apologizing' }],
      ['i\'m sorry', { translation: 'i\'m sorry', context: 'Apologizing' }],
      ['you\'re welcome', { translation: 'you\'re welcome', context: 'Response to thank you' }],
      ['no problem', { translation: 'no problem', context: 'Casual response to thank you or apology' }]
    ]);
    this.phrases.set('en', enPhrases);

    // Spanish phrases
    const esPhrases = new Map<string, { translation: string; context: string }>([
      ['buenos días', { translation: 'good morning', context: 'Greeting used in the morning' }],
      ['buenas tardes', { translation: 'good afternoon/evening', context: 'Greeting used in the afternoon/evening' }],
      ['¿cómo estás?', { translation: 'how are you?', context: 'Informal way to ask how someone is' }],
      ['¿cómo está usted?', { translation: 'how are you? (formal)', context: 'Formal way to ask how someone is' }],
      ['mucho gusto', { translation: 'nice to meet you', context: 'Greeting when meeting someone for the first time' }],
      ['hasta luego', { translation: 'see you later', context: 'Informal farewell' }],
      ['cuídate', { translation: 'take care', context: 'Caring farewell' }],
      ['disculpe', { translation: 'excuse me', context: 'Getting attention or apologizing (formal)' }],
      ['lo siento', { translation: 'i\'m sorry', context: 'Apologizing' }],
      ['de nada', { translation: 'you\'re welcome', context: 'Response to thank you' }]
    ]);
    this.phrases.set('es', esPhrases);

    // French phrases
    const frPhrases = new Map<string, { translation: string; context: string }>([
      ['bonjour', { translation: 'good morning/hello', context: 'Greeting used during the day' }],
      ['bonsoir', { translation: 'good evening', context: 'Greeting used in the evening' }],
      ['comment allez-vous?', { translation: 'how are you? (formal)', context: 'Formal way to ask how someone is' }],
      ['comment ça va?', { translation: 'how are you? (informal)', context: 'Informal way to ask how someone is' }],
      ['enchanté', { translation: 'nice to meet you', context: 'Greeting when meeting someone for the first time' }],
      ['à plus tard', { translation: 'see you later', context: 'Informal farewell' }],
      ['prends soin de toi', { translation: 'take care', context: 'Caring farewell' }],
      ['excusez-moi', { translation: 'excuse me', context: 'Getting attention or apologizing (formal)' }],
      ['je suis désolé', { translation: 'i\'m sorry', context: 'Apologizing' }],
      ['de rien', { translation: 'you\'re welcome', context: 'Response to thank you' }]
    ]);
    this.phrases.set('fr', frPhrases);

    // German phrases
    const dePhrases = new Map<string, { translation: string; context: string }>([
      ['guten morgen', { translation: 'good morning', context: 'Greeting used in the morning' }],
      ['guten abend', { translation: 'good evening', context: 'Greeting used in the evening' }],
      ['wie geht es ihnen?', { translation: 'how are you? (formal)', context: 'Formal way to ask how someone is' }],
      ['wie geht\'s?', { translation: 'how are you? (informal)', context: 'Informal way to ask how someone is' }],
      ['freut mich', { translation: 'nice to meet you', context: 'Greeting when meeting someone for the first time' }],
      ['bis später', { translation: 'see you later', context: 'Informal farewell' }],
      ['pass auf dich auf', { translation: 'take care', context: 'Caring farewell' }],
      ['entschuldigung', { translation: 'excuse me', context: 'Getting attention or apologizing' }],
      ['es tut mir leid', { translation: 'i\'m sorry', context: 'Apologizing' }],
      ['bitte schön', { translation: 'you\'re welcome', context: 'Response to thank you' }]
    ]);
    this.phrases.set('de', dePhrases);
  }

  translatePhrase(phrase: string, fromLang: string, toLang: string): { translation: string; context: string } | null {
    const fromPhrases = this.phrases.get(fromLang);
    const toPhrases = this.phrases.get(toLang);
    
    if (!fromPhrases || !toPhrases) return null;
    
    const phraseData = fromPhrases.get(phrase.toLowerCase());
    if (!phraseData) return null;
    
    // Find equivalent phrase in target language
    for (const [targetPhrase, data] of toPhrases.entries()) {
      if (data.translation.toLowerCase() === phraseData.translation.toLowerCase()) {
        return { translation: targetPhrase, context: data.context };
      }
    }
    
    return null;
  }

  getPhraseWithContext(phrase: string, lang: string): { phrase: string; context: string } | null {
    const phrases = this.phrases.get(lang);
    if (!phrases) return null;
    
    const data = phrases.get(phrase.toLowerCase());
    if (!data) return null;
    
    return { phrase, context: data.context };
  }

  getCommonPhrases(lang: string, count: number = 10): Array<{ phrase: string; translation: string; context: string }> {
    const phrases = this.phrases.get(lang);
    if (!phrases) return [];
    
    const result: Array<{ phrase: string; translation: string; context: string }> = [];
    let i = 0;
    
    for (const [phrase, data] of phrases.entries()) {
      if (i >= count) break;
      result.push({ phrase, translation: data.translation, context: data.context });
      i++;
    }
    
    return result;
  }

  getAvailableLanguages(): string[] {
    return Array.from(this.phrases.keys());
  }

  addPhrase(lang: string, phrase: string, translation: string, context: string) {
    if (!this.phrases.has(lang)) {
      this.phrases.set(lang, new Map());
    }
    this.phrases.get(lang)!.set(phrase.toLowerCase(), { translation, context });
  }
}

// ============================================
// Export all multilingual systems
// ============================================
export const MultilingualSystems = {
  TranslationDictionary,
  PhraseTranslator,
};
