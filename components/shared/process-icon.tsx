import { Search, UserRound, Calendar } from "lucide-react"

type ProcessIconProps = {
  step: number
  size?: number
}

export default function ProcessIcon({ step, size = 32 }: ProcessIconProps) {
  const getIcon = () => {
    switch (step) {
      case 1:
        return <Search size={size} />
      case 2:
        return <UserRound size={size} />
      case 3:
        return <Calendar size={size} />
      default:
        return <Search size={size} />
    }
  }

  return <div className="process-step-icon">{getIcon()}</div>
}

