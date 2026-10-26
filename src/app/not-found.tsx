import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-404">
      <h1 className="brand-font">Oops! Crumbs only.</h1>
      <p>We couldn’t find that page.</p>
      <Link href="/" className="btn-purple">Back to home</Link>
    </div>
  );
}
