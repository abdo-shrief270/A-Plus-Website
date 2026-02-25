/**
 * Composable to generate and persist device identification info.
 * Used to send X-Device-ID, X-Device-Name, X-Device-Platform headers.
 */

const DEVICE_ID_KEY = 'aplus_device_id'

function generateUUID(): string {
    // Use crypto.randomUUID if available, fallback to manual generation
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID()
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

function getDeviceId(): string {
    if (typeof localStorage === 'undefined') return ''
    let id = localStorage.getItem(DEVICE_ID_KEY)
    if (!id) {
        id = generateUUID()
        localStorage.setItem(DEVICE_ID_KEY, id)
    }
    return id
}

function getDeviceName(): string {
    if (typeof navigator === 'undefined') return 'Unknown'
    const ua = navigator.userAgent

    // Extract browser name
    let browser = 'Browser'
    if (ua.includes('Edg/')) browser = 'Edge'
    else if (ua.includes('Chrome/')) browser = 'Chrome'
    else if (ua.includes('Firefox/')) browser = 'Firefox'
    else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari'

    // Extract OS
    let os = 'Unknown OS'
    if (ua.includes('Windows')) os = 'Windows'
    else if (ua.includes('Mac OS')) os = 'macOS'
    else if (ua.includes('Linux')) os = 'Linux'
    else if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

    return `${browser} on ${os}`
}

export function useDeviceInfo() {
    const deviceId = getDeviceId()
    const deviceName = getDeviceName()
    const devicePlatform = 'web'

    return {
        deviceId,
        deviceName,
        devicePlatform,
        /** Returns headers object ready to spread into Axios config */
        getHeaders() {
            return {
                'X-Device-ID': deviceId,
                'X-Device-Name': deviceName,
                'X-Device-Platform': devicePlatform,
            }
        },
    }
}
