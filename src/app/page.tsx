"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error) {
      window.location.href = "/dashboard"
    } else {
      alert(error.message)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-96 p-6 border rounded-lg shadow-lg space-y-4">
        <h1 className="text-xl font-bold text-center">Login</h1>
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <Button className="w-full" onClick={handleLogin}>Login</Button>
      </div>
    </div>
  )
}
