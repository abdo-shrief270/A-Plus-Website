export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',
      neutral: 'slate',
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info'
    },
    button: {
      defaultVariants: {
        color: 'primary'
      },
      variants: {
        variant: {
          solid: 'text-white dark:text-white'
        }
      }
    }
  }
})
