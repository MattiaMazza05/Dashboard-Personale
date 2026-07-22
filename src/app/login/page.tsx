"use client";
import { Button } from "@heroui/react";
import LightRays from "./LightRays";
import { supabase } from "@/lib/supabase";
import { Icon } from "@iconify/react";

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
        <Button variant="tertiary" onPress={() => handleGoogleLogin()}>
          <Icon icon="logos:google-icon" className="w-5 h-5 mr-2" />
          Login con Google
        </Button>
      </div>
    </div>
  );
}
