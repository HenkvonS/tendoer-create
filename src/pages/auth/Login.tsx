import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AITextEditor } from "@/components/AITextEditor"

export default function Login() {
  const [text, setText] = useState("")

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Text Editor</CardTitle>
          <CardDescription>
            Write your text and use the magic wand to enhance it with AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AITextEditor
            value={text}
            onChange={setText}
            placeholder="Start writing here..."
            className="min-h-[300px]"
          />
        </CardContent>
      </Card>
    </div>
  )
}