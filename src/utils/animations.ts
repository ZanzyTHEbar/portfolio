// Animation utility functions and constants
import { TransitionConfig } from 'solid-transition-group'

// Fade transition
export const fadeTransition: TransitionConfig = {
  enterActiveClass: 'transition-opacity duration-300 ease-in-out',
  enterClass: 'opacity-0',
  enterToClass: 'opacity-100',
  exitActiveClass: 'transition-opacity duration-300 ease-in-out',
  exitClass: 'opacity-100',
  exitToClass: 'opacity-0',
}

// Slide up transition
export const slideUpTransition: TransitionConfig = {
  enterActiveClass: 'transition-all duration-500 ease-out',
  enterClass: 'opacity-0 transform translate-y-8',
  enterToClass: 'opacity-100 transform translate-y-0',
  exitActiveClass: 'transition-all duration-300 ease-in',
  exitClass: 'opacity-100 transform translate-y-0',
  exitToClass: 'opacity-0 transform translate-y-8',
}

// Scale transition
export const scaleTransition: TransitionConfig = {
  enterActiveClass: 'transition-all duration-300 ease-out',
  enterClass: 'opacity-0 transform scale-95',
  enterToClass: 'opacity-100 transform scale-100',
  exitActiveClass: 'transition-all duration-200 ease-in',
  exitClass: 'opacity-100 transform scale-100',
  exitToClass: 'opacity-0 transform scale-95',
}

// Staggered animation delay utility
export const getStaggeredDelay = (index: number, baseDelay = 100): string => {
  return `${baseDelay * index}ms`
}
