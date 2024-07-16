import { authOptions } from "@/lib/nextAuth"
import NextAuth from "next-auth"

const handler = NextAuth.default(authOptions())

export {handler as GET, handler as POST}