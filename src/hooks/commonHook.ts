import { supabase } from "@/lib/supabase";

export async function getUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id;
}
