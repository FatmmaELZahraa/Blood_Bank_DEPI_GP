"use client"

import { useState } from "react"
import { 
  Droplets, 
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock inventory data
const initialInventory = [
  { type: "A+", units: 4, capacity: 100, expiringSoon: 5, lastUpdated: "2 hours ago" },
  { type: "A-", units: 12, capacity: 50, expiringSoon: 2, lastUpdated: "3 hours ago" },
  { type: "B+", units: 38, capacity: 80, expiringSoon: 3, lastUpdated: "1 hour ago" },
  { type: "B-", units: 8, capacity: 40, expiringSoon: 1, lastUpdated: "4 hours ago" },
  { type: "AB+", units: 22, capacity: 60, expiringSoon: 2, lastUpdated: "2 hours ago" },
  { type: "AB-", units: 5, capacity: 30, expiringSoon: 0, lastUpdated: "5 hours ago" },
  { type: "O+", units: 52, capacity: 120, expiringSoon: 8, lastUpdated: "30 min ago" },
  { type: "O-", units: 15, capacity: 60, expiringSoon: 3, lastUpdated: "1 hour ago" }
]

function getStatus(units: number, capacity: number) {
  const percentage = (units / capacity) * 100
  if (percentage <= 20) return { label: "Critical", color: "bg-destructive", textColor: "text-destructive" }
  if (percentage <= 40) return { label: "Low", color: "bg-amber-500", textColor: "text-amber-600" }
  return { label: "Good", color: "bg-green-500", textColor: "text-green-600" }
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState(initialInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("")
  const [adjustAmount, setAdjustAmount] = useState("")
  const [adjustAction, setAdjustAction] = useState<"add" | "remove">("add")

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.type.toLowerCase().includes(searchTerm.toLowerCase())
    const status = getStatus(item.units, item.capacity).label.toLowerCase()
    const matchesFilter = filterStatus === "all" || status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleAdjustInventory = () => {
    if (!selectedType || !adjustAmount) return
    
    setInventory(prev => prev.map(item => {
      if (item.type === selectedType) {
        const amount = parseInt(adjustAmount)
        const newUnits = adjustAction === "add" 
          ? Math.min(item.units + amount, item.capacity)
          : Math.max(item.units - amount, 0)
        return { ...item, units: newUnits, lastUpdated: "Just now" }
      }
      return item
    }))
    
    setSelectedType("")
    setAdjustAmount("")
  }

  const totalUnits = inventory.reduce((acc, item) => acc + item.units, 0)
  const totalCapacity = inventory.reduce((acc, item) => acc + item.capacity, 0)
  const expiringTotal = inventory.reduce((acc, item) => acc + item.expiringSoon, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Inventory</p>
                <p className="text-3xl font-bold text-foreground">{totalUnits}</p>
                <p className="text-xs text-muted-foreground">of {totalCapacity} capacity</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Progress value={(totalUnits / totalCapacity) * 100} className="mt-4 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Types</p>
                <p className="text-3xl font-bold text-amber-600">
                  {inventory.filter(i => getStatus(i.units, i.capacity).label === "Low").length}
                </p>
                <p className="text-xs text-muted-foreground">need restocking</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-3xl font-bold text-destructive">{expiringTotal}</p>
                <p className="text-xs text-muted-foreground">units within 7 days</p>
              </div>
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Blood Inventory</CardTitle>
              <CardDescription>Manage and monitor blood stock levels</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Stock
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adjust Inventory</DialogTitle>
                    <DialogDescription>
                      Add or remove blood units from inventory
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Blood Type</Label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventory.map((item) => (
                            <SelectItem key={item.type} value={item.type}>
                              {item.type} ({item.units} units)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Action</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={adjustAction === "add" ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => setAdjustAction("add")}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                        <Button
                          variant={adjustAction === "remove" ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => setAdjustAction("remove")}
                        >
                          <Minus className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Units</Label>
                      <Input
                        type="number"
                        placeholder="Enter number of units"
                        value={adjustAmount}
                        onChange={(e) => setAdjustAmount(e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAdjustInventory} disabled={!selectedType || !adjustAmount}>
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search blood type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredInventory.map((item) => {
              const status = getStatus(item.units, item.capacity)
              return (
                <Card key={item.type} className="overflow-hidden">
                  <div className={`h-1 ${status.color}`} />
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-lg font-bold text-primary">{item.type}</span>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={status.textColor}
                      >
                        {status.label}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Stock Level</span>
                          <span className="font-medium text-foreground">{item.units} / {item.capacity}</span>
                        </div>
                        <Progress 
                          value={(item.units / item.capacity) * 100} 
                          className="mt-1 h-2" 
                        />
                      </div>

                      {item.expiringSoon > 0 && (
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                          <AlertTriangle className="h-3 w-3" />
                          {item.expiringSoon} units expiring soon
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Updated {item.lastUpdated}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
