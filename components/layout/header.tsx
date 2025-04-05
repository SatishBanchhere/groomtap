import TopBar from "./top-bar"
import Logo from "./logo"
import Navigation from "./navigation"
import JoinButton from "./join-button"

export default function Header() {
  return (
    <header>
      <TopBar />
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Logo />
        <Navigation />
        <JoinButton />
      </div>
    </header>
  )
}
