export const showToast = (
  summary: string,
  detail?: string,
  severity: 'success' | 'info' | 'warning' | 'error' = 'info',
  duration: number = 5000
) => {
  const toast = useToast()

  toast.add({
    title: summary,
    description: detail,
    color: severity,
    timeout: duration
  })
}
