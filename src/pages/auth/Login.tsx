import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    // Automatically redirect to main page
    navigate("/")
  }, [navigate])

  // Return empty div while redirecting
  return <div />
}