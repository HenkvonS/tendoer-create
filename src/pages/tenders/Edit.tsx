import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Save, FileDown, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  createPlugins,
  Plate,
  PlateContent,
  PlateProvider,
} from '@udecode/plate-common';
import {
  createParagraphPlugin,
  createBlockquotePlugin,
  createCodeBlockPlugin,
  createHeadingPlugin,
} from '@udecode/plate-basic-elements';

const plugins = createPlugins([
  createParagraphPlugin(),
  createBlockquotePlugin(),
  createCodeBlockPlugin(),
  createHeadingPlugin(),
]);

const EditTender = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  const { data: tender, isLoading } = useQuery({
    queryKey: ["tender", id],
    queryFn: async () => {
      if (!id) {
        toast.error("Invalid tender ID");
        navigate("/");
        throw new Error("Invalid tender ID");
      }

      const { data, error } = await supabase
        .from("tenders")
        .select()
        .eq("id", id)
        .maybeSingle();

      if (error) {
        toast.error("Failed to load tender");
        console.error("Load error:", error);
        throw error;
      }

      if (!data) {
        toast.error("Tender not found");
        navigate("/");
        throw new Error("Tender not found");
      }

      try {
        const parsedContent = data.description ? JSON.parse(data.description) : [
          {
            type: 'p',
            children: [{ text: '' }],
          },
        ];
        setContent(parsedContent);
      } catch (e) {
        // If the content is not JSON (legacy plain text), convert it to Plate format
        setContent([
          {
            type: 'p',
            children: [{ text: data.description || '' }],
          },
        ]);
      }
      
      return data;
    },
    retry: false,
  });

  const handleSave = async () => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from("tenders")
        .update({ description: JSON.stringify(content) })
        .eq("id", id);

      if (error) throw error;
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes");
      console.error("Save error:", error);
    }
  };

  const handleExport = () => {
    // Convert the rich text content to plain text for export
    const plainText = content.map((node: any) => {
      return node.children.map((child: any) => child.text).join('');
    }).join('\n');

    const element = document.createElement("a");
    const file = new Blob([plainText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `tender-${tender?.title || "export"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Tender exported successfully");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{tender?.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] rounded-md border bg-background">
        <div className="p-4">
          <PlateProvider plugins={plugins}>
            <Plate
              value={content}
              onChange={setContent}
            >
              <PlateContent 
                className="min-h-[500px] outline-none"
                placeholder="Start writing your tender description..."
              />
            </Plate>
          </PlateProvider>
        </div>
      </ScrollArea>
    </div>
  );
};

export default EditTender;