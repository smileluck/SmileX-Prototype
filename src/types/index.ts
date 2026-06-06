export interface Annotation {
  id: string
  markerNumber: number
  x: number
  y: number
  description: string
  createdAt: number
  updatedAt: number
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
