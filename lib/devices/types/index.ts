export type Device = {
  id: string
  root_id: string
  area_id: string
  name: string
  type: DeviceType
  serial_number: string | null
  brand: string | null
  model: string | null
  status: DeviceStatus
  ip_address: string | null
  purchase_date: string | null
  warranty_expiry: string | null
  notes: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  area?: { id: string; name: string }
}

export type DeviceType = "COMPUTER" | "PRINTER" | "SERVER" | "NETWORK" | "OTHER"
export type DeviceStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE" | "RETIRED"