import type { Access, FieldAccess } from 'payload'

type AuthUser = {
  id: number | string
  collection?: string
  roles?: string[]
  role?: string
}

export const userIsStaff = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') return false
  const user = value as AuthUser
  return user.collection === 'users' && Boolean(user.roles?.some((role) => role === 'admin' || role === 'editor'))
}

export const userIsAdmin = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') return false
  const user = value as AuthUser
  return user.collection === 'users' && user.roles?.includes('admin') === true
}

export const staffOnly: Access = ({ req }) => userIsStaff(req.user)
export const adminOnly: Access = ({ req }) => userIsAdmin(req.user)
export const adminFieldOnly: FieldAccess = ({ req }) => userIsAdmin(req.user)

export const firstAdminOrAdmin: Access = async ({ req }) => {
  if (userIsAdmin(req.user)) return true
  const result = await req.payload.find({ collection: 'users', limit: 1, depth: 0, overrideAccess: true })
  return result.docs.length === 0
}

export const publicOrStaffPublished: Access = ({ req }) => {
  if (userIsStaff(req.user)) return true
  return { _status: { equals: 'published' } }
}

export const ownCustomerOrStaff: Access = ({ req }) => {
  if (userIsStaff(req.user)) return true
  if (!req.user || (req.user as AuthUser).collection !== 'customers') return false
  return { id: { equals: (req.user as AuthUser).id } }
}

export const ownBookingsOrStaff: Access = ({ req }) => {
  if (userIsStaff(req.user)) return true
  if (!req.user || (req.user as AuthUser).collection !== 'customers') return false
  return { customer: { equals: (req.user as AuthUser).id } }
}
