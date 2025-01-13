import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTenderAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateDescription = async (title: string) => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a professional tender description for: "${title}". Include key requirements, specifications, and evaluation criteria. Keep it concise but comprehensive.`;
      
      const { data, error } = await supabase.functions.invoke('generate-tender', {
        body: { prompt },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to generate description');
      }

      if (!data?.generatedText) {
        throw new Error('No description was generated');
      }

      return data.generatedText;
    } catch (error) {
      console.error('Error generating tender description:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate description. Please try again.",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateDescription,
    isGenerating,
  };
};