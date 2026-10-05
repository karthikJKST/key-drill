/** Small top bar: logo + tagline. */
export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <span className="brand">
          <span className="brand__mark" aria-hidden="true">
            K
          </span>
          <span className="brand__name">KeyDrill</span>
        </span>
        <span className="brand__tag">home-row typing practice</span>
      </div>
    </header>
  )
}
