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
          prompt = `Generate a clear objective for a tender about: "${context}". Focus on the main goals and desired outcomes. Be specific and measurable.`;
          break;
        case 'scope_of_work':
          prompt = `Generate a detailed scope of work for a tender about: "${context}". Include deliverables, timelines, and specific requirements. Be thorough but clear.`;
          break;
        case 'eligibility_criteria':
          prompt = `Generate eligibility criteria for a tender about: "${context}". Include required qualifications, experience, certifications, and other essential requirements. Be specific and comprehensive.`;
          break;
        default:
          prompt = `Generate professional content for the ${field} section of a tender about: "${context}". Ensure the content is clear, specific, and follows tender documentation best practices.`;
      }

      console.log('Sending prompt to generate-tender:', prompt);
      
      const { data, error } = await supabase.functions.invoke('generate-tender', {
        body: { prompt },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data?.generatedText) {
        throw new Error('No content was generated');
      }

      console.log('Generated content:', data.generatedText);
      return data.generatedText;
    } catch (error) {
      console.error('Error generating tender content:', error);
      toast({
        variant: "destructive",
        title: "Error Generating Content",
        description: error instanceof Error ? error.message : "Failed to generate content. Please try again.",
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