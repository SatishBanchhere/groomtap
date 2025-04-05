import {
  SmileIcon as Tooth,
  Heart,
  Stethoscope,
  Leaf,
  Eye,
  Bone,
  BabyIcon as Kidney,
  Baby,
  Brain,
  Pill,
  Activity,
} from "lucide-react"

type SpecialtyIconProps = {
  specialty: string
  size?: number
}

export default function SpecialtyIcon({ specialty, size = 24 }: SpecialtyIconProps) {
  const getIcon = () => {
    switch (specialty.toLowerCase()) {
      case "dentist":
        return <Tooth size={size} />
      case "cardiologist":
        return <Heart size={size} />
      case "dermatologist":
        return <Stethoscope size={size} />
      case "ayurveda":
        return <Leaf size={size} />
      case "eye care":
        return <Eye size={size} />
      case "orthopedic":
        return <Bone size={size} />
      case "urologist":
        return <Kidney size={size} />
      case "gynecologist":
        return <Baby size={size} />
      case "neurologist":
        return <Brain size={size} />
      case "psychiatrist":
        return <Brain size={size} />
      case "pediatrician":
        return <Baby size={size} />
      case "oncologist":
        return <Activity size={size} />
      default:
        return <Pill size={size} />
    }
  }

  return <div className="specialty-icon">{getIcon()}</div>
}

