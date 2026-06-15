export type ShipmentType = 'physical' | 'digital' | 'money' | 'consignment'
export type ShipmentStatus = 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception' | 'held' | 'returned'
export type PaymentStatus = 'pending' | 'confirmed' | 'failed'
export type CryptoCoin = 'BTC' | 'ETH' | 'USDT' | 'USDC'
export type MessageType = 'warning' | 'danger' | 'info' | 'success'

export interface ShipmentItem {
  description: string
  quantity: number
  weight: number
}

export interface Address {
  name: string
  phone: string
  email: string
  address: string
  country: string
}

export interface AgentInfo {
  name: string
  phone: string
  date: string
  time_window: string
}

export interface AdminMessage {
  type: MessageType
  title: string
  body: string
  action?: string
  created_at: string
}

export interface TimelineEvent {
  text: string
  location: string
  time: string
  type: 'normal' | 'info' | 'issue' | 'done'
}

export interface Payment {
  coin: CryptoCoin
  coin_name: string
  usd_amount: number
  crypto_amount: string
  tx_hash: string
  status: PaymentStatus
  submitted_at: string
  confirmed_at?: string
}

export interface Shipment {
  id: string
  tracking_number: string
  status: ShipmentStatus
  type: ShipmentType
  category: string
  items: ShipmentItem[]
  sender: Address
  recipient: Address
  service: string
  declared_value: number
  notes?: string
  money_details?: {
    amount: number
    transfer_type: string
  }
  file_name?: string
  images: string[]
  current_location?: string
  eta?: string
  admin_message?: AdminMessage
  agent_info?: AgentInfo
  is_vip: boolean
  client_id?: string
  payment?: Payment
  timeline: TimelineEvent[]
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  email: string
  name: string
  phone?: string
  is_vip: boolean
  vip_expires_at?: string
  shipment_count: number
  created_at: string
}

export interface AdminSession {
  authenticated: boolean
  username: string
  expires: number
}
