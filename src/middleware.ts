// eslint-disable-next-line no-restricted-exports
export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/',
    '/friend-request',
    '/profile',
    '/search',
    '/user-friend-list',
    '/other-users',
    '/user-chat',
    '/change-password',
  ],
}
