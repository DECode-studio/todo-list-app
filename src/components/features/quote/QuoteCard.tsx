import React from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MotivationalQuote } from '../../../types';

interface QuoteCardProps {
  quote: MotivationalQuote | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  isLoading,
  onRefresh
}) => {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-primary" />
            <span>Daily Inspiration</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        ) : quote ? (
          <div className="space-y-3">
            <blockquote className="text-sm italic text-foreground leading-relaxed">
              "{quote.text}"
            </blockquote>
            <p className="text-xs text-muted-foreground font-medium">
              — {quote.author}
            </p>
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-sm py-4">
            <Quote className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No quote available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};