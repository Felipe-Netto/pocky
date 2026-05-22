import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import type { GoogleUserMetadata } from "@/types/auth";

function parseGoogleProfile(metadata: GoogleUserMetadata) {
  const name = metadata.full_name ?? metadata.name ?? null;
  const avatarUrl = metadata.avatar_url ?? metadata.picture ?? null;

  return { name, avatarUrl };
}

export async function syncUserFromAuth(user: SupabaseUser) {
  if (!user.email) {
    throw new Error("Usuário autenticado sem e-mail.");
  }

  const metadata = user.user_metadata as GoogleUserMetadata;
  const { name, avatarUrl } = parseGoogleProfile(metadata);

  return prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email,
      name,
      avatarUrl,
    },
    update: {
      email: user.email,
      name,
      avatarUrl,
    },
  });
}
