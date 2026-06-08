export interface Annotation {
  id: string
  markerNumber: number
  selector: string
  description: string
  scope: 'global' | 'page'
  page?: string
  createdAt: number
  updatedAt: number
}

export interface PageInfo {
  id: string
  name: string
}

export interface Prototype {
  id: string
  name: string
  prompt: string
  generatedCode: string
  annotations: Annotation[]
  hasSrs?: boolean
  hasHandbook?: boolean
  createdAt: number
  updatedAt: number
}
