import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { HIGH_TARIFF_COUNTRIES, SERVICE_TIERS, TYPE_MULTIPLIERS } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTrackingNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = 'VX'
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export function calculatePrice(
  serviceKey: string,
  type: string,
  declaredValue: number,
  destinationCountry: string,
  moneyAmount?: number
): number {
  const service = SERVICE_TIERS[serviceKey as keyof typeof SERVICE_TIERS]
  if (!service) return 0

  const base = service.basePrice
  const multiplier = TYPE_MULTIPLIERS[type as keyof typeof TYPE_MULTIPLIERS] || 1
  const tariffSurcharge = HIGH_TARIFF_COUNTRIES.includes(destinationCountry) ? 25 : 0
  const insurance = declaredValue > 0 ? declaredValue * 0.015 : 0

  if (type === 'money' && moneyAmount) {
    const complianceFee = moneyAmount * 0.035
    const mandatoryInsurance = moneyAmount * 0.02
    return parseFloat((base * multiplier + complianceFee + mandatoryInsurance + tariffSurcharge).toFixed(2))
  }

  return parseFloat((base * multiplier + insurance + tariffSurcharge).toFixed(2))
}

export function calculateETA(serviceKey: string): string {
  const service = SERVICE_TIERS[serviceKey as keyof typeof SERVICE_TIERS]
  const days = service?.days || 3
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}
