"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Upload, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoleSelector } from "../components/RoleSelector"

const urgencyLevels = ["routine", "priority", "emergency"]

export default function ImprestRequirements() {
  const [role, setRole] = useState("employee")
  const [requirements, setRequirements] = useState([])
  const [newRequirement, setNewRequirement] = useState({ description: "", amount: "", urgencyLevel: "" })
  const [editingId, setEditingId] = useState(null)
  const [balance, setBalance] = useState(10000) // Initial balance for admin

  const addRequirement = () => {
    if (newRequirement.description && newRequirement.amount) {
      setRequirements([
        ...requirements,
        {
          id: Date.now(),
          description: newRequirement.description,
          amount: Number.parseFloat(newRequirement.amount),
          urgencyLevel: newRequirement.urgencyLevel,
          status: "pending",
        },
      ])
      setNewRequirement({ description: "", amount: "", urgencyLevel: "" })
    }
  }

  const updateRequirement = (id, updatedRequirement) => {
    setRequirements(requirements.map((req) => (req.id === id ? { ...req, ...updatedRequirement } : req)))
    setEditingId(null)
  }

  const deleteRequirement = (id) => {
    setRequirements(requirements.filter((req) => req.id !== id))
  }

  const approveRequirement = (id) => {
    updateRequirement(id, { status: "approved" })
  }

  const rejectRequirement = (id) => {
    updateRequirement(id, { status: "rejected" })
  }

  const uploadBill = (id) => {
    updateRequirement(id, { billUploaded: true, status: "fulfilled" })
  }

  const verifyBill = (id) => {
    const requirement = requirements.find((req) => req.id === id)
    if (requirement) {
      setBalance((prevBalance) => prevBalance - requirement.amount)
      updateRequirement(id, { status: "verified" })
    }
  }

  const refillFunds = (amount) => {
    setBalance((prevBalance) => prevBalance + amount)
  }

  const totalAmount = requirements.reduce((sum, req) => sum + req.amount, 0)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Imprest Requirements</CardTitle>
          <RoleSelector role={role} setRole={setRole} />
        </div>
      </CardHeader>
      <CardContent>
        {role === "employee" && (
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Description"
              value={newRequirement.description}
              onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newRequirement.amount}
              onChange={(e) => setNewRequirement({ ...newRequirement, amount: e.target.value })}
            />
            <Select
              value={newRequirement.urgencyLevel}
              onValueChange={(value) => setNewRequirement({ ...newRequirement, urgencyLevel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent>
                {urgencyLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addRequirement}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Urgency Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requirements.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.description}</TableCell>
                <TableCell>${req.amount.toFixed(2)}</TableCell>
                <TableCell>{req.urgencyLevel.charAt(0).toUpperCase() + req.urgencyLevel.slice(1)}</TableCell>
                <TableCell>{req.status}</TableCell>
                <TableCell>
                  {role === "employee" && req.status === "pending" && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => setEditingId(req.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteRequirement(req.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {role === "manager" && req.status === "pending" && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => approveRequirement(req.id)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => rejectRequirement(req.id)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {role === "manager" && req.status === "approved" && (
                    <Button variant="ghost" size="icon" onClick={() => uploadBill(req.id)}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  )}
                  {role === "admin" && req.status === "fulfilled" && (
                    <Button variant="ghost" size="icon" onClick={() => verifyBill(req.id)}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <span className="font-bold">Total Imprest Amount:</span>
          <span className="text-xl font-bold">${totalAmount.toFixed(2)}</span>
        </div>
      </CardFooter>
      {role === "admin" && (
        <CardFooter>
          <div className="flex justify-between items-center w-full">
            <span className="font-bold">Current Balance:</span>
            <span className="text-xl font-bold">${balance.toFixed(2)}</span>
          </div>
          <div className="flex space-x-2 mt-4">
            <Input
              type="number"
              placeholder="Refill amount"
              onChange={(e) => setNewRequirement({ ...newRequirement, amount: e.target.value })}
            />
            <Button onClick={() => refillFunds(Number.parseFloat(newRequirement.amount))}>
              <DollarSign className="mr-2 h-4 w-4" /> Refill Funds
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

