export function getJwtExp(token: string): number | null {
    try {
      const payload = token.split(".")[1]
      if (!payload) return null
      const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
      return typeof json?.exp === "number" ? json.exp : null
    } catch {
      return null
    }
  }
  
  export function isJwtExpired(token: string, leewaySeconds = 15): boolean {
    const exp = getJwtExp(token)
    if (!exp) return false
    const now = Math.floor(Date.now() / 1000)
    return exp <= now + leewaySeconds
  }