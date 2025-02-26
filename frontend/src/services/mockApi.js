const STORAGE_KEY = "imprestRequirements"
const BALANCE_KEY = "departmentBalances"
const NOTIFICATION_KEY = "notifications"

const INITIAL_BALANCE = 50000

export const mockApi = {
  getRequirements: () => {
    const storedData = localStorage.getItem(STORAGE_KEY)
    return storedData ? JSON.parse(storedData) : []
  },

  saveRequirements: (requirements) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requirements))
  },

  addRequirement: (requirement) => {
    const requirements = mockApi.getRequirements()
    const newRequirement = { ...requirement, id: Date.now() }
    requirements.push(newRequirement)
    mockApi.saveRequirements(requirements)
    return newRequirement
  },

  updateRequirement: (id, updates) => {
    const requirements = mockApi.getRequirements()
    const index = requirements.findIndex((req) => req.id === id)
    if (index !== -1) {
      requirements[index] = { ...requirements[index], ...updates }
      mockApi.saveRequirements(requirements)
    }
  },

  deleteRequirement: (id) => {
    const requirements = mockApi.getRequirements()
    const updatedRequirements = requirements.filter((req) => req.id !== id)
    mockApi.saveRequirements(updatedRequirements)
  },

  getDepartmentBalances: () => {
    const storedData = localStorage.getItem(BALANCE_KEY)
    return storedData ? JSON.parse(storedData) : []
  },

  saveDepartmentBalances: (balances) => {
    localStorage.setItem(BALANCE_KEY, JSON.stringify(balances))
  },

  initializeDepartmentBalances: (departments) => {
    const balances = departments.map((dept) => ({ department: dept, balance: INITIAL_BALANCE }))
    mockApi.saveDepartmentBalances(balances)
  },

  updateDepartmentBalance: (department, amount) => {
    const balances = mockApi.getDepartmentBalances()
    const index = balances.findIndex((b) => b.department === department)
    if (index !== -1) {
      balances[index].balance += amount
      mockApi.saveDepartmentBalances(balances)
    }
  },

  getDepartmentBalance: (department) => {
    const balances = mockApi.getDepartmentBalances()
    const balance = balances.find((b) => b.department === department)
    return balance ? balance.balance : INITIAL_BALANCE
  },

  getNotifications: () => {
    const storedData = localStorage.getItem(NOTIFICATION_KEY)
    return storedData ? JSON.parse(storedData) : []
  },

  saveNotifications: (notifications) => {
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications))
  },

  addNotification: (message, department, type) => {
    const notifications = mockApi.getNotifications()
    notifications.push({ id: Date.now(), message, department, timestamp: new Date().toISOString(), type })
    mockApi.saveNotifications(notifications)
  },
}

