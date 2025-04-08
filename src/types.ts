
import type { JSX } from 'solid-js'

export interface Experience {
    title: string
    company: string
    period: string
    description: string
    achievements: string[]
}

export interface Project {
    title: string
    description: string
    image: string
    tags: string[]
    icon: JSX.Element,
    link: string
}

export interface Skill {
    icon: JSX.Element
    title: string
    skills: string[]
}