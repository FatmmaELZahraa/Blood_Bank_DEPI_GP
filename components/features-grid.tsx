import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  User, 
  Calendar, 
  QrCode, 
  Trophy, 
  Gauge, 
  AlertTriangle,
  Brain,
  MessageCircle,
  BarChart3,
  Thermometer,
  Mic,
  GitBranch
} from "lucide-react"

const features = [
  {
    category: "Donor Portal",
    items: [
      {
        icon: User,
        title: "Digital Profile",
        description: "Store blood type, medical history, and donation records securely in one place."
      },
      {
        icon: Calendar,
        title: "Smart Booking",
        description: "Select nearest branch and available time via integrated map system."
      },
      {
        icon: QrCode,
        title: "Digital ID",
        description: "QR code containing personal data to speed up registration at blood banks."
      },
      {
        icon: Trophy,
        title: "Gamification",
        description: "Earn points and badges for donations, redeemable for health rewards."
      },
    ]
  },
  {
    category: "Inventory Management",
    items: [
      {
        icon: Gauge,
        title: "Live Dashboard",
        description: "Real-time blood unit availability with low-level alerts per blood type."
      },
      {
        icon: AlertTriangle,
        title: "SOS Requests",
        description: "Emergency button for rare blood types with instant donor notifications."
      },
      {
        icon: Thermometer,
        title: "Cold Chain",
        description: "IoT temperature monitoring to ensure blood safety and compliance."
      },
      {
        icon: Calendar,
        title: "Expiry Tracking",
        description: "FIFO consumption alerts for units approaching expiration."
      },
    ]
  },
  {
    category: "AI & Communication",
    items: [
      {
        icon: Brain,
        title: "ML Predictions",
        description: "Analyze historical data to predict shortage periods and demand."
      },
      {
        icon: MessageCircle,
        title: "Medical Chatbot",
        description: "NLP-powered assistant for donor questions and eligibility checks."
      },
      {
        icon: Mic,
        title: "Voice Assistant",
        description: "Find nearest blood banks using voice commands."
      },
      {
        icon: BarChart3,
        title: "Smart Matching",
        description: "Algorithm identifies best donors based on proximity and responsiveness."
      },
    ]
  },
  {
    category: "Administration",
    items: [
      {
        icon: BarChart3,
        title: "Analytics",
        description: "Periodic reports on donation rates, consumption, and blood type demand."
      },
      {
        icon: GitBranch,
        title: "Branch Network",
        description: "Link multiple blood banks to exchange units within a unified network."
      },
    ]
  }
]

export function FeaturesGrid() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance font-serif">
            One Integration. Complete Blood Management.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-serif">
            Structured data. Dedicated support. Minimal operational headaches.
          </p>
        </div>

        <div className="space-y-16">
          {features.map((section) => (
            <div key={section.category}>
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2 font-serif">
                <div className="h-1 w-8 bg-primary rounded-full" />
                {section.category}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {section.items.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <Card key={feature.title} className="group hover:border-primary/50 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="p-2 w-fit rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors mb-2">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-base font-serif">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm font-serif">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
