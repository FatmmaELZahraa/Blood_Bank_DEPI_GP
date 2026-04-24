"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { 
  MessageCircle, 
  X, 
  Send,
  Droplets,
  User,
  Bot,
  Minimize2,
  Mic,
  MicOff,
  MapPin,
  Bell,
  Pill,
  Calendar,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: number
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "location" | "medication" | "notification"
}

// Medication eligibility database (common medications that affect donation)
const medicationDatabase: Record<string, { eligible: boolean; waitPeriod?: string; reason: string }> = {
  "aspirin": { eligible: true, waitPeriod: "48 hours", reason: "Aspirin affects platelet function. Wait 48 hours after last dose for platelet donation, but you can donate whole blood." },
  "ibuprofen": { eligible: true, reason: "Ibuprofen does not affect your eligibility to donate blood." },
  "acetaminophen": { eligible: true, reason: "Acetaminophen (Tylenol) does not affect your eligibility to donate blood." },
  "antibiotics": { eligible: false, waitPeriod: "Until infection clears", reason: "If you're taking antibiotics for an active infection, you should wait until the infection has cleared and you've finished your medication." },
  "accutane": { eligible: false, waitPeriod: "1 month", reason: "Wait 1 month after your last dose of Accutane (isotretinoin) before donating." },
  "propecia": { eligible: false, waitPeriod: "1 month", reason: "Wait 1 month after your last dose of Propecia (finasteride) before donating." },
  "avodart": { eligible: false, waitPeriod: "6 months", reason: "Wait 6 months after your last dose of Avodart (dutasteride) before donating." },
  "blood thinners": { eligible: false, reason: "Blood thinners like Warfarin, Coumadin, or Heparin typically make you ineligible. Please consult with our medical staff." },
  "warfarin": { eligible: false, reason: "Warfarin is a blood thinner that makes you ineligible to donate. Please consult with our medical staff." },
  "insulin": { eligible: true, reason: "Diabetics who take insulin are eligible to donate as long as their diabetes is well controlled." },
  "blood pressure": { eligible: true, reason: "Blood pressure medications generally do not affect your eligibility as long as your blood pressure is controlled." },
  "birth control": { eligible: true, reason: "Birth control pills do not affect your eligibility to donate blood." },
  "antidepressants": { eligible: true, reason: "Most antidepressants do not affect your eligibility to donate blood." },
  "hepatitis b vaccine": { eligible: false, waitPeriod: "21 days", reason: "Wait 21 days after receiving the Hepatitis B vaccine before donating." },
  "covid vaccine": { eligible: true, reason: "COVID-19 vaccines do not affect your eligibility. No waiting period is required." },
  "flu shot": { eligible: true, reason: "Flu shots do not affect your eligibility. No waiting period is required." },
}

// Nearby blood bank locations (simulated)
const bloodBankLocations = [
  { id: 1, name: "BloodLink Central Hub", address: "123 Health Center Drive", distance: "0.8 miles", availability: "Open Now", hours: "8AM - 8PM" },
  { id: 2, name: "City Hospital Blood Center", address: "456 Medical Plaza", distance: "1.2 miles", availability: "Open Now", hours: "7AM - 6PM" },
  { id: 3, name: "Community Blood Bank", address: "789 Wellness Ave", distance: "2.5 miles", availability: "Open Now", hours: "9AM - 5PM" },
  { id: 4, name: "Regional Medical Center", address: "321 Care Street", distance: "3.1 miles", availability: "Closes at 6PM", hours: "6AM - 6PM" },
]

// Health conditions database
const healthConditions: Record<string, { eligible: boolean; waitPeriod?: string; reason: string }> = {
  "cold": { eligible: false, waitPeriod: "Until symptoms resolve", reason: "Wait until your cold symptoms have completely resolved before donating." },
  "flu": { eligible: false, waitPeriod: "Until symptoms resolve", reason: "Wait until your flu symptoms have completely resolved before donating." },
  "fever": { eligible: false, waitPeriod: "Until fever-free for 24 hours", reason: "You must be fever-free (without medication) for at least 24 hours before donating." },
  "pregnant": { eligible: false, waitPeriod: "6 weeks after delivery", reason: "You cannot donate while pregnant. Wait 6 weeks after delivery to donate." },
  "tattoo": { eligible: true, waitPeriod: "Depends on state regulations", reason: "In most states, you can donate immediately after getting a tattoo if done at a licensed facility. Some states require a 3-month wait." },
  "piercing": { eligible: true, waitPeriod: "Depends on state regulations", reason: "Similar to tattoos, most states allow immediate donation if done at a licensed facility." },
  "travel": { eligible: true, reason: "Travel eligibility depends on the destination. Please tell me where you traveled and I can provide specific guidance." },
  "surgery": { eligible: false, waitPeriod: "Varies", reason: "Wait time after surgery varies. Minor procedures: 24-48 hours. Major surgery: until fully healed. Blood transfusion during surgery: 12 months." },
  "dental": { eligible: true, waitPeriod: "24-72 hours for extractions", reason: "For routine dental work, no waiting period. For extractions or oral surgery, wait until healed (usually 24-72 hours)." },
  "cancer": { eligible: false, reason: "Cancer survivors may be eligible depending on the type and treatment. Please consult with our medical staff for a personalized assessment." },
  "hiv": { eligible: false, reason: "Individuals with HIV are not eligible to donate blood." },
  "hepatitis": { eligible: false, reason: "Individuals who have had hepatitis B or C are not eligible to donate blood." },
}

// Predefined responses for common questions
const botResponses: Record<string, string> = {
  "eligibility": "To donate blood, you must be at least 17 years old, weigh at least 110 pounds, and be in good health. The time between whole blood donations is 56 days (8 weeks). Would you like me to check your eligibility based on medications or health conditions?",
  "blood type": "The most common blood types are A+, A-, B+, B-, AB+, AB-, O+, and O-. O- is the universal donor, while AB+ is the universal recipient. You can find your blood type on your donor card or through a blood test.",
  "appointment": "You can book an appointment through your donor portal. Simply go to the Appointments section, select a nearby blood center, choose a date and time that works for you, and confirm your booking. Would you like me to find the nearest blood bank for you?",
  "donation process": "The blood donation process takes about 45-60 minutes total. This includes registration (10 min), health screening (10 min), donation (8-10 min), and refreshments (10-15 min). The actual blood draw only takes about 8-10 minutes.",
  "sos": "SOS requests are emergency blood requests from hospitals with critical shortages. When an SOS is issued, nearby blood banks and eligible donors are notified immediately via email and push notifications. If you're eligible, you can help save lives by responding to SOS alerts.",
  "rewards": "Our rewards program lets you earn points for every donation. Points can be redeemed for health discounts, fitness passes, wellness packages, and more. You also earn badges for milestones like your first donation, 10th donation, and maintaining donation streaks.",
  "qr code": "Your Digital ID (QR code) contains your donor information and can be scanned at any BloodLink partner center for quick check-in. You can find it in the Digital ID section of your donor portal.",
  "contact": "You can reach our support team at support@bloodlink.com or call our helpline at 1-800-BLOOD-HELP. Our team is available 24/7 for emergencies and Monday-Friday 9AM-5PM for general inquiries.",
  "notifications": "BloodLink sends appointment reminders, eligibility notifications, and urgent SOS alerts. You can customize your notification preferences in your profile settings. Would you like me to explain the notification types?",
  "default": "I'm here to help with blood donation questions! You can ask me about:\n\n• Medication eligibility (e.g., 'Can I donate if I take aspirin?')\n• Health conditions\n• Nearest blood banks (try voice command!)\n• Appointment booking\n• Rewards program\n• SOS requests\n\nHow can I assist you today?"
}

function checkMedication(medication: string): string {
  const lowerMed = medication.toLowerCase()
  
  for (const [key, value] of Object.entries(medicationDatabase)) {
    if (lowerMed.includes(key)) {
      if (value.eligible) {
        return `Regarding ${key}: ${value.reason}${value.waitPeriod ? ` Wait period: ${value.waitPeriod}.` : ''} You are likely eligible to donate!`
      } else {
        return `Regarding ${key}: ${value.reason}${value.waitPeriod ? ` Required wait period: ${value.waitPeriod}.` : ''} Please consult with our staff if you have questions.`
      }
    }
  }
  
  return "I don't have specific information about that medication in my database. For safety, please consult with our medical staff at the blood center, or call 1-800-BLOOD-HELP for guidance before your appointment."
}

function checkHealthCondition(condition: string): string {
  const lowerCondition = condition.toLowerCase()
  
  for (const [key, value] of Object.entries(healthConditions)) {
    if (lowerCondition.includes(key)) {
      if (value.eligible) {
        return `Regarding ${key}: ${value.reason}${value.waitPeriod ? ` Note: ${value.waitPeriod}.` : ''}`
      } else {
        return `Regarding ${key}: ${value.reason}${value.waitPeriod ? ` Required wait period: ${value.waitPeriod}.` : ''}`
      }
    }
  }
  
  return null as unknown as string
}

function getNearbyLocations(): string {
  const locationList = bloodBankLocations
    .map((loc, i) => `${i + 1}. ${loc.name}\n   📍 ${loc.address}\n   📏 ${loc.distance} away\n   🕐 ${loc.hours} (${loc.availability})`)
    .join("\n\n")
  
  return `Here are the nearest blood banks to your location:\n\n${locationList}\n\nWould you like me to help you book an appointment at any of these locations?`
}

function getBotResponse(message: string): { content: string; type: Message["type"] } {
  const lowerMessage = message.toLowerCase()
  
  // Check for medication queries
  if (lowerMessage.includes("medication") || lowerMessage.includes("medicine") || lowerMessage.includes("drug") || 
      lowerMessage.includes("taking") || lowerMessage.includes("can i donate if i take") ||
      Object.keys(medicationDatabase).some(med => lowerMessage.includes(med))) {
    const medicationResponse = checkMedication(message)
    return { content: medicationResponse, type: "medication" }
  }
  
  // Check for health condition queries
  const healthResponse = checkHealthCondition(message)
  if (healthResponse) {
    return { content: healthResponse, type: "medication" }
  }
  
  // Check for location queries
  if (lowerMessage.includes("nearest") || lowerMessage.includes("nearby") || lowerMessage.includes("close to me") ||
      lowerMessage.includes("where can i") || lowerMessage.includes("find blood bank") || lowerMessage.includes("location")) {
    return { content: getNearbyLocations(), type: "location" }
  }
  
  // Check for notification queries
  if (lowerMessage.includes("notification") || lowerMessage.includes("reminder") || lowerMessage.includes("alert") ||
      lowerMessage.includes("email") || lowerMessage.includes("sms")) {
    return { 
      content: "BloodLink keeps you informed through multiple channels:\n\n📧 Email Notifications:\n• Appointment confirmations & reminders\n• Eligibility notifications (when you can donate again)\n• Monthly newsletters with health tips\n\n🚨 Urgent Alerts:\n• SOS blood requests from hospitals\n• Critical shortage notifications\n• Emergency donor calls\n\n📱 SMS & Push:\n• 24-hour appointment reminders\n• Day-of appointment confirmations\n• Real-time SOS alerts\n\nYou can customize all notification preferences in your donor profile settings.", 
      type: "notification" 
    }
  }
  
  if (lowerMessage.includes("eligib") || lowerMessage.includes("can i donate") || lowerMessage.includes("requirements")) {
    return { content: botResponses["eligibility"], type: "text" }
  }
  if (lowerMessage.includes("blood type") || lowerMessage.includes("type")) {
    return { content: botResponses["blood type"], type: "text" }
  }
  if (lowerMessage.includes("appointment") || lowerMessage.includes("book") || lowerMessage.includes("schedule")) {
    return { content: botResponses["appointment"], type: "text" }
  }
  if (lowerMessage.includes("process") || lowerMessage.includes("how long") || lowerMessage.includes("what happens")) {
    return { content: botResponses["donation process"], type: "text" }
  }
  if (lowerMessage.includes("sos") || lowerMessage.includes("emergency") || lowerMessage.includes("urgent")) {
    return { content: botResponses["sos"], type: "text" }
  }
  if (lowerMessage.includes("reward") || lowerMessage.includes("point") || lowerMessage.includes("badge")) {
    return { content: botResponses["rewards"], type: "text" }
  }
  if (lowerMessage.includes("qr") || lowerMessage.includes("digital id") || lowerMessage.includes("id card")) {
    return { content: botResponses["qr code"], type: "text" }
  }
  if (lowerMessage.includes("contact") || lowerMessage.includes("support") || lowerMessage.includes("help line")) {
    return { content: botResponses["contact"], type: "text" }
  }
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return { content: "Hello! Welcome to BloodLink. I'm BloodBot, your medical inquiry assistant. I can help you with:\n\n💊 Medication eligibility checks\n🏥 Finding nearby blood banks\n📅 Appointment information\n🏆 Rewards and badges\n🔔 Notification settings\n\nTry using the microphone button to ask me questions by voice! How can I help you today?", type: "text" }
  }
  if (lowerMessage.includes("thank")) {
    return { content: "You're welcome! Remember, every donation can save up to 3 lives. Is there anything else I can help you with?", type: "text" }
  }
  if (lowerMessage.includes("voice") || lowerMessage.includes("microphone") || lowerMessage.includes("speak")) {
    return { content: "You can use voice commands by clicking the microphone button! Try saying:\n\n🎤 'Find the nearest blood bank'\n🎤 'Can I donate if I take aspirin?'\n🎤 'Book an appointment'\n🎤 'What are my rewards?'\n\nJust click the mic and speak clearly.", type: "text" }
  }
  
  return { content: botResponses["default"], type: "text" }
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm BloodBot, your medical inquiry assistant. I can help with:\n\n💊 Medication eligibility\n🏥 Nearest blood banks\n📅 Appointments & scheduling\n🔔 Notifications & reminders\n\nTry the microphone for voice commands! How can I assist you?",
      sender: "bot",
      timestamp: new Date(),
      type: "text"
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Check for speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInputValue(transcript)
          setIsListening(false)
          
          // Auto-send after voice input
          setTimeout(() => {
            handleSendVoice(transcript)
          }, 500)
        }
        
        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }
        
        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendVoice = useCallback((voiceText: string) => {
    if (!voiceText.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      content: voiceText,
      sender: "user",
      timestamp: new Date(),
      type: "text"
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const response = getBotResponse(voiceText)
      const botMessage: Message = {
        id: Date.now() + 1,
        content: response.content,
        sender: "bot",
        timestamp: new Date(),
        type: response.type
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
      
      // Speak the response if voice was used
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response.content.replace(/[•📧🚨📱💊🏥📅🔔🎤📍📏🕐🏆]/g, ''))
        utterance.rate = 1
        utterance.pitch = 1
        window.speechSynthesis.speak(utterance)
      }
    }, 1000)
  }, [])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text"
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const response = getBotResponse(currentInput)
      const botMessage: Message = {
        id: Date.now() + 1,
        content: response.content,
        sender: "bot",
        timestamp: new Date(),
        type: response.type
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleVoice = () => {
    if (!recognitionRef.current) return
    
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const quickQuestions = [
    { text: "Can I donate on aspirin?", icon: Pill },
    { text: "Find nearest blood bank", icon: MapPin },
    { text: "Book an appointment", icon: Calendar },
    { text: "SOS alerts info", icon: AlertTriangle },
    
  ]

  const getMessageIcon = (type: Message["type"]) => {
    switch (type) {
      case "location": return <MapPin className="h-3 w-3" />
      case "medication": return <Pill className="h-3 w-3" />
      case "notification": return <Bell className="h-3 w-3" />
      default: return null
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl transition-all duration-200",
        isMinimized ? "h-14 w-80" : "h-[520px] w-[400px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Droplets className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold">BloodBot</p>
            {!isMinimized && (
              <p className="text-xs opacity-80">Medical Inquiry Assistant</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-white/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-2",
                    message.sender === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.sender === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {message.type && message.type !== "text" && message.sender === "bot" && (
                      <Badge variant="secondary" className="mb-2 gap-1 text-[10px]">
                        {getMessageIcon(message.type)}
                        {message.type === "location" && "Location Info"}
                        {message.type === "medication" && "Medical Info"}
                        {message.type === "notification" && "Notifications"}
                      </Badge>
                    )}
                    <p className="whitespace-pre-line text-sm">{message.content}</p>
                    <p className={cn(
                      "mt-1 text-[10px]",
                      message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl bg-muted px-4 py-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="border-t border-border px-4 py-2">
              <p className="mb-2 text-xs text-muted-foreground">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(question.text)
                    }}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                  >
                    <question.icon className="h-3 w-3" />
                    {question.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-4">
            {isListening && (
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                </span>
                Listening... Speak now
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder={isListening ? "Listening..." : "Type or use voice..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
                disabled={isListening}
              />
              {speechSupported && (
                <Button 
                  onClick={toggleVoice} 
                  size="icon" 
                  variant={isListening ? "destructive" : "outline"}
                  className={cn(isListening && "animate-pulse")}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
              <Button onClick={handleSend} size="icon" disabled={!inputValue.trim() || isListening}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Add type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}
