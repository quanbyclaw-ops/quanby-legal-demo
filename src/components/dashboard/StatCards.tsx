'use client'

import { AnimatedCounter } from '@/components/ui/animated-counter'

interface StatCard {
  label: string
  value: number
  icon: string
  change: string
  changePositive: boolean
  bgClass: string
  iconBg: string
  href: string
}

interface StatCardsProps {
  cards: StatCard[]
}

export function StatCards({ cards }: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((stat) => (
        <a
          key={stat.label}
          href={stat.href}
          className={`block rounded-xl border border-gray-100 p-4 ${stat.bgClass} transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer dark:border-slate-700 dark:bg-slate-800`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center text-xl dark:bg-slate-700`}>
              {stat.icon}
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                stat.changePositive
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {stat.change}
            </span>
          </div>
          <p className="text-2xl font-bold text-navy-950 dark:text-slate-100">
            <AnimatedCounter target={stat.value} />
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
        </a>
      ))}
    </div>
  )
}
