import { useEffect, useState, useCallback } from 'react'
import { events, holiday, program } from './data/content.js'

// ─── Параметры адреса ───────────────────────────────────────────
const params = new URLSearchParams(window.location.search)
export const isDraft = params.has('draft')

// ─── Даты ───────────────────────────────────────────────────────
export function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function getToday() {
  const override = params.get('today')
  if (override && /^\d{4}-\d{2}-\d{2}$/.test(override)) return parseDate(override)
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']

export function formatDay(iso, { weekday = false } = {}) {
  const d = parseDate(iso)
  const base = `${d.getDate()} ${MONTHS[d.getMonth()]}`
  return weekday ? `${base}, ${WEEKDAYS[d.getDay()]}` : base
}

export function daysBetween(a, b) {
  return Math.round((b - a) / 86400000)
}

export function plural(n, one, few, many) {
  const n10 = n % 10
  const n100 = n % 100
  if (n10 === 1 && n100 !== 11) return one
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few
  return many
}

/**
 * Где участник сейчас.
 * phase: before | active | holiday | after
 * stageId: текущий этап (для маршрута)
 * next: ближайшая встреча (сегодня или позже)
 */
export function getNow(today = getToday()) {
  const start = parseDate(program.start)
  const hFrom = parseDate(holiday.from)
  const hTo = parseDate(holiday.to)
  const next = events.find((e) => parseDate(e.date) >= today) || null
  const isToday = next ? daysBetween(today, parseDate(next.date)) === 0 : false

  if (today < start) {
    return { phase: 'before', stageId: 'org', next, isToday: false, daysLeft: daysBetween(today, start) }
  }
  if (today >= hFrom && today <= hTo) {
    return { phase: 'holiday', stageId: 'holiday', next, isToday: false, daysLeft: daysBetween(today, parseDate(next.date)) }
  }
  if (!next) return { phase: 'after', stageId: null, next: null, isToday: false }
  return { phase: 'active', stageId: next.stage, next, isToday, daysLeft: daysBetween(today, parseDate(next.date)) }
}

// ─── Хранение в браузере (без падений, если хранилище закрыто) ──
export function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? { ...initial, ...JSON.parse(raw) } : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* хранилище недоступно — состояние живёт до перезагрузки */
    }
  }, [key, value])
  return [value, setValue]
}

// ─── Навигация через #: можно дать ссылку прямо на раздел ───────
export const TABS = ['start', 'route', 'workbook', 'bonuses', 'materials']

function readHash() {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [tab, sub] = raw.split('/')
  return { tab: TABS.includes(tab) ? tab : 'start', sub: sub || null }
}

export function useHashRoute() {
  const [route, setRoute] = useState(readHash)
  useEffect(() => {
    const onHash = () => setRoute(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const go = useCallback((tab, sub) => {
    const next = `#/${tab}${sub ? `/${sub}` : ''}`
    if (window.location.hash !== next) window.location.hash = next
    window.scrollTo({ top: 0 })
  }, [])
  return [route, go]
}

// ─── Копирование в буфер ────────────────────────────────────────
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}
