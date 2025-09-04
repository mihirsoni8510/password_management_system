export interface Password {
  id: string
  service_name: string
  url: string
  email: string
  last_updated: string // always store as string (ISO date)
  password: string          
}

export interface PasswordFromData
  extends Omit<Password, "id" | "last_updated"> {
  last_updated?: string // optional during creation
}

export interface AddPasswordFormProps {
  open: boolean
  setOpen: (open: boolean) => void
  refresh: () => void
  projectId: string | null // NEW: project ID to associate password with
}

export interface Project {
  id: string
  name: string
  client_name?: string
  start_date?: string
  user_id?: string
  created_at?: string
}


export interface AddProjectFormProps {
  open: boolean
  setOpen: (open: boolean) => void
  refresh: () => void
}
