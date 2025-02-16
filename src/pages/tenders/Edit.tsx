
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Save, FileDown, ArrowLeft, Eye, Edit as EditIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AITextEditor } from "@/components/AITextEditor";
import ReactMarkdown from 'react-markdown';

const EditTender = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  // Early validation of ID
  useEffect(() => {
    if (!id || id === "undefined") {
      toast.error("Invalid tender ID");
      navigate("/tenders");
    }
  }, [id, navigate]);

  const { data: tender, isLoading } = useQuery({
    queryKey: ["tender", id],
    queryFn: async () => {
      if (!id || id === "undefined") {
        throw new Error("Invalid tender ID");
      }

      const { data, error } = await supabase
        .from("tenders")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Load error:", error);
        throw error;
      }

      if (!data) {
        toast.error("Tender not found");
        navigate("/tenders");
        throw new Error("Tender not found");
      }

      setContent(data.description || "");
      return data;
    },
    enabled: !!id && id !== "undefined",
  });

  const handleSave = async () => {
    if (!id || id === "undefined") return;

    try {
      const { error } = await supabase
        .from("tenders")
        .update({ description: content })
        .eq("id", id);

      if (error) throw error;
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes");
      console.error("Save error:", error);
    }
  };

  const handleExport = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
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
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
            className="gap-2"
          >
            {isPreview ? (
              <>
                <EditIcon className="h-4 w-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Preview
              </>
            )}
          </Button>
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

      <ScrollArea className="h-[calc(100vh-12rem)] rounded-md border">
        {isPreview ? (
          <div className="prose dark:prose-invert max-w-none p-4">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <AITextEditor
            value={content}
            onChange={setContent}
            className="min-h-[500px] resize-none border-0 p-4 focus-visible:ring-0"
            placeholder="Start writing your tender description..."
          />
        )}
      </ScrollArea>
    </div>
  );
};

export default EditTender;
