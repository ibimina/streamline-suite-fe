/**
 * JWT Token utilities for client-side token handling
 * Note: This is for reading JWT payload only, not for verification
 */

interface JWTPayload {
  exp: number // Expiration time (seconds since Unix epoch)
  iat: number // Issued at time
  sub: string // Subject (usually user ID)
  [key: string]: any // Other claims
}

/**
 * Decode JWT token payload without verification
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    if (!token) return null

    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) return null

    // Decode the payload (second part)
    const payload = parts[1]

    // Add padding if needed (base64url can have padding removed)
    const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4)

    // Decode base64url to string
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'))

    // Parse JSON
    return JSON.parse(decodedPayload) as JWTPayload
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

/**
 * Check if JWT token is expired
 * @param token JWT token string
 * @returns true if expired, false if valid, null if token is invalid
 */
export function isTokenExpired(token: string): boolean | null {
  const payload = decodeJWT(token)
  if (!payload || !payload.exp) return null

  // Compare expiration time (in seconds) with current time
  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}

/**
 * Get token expiration date
 * @param token JWT token string
 * @returns Date object or null if token is invalid
 */
export function getTokenExpiration(token: string): Date | null {
  const payload = decodeJWT(token)
  if (!payload || !payload.exp) return null

  return new Date(payload.exp * 1000) // Convert seconds to milliseconds
}

/**
 * Get time remaining until token expires in minutes
 * @param token JWT token string
 * @returns Minutes until expiration, or null if token is invalid
 */
export function getTokenTimeRemaining(token: string): number | null {
  const payload = decodeJWT(token)
  if (!payload || !payload.exp) return null

  const currentTime = Math.floor(Date.now() / 1000)
  const timeRemaining = payload.exp - currentTime

  return timeRemaining > 0 ? Math.floor(timeRemaining / 60) : 0
}

/**
 * Check if token will expire soon (within specified minutes)
 * @param token JWT token string
 * @param minutesThreshold Minutes before expiration to consider "soon"
 * @returns true if expires soon, false if not, null if token is invalid
 */
export function willTokenExpireSoon(token: string, minutesThreshold: number = 5): boolean | null {
  const timeRemaining = getTokenTimeRemaining(token)
  if (timeRemaining === null) return null

  return timeRemaining <= minutesThreshold
}
