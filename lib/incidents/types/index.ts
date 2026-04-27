export type Incident = {
  id: string
  root_id: string
  device_id: string
  area_id: string
  reported_by_id: string
  assigned_to_id: string | null
  type: IncidentType
  priority: IncidentPriority
  status: IncidentStatus
  description: string
  solution: string | null
  observations: string | null
  location: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
  closed_at: string | null
  deleted_at: string | null
  device?: { id: string; name: string }
  area?: { id: string; name: string }
  reporter?: { id: string; name: string; email: string }
  assignee?: { id: string; name: string; email: string } | null
  attachments?: IncidentAttachment[]
}

export type IncidentAttachment = {
  id: string
  incident_id: string
  file_url: string
  file_name: string
  file_type: string | null
  file_size: number | null
  created_at: string
}

export type IncidentType = "HARDWARE" | "SOFTWARE" | "NETWORK" | "POWER" | "OTHER"
export type IncidentPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
export type IncidentStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"