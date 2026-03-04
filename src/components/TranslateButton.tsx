'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TranslateButtonProps {
  content: string;
}

export function TranslateButton({ content }: TranslateButtonProps) {
  const [translated, setTranslated] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const handleTranslate = async () => {
    if (showTranslation) {
      setShowTranslation(false);
      return;
    }

    setIsTranslating(true);
    setTranslated('');
    setShowTranslation(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                setTranslated(prev => prev + content);
              }
            } catch {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslated('翻译失败，请重试。');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="mt-8">
      <Button 
        variant="outline" 
        onClick={handleTranslate}
        disabled={isTranslating}
      >
        {isTranslating ? '翻译中...' : showTranslation ? '隐藏翻译' : 'Translate to English'}
      </Button>

      {showTranslation && (
        <div className="mt-6 p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-4">English Translation</h3>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {isTranslating && !translated && (
              <p className="text-muted-foreground">Loading...</p>
            )}
            <pre className="whitespace-pre-wrap font-sans">{translated}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
