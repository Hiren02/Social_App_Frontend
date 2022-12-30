import NextAuth, { Session, NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import * as dotenv from 'dotenv'
import { url } from 'services/endPoint'
import { addUserDetails } from '../../../services/webservices/user/userInformation'

dotenv.config()

const nextAuthUrl = 'http://localhost:3000' ?? ''

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials: any, req) {
        if (!credentials.otp) {
          const { email, password } = credentials as {
            email: string
            password: string
          }
          const details = await addUserDetails({ email, password })
          const resData = await axios
            .post(`${url}/api/user/login`, details)
            .then(({ data }) => {
              return data
            })
          if (resData.responseData) {
            const {
              _id: id,
              email,
              userName,
              twoFactorAuthentication,
              token,
            } = resData.responseData

            return { id, email, userName, twoFactorAuthentication, token }
          } else {
            throw new Error(resData?.responseMessage)
          }
        } else {
          const { otp, userId } = credentials as {
            otp: string
            userId: string
          }

          const resData = await axios
            .post(`${url}/api/user/verifySecurityCode/${userId}`, {
              OTP: otp,
            })
            .then(({ data }) => {
              return data
            })

          if (resData.responseData) {
            const {
              _id: id,
              email,
              userName,
              twoFactorAuthentication,
              token,
            } = resData.responseData

            return { id, email, userName, twoFactorAuthentication, token }
          } else {
            throw new Error(resData?.responseMessage)
          }
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user) {
        return true
      } else {
        return false
      }
    },
    async redirect({ baseUrl }) {
      return baseUrl
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          user,
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        return { ...session, user: token.user as Session['user'] }
      }

      return session
    },
  },
}

export default NextAuth(authOptions)
