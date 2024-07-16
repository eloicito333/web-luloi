/** @type {import('next').NextConfig} */
export default {
  images: {
    remotePatterns: [
      {
         protocol: "https",
         hostname: "lh3.googleusercontent.com",
         port: "",
         pathname: "/**",
      },
   ],
  },
};
