"use client"

import { useState } from "react"
import { 
  Settings, 
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Save
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "BloodLink Network",
    siteEmail: "admin@bloodlink.com",
    sosNotifications: true,
    lowStockAlerts: true,
    newDonorNotifications: true,
    weeklyReports: true,
    criticalThreshold: "20",
    lowThreshold: "40",
    donationCooldown: "56",
    maintenanceMode: false,
    timezone: "America/New_York"
  })

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            General Settings
          </CardTitle>
          <CardDescription>Configure basic system settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteEmail">Admin Email</Label>
              <Input
                id="siteEmail"
                type="email"
                value={settings.siteEmail}
                onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select 
              value={settings.timezone} 
              onValueChange={(value) => setSettings({ ...settings, timezone: value })}
            >
              <SelectTrigger>
                <Globe className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Settings
          </CardTitle>
          <CardDescription>Manage system notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SOS Request Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts when hospitals send SOS requests
              </p>
            </div>
            <Switch
              checked={settings.sosNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, sosNotifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when blood inventory falls below threshold
              </p>
            </div>
            <Switch
              checked={settings.lowStockAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, lowStockAlerts: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Donor Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts when new donors register
              </p>
            </div>
            <Switch
              checked={settings.newDonorNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, newDonorNotifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">
                Receive automated weekly summary reports
              </p>
            </div>
            <Switch
              checked={settings.weeklyReports}
              onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Inventory Thresholds
          </CardTitle>
          <CardDescription>Configure stock level alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="critical">Critical Threshold (%)</Label>
              <Input
                id="critical"
                type="number"
                value={settings.criticalThreshold}
                onChange={(e) => setSettings({ ...settings, criticalThreshold: e.target.value })}
                min="0"
                max="100"
              />
              <p className="text-xs text-muted-foreground">Alert when stock falls below this %</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="low">Low Stock Threshold (%)</Label>
              <Input
                id="low"
                type="number"
                value={settings.lowThreshold}
                onChange={(e) => setSettings({ ...settings, lowThreshold: e.target.value })}
                min="0"
                max="100"
              />
              <p className="text-xs text-muted-foreground">Warning when stock falls below this %</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cooldown">Donation Cooldown (days)</Label>
              <Input
                id="cooldown"
                type="number"
                value={settings.donationCooldown}
                onChange={(e) => setSettings({ ...settings, donationCooldown: e.target.value })}
                min="1"
              />
              <p className="text-xs text-muted-foreground">Days between donations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            System Settings
          </CardTitle>
          <CardDescription>Advanced system configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-destructive">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily disable public access for maintenance
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
            />
          </div>
          {settings.maintenanceMode && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <p className="text-sm text-destructive">
                Warning: Maintenance mode is enabled. Public users cannot access the system.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">
          <Save className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  )
}
