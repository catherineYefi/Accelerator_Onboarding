import React from 'react'
import {
  ArrowRight, ArrowUpRight, BookOpen, Calculator, CalendarDays, Check, ChevronDown, Circle, ClipboardList,
  Compass, Copy, FileSpreadsheet, FileText, Flag, Gift, HeartHandshake, Home, KeyRound, LayoutGrid, Lock,
  MessageCircle, Play, Route, Snowflake, Sparkles, Users, X,
} from 'lucide-react'
import { links } from '../data/content.js'
import { isDraft } from '../lib.js'

// Явный список иконок — чтобы в сборку не попала вся библиотека
const Icons = {
  ArrowRight, ArrowUpRight, BookOpen, Calculator, CalendarDays, Check, ChevronDown, Circle, ClipboardList,
  Compass, Copy, FileSpreadsheet, FileText, Flag, Gift, HeartHandshake, Home, KeyRound, LayoutGrid, Lock,
  MessageCircle, Play, Route, Snowflake, Sparkles, Users, X,
}

export function Icon({ name, size = 18, className = '', strokeWidth = 1.8 }) {
  const Cmp = Icons[name] || Icons.Circle
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />
}

export function SectionTitle({ eyebrow, children, aside }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="label-caps mb-1.5">{eyebrow}</p>}
        <h2 className="font-display text-[17px] font-semibold leading-snug tracking-tight">{children}</h2>
      </div>
      {aside}
    </div>
  )
}

/** Кнопка-ссылка. Нет ссылки → спокойное «Скоро», в черновике подсвечено. */
export function LinkButton({ linkKey, href, onClick, children, variant = 'primary', icon = 'ArrowUpRight', full = false }) {
  const url = href ?? (linkKey ? links[linkKey] : null)
  const base = `focus-ring inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 text-[14px] font-semibold transition ${full ? 'w-full' : ''}`
  const styles = {
    primary: 'bg-lime text-ink-950 hover:brightness-95 active:brightness-90',
    secondary: 'bg-ink-800 text-fg hover:bg-ink-700 border border-line',
    ghost: 'text-fg-2 hover:text-fg',
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} ${styles[variant]}`}>
        {children}
        {icon && <Icon name={icon} size={16} />}
      </button>
    )
  }

  if (!url) {
    return (
      <span
        className={`${base} cursor-default border text-fg-3 ${
          isDraft ? 'border-dashed border-warn/70 bg-warn/5' : 'border-line bg-transparent'
        }`}
        title="Ссылка скоро появится"
      >
        {children}
        <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${isDraft ? 'bg-warn/20 text-warn' : 'bg-ink-800 text-fg-3'}`}>
          {isDraft ? 'нет ссылки' : 'скоро'}
        </span>
      </span>
    )
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`${base} ${styles[variant]}`}>
      {children}
      {icon && <Icon name={icon} size={16} />}
    </a>
  )
}

const TYPE_META = {
  video: { icon: 'Play', label: 'Видео' },
  template: { icon: 'FileSpreadsheet', label: 'Шаблон' },
  doc: { icon: 'FileText', label: 'Документ' },
}

/** Строка материала: видео, шаблон, документ. */
export function MaterialRow({ item, onTab }) {
  const meta = TYPE_META[item.type] || TYPE_META.doc
  const url = item.linkKey ? links[item.linkKey] : null
  const isTab = Boolean(item.tab)
  const available = isTab || Boolean(url)

  const inner = (
    <>
      <span
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
          available ? 'bg-lime-soft text-lime' : 'bg-ink-800 text-fg-3'
        }`}
      >
        <Icon name={meta.icon} size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold leading-snug">{item.title}</span>
        <span className="block text-[12.5px] text-fg-3">
          {meta.label}
          {item.meta ? ` · ${item.meta}` : ''}
          {item.hint ? ` · ${item.hint}` : ''}
        </span>
      </span>
      {available ? (
        <Icon name={isTab ? 'ArrowRight' : 'ArrowUpRight'} size={18} className="text-fg-3" />
      ) : (
        <span
          className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
            isDraft ? 'bg-warn/20 text-warn' : 'bg-ink-800 text-fg-3'
          }`}
        >
          {isDraft ? 'нет ссылки' : 'скоро'}
        </span>
      )}
    </>
  )

  const cls = `focus-ring flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
    available ? 'border-line bg-ink-850 hover:border-lime-line' : isDraft ? 'border-dashed border-warn/50 bg-ink-850' : 'border-line bg-ink-850'
  }`

  if (isTab) {
    return (
      <button type="button" className={cls} onClick={() => onTab?.(item.tab)}>
        {inner}
      </button>
    )
  }
  if (url) {
    return (
      <a className={cls} href={url} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }
  return <div className={cls}>{inner}</div>
}

export function Pill({ children, tone = 'muted' }) {
  const tones = {
    lime: 'bg-lime text-ink-950',
    soft: 'bg-lime-soft text-lime',
    muted: 'bg-ink-800 text-fg-2',
    outline: 'border border-lime-line text-lime',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}
