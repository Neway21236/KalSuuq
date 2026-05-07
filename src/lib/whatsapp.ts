const BUSINESS_PHONE = '251900000000'

interface Order {
  id: string
  items: Array<{
    name: string
    size: string
    colour: string
    quantity: number
    total: number
  }>
  address: string
  total: number
}

interface Product {
  name: string
  price: number
}

export function buildCODOrderMessage(order: Order): string {
  const items = order.items.map(i =>
    `- ${i.name} (Size ${i.size}, ${i.colour}) × ${i.quantity} = ETB ${i.total.toLocaleString()}`
  ).join('\n')
  
  const message = `New Order #${order.id}\n\n${items}\n\nDelivery: ${order.address}\nTotal: ETB ${order.total.toLocaleString()}\nPayment: Cash on Delivery\n\nPlease confirm this order.`
  
  return `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(message)}`
}

export function buildProductEnquiryMessage(product: Product, size: string): string {
  const message = `Hi, I'm interested in:\n\n${product.name}\nSize: ${size}\nPrice: ETB ${product.price.toLocaleString()}\n\nCould you help me with my order?`
  
  return `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(message)}`
}

export function buildPartnerOrderNotification(partnerName: string, orderId: string): string {
  const message = `Partner Notification: ${partnerName} has generated a new order (#${orderId}).`
  return `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(message)}`
}

export function buildChapaOrderConfirmation(orderId: string): string {
  const message = `Payment Confirmed for Order #${orderId}. We are now processing your delivery.`
  return `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(message)}`
}

export function buildPayoutMessage(partnerName: string, amount: number): string {
  const message = `Payout Request: ${partnerName} is requesting a payout of ETB ${amount.toLocaleString()}.`
  return `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(message)}`
}
