/**
 * Renders the DevCrate mark: an isometric crate whose planked faces are lit from the top.
 * It uses a fixed palette (shared with the favicon) and has no background tile, so it reads
 * the same on light and dark surfaces.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M20 4.5 33 12 20 19.5 7 12Z" fill="#FDBA74" />
      <path d="M7 12 20 19.5V35L7 27.5Z" fill="#EA580C" />
      <path d="M33 12 20 19.5V35L33 27.5Z" fill="#C2410C" />
      <g stroke="#FFEDD5" strokeOpacity=".55" strokeWidth="1.2" fill="none">
        <path d="M13.5 8.25 26.5 15.75" />
        <path d="M7 19.75 20 27.25" />
        <path d="M33 19.75 20 27.25" />
      </g>
    </svg>
  )
}
