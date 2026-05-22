import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'
import { locales } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale: 'vi'
})

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
