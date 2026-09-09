// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Jab user Discord se login karega, yeh chalega
    async jwt({ token, account, profile }: any) {
      if (account && profile) {
        try {
          // Dev 3 ke backend ko user data bhejna (Sync)
          const syncResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/discord/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Backend-Handshake-Secret": process.env.BACKEND_HANDSHAKE_SECRET!,
            },
            body: JSON.stringify({
              discord_id: profile.id,
              username: profile.username,
              display_name: profile.global_name || profile.username,
              avatar_url: profile.image_url || `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
            }),
          });

          if (!syncResponse.ok) {
            console.error("Backend Sync Failed:", await syncResponse.text());
            throw new Error("Backend sync failed");
          }

          const data = await syncResponse.json();
          
          // Dev 3 se mila access_token NextAuth token me save kar lo
          token.backendToken = data.access_token;
          token.role = data.user?.role || "clipper"; 
        } catch (error) {
          console.error("Error syncing with backend:", error);
        }
      }
      return token;
    },
    // Yeh session tumhari baaki website ko milega
    async session({ session, token }: any) {
      session.accessToken = token.backendToken;
      session.user.role = token.role;
      return session;
    },
  },
});

export { handler as GET, handler as POST };