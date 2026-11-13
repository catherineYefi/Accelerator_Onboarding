import React, { useEffect, useRef, useState } from 'react'
import { stages, events, holiday, program, templateNote } from '../data/content.js'
import { getNow, formatDay } from '../lib.js'
import { Icon, LinkButton, MaterialRow, Pill } from '../components/ui.jsx'

const ORDER = ['org', 'rnp', 'pl', 'decomp', 'holiday', 'finplan', 'finmodel', 'ss', 'final']

export default function RouteScreen({ go, focus }) {
  const now = getNow()
  const currentIdx = now.phase === 'after' ? ORDER.length : ORDER.indexOf(now.stageId)
  const [open, setOpen] = useState(() => new Set([focus || now.stageId].filter(Boolean)))
  const refs = useRef({})

  useEffect(() => {
    if (!focus) return
    setOpen((prev) => new Set(prev).add(focus))
    const el = refs.current[focus]
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }, [focus])

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const items = ORDER.map((id) => (id === 'holiday' ? { ...holiday, isHoliday: true } : stages.find((s) => s.id === id)))

  return (
    <div className="mx-auto max-w-2xl">
      <p className="label-caps mb-3">Маршрут · 17 ноября — 2 февраля</p>
      <h1 className="h-display text-[26px] sm:text-[32px]">
        От цифр <b>к дорожной карте</b>
      </h1>
      <p className="mt-3 text-[15px] text-fg-2">
        Каждую неделю — встреча с трекером, между встречами вы с командой и бизнес-инженером собираете очередной документ.
      </p>
      <p className="mt-2 text-[13px] text-fg-3">{program.scheduleNote}</p>

      <ol className="relative mt-7">
        {items.map((item, i) => {
          const status = i < currentIdx ? 'done' : i === currentIdx ? 'current' : 'next'
          const isLast = i === items.length - 1
          return (
            <li
              key={item.id}
              ref={(el) => (refs.current[item.id] = el)}
              className="relative flex scroll-mt-24 gap-3.5"
            >
              {/* Линия и точка */}
              <div className="flex flex-col items-center">
                <Dot status={status} holidayStep={item.isHoliday} />
                {!isLast && <span className={`w-px flex-1 ${status === 'done' ? 'bg-lime/40' : 'bg-line'}`} />}
              </div>

              <div className="min-w-0 flex-1 pb-4">
                {item.isHoliday ? (
                  <HolidayCard item={item} status={status} />
                ) : (
                  <StageCard
                    stage={item}
                    status={status}
                    open={open.has(item.id)}
                    onToggle={() => toggle(item.id)}
                    go={go}
                  />
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Dot({ status, holidayStep }) {
  if (status === 'done')
    return (
      <span className="mt-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-lime/90 text-ink-950">
        <Icon name="Check" size={14} strokeWidth={3} />
      </span>
    )
  if (status === 'current')
    return (
      <span className="relative mt-4 flex h-6 w-6 flex-shrink-0 items-center justify-center">
        <span className="h-3.5 w-3.5 rounded-full bg-lime ring-4 ring-lime/20" />
      </span>
    )
  return (
    <span className="mt-4 flex h-6 w-6 flex-shrink-0 items-center justify-center">
      <span className={`h-2.5 w-2.5 rounded-full ${holidayStep ? 'bg-fg-3/50' : 'border-2 border-fg-3/60'}`} />
    </span>
  )
}

function StageCard({ stage, status, open, onToggle, go }) {
  const stageEvents = events.filter((e) => e.stage === stage.id)
  const hasTemplates = stage.materials?.some((m) => m.type === 'template')
  const panelId = `stage-${stage.id}`

  return (
    <div
      className={`card overflow-hidden transition ${
        status === 'current' ? 'border-lime-line bg-gradient-to-br from-lime/[0.07] to-ink-900' : ''
      } ${status === 'done' && !open ? 'opacity-70' : ''}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="focus-ring flex w-full items-start gap-3 p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-[12.5px] font-semibold text-fg-3">{stage.dates}</span>
            {status === 'current' && <Pill tone="lime">Сейчас</Pill>}
          </div>
          <p className="font-display text-[16.5px] font-semibold leading-snug tracking-tight">{stage.title}</p>
          <p className="mt-1 text-[13.5px] text-fg-2">{stage.summary}</p>
        </div>
        <Icon
          name="ChevronDown"
          size={20}
          className={`mt-1 flex-shrink-0 text-fg-3 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div className="collapse-grid" data-open={open} id={panelId} {...(!open && { inert: '' })}>
        <div>
          <div className="space-y-4 border-t border-line px-4 pb-4 pt-4">
            {stageEvents.length > 0 && (
              <Block title="Встречи с трекером">
                <ul className="space-y-1.5">
                  {stageEvents.map((e) => (
                    <li key={e.date} className="flex gap-3 text-[14px]">
                      <span className="w-[92px] flex-shrink-0 font-semibold text-lime/90">
                        {e.approx ? '≈ ' : ''}
                        {formatDay(e.date)}
                      </span>
                      <span className="text-fg">{e.title}</span>
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {stage.bi?.length > 0 && (
              <Block title="Собираете с бизнес-инженером">
                <ul className="space-y-1">
                  {stage.bi.map((b) => (
                    <li key={b} className="flex gap-2 text-[14px] text-fg-2">
                      <span className="mt-[9px] h-1 w-1 flex-shrink-0 rounded-full bg-fg-3" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {stage.todo?.length > 0 && (
              <Block title="Что сделать">
                <ul className="space-y-1">
                  {stage.todo.map((t) => (
                    <li key={t} className="flex gap-2 text-[14px] text-fg-2">
                      <span className="mt-[9px] h-1 w-1 flex-shrink-0 rounded-full bg-fg-3" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {stage.agenda && (
              <Block title="Как проходит">
                <div className="grid gap-2 sm:grid-cols-2">
                  {stage.agenda.map((a) => (
                    <div key={a.title} className="rounded-xl bg-ink-850 p-3">
                      <p className="text-[14px] font-semibold">{a.title}</p>
                      <p className="text-[13px] text-fg-2">{a.text}</p>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {stage.artifact && (
              <div className="flex items-start gap-3 rounded-xl border border-lime-line bg-lime-soft p-3">
                <Icon name="Flag" size={18} className="mt-0.5 flex-shrink-0 text-lime" />
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-lime">Что получится</p>
                  <p className="text-[14.5px] font-semibold">{stage.artifact.title}</p>
                  <p className="text-[13.5px] text-fg-2">{stage.artifact.text}</p>
                </div>
              </div>
            )}

            {stage.materials?.length > 0 && (
              <Block title="Материалы">
                <div className="space-y-2">
                  {stage.materials.map((m) => (
                    <MaterialRow key={m.title} item={m} onTab={(t) => go(t)} />
                  ))}
                </div>
                {hasTemplates && <p className="mt-2 text-[12.5px] leading-relaxed text-fg-3">{templateNote}</p>}
              </Block>
            )}

            {stage.note && <p className="text-[13.5px] text-fg-2">{stage.note}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

function HolidayCard({ item, status }) {
  return (
    <div className={`rounded-2xl border border-dashed p-4 ${status === 'current' ? 'border-lime-line bg-lime-soft' : 'border-line'}`}>
      <div className="flex items-start gap-3">
        <Icon name="Snowflake" size={18} className="mt-0.5 flex-shrink-0 text-fg-3" />
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex flex-wrap items-center gap-2">
            <span className="text-[12.5px] font-semibold text-fg-3">
              {formatDay(item.from)} — {formatDay(item.to)}
            </span>
            {status === 'current' && <Pill tone="lime">Сейчас</Pill>}
          </div>
          <p className="text-[15px] font-semibold">{item.title}</p>
          <p className="text-[13.5px] text-fg-2">{item.text}</p>
          <div className="mt-3">
            <LinkButton linkKey={item.linkKey} variant="secondary">
              {item.linkLabel}
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function Block({ title, children }) {
  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-fg-3">{title}</p>
      {children}
    </div>
  )
}
