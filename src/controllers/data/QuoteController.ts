import { makeAutoObservable } from 'mobx';
import { QuoteService } from '../../services/QuoteService';
import { MotivationalQuote, QuoteState } from '../../types';

export class QuoteController {
  currentQuote: MotivationalQuote | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get quoteState(): QuoteState {
    return {
      currentQuote: this.currentQuote,
      isLoading: this.isLoading
    };
  }

  async loadDailyQuote(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      
      const quote = await QuoteService.getDailyQuote();
      this.currentQuote = quote;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to load daily quote';
      // Set a fallback quote if API fails
      this.currentQuote = QuoteService.getRandomQuote();
    } finally {
      this.isLoading = false;
    }
  }

  async refreshQuote(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      
      // Get a random quote for manual refresh
      this.currentQuote = QuoteService.getRandomQuote();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to refresh quote';
    } finally {
      this.isLoading = false;
    }
  }

  clearError(): void {
    this.error = null;
  }
}

// Create a singleton instance
export const quoteController = new QuoteController();