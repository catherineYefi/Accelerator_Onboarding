import React from 'react'
import { bonuses, bonusStatus } from '../data/content.js'
import { Icon, LinkButton, Pill } from '../components/ui.jsx'

// Сначала то, чем можно пользоваться сейчас
const ORDER = { available: 0, request: 1, soon: 2 }

export default function Bonuses({ go }) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="label-caps mb-3">При вступлении</p>
      <h1 className="h-display text-[26px] sm:text-[32px]">
        Бонусы <b>в одном месте</b>
      </h1>
      <p className="mt-3 text-[15px] text-fg-2">
        У каждого бонуса — статус: что доступно сейчас, что откроется по ходу программы и что выдаём по запросу.
      </p>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {[...bonuses].sort((a, b) => ORDER[a.status] - ORDER[b.status]).map((b) => {
          const st = bonusStatus[b.status]
          return (
            <div key={b.id} className={`card flex flex-col p-4 ${b.status === 'available' ? 'border-lime-line' : ''}`}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    b.status === 'soon' ? 'bg-ink-800 text-fg-3' : 'bg-lime-soft text-lime'
                  }`}
                >
                  <Icon name={b.icon} size={19} />
                </span>
                <Pill tone={st.tone}>{st.label}</Pill>
              </div>
              <p className="text-[15px] font-semibold leading-snug">{b.title}</p>
              <p className="mt-1 flex-1 text-[13.5px] leading-relaxed text-fg-2">{b.text}</p>
              {b.note && <p className="mt-2 text-[12.5px] text-fg-3">{b.note}</p>}
              {b.action && (
                <div className="mt-3">
                  {b.action.type === 'tab' ? (
                    <LinkButton onClick={() => go(b.action.to)} variant="secondary" icon="ArrowRight">
                      {b.action.label}
                    </LinkButton>
                  ) : (
                    <LinkButton linkKey={b.action.linkKey} variant="secondary">
                      {b.action.label}
                    </LinkButton>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
