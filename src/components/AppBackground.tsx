export function AppBackground() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(900px 620px at 12% -8%, rgba(255,106,77,.20), transparent 62%), radial-gradient(820px 520px at 88% 2%, rgba(96,142,255,.18), transparent 62%), radial-gradient(700px 700px at 62% 112%, rgba(94,240,205,.12), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none fixed z-0 rounded-full blur-[20px]"
        style={{
          width: 520,
          height: 520,
          left: "58%",
          top: "22%",
          background:
            "radial-gradient(circle, rgba(255,138,110,.16), transparent 65%)",
          animation: "jarvis-drift 18s ease-in-out infinite",
        }}
      />
    </>
  );
}
