"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "./ui/card"
import { CardContent } from "./ui/card"
import { CardHeader } from "./ui/card"
import { CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const departments = ["IT", "HR", "Finance", "Marketing"]

export default function Login() {
  const [role, setRole] = useState("")
  const [department, setDepartment] = useState("")
  const navigate = useNavigate()

  const handleLogin = () => {
    if (role) {
      // In a real app, you'd handle authentication here
      localStorage.setItem("userRole", role)
      if (role === "manager") {
        localStorage.setItem("userDepartment", department)
      }
      navigate("/dashboard")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {role === "manager" && (
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button className="w-full" onClick={handleLogin} disabled={!role || (role === "manager" && !department)}>
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

