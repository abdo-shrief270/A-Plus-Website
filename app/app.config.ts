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
    },
    input: {
      defaultVariants: {
        size: 'lg'
      },
      base: 'w-full',
      wrapper: 'w-full',
      slots: {
        root: 'w-full',
        base: 'w-full',
        wrapper: 'w-full'
      }
    },
    select: {
      defaultVariants: {
        size: 'lg'
      },
      base: 'w-full',
      wrapper: 'w-full'
    },
    selectMenu: {
      defaultVariants: {
        size: 'lg'
      },
      base: 'w-full',
      wrapper: 'w-full'
    },
    textarea: {
      defaultVariants: {
        size: 'lg'
      },
      base: 'w-full',
      wrapper: 'w-full'
    }
  }
})
