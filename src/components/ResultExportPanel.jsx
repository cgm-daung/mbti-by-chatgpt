/**
 * PNG ဒေါင်းလုဒ်အတွက်သာ — မြန်မာဖောင့် နှင့် ရိုးရှင်းသော ဖွဲ့စည်းပုံ
 */
function splitBullets(text) {
  if (!text?.trim()) return []
  return text
    .split('၊')
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function ResultExportPanel({
  type,
  match,
  confidence,
  fnBreakdown,
  summary,
  strengthsText,
  weaknessesText,
  careersText,
  dominantLabel,
  auxiliaryLabel,
}) {
  const strengths = splitBullets(strengthsText)
  const weaknesses = splitBullets(weaknessesText)
  const careers = splitBullets(careersText)
  const max = Math.max(...fnBreakdown.map((r) => r.score), 1e-9)

  return (
    <div
      className="font-sans bg-white p-10 text-ink-900"
      style={{ width: 720, boxSizing: 'border-box' }}
    >
      <h1
        style={{
          fontSize: 42,
          fontWeight: 600,
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
        }}
      >
        {type}
      </h1>
      <p style={{ margin: '0 0 24px', fontSize: 14, color: '#71717a' }}>
        ကိုက်ညီမှု {match}% · ယုံကြည်စိတ်ချရမှု {confidence}%
      </p>
      <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: '#52525b' }}>
        ဒိုမီနန့် / အက်စ်
      </p>
      <p style={{ margin: '0 0 20px', fontSize: 15, lineHeight: 1.6 }}>
        {dominantLabel} · {auxiliaryLabel}
      </p>
      <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: '#52525b' }}>
        ကိုဂ်နီတီဗ် ဖန်ရှင်ရှင်း
      </p>
      <div style={{ marginBottom: 24 }}>
        {fnBreakdown.map((row) => {
          const w = Math.round((row.score / max) * 100)
          return (
            <div key={row.key} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                <span>{row.key}</span>
                <span style={{ color: '#71717a' }}>{row.pct}%</span>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: '#e4e4e7',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${w}%`,
                    height: '100%',
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: '#52525b' }}>
        အကျဉ်းချုပ်
      </p>
      <p style={{ margin: '0 0 20px', fontSize: 15, lineHeight: 1.75 }}>{summary}</p>
      <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600 }}>အားသာချက်များ</p>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.65 }}>
            {strengths.map((s) => (
              <li key={s} style={{ marginBottom: 4 }}>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600 }}>အားနည်းချက်များ</p>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.65 }}>
            {weaknesses.map((s) => (
              <li key={s} style={{ marginBottom: 4 }}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: '#52525b' }}>
        အလုပ်အကိုင် အကြံပြုချက်များ
      </p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.65 }}>
        {careers.map((s) => (
          <li key={s} style={{ marginBottom: 4 }}>
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
