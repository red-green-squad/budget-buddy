import { connectToDB } from '@/db/mongodb';
import { UserModel } from '@/models/User';
import { compare } from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/singin',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToDB();
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await UserModel.findOne({
          email: credentials.email,
        });

        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }

        return {
          id: user._id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user;
        return {
          ...token,
          id: u.id,
        };
      }
      return token;
    },
    signIn: async ({ profile }) => {
      if (profile) {
        await connectToDB();
        const user = await UserModel.findOne({
          email: profile.email,
        });
        if (user) {
          return '/signin';
        }
      }
      return true;
    },
    redirect({ url, baseUrl }) {
      if (url.includes('singin') || url.includes('signup')) {
        return baseUrl + '/expenses';
      }
      return url;
    },
  },
};

const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST };
