export type Service = {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  image_url?: string
}

export type Employee = {
  id: string
  name: string
  email?: string
  created_at?: any
}

export type Appointment = {
  id?: string
  name: string
  phone: string
  email: string
  service_id: string
  employee_id: string
  date: string
  time: string
  notes?: string
  status?: string
  created_at?: string
  employees?: { name: string } | null
}

export type GalleryImage = {
  id: string
  url: string
  caption?: string
  category?: string
}
