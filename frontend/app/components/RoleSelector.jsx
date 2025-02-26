import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RoleSelector({ role, setRole }) {
  return (
    <Select value={role} onValueChange={setRole}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select your role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="employee">Employee</SelectItem>
        <SelectItem value="manager">Manager</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  )
}

