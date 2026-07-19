"use client"
import LightRays from "./LightRays";
import LoginCard from "./LoginButton";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        backgroundColor: "#000000",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <LoginCard
          onClick={handleGoogleLogin}
          className="group border-white/10 shadow-[0_0_80px_-20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:border-white/25 hover:shadow-[0_0_100px_-15px_rgba(255,255,255,0.25)]"
        >
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 48 48" className="h-6 w-6">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.5C29.6 35.2 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5c3.3 6.5 10 11 17.8 10.9z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.2 5.5l6.5 5.5C41.5 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z"
                />
              </svg>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-base font-medium tracking-wide text-white">
                Bentornato 👋
              </span>
              <span className="text-xs text-white/50">
                Clicca per accedere con Google
              </span>
            </div>
          </div>
        </LoginCard>
      </div>
    </div>
  );
}
