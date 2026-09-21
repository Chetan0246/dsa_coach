import PageHeader from '../components/common/PageHeader'
import CodeBlock from '../components/common/CodeBlock'
import { TOOLKIT_SECTIONS } from '../data/toolkit'

export default function JavaToolkit() {
  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-8">
      <PageHeader
        title="Java Toolkit"
        subtitle="The minimum Java you need for 90% of problems. Learn the tool when the pattern asks for it."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {TOOLKIT_SECTIONS.map((s) => (
          <section key={s.id} className="card p-4">
            <h2 className="font-semibold">{s.title}</h2>
            {s.note && <p className="mt-0.5 text-xs text-mute-dark">{s.note}</p>}
            <div className="mt-3 space-y-2">
              {s.snippets.map((sn, i) => (
                <div key={i}>
                  {sn.label && <div className="mb-1 text-xs text-mute-dark">{sn.label}</div>}
                  <CodeBlock code={sn.code} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
