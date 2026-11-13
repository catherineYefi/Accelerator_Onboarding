import React, { useState } from 'react'
import { library, team, glossary, faq } from '../data/content.js'
import { Icon, MaterialRow, SectionTitle } from '../components/ui.jsx'

export default function Materials({ go }) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="label-caps mb-3">Всё в одном месте</p>
      <h1 className="h-display text-[26px] sm:text-[32px]">
        Материалы <b>и команда</b>
      </h1>

      <div className="mt-7 space-y-8">
        {library.map((sec) => (
          <section key={sec.title}>
            <SectionTitle>{sec.title}</SectionTitle>
            <div className="grid gap-2 sm:grid-cols-2">
              {sec.items.map((it) => (
                <MaterialRow key={it.title} item={it} onTab={(t) => go(t)} />
              ))}
            </div>
          </section>
        ))}

        <section>
          <SectionTitle eyebrow="Кто стоит за программой">Команда</SectionTitle>
          <div className="grid gap-2 sm:grid-cols-2">
            {team.map((g) => (
              <div key={g.group} className="card p-4">
                <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-wider text-fg-3">{g.group}</p>
                <ul className="space-y-2.5">
                  {g.people.map((p) => (
                    <li key={p.name} className="flex items-start gap-3">
                      <Avatar name={p.name} />
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold leading-snug">{p.name}</p>
                        <p className="text-[12.5px] leading-snug text-fg-2">{p.role}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[12.5px] text-fg-3">Кто ведёт вашу группу — в чате группы.</p>
        </section>

        <section>
          <SectionTitle eyebrow="Словарь">Термины программы</SectionTitle>
          <div className="card divide-y divide-line">
            {glossary.map((g) => (
              <div key={g.term} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-4">
                <p className="text-[14px] font-semibold text-lime">{g.term}</p>
                <p className="text-[13.5px] leading-relaxed text-fg-2">{g.def}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle eyebrow="Вопросы">Частые вопросы</SectionTitle>
          <div className="space-y-2">
            {faq.map((f) => (
              <Faq key={f.q} item={f} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function Avatar({ name }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
  return (
    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line bg-ink-800 text-[12px] font-bold text-fg-2">
      {initials}
    </span>
  )
}

function Faq({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="focus-ring flex w-full items-start gap-3 p-4 text-left">
        <span className="flex-1 text-[14.5px] font-semibold leading-snug">{item.q}</span>
        <Icon name="ChevronDown" size={18} className={`mt-0.5 flex-shrink-0 text-fg-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className="collapse-grid" data-open={open}>
        <div>
          <p className="px-4 pb-4 text-[13.5px] leading-relaxed text-fg-2">{item.a}</p>
        </div>
      </div>
    </div>
  )
}
