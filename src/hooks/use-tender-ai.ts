import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTenderAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async (field: string, context: string) => {
    setIsGenerating(true);
    try {
      let prompt = '';
      switch (field) {
        case 'description':
          prompt = `Generate a professional tender description for: "${context}". Include key requirements, specifications, and evaluation criteria. Keep it concise but comprehensive.`;
          break;
        case 'objective':
          prompt = `Generate a clear objective for a tender about: "${context}". Focus on the main goals and desired outcomes.`;
          break;
        case 'scope':
          prompt = `Generate a detailed scope of work for a tender about: "${context}". Include deliverables, timelines, and requirements.`;
          break;
        case 'criteria':
          prompt = `Generate eligibility criteria for a tender about: "${context}". Include qualifications, experience, and requirements.`;
          break;
        default:
          prompt = `Generate professional content for the ${field} section of a tender about: "${context}".`;
      }
      
      const { data, error } = await supabase.functions.invoke('generate-tender', {
        body: { prompt },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to generate content');
      }

      if (!data?.generatedText) {
        throw new Error('No content was generated');
      }

      return data.generatedText;
    } catch (error) {
      console.error('Error generating tender content:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate content. Please try again.",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContent,
    isGenerating,
  };
};