import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, Search, Droplet, Heart } from "lucide-react"

const steps = [
  {
    step: 1,
    icon: UserPlus,
    title: "Register",
    description: "Create your profile as a donor, hospital, or blood bank administrator."
  },
  {
    step: 2,
    icon: Search,
    title: "Connect",
    description: "Find nearby blood banks, check availability, or register blood inventory."
  },
  {
    step: 3,
    icon: Droplet,
    title: "Donate or Request",
    description: "Schedule donations or submit blood requests with real-time tracking."
  },
  {
    step: 4,
    icon: Heart,
    title: "Save Lives",
    description: "Efficient matching and delivery ensures blood reaches those in need."
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-card border-t border-border">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-serif">
            Get started in minutes with our streamlined process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={item.step} className="relative overflow-hidden font-serif">
                <CardContent className="pt-8 pb-6">
                  {/* Step number */}
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted/20 font-serif">
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="p-3 w-fit rounded-xl bg-primary/10 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 font-serif">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-serif">
                    {item.description}
                  </p>

                  {/* Connector line (except last) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-border" />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
