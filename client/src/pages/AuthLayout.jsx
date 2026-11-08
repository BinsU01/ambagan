// Shared green-hero layout for Login and Register.
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="hero-circle" aria-hidden="true" />
        <span className="logo logo-light">
          <span className="logo-a">a</span>mbagan
        </span>
        <h1 className="display auth-title">{title}</h1>
        <p className="auth-tagline">{subtitle}</p>
      </section>
      <section className="auth-card">{children}</section>
    </div>
  );
}
