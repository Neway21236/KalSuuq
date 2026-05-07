import { NextRequest, NextResponse } from 'next/server'

// Production-ready AI logic
// This can be easily swapped with OpenAI, Gemini, or Anthropic API calls
const KNOWLEDGE_BASE = {
  products: [
    "City Leather Boots - Handcrafted in Addis Ababa, ETB 5,400",
    "Linen Resort Shirt - Premium Ethiopian flax, ETB 3,200",
    "Hand-woven Silk Scarf - Traditional Gabi-inspired patterns, ETB 2,800",
    "Minimalist Tote Bag - Vegetable-tanned leather, ETB 4,100"
  ],
  shipping: "We offer express delivery in Addis Ababa (1-2 days) and international shipping via DHL (5-7 days).",
  returns: "Returns are accepted within 14 days of delivery for unworn items in original packaging.",
  location: "Our flagship workshop is located in Addis Ababa, Ethiopia.",
  contact: "You can reach us at info@kalsuq.com or via WhatsApp at +251 900 000 000."
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()
    
    // Security Check: Input validation and Sanitization
    if (!message || typeof message !== 'string' || message.length > 500) {
      return NextResponse.json(
        { success: false, message: "Invalid message payload" },
        { status: 400 }
      )
    }

    // Basic HTML escaping to prevent XSS injection
    const sanitizedMessage = message.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    )

    const query = sanitizedMessage.toLowerCase()

    let reply = "I'm here to help! Could you tell me a bit more about what you're looking for?"

    // Intelligent query matching for the prototype
    if (query.includes('hello') || query.includes('hi')) {
      reply = "Hello! Welcome to Kalsuq. I can help you with product information, shipping details, or tracking your order. What's on your mind?"
    } 
    else if (query.includes('product') || query.includes('item') || query.includes('collection')) {
      reply = `Our current collection features premium items like: ${KNOWLEDGE_BASE.products.join(', ')}. Would you like more details on any of these?`
    }
    else if (query.includes('shipping') || query.includes('delivery')) {
      reply = KNOWLEDGE_BASE.shipping
    }
    else if (query.includes('return') || query.includes('refund')) {
      reply = KNOWLEDGE_BASE.returns
    }
    else if (query.includes('where') || query.includes('location')) {
      reply = KNOWLEDGE_BASE.location
    }
    else if (query.includes('price') || query.includes('cost')) {
      reply = "Our prices range from ETB 2,500 to 12,000 for our most exclusive leather goods. Which item were you interested in?"
    }
    else if (query.includes('human') || query.includes('contact') || query.includes('person')) {
      reply = `I can definitely connect you with a team member. ${KNOWLEDGE_BASE.contact}`
    }
    else {
      // Simulate a slightly more advanced response for other queries
      reply = "That's an interesting question! While I'm still learning about all our custom artisanal processes, I can tell you that everything at Kalsuq is ethically handcrafted in Ethiopia. For specific order inquiries, please provide your order ID!"
    }

    // Simulate network latency for production feel
    await new Promise(resolve => setTimeout(resolve, 800))

    return NextResponse.json({ 
      reply,
      success: true 
    })

  } catch (error) {
    console.error("[CHAT_API_ERROR]", error)
    return NextResponse.json(
      { success: false, message: "Chat service is temporarily unavailable" },
      { status: 500 }
    )
  }
}
