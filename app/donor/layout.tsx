"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  User, 
  Calendar, 
  QrCode, 
  Award, 
  History,
  Menu,
  X,
  Droplets,
  Bell,
  Settings,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { href: "/donor", icon: User, label: "Profile" },
  { href: "/donor/appointments", icon: Calendar, label: "Appointments" },
  { href: "/donor/qr-code", icon: QrCode, label: "Digital ID" },
  { href: "/donor/rewards", icon: Award, label: "Rewards" },
  { href: "/donor/history", icon: History, label: "Donation History" },
]

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <Droplets className="h-6 w-6 text-primary" />
          <span className="font-bold text-foreground font-serif">BloodLink</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card transition-transform duration-200 lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Desktop Header */}
          <div className="hidden items-center gap-2 border-b border-border px-6 py-4 lg:flex">
            <Link href="/" className="flex items-center gap-2">
              <Droplets className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold text-foreground font-serif">BloodLink</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/avatar.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground font-serif">John Doe</p>
                <p className="text-sm text-muted-foreground font-serif">Blood Type: O+</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Points Display */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground font-serif">Total Points</span>
                <Award className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-1 text-2xl font-bold text-primary font-serif">2,450</p>
              <p className="text-xs text-muted-foreground font-serif">Gold Donor Status</p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Desktop Header */}
          <div className="mb-6 hidden items-center justify-between lg:flex">
            <div>
              <h1 className="text-2xl font-bold text-foreground font-serif">Welcome back, Fatma</h1>
              <p className="text-muted-foreground font-serif">Manage your donations and track your impact</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  3
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.jpg" />
                      <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
                    </Avatar>
                    <span className="hidden xl:inline font-serif">John Doe</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/donor/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
