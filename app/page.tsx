import Link from 'next/link';
export default function Home() {
  return (
    <div className="p-6 space-y-3">
      <h2 className="text-2xl font-semibold">Welcome to Polycalc</h2>
      <p className="text-zinc-600">
        Scrub numbers, watch visuals update, and ask the AI tutor to demonstrate ideas.
      </p>
      <ul className="list-disc pl-6 mt-2">
        <li>Start with <Link className="underline" href="/formulas/quadratic">Quadratic</Link></li>
        <li>Or try <Link className="underline" href="/formulas/projectile">Projectile</Link></li>
      </ul>
    </div>
  );
}
