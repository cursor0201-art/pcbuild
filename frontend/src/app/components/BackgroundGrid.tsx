export function BackgroundGrid() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00d4ff08_1px,transparent_1px),linear-gradient(to_bottom,#00d4ff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]" />
    </div>
  );
}
