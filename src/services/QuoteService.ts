import { MotivationalQuote } from '../types';

const FALLBACK_QUOTES: MotivationalQuote[] = [
  {
    id: 1,
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    id: 2,
    text: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller"
  },
  {
    id: 3,
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    id: 4,
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    id: 5,
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  }
];

export class QuoteService {
  private static readonly CACHE_KEY = 'daily_quote';
  private static readonly CACHE_DATE_KEY = 'daily_quote_date';

  static async getDailyQuote(): Promise<MotivationalQuote> {
    try {
      const cachedDate = localStorage.getItem(this.CACHE_DATE_KEY);
      const today = new Date().toDateString();

      if (cachedDate === today) {
        const cachedQuote = localStorage.getItem(this.CACHE_KEY);
        if (cachedQuote) {
          return JSON.parse(cachedQuote);
        }
      }

      const quote = await this.fetchFromAPI();

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(quote));
      localStorage.setItem(this.CACHE_DATE_KEY, today);

      return quote;
    } catch (error) {
      console.warn('Failed to fetch quote from API, using fallback:', error);
      return this.getFallbackQuote();
    }
  }

  private static async fetchFromAPI(): Promise<MotivationalQuote> {
    const response = await fetch('https://api.quotable.io/random?tags=motivational|inspirational|success');

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();

    return {
      id: Date.now(),
      text: data.content,
      author: data.author
    };
  }

  private static getFallbackQuote(): MotivationalQuote {
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    return FALLBACK_QUOTES[randomIndex];
  }

  static getRandomQuote(): MotivationalQuote {
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    return FALLBACK_QUOTES[randomIndex];
  }
}