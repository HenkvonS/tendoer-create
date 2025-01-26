import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTenderAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async (field: string, context: any) => {
    setIsGenerating(true);
    try {
      // Create a comprehensive prompt that includes all tender details
      const prompt = `Generate professional content for a tender with the following details:
Title: ${context.title}
Budget: ${context.budget || 'Not specified'}
Category: ${context.category || 'Not specified'}
Contact Person: ${context.contact_person || 'Not specified'}
Contact Email: ${context.contact_email || 'Not specified'}
Contact Phone: ${context.contact_phone || 'Not specified'}
Deadline: ${context.deadline || 'Not specified'}
Site Visit Required: ${context.site_visit_required ? 'Yes' : 'No'}
${context.site_visit_required ? `Site Visit Date: ${context.site_visit_date || 'Not specified'}` : ''}
${context.site_visit_required ? `Site Visit Location: ${context.site_visit_location || 'Not specified'}` : ''}

Please generate content for the "${field}" section of this tender. The content should be professional, clear, and comprehensive.`;

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