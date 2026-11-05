const rings = [
  "inset-[12%] rotate-20",
  "inset-[23%] rotate-40",
  "inset-[34%] rotate-60",
];

export function GalleryOrbit() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute end-[2%] top-1/2 z-0 aspect-square w-[min(28vw,22rem)] -translate-y-1/2 -rotate-18 mask-[linear-gradient(to_bottom,black,transparent_82%)] opacity-[0.38] max-[430px]:hidden max-md:-end-[13%] max-md:w-44 max-md:opacity-[0.16]"
    >
      {rings.map((ring) => (
        <div
          key={ring}
          className={`absolute rounded-[32%] border border-[color-mix(in_oklch,var(--primary)_34%,var(--border))] bg-[color-mix(in_oklch,var(--primary)_4%,transparent)] ${ring}`}
        />
      ))}
    </div>
  );
}
