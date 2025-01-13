import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AuthError, AuthApiError } from "@supabase/supabase-js"

const getErrorMessage = (error: AuthError) => {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 400:
        return 'Invalid credentials. Please check your email and password, or sign up if you don\'t have an account.'
      case 422:
        return 'Invalid email format. Please enter a valid email address.'
      case 429:
        return 'Too many login attempts. Please try again later.'
      default:
        return error.message
    }
  }
  return error.message
}

export default function Login() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSkip = () => {
    navigate("/")
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/")
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        })
        navigate("/")
      }
      if (event === "SIGNED_OUT") {
        navigate("/login")
      }
      if (event === "USER_UPDATED") {
        navigate("/")
      }
      // Handle auth errors
      if (event === 'PASSWORD_RECOVERY' || event === 'USER_UPDATED') {
        const { error } = await supabase.auth.getSession()
        if (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: getErrorMessage(error),
          })
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate, toast])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-medium">Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or continue as guest
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#059669',
                    brandAccent: '#047857',
                  },
                },
              },
              className: {
                container: 'flex flex-col gap-2',
                button: 'bg-primary text-primary-foreground hover:bg-primary/90',
                input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                message: 'text-sm text-destructive',
              }
            }}
            theme="default"
            providers={[]}
            redirectTo={window.location.origin}
          />
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="mt-2"
            >
              Continue as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}