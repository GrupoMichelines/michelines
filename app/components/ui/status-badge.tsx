import { cn } from "../../../lib/utils"

type StatusBadgeProps = {
  status: "em_analise" | "aprovado" | "reprovado" | "reanalise"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    em_analise: {
      label: "Em Análise",
      className: "bg-yellow-100 text-yellow-800",
    },
    aprovado: {
      label: "Aprovado",
      className: "bg-green-100 text-green-800",
    },
    reprovado: {
      label: "Reprovado",
      className: "bg-red-100 text-red-800",
    },
    reanalise: {
      label: "Reanálise",
      className: "bg-blue-100 text-blue-800",
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
} 