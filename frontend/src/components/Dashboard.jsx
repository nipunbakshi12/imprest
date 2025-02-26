"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, CheckCircle, XCircle, DollarSign, AlertTriangle, Bell } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Textarea } from "./ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { mockApi } from "../services/mockApi"
import axios from "axios"

const departments = ["IT", "HR", "Finance", "Marketing"]
const urgencyLevels = ["routine", "priority", "emergency"]

export default function Dashboard() {
  const [role, setRole] = useState(null)
  const [userDepartment, setUserDepartment] = useState(null)
  const [requirements, setRequirements] = useState([])
  const [newRequirement, setNewRequirement] = useState({
    description: "",
    amount: "",
    department: "",
    urgencyLevel: "",
  })
  const [editingId, setEditingId] = useState(null)
  const [departmentBalances, setDepartmentBalances] = useState([])
  const [refillInfo, setRefillInfo] = useState({ amount: "", department: "" })
  const [notifications, setNotifications] = useState([])
  const [rejectionFeedback, setRejectionFeedback] = useState("")
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [rejectingId, setRejectingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    const storedDepartment = localStorage.getItem("userDepartment")
    if (!userRole) {
      navigate("/login")
    } else {
      setRole(userRole)
      setUserDepartment(storedDepartment)
      setRequirements(mockApi.getRequirements())
      setDepartmentBalances(mockApi.getDepartmentBalances())
      setNotifications(mockApi.getNotifications())

      if (mockApi.getDepartmentBalances().length === 0) {
        mockApi.initializeDepartmentBalances(departments)
        setDepartmentBalances(mockApi.getDepartmentBalances())
      }
    }
  }, [navigate])

  console.log("jiiiiiiiiiiiiiiiii")

  const addRequirement = () => {
    if (newRequirement.description && newRequirement.amount && newRequirement.department) {
      const amount = Number(newRequirement.amount)
      const status = amount > 20000 ? "pending_admin_approval" : "pending"
      const addedRequirement = mockApi.addRequirement({
        description: newRequirement.description,
        amount: amount,
        status: status,
        department: newRequirement.department,
        urgencyLevel: newRequirement.urgencyLevel,
        timestamp: new Date().toISOString(),
      })
      setRequirements([...requirements, addedRequirement])
      setNewRequirement({ description: "", amount: "", department: "", urgencyLevel: "" })

      if (amount > 20000) {
        mockApi.addNotification(
          `Your request for $${amount} is a special request and has been sent for multi-level approval. It may take more time to process.`,
          newRequirement.department,
          "specialRequest",
        )
        setNotifications(mockApi.getNotifications())
      }
    }
  }

  // const baseUrl = "http://localhost:5000/api/imprest"


  const getRequirementsData = async () => {



    try {
      const response = await axios.get("http://localhost:5000/api/imprest/getAllImprest");
      console.log(response.data, "requirement data");
    } catch (error) {
      console.error("Error fetching requirements:", error);
    }
  };

  useEffect(() => {
    getRequirementsData()
  }, [])

  const updateRequirement = (id, updatedRequirement) => {
    mockApi.updateRequirement(id, updatedRequirement)
    setRequirements(requirements.map((req) => (req.id === id ? { ...req, ...updatedRequirement } : req)))
    setEditingId(null)
  }

  const deleteRequirement = (id) => {
    mockApi.deleteRequirement(id)
    setRequirements(requirements.filter((req) => req.id !== id))
  }

  const approveRequirement = (id) => {
    const requirement = requirements.find((req) => req.id === id)
    if (requirement) {
      const balance = mockApi.getDepartmentBalance(requirement.department)
      if (balance >= requirement.amount) {
        if (requirement.amount > 150000) {
          updateRequirement(id, { status: "pending", approvedBy: "manager" })
          notifyAdmin(requirement, "approvalNotification")
        } else {
          mockApi.updateDepartmentBalance(requirement.department, -requirement.amount)
          updateRequirement(id, {
            status: "approved",
            approvedBy: "manager",
            approvalTimestamp: new Date().toISOString(),
          })
          setDepartmentBalances(mockApi.getDepartmentBalances())
          notifyAdmin(requirement, "approvalNotification")
        }
      } else {
        alert(`Insufficient funds in ${requirement.department} department. Please refill funds.`)
      }
    }
  }

  const rejectRequirement = (id) => {
    setRejectingId(id)
    setShowRejectionDialog(true)
  }

  const confirmRejection = () => {
    if (rejectingId !== null) {
      updateRequirement(rejectingId, { status: "rejected", managerFeedback: rejectionFeedback })
      setShowRejectionDialog(false)
      setRejectionFeedback("")
      setRejectingId(null)
    }
  }

  const verifyBill = (id) => {
    updateRequirement(id, { status: "verified" })
  }

  const disburseFunds = (id) => {
    updateRequirement(id, { status: "disbursed" })
  }

  const refillFunds = () => {
    if (refillInfo.amount && refillInfo.department) {
      const amount = Number(refillInfo.amount)
      mockApi.updateDepartmentBalance(refillInfo.department, amount)
      setDepartmentBalances(mockApi.getDepartmentBalances())
      setRefillInfo({ amount: "", department: "" })
    }
  }

  const sendFundsAlert = (department) => {
    mockApi.addNotification(`${department} department urgently needs funds`, department, "fundRequest")
    setNotifications(mockApi.getNotifications())
    alert(`Urgent funds request sent to admin for ${department} department`)
  }

  const notifyAdmin = (requirement, type) => {
    const message =
      type === "approvalNotification"
        ? `Manager of ${requirement.department} department has approved a request of $${requirement.amount}. Funds need to be disbursed.`
        : `${requirement.department} department urgently needs funds.`
    mockApi.addNotification(message, "Admin", type)
    setNotifications(mockApi.getNotifications())
  }

  const renderEmployeeView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Raise Imprest Request</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
            value={newRequirement.department}
            onValueChange={(value) => setNewRequirement({ ...newRequirement, department: value })}
          >
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
          <Button onClick={getRequirementsData}>
            <Plus className="mr-2 h-4 w-4" /> Submit New Request
          </Button>
        </div>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Urgency Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requirements.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.description}</TableCell>
                <TableCell>${req.amount.toFixed(2)}</TableCell>
                <TableCell>{req.department}</TableCell>
                <TableCell>{req.urgencyLevel.charAt(0).toUpperCase() + req.urgencyLevel.slice(1)}</TableCell>
                <TableCell>{req.status === "pending_admin_approval" ? "Pending Admin Approval" : req.status}</TableCell>
                <TableCell>{new Date(req.timestamp).toLocaleString()}</TableCell>
                <TableCell>{req.managerFeedback || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          {notifications
            .filter((notification) => notification.department === userDepartment)
            .map((notification) => (
              <Alert key={notification.id} className="mb-2">
                <Bell className="h-4 w-4" />
                <AlertTitle>{notification.type === "specialRequest" ? "Special Request" : "Notification"}</AlertTitle>
                <AlertDescription>{notification.message}</AlertDescription>
              </Alert>
            ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderManagerView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Manage Imprest Requests - {userDepartment} Department</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <span className="font-bold">Current Balance: </span>
            <span>${(departmentBalances.find((b) => b.department === userDepartment)?.balance || 0).toFixed(2)}</span>
          </div>
          <Button onClick={() => userDepartment && sendFundsAlert(userDepartment)}>
            <AlertTriangle className="mr-2 h-4 w-4" /> Request Urgent Funds
          </Button>
        </div>
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="approved">Approved Requests</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Urgency Level</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements
                  .filter((req) => req.status === "pending" && !req.approvedBy && req.department === userDepartment)
                  .map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.description}</TableCell>
                      <TableCell>${req.amount.toFixed(2)}</TableCell>
                      <TableCell>{req.urgencyLevel.charAt(0).toUpperCase() + req.urgencyLevel.slice(1)}</TableCell>
                      <TableCell>{new Date(req.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => approveRequirement(req.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => rejectRequirement(req.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="approved">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Urgency Level</TableHead>
                  <TableHead>Approval Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements
                  .filter(
                    (req) => req.status !== "pending" && req.status !== "rejected" && req.department === userDepartment,
                  )
                  .map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.description}</TableCell>
                      <TableCell>${req.amount.toFixed(2)}</TableCell>
                      <TableCell>{req.urgencyLevel.charAt(0).toUpperCase() + req.urgencyLevel.slice(1)}</TableCell>
                      <TableCell>
                        {req.approvalTimestamp ? new Date(req.approvalTimestamp).toLocaleString() : "-"}
                      </TableCell>
                      <TableCell>{req.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>Please provide feedback for rejecting this request.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection feedback"
            value={rejectionFeedback}
            onChange={(e) => setRejectionFeedback(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={confirmRejection}>Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )

  const renderAdminView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <Input
            type="number"
            placeholder="Refill amount"
            value={refillInfo.amount}
            onChange={(e) => setRefillInfo({ ...refillInfo, amount: e.target.value })}
          />
          <Select
            value={refillInfo.department}
            onValueChange={(value) => setRefillInfo({ ...refillInfo, department: value })}
          >
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
          <Button onClick={refillFunds}>
            <DollarSign className="mr-2 h-4 w-4" /> Refill Funds
          </Button>
        </div>
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="disbursed">Disbursed</TabsTrigger>
            <TabsTrigger value="multilevel">Multi-level Requests</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Urgency Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements
                  .filter((req) => req.status === "pending" && req.approvedBy === "manager")
                  .map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.description}</TableCell>
                      <TableCell>${req.amount.toFixed(2)}</TableCell>
                      <TableCell>{req.department}</TableCell>
                      <TableCell>{req.urgencyLevel.charAt(0).toUpperCase() + req.urgencyLevel.slice(1)}</TableCell>
                      <TableCell>{req.status}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => approveRequirement(req.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => rejectRequirement(req.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="approved">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Urgency Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements
                  .filter((req) => req.status === "approved" || req.status === "verified")
                  .map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.description}</TableCell>
                      <TableCell>${req.amount.toFixed(2)}</TableCell>
                      <TableCell>{req.department}</TableCell>
                      <TableCell>{req.urgencyLevel.charAt(0).toUpperCase() + req.urgencyLevel.slice(1)}</TableCell>
                      <TableCell>{req.status}</TableCell>
                      <TableCell>
                        {req.status === "approved" && (
                          <Button variant="ghost" size="icon" onClick={() => verifyBill(req.id)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {req.status === "verified" && (
                          <Button variant="ghost" size="icon" onClick={() => disburseFunds(req.id)}>
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="disbursed">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Urgency Level</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements
                  .filter((req) => req.status === "disbursed")
                  .map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.description}</TableCell>
                      <TableCell>${req.amount.toFixed(2)}</TableCell>
                      <TableCell>{req.department}</TableCell>
                      <TableCell>{req.urgencyLevel.charAt(0).toUpperCase() + req.urgencyLevel.slice(1)}</TableCell>
                      <TableCell>{req.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="multilevel">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Urgency Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements
                  .filter((req) => req.status === "pending_admin_approval")
                  .map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.description}</TableCell>
                      <TableCell>${req.amount.toFixed(2)}</TableCell>
                      <TableCell>{req.department}</TableCell>
                      <TableCell>{req.urgencyLevel.charAt(0).toUpperCase() + req.urgencyLevel.slice(1)}</TableCell>
                      <TableCell>{req.status}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => approveRequirement(req.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => rejectRequirement(req.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="notifications">
            {notifications.map((notification) => (
              <Alert key={notification.id} className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>
                  {notification.type === "fundRequest" ? "Urgent Fund Request" : "Approval Notification"}
                </AlertTitle>
                <AlertDescription>{notification.message}</AlertDescription>
              </Alert>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  if (!role) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Imprest Management System</h1>
      {role === "employee" && renderEmployeeView()}
      {role === "manager" && renderManagerView()}
      {role === "admin" && renderAdminView()}
    </div>
  )
}

