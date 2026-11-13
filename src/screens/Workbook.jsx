import React from 'react'
import { workbook } from '../data/content.js'
import { isDraft } from '../lib.js'
import { Icon, LinkButton } from '../components/ui.jsx'

export default function Workbook({ go }) {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="label-caps mb-3">Шаг 3 стартового чек-листа</p>
      <h1 className="h-display text-[26px] sm:text-[32px]">
        Воркбук: <b>с чего начинаем</b>
      </h1>
      <p className="mt-3 text-[15px] text-fg-2">{workbook.lead}</p>

      {workbook.deadline || workbook.submit || isDraft ? (
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Meta icon="CalendarDays" label="Срок" value={workbook.deadline} />
          <Meta icon="ArrowUpRight" label="Куда отправить" value={workbook.submit} />
        </div>
      ) : (
        <p className="mt-5 flex items-center gap-2 text-[13.5px] text-fg-3">
          <Icon name="CalendarDays" size={16} className="text-lime" />
          Срок и способ сдачи сообщим в чате группы.
        </p>
      )}

      <div className="mt-4">
        <LinkButton linkKey="workbook" full>
          Открыть воркбук
        </LinkButton>
      </div>

      <h2 className="mt-9 font-display text-[17px] font-semibold">Что внутри</h2>
      <ol className="mt-3 space-y-2">
        {workbook.blocks.map((b, i) => (
          <li key={b.title} className="card flex gap-3.5 p-4">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-ink-800 text-[13px] font-bold text-lime">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold">{b.title}</p>
              <p className="mt-0.5 text-[13.5px] leading-relaxed text-fg-2">{b.text}</p>
              {b.chips && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {b.chips.map((c) => (
                    <span key={c} className="rounded-lg border border-line bg-ink-850 px-2.5 py-1 text-[12.5px] font-medium text-fg-2">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 rounded-2xl border border-lime-line bg-lime-soft p-4">
        <p className="text-[15px] font-semibold">{workbook.noNumbers.title}</p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-fg-2">{workbook.noNumbers.text}</p>
      </div>

      <div className="mt-4 flex gap-3 rounded-2xl border border-line p-4">
        <Icon name="Lock" size={18} className="mt-0.5 flex-shrink-0 text-fg-3" />
        <p className="text-[13.5px] leading-relaxed text-fg-2">
          Цифры бизнеса — после подписания NDA. Это первый шаг чек-листа.
        </p>
      </div>

      <div className="mt-4 flex gap-3 rounded-2xl border border-line p-4">
        <Icon name="FileSpreadsheet" size={18} className="mt-0.5 flex-shrink-0 text-fg-3" />
        <div>
          <p className="text-[13.5px] leading-relaxed text-fg-2">{workbook.templatesNote}</p>
          <button type="button" onClick={() => go('route')} className="focus-ring mt-2 inline-flex min-h-[40px] items-center gap-1.5 rounded-lg text-[13.5px] font-semibold text-lime">
            Открыть маршрут <Icon name="ArrowRight" size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

function Meta({ icon, label, value }) {
  const missing = !value
  return (
    <div className={`card flex items-center gap-3 p-3.5 ${missing && isDraft ? 'border-dashed border-warn/60' : ''}`}>
      <Icon name={icon} size={18} className="flex-shrink-0 text-lime" />
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-fg-3">{label}</p>
        <p className={`text-[14px] font-semibold ${missing ? 'text-fg-3' : ''}`}>
          {value || (isDraft ? 'не задано' : 'сообщим в чате группы')}
        </p>
      </div>
    </div>
  )
}
