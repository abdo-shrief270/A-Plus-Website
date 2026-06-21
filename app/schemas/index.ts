/**
 * Single source of truth for form validation schemas. Pages import from here
 * instead of defining schemas inline so messages stay consistent and shared
 * shapes (registration, profile) only need to change in one place.
 */
export * from './auth'
export * from './contact'
export * from './profile'
export * from './students'
