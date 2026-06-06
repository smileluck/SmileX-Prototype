export interface Annotation {
  id: string
  markerNumber: number
  x: number
  y: number
  description: string
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
  mode: 'prototype' | 'preview'
  createdAt: number
  updatedAt: number
}
