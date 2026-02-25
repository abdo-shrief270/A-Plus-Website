export const useDeviceId = () => {
  const deviceId = useCookie('device_id', {
    maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
    path: '/'
  })

  if (!deviceId.value) {
    deviceId.value = crypto.randomUUID()
  }

  return deviceId.value
}
