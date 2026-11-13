import React, { useState } from 'react'
import { program, draftTodos, links } from './data/content.js'
import { useHashRoute, isDraft } from './lib.js'
import { Icon } from './components/ui.jsx'
import Start from './screens/Start.jsx'
import RouteScreen from './screens/Route.jsx'
import Workbook from './screens/Workbook.jsx'
import Bonuses from './screens/Bonuses.jsx'
import Materials from './screens/Materials.jsx'

const NAV = [
  { id: 'start', label: 'Старт', icon: 'Home' },
  { id: 'route', label: 'Маршрут', icon: 'Route' },
  { id: 'workbook', label: 'Воркбук', icon: 'ClipboardList' },
  { id: 'bonuses', label: 'Бонусы', icon: 'Gift' },
  { id: 'materials', label: 'Материалы', icon: 'LayoutGrid' },
]

export default function App() {
  const [route, go] = useHashRoute()

  const screen = {
    start: <Start go={go} />,
    route: <RouteScreen go={go} focus={route.sub} />,
    workbook: <Workbook go={go} />,
    bonuses: <Bonuses go={go} />,
    materials: <Materials go={go} />,
  }[route.tab]

  return (
    <div className="bg-glow min-h-[100dvh]">
      {/* Шапка */}
      <header className="sticky top-0 z-30 border-b border-line bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 md:px-6">
          <button type="button" onClick={() => go('start')} className="focus-ring flex items-center gap-2.5 rounded-lg">
            <Logo />
            <span className="text-left leading-tight">
              <span className="block font-display text-[13px] font-semibold tracking-tight">{program.name}</span>
              <span className="block text-[11px] text-fg-3">{program.flow}</span>
            </span>
          </button>

          {links.manager && (
            <a
              href={links.manager}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring order-last inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] font-semibold text-fg-2 hover:text-fg md:order-none"
            >
              <Icon name="MessageCircle" size={16} />
              Вопрос
            </a>
          )}

          {/* Навигация на широком экране */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Разделы">
            {NAV.map((n) => {
              const active = route.tab === n.id
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => go(n.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`focus-ring rounded-lg px-3 py-2 text-[13.5px] font-semibold transition ${
                    active ? 'bg-ink-800 text-fg' : 'text-fg-3 hover:text-fg'
                  }`}
                >
                  {n.label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 md:px-6 md:pb-16 md:pt-10">
        <div key={route.tab} className="rise">
          {screen}
        </div>
      </main>

      {/* Навигация на телефоне — внизу, под большой палец */}
      <nav
        className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink-950/90 backdrop-blur-xl md:hidden"
        aria-label="Разделы"
      >
        <div className="mx-auto grid max-w-md grid-cols-5">
          {NAV.map((n) => {
            const active = route.tab === n.id
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => go(n.id)}
                aria-current={active ? 'page' : undefined}
                className="focus-ring flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-lg"
              >
                <span
                  className={`flex h-7 w-12 items-center justify-center rounded-full transition ${
                    active ? 'bg-lime-soft text-lime' : 'text-fg-3'
                  }`}
                >
                  <Icon name={n.icon} size={19} strokeWidth={active ? 2.1 : 1.8} />
                </span>
                <span className={`text-[10.5px] font-semibold ${active ? 'text-fg' : 'text-fg-3'}`}>{n.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {isDraft && <DraftPanel />}
    </div>
  )
}

function Logo() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-lime-line bg-lime-soft">
      <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
        <path d="M6 24 L13 15 L18 19 L26 8" stroke="#e6f27c" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

/** Панель черновика: видна только по адресу с ?draft. Показывает, чего не хватает. */
function DraftPanel() {
  const [open, setOpen] = useState(false)
  const groups = draftTodos.reduce((acc, t) => {
    ;(acc[t.where] ||= []).push(t.text)
    return acc
  }, {})

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring fixed bottom-[86px] right-4 z-40 rounded-full border border-warn/60 bg-ink-900 px-3.5 py-2 text-[12.5px] font-semibold text-warn shadow-lg md:bottom-6"
      >
        Черновик · {draftTodos.length}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 md:items-center" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-label="Чего не хватает"
            className="rise max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-line bg-ink-900 p-5 md:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="label-caps !text-warn">Режим черновика</p>
                <h2 className="font-display text-[17px] font-semibold">Что ещё нужно получить</h2>
                <p className="mt-1 text-[13px] text-fg-3">Участники этой панели не видят.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="focus-ring rounded-lg p-2 text-fg-3" aria-label="Закрыть">
                <Icon name="X" size={18} />
              </button>
            </div>
            {Object.entries(groups).map(([where, items]) => (
              <div key={where} className="mb-4">
                <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wider text-fg-3">{where}</p>
                <ul className="space-y-1.5">
                  {items.map((t) => (
                    <li key={t} className="flex gap-2 text-[13.5px] text-fg-2">
                      <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-warn" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
