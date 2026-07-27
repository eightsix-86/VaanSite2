export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: 'cakes' | 'cupcakes' | 'cookies'
}

export interface CartItem extends Product {
  quantity: number
}

export interface OrderDetails {
  name: string
  email: string
  phone: string
  address: string
  specialInstructions?: string
}