import React, { useState } from 'react'
import { program, checklist, roles, rolesNote, agreements, stages, vizitkaTemplate, holiday } from '../data/content.js'
import { getNow, formatDay, plural, useStoredState, copyText } from '../lib.js'
import { Icon, LinkButton, SectionTitle, MaterialRow } from '../components/ui.jsx'

export default function Start({ go }) {
  return (
    <div className="grid gap-8 md:grid-cols-[1.15fr_1fr] md:gap-10">
      <div className="space-y-8">
        <Hero />
        <NowCard go={go} />
        <Checklist go={go} />
      </div>
      <div className="space-y-8">
        <Stats />
        <div className="space-y-2">
          <MaterialRow item={{ type: 'video', title: 'Евгений Дубровин о программе', meta: '1,5 мин', linkKey: 'videoAboutShort' }} />
        </div>
        <Roles />
        <Agreements />
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section>
      <p className="label-caps mb-3">
        {program.name} · {program.flow}
      </p>
      <h1 className="h-display text-[28px] sm:text-[34px]">
        Добро пожаловать <b>в&nbsp;Акселератор</b>
      </h1>
      <p className="mt-3 max-w-xl text-[15.5px] text-fg-2">{program.lead}</p>
      <p className="mt-2 text-[14px] font-semibold text-lime">{program.motto}</p>
    </section>
  )
}

function NowCard({ go }) {
  const now = getNow()
  const stage = stages.find((s) => s.id === now.stageId)

  let eyebrow, title, text, cta
  if (now.phase === 'before') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-lime-line bg-lime-soft px-4 py-3">
        <Icon name="CalendarDays" size={18} className="flex-shrink-0 text-lime" />
        <p className="text-[14px] leading-snug">
          <b className="font-semibold">
            До старта {now.daysLeft} {plural(now.daysLeft, 'день', 'дня', 'дней')}.
          </b>{' '}
          <span className="text-fg-2">Welcome-встреча — {formatDay(program.start, { weekday: true })}.</span>
        </p>
      </div>
    )
  }
  if (now.phase === 'holiday') {
    eyebrow = 'Праздники · встреч нет'
    title = 'Ведёте РНП и P&L сами'
    text = `Следующая встреча — ${formatDay(now.next.date, { weekday: true })}: ${now.next.title.toLowerCase()}.`
    cta = { label: 'Что делать в праздники', onClick: () => go('route', holiday.id) }
  } else if (now.phase === 'after') {
    eyebrow = 'Программа пройдена'
    title = 'Дорожная карта у вас'
    text = 'Все материалы программы остаются в разделе «Материалы».'
    cta = { label: 'Материалы', onClick: () => go('materials') }
  } else {
    eyebrow = `Сейчас · ${stage?.title ?? ''}`
    title = now.next.title
    const when = now.isToday ? 'сегодня' : `через ${now.daysLeft} ${plural(now.daysLeft, 'день', 'дня', 'дней')}`
    text = `${now.next.approx ? '≈ ' : ''}${formatDay(now.next.date, { weekday: true })} · ${when}. Время и ссылка — в чате группы.`
    cta = { label: 'Открыть этап', onClick: () => go('route', now.stageId) }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-lime-line bg-gradient-to-br from-lime/[0.10] via-ink-900 to-ink-900 p-5">
      <p className="label-caps mb-2">{eyebrow}</p>
      <p className="font-display text-[22px] font-semibold leading-tight tracking-tight">{title}</p>
      <p className="mt-2 text-[14px] text-fg-2">{text}</p>
      <div className="mt-4">
        <LinkButton onClick={cta.onClick} variant="secondary" icon="ArrowRight">
          {cta.label}
        </LinkButton>
      </div>
    </section>
  )
}

function Checklist({ go }) {
  const initial = Object.fromEntries(checklist.map((i) => [i.id, false]))
  const [done, setDone] = useStoredState('acc-onboarding-checklist-v1', initial)
  const count = checklist.filter((i) => done[i.id]).length
  const pct = Math.round((count / checklist.length) * 100)
  const toggle = (id) => setDone((p) => ({ ...p, [id]: !p[id] }))
  const allDone = count === checklist.length
  const [expanded, setExpanded] = useState(false)
  const before = getNow().phase === 'before'

  return (
    <section>
      <SectionTitle
        eyebrow={before ? 'Сделайте до старта' : 'Первая неделя'}
        aside={
          <span className="text-[13px] font-semibold text-fg-2">
            {count} из {checklist.length}
          </span>
        }
      >
        Стартовый чек-лист
      </SectionTitle>

      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-ink-800" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-lime transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>

      {allDone && (
        <div className="rise mb-2 flex items-center gap-3 rounded-2xl border border-lime-line bg-lime-soft p-4">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-lime text-ink-950">
            <Icon name="Check" size={18} strokeWidth={2.6} />
          </span>
          <p className="flex-1 text-[14px] font-semibold text-fg">Чек-лист пройден. Дальше — по маршруту.</p>
          <button type="button" onClick={() => setExpanded((v) => !v)} className="focus-ring min-h-[40px] rounded-lg px-2 text-[13px] font-semibold text-lime">
            {expanded ? 'Скрыть' : 'Шаги'}
          </button>
        </div>
      )}

      {(!allDone || expanded) && (
        <ol className="space-y-2">
          {checklist.map((item, i) => (
            <CheckItem key={item.id} item={item} index={i + 1} checked={!!done[item.id]} onToggle={() => toggle(item.id)} go={go} />
          ))}
        </ol>
      )}
      <p className="mt-2 text-[12px] text-fg-3">Отметки сохраняются в этом браузере.</p>
    </section>
  )
}

function CheckItem({ item, index, checked, onToggle, go }) {
  const [showVizitka, setShowVizitka] = useState(false)
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    const ok = await copyText(vizitkaTemplate)
    setCopied(ok)
    if (ok) setTimeout(() => setCopied(false), 2000)
  }

  return (
    <li className={`card transition ${checked ? 'border-transparent bg-ink-900/50' : ''}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onToggle}
        className="focus-ring flex w-full items-start gap-3 rounded-2xl px-3.5 pb-1 pt-3.5 text-left"
      >
        <span
          className={`mt-[-2px] flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border text-[12px] font-bold transition ${
            checked ? 'border-lime bg-lime text-ink-950' : 'border-fg-3/50 text-fg-3'
          }`}
          aria-hidden="true"
        >
          {checked ? <Icon name="Check" size={16} strokeWidth={3} /> : index}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-[15px] font-semibold leading-snug ${checked ? 'text-fg-3 line-through decoration-fg-3/60' : ''}`}>
            {item.title}
          </span>
          {!checked && <span className="mt-1 block text-[13.5px] leading-relaxed text-fg-2">{item.sub}</span>}
          {checked && <span className="sr-only">выполнено</span>}
        </span>
      </button>
      <div className="flex items-start gap-3 px-3.5 pb-3.5">
        <span className="w-7 flex-shrink-0" />
        <div className="min-w-0 flex-1">

          {!checked && (item.action || item.vizitka) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.action?.type === 'link' && (
                <LinkButton linkKey={item.action.linkKey}>{item.action.label}</LinkButton>
              )}
              {item.action?.type === 'tab' && (
                <LinkButton onClick={() => go(item.action.to)} icon="ArrowRight">
                  {item.action.label}
                </LinkButton>
              )}
              {item.vizitka && (
                <LinkButton onClick={() => setShowVizitka((v) => !v)} variant="secondary" icon="ChevronDown">
                  Шаблон визитки
                </LinkButton>
              )}
            </div>
          )}

          {!checked && item.vizitka && showVizitka && (
            <div className="rise mt-3 rounded-xl border border-line bg-ink-850 p-3">
              <pre className="whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed text-fg-2">{vizitkaTemplate}</pre>
              <button
                type="button"
                onClick={onCopy}
                className="focus-ring mt-2 inline-flex min-h-[40px] items-center gap-2 rounded-lg px-2 text-[13px] font-semibold text-lime"
              >
                <Icon name={copied ? 'Check' : 'Copy'} size={15} />
                {copied ? 'Скопировано' : 'Скопировать'}
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

function Stats() {
  return (
    <section>
      <SectionTitle eyebrow="Программа">2 месяца: собираем картину</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {program.stats.map((s) => (
          <div key={s.label} className="card p-4">
            <p className="font-display text-[30px] font-semibold leading-none text-lime">{s.value}</p>
            <p className="mt-2 text-[12.5px] leading-snug text-fg-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Roles() {
  return (
    <section>
      <SectionTitle eyebrow="Кто с вами">Три уровня работы</SectionTitle>
      <div className="space-y-2">
        {roles.map((r) => (
          <div key={r.id} className="card p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-lime-soft text-lime">
                <Icon name={r.icon} size={19} />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold leading-snug">{r.title}</p>
                <p className="text-[12.5px] font-semibold text-lime/90">{r.meta}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-2">{r.text}</p>
                {r.action && (
                  <div className="mt-3">
                    <LinkButton linkKey={r.action.linkKey} variant="secondary">
                      {r.action.label}
                    </LinkButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[12.5px] text-fg-3">{rolesNote}</p>
    </section>
  )
}

function Agreements() {
  return (
    <section>
      <SectionTitle eyebrow="Договорённости">Ритм работы</SectionTitle>
      <div className="card divide-y divide-line">
        {agreements.map((a) => (
          <div key={a.title} className="p-4">
            <p className="text-[14.5px] font-semibold">{a.title}</p>
            <p className="mt-0.5 text-[13.5px] leading-relaxed text-fg-2">{a.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
