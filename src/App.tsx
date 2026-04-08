import React, { useState, useEffect } from 'react'

// ─── Styles ──────────────────────────────────────────────────────────────────

const globalStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #FAFBFE;
    color: #1A1A2E;
    -webkit-font-smoothing: antialiased;
  }
  .font-serif { font-family: 'Playfair Display', Georgia, serif; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-in { animation: fadeIn 0.6s ease-out forwards; }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  .gold-shimmer {
    background: linear-gradient(90deg, #C5A572 0%, #E8D5B0 25%, #C5A572 50%, #E8D5B0 75%, #C5A572 100%);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .grid-kpi { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  @media (max-width: 640px) {
    .grid-2 { grid-template-columns: 1fr; }
    .grid-kpi { grid-template-columns: repeat(2, 1fr); }
  }
`

// ─── Questions Definition ────────────────────────────────────────────────────

type Question = {
  id: string; block: number; label: string;
  type: 'select' | 'multiselect' | 'text'; options?: string[];
  placeholder?: string; required?: boolean;
}

const QUESTIONS: Question[] = [
  { id: 'cargo', block: 1, label: 'Qual seu cargo atual?', type: 'select', required: true,
    options: ['C-Level / Diretor(a)', 'Gerente / Head', 'Coordenador(a) / Supervisor(a)', 'Consultor(a) / Especialista', 'Empreendedor(a)', 'Profissional de RH / T&D', 'Outro'] },
  { id: 'setor', block: 1, label: 'Em qual setor voce atua?', type: 'select', required: true,
    options: ['Tecnologia', 'Educacao', 'Saude', 'Industria', 'Servicos / Consultoria', 'Varejo / Comercio', 'Financeiro', 'Outro'] },
  { id: 'equipe', block: 1, label: 'Quantas pessoas voce lidera (direta ou indiretamente)?', type: 'select', required: true,
    options: ['Nenhuma (contribuidor individual)', '1 a 5', '6 a 20', '21 a 50', '51 a 200', 'Mais de 200'] },
  { id: 'experiencia', block: 1, label: 'Ha quanto tempo exerce cargo de lideranca?', type: 'select',
    options: ['Menos de 1 ano', '1 a 3 anos', '4 a 10 anos', 'Mais de 10 anos'] },
  { id: 'desafio', block: 2, label: 'Qual o MAIOR desafio que voce enfrenta como lider hoje?', type: 'select', required: true,
    options: ['Engajar e reter talentos', 'Integrar IA na operacao sem perder o lado humano', 'Produtividade do time (fazer mais com menos)', 'Tomar decisoes estrategicas com dados', 'Desenvolver novas competencias de lideranca', 'Escalar processos mantendo qualidade', 'Outro'] },
  { id: 'tentou', block: 2, label: 'O que voce ja tentou para resolver esse desafio?', type: 'text', placeholder: 'Cursos, mentorias, consultorias, mudancas internas...' },
  { id: 'frustacao', block: 2, label: 'O que mais te frustra nas solucoes que existem no mercado?', type: 'select',
    options: ['Muito teoricas, pouca aplicacao pratica', 'Focam em ferramentas, nao em lideranca', 'Nao consideram a realidade do lider brasileiro', 'Caras demais para o que entregam', 'Genericas — nao falam com meu contexto', 'Nenhuma frustracao, nao busquei solucoes ainda'] },
  { id: 'fluencia_ia', block: 3, label: 'Como voce classifica sua fluencia em IA?', type: 'select', required: true,
    options: ['Iniciante — uso ChatGPT ocasionalmente', 'Intermediario — uso IA no dia a dia para tarefas', 'Avancado — integrei IA em processos do time', 'Expert — construo solucoes com IA para o negocio'] },
  { id: 'ia_gestao', block: 3, label: 'Voce usa IA para apoiar sua gestao de pessoas?', type: 'select',
    options: ['Nao uso nada', 'Uso para tarefas pessoais, mas nao na gestao do time', 'Meu time usa, mas sem direcionamento meu', 'Sim, tenho processos com IA integrados na operacao'] },
  { id: 'barreira_ia', block: 3, label: 'O que falta para voce integrar IA de verdade na sua lideranca?', type: 'multiselect',
    options: ['Conhecimento tecnico', 'Metodo pratico (passo a passo)', 'Tempo para implementar', 'Apoio da empresa', 'Confianca de que funciona', 'Exemplos reais de quem ja fez'] },
  { id: 'investiu', block: 4, label: 'Ja investiu em formacao de lideranca nos ultimos 12 meses?', type: 'select',
    options: ['Nao', 'Sim, ate R$ 500', 'Sim, entre R$ 500 e R$ 2.000', 'Sim, entre R$ 2.000 e R$ 5.000', 'Sim, mais de R$ 5.000'] },
  { id: 'formato', block: 4, label: 'Qual formato de aprendizado funciona melhor pra voce?', type: 'multiselect',
    options: ['Imersao online intensiva (1-2 dias)', 'Formacao online com modulos semanais', 'Mentoria individual', 'Workshop presencial', 'Comunidade + conteudo continuo'] },
  { id: 'decisor', block: 4, label: 'Quem decide sobre investir em formacao na sua empresa?', type: 'select',
    options: ['Eu mesmo(a)', 'Meu gestor direto', 'RH / T&D', 'Diretoria / C-Level', 'Nao tenho orcamento para isso'] },
  { id: 'mensagem', block: 4, label: 'Se pudesse dizer uma coisa para quem esta construindo uma formacao de lideranca na era da IA, o que diria?', type: 'text', placeholder: 'Sua opiniao sincera aqui...' },
]

const BLOCK_TITLES = ['', 'Seu Perfil', 'Desafios & Dores', 'Voce e a IA', 'Investimento & Formato']
const BLOCK_SUBTITLES = ['', 'Queremos entender quem voce e como lider', 'O que tira seu sono hoje', 'Como a IA entra (ou nao) na sua lideranca', 'Como voce investe no seu desenvolvimento']

// ─── Survey Components ───────────────────────────────────────────────────────

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 640, textAlign: 'center' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 999, background: 'linear-gradient(135deg, #C5A572 0%, #E8D5B0 100%)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>PulsarH.ai</div>
        </div>
        <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#1A1A2E', lineHeight: 1.15, marginBottom: '1.5rem' }}>
          A 1a Revolucao da IA<br /><span style={{ color: '#9CA3AF' }}>ja passou.</span>
        </h1>
        <h2 className="font-serif gold-shimmer" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '2rem' }}>
          A 2a esta acontecendo agora.<br />E quero a sua opiniao.
        </h2>
        <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 2.5rem' }}>
          Estou ouvindo lideres que admiro para entender como a inteligencia artificial
          esta mudando a forma de liderar — e o que falta no mercado para preparar
          quem lidera gente <strong style={{ color: '#1A1A2E' }}>e</strong> tecnologia.
        </p>
        <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: '2.5rem' }}>
          Sao <strong style={{ color: '#6B7280' }}>14 perguntas</strong> · Leva cerca de <strong style={{ color: '#6B7280' }}>3 minutos</strong> · Suas respostas sao confidenciais
        </p>
        <button onClick={onStart} style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '16px 40px', borderRadius: 14,
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2A2A4E 100%)',
          color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '0.02em',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(26,26,46,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
          transition: 'all 0.3s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(26,26,46,0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,26,46,0.25)'; }}
        >
          Quero Participar
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}><strong style={{ color: '#6B7280' }}>Rodrigo Braga</strong> · Fundador PulsarH.ai</p>
          <p style={{ fontSize: 11, color: '#C5A572', marginTop: 4, fontWeight: 600 }}>21 anos de lideranca · ex-C&A · 4.500 pessoas lideradas</p>
        </div>
      </div>
    </div>
  )
}

function ThankYouScreen() {
  return (
    <div className="animate-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 540, textAlign: 'center' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C5A572" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1.5rem' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <h1 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: '#1A1A2E', marginBottom: '1rem' }}>Obrigado pela sua visao.</h1>
        <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.7, maxWidth: 440, margin: '0 auto 2rem' }}>
          Suas respostas vao ajudar a construir algo que realmente faz sentido
          para quem lidera gente e tecnologia na mesma operacao.
        </p>
        <div style={{ padding: '20px 24px', borderRadius: 16, background: '#fff', border: '1px solid #E5E7EB', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize: 14, color: '#C5A572', fontWeight: 600, marginBottom: 4 }}>PulsarH.ai</p>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>A 2a Revolucao da lideranca comeca com quem ouve antes de falar.</p>
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, background: '#FAFBFE', padding: '16px 0 8px', borderBottom: '1px solid #f0f0f5' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{BLOCK_TITLES[QUESTIONS[current - 1]?.block] || ''}</span>
          <span style={{ fontSize: 11, color: '#C5A572', fontWeight: 700 }}>{current}/{total}</span>
        </div>
        <div style={{ height: 4, borderRadius: 4, background: '#E5E7EB' }}>
          <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #C5A572, #E8D5B0)', width: `${pct}%`, transition: 'width 0.5s ease' }} />
        </div>
      </div>
    </div>
  )
}

function QuestionView({ question, value, onChange, onNext, onBack, isFirst, isLast }: {
  question: Question; value: any; onChange: (v: any) => void;
  onNext: () => void; onBack: () => void; isFirst: boolean; isLast: boolean;
}) {
  const canProceed = !question.required || (question.type === 'multiselect' ? (value as string[])?.length > 0 : !!value)

  return (
    <div className="animate-in" key={question.id} style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 8 }}>{BLOCK_SUBTITLES[question.block]}</p>
      <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 700, color: '#1A1A2E', marginBottom: '2rem', lineHeight: 1.3 }}>{question.label}</h2>

      {question.type === 'select' && question.options && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {question.options.map(opt => (
            <button key={opt} onClick={() => onChange(opt)} style={{
              padding: '14px 20px', borderRadius: 12, textAlign: 'left' as const, fontSize: 14,
              fontWeight: value === opt ? 600 : 400,
              background: value === opt ? '#1A1A2E' : '#fff',
              color: value === opt ? '#fff' : '#4B5563',
              border: `1.5px solid ${value === opt ? '#1A1A2E' : '#E5E7EB'}`,
              cursor: 'pointer', transition: 'all 0.2s ease',
              boxShadow: value === opt ? '0 4px 16px rgba(26,26,46,0.2)' : '0 1px 4px rgba(0,0,0,0.04)',
            }}>{opt}</button>
          ))}
        </div>
      )}

      {question.type === 'multiselect' && question.options && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>Selecione todas que se aplicam</p>
          {question.options.map(opt => {
            const selected = (value as string[] || []).includes(opt)
            return (
              <button key={opt} onClick={() => {
                const arr = (value as string[] || [])
                onChange(selected ? arr.filter((v: string) => v !== opt) : [...arr, opt])
              }} style={{
                padding: '14px 20px', borderRadius: 12, textAlign: 'left' as const, fontSize: 14,
                fontWeight: selected ? 600 : 400,
                background: selected ? '#F0EADF' : '#fff',
                color: selected ? '#8B6914' : '#4B5563',
                border: `1.5px solid ${selected ? '#C5A572' : '#E5E7EB'}`,
                cursor: 'pointer', transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 6, border: `2px solid ${selected ? '#C5A572' : '#D1D5DB'}`,
                  background: selected ? '#C5A572' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease', flexShrink: 0,
                }}>
                  {selected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </span>
                {opt}
              </button>
            )
          })}
        </div>
      )}

      {question.type === 'text' && (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={question.placeholder || 'Escreva aqui...'} rows={4}
          style={{ width: '100%', padding: '16px 20px', borderRadius: 14, border: '1.5px solid #E5E7EB', fontSize: 14, color: '#1A1A2E', background: '#fff', resize: 'vertical' as const, outline: 'none', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          onFocus={e => e.currentTarget.style.borderColor = '#C5A572'}
          onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', gap: 12 }}>
        {!isFirst ? (
          <button onClick={onBack} style={{ padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 500, color: '#6B7280', background: '#fff', border: '1.5px solid #E5E7EB', cursor: 'pointer' }}>Voltar</button>
        ) : <div />}
        <button onClick={onNext} disabled={!canProceed} style={{
          padding: '12px 32px', borderRadius: 12, fontSize: 14, fontWeight: 700,
          color: canProceed ? '#fff' : '#9CA3AF',
          background: canProceed ? 'linear-gradient(135deg, #1A1A2E 0%, #2A2A4E 100%)' : '#F3F4F6',
          border: 'none', cursor: canProceed ? 'pointer' : 'not-allowed',
          boxShadow: canProceed ? '0 4px 16px rgba(26,26,46,0.2)' : 'none',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {isLast ? 'Enviar Respostas' : 'Continuar'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  )
}

// ─── Results Dashboard ───────────────────────────────────────────────────────

type RankItem = { label: string; count: number; pct: number }
type Analytics = {
  total: number;
  cargo: RankItem[]; setor: RankItem[]; equipe: RankItem[];
  experiencia: RankItem[]; desafio: RankItem[]; frustacao: RankItem[];
  fluencia_ia: RankItem[]; ia_gestao: RankItem[]; barreira_ia: RankItem[];
  investiu: RankItem[]; formato: RankItem[]; decisor: RankItem[];
  tentou: string[]; mensagem: string[];
}

function HBar({ items, color = '#C5A572' }: { items: RankItem[]; color?: string }) {
  const max = Math.max(...items.map(i => i.pct), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(item => (
        <div key={item.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: '#4B5563', fontWeight: 500, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{item.label}</span>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, flexShrink: 0 }}>{item.count} ({item.pct}%)</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: '#F3F4F6' }}>
            <div style={{ height: '100%', borderRadius: 4, background: color, width: `${(item.pct / max) * 100}%`, transition: 'width 0.8s ease', minWidth: item.pct > 0 ? 8 : 0 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function DashSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 'clamp(16px, 4vw, 24px)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #F3F4F6' }}>{title}</h3>
      {children}
    </div>
  )
}

function ResultsDashboard() {
  const [data, setData] = useState<{ analytics: Analytics } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const key = params.get('key')
    if (!key) { setError('Acesso nao autorizado'); setLoading(false); return }

    fetch(`/api/survey?key=${key}`)
      .then(r => { if (!r.ok) throw new Error('Unauthorized'); return r.json() })
      .then(d => setData(d))
      .catch(() => setError('Acesso nao autorizado'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTopColor: '#C5A572', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 18, fontWeight: 600, color: '#EF4444', marginBottom: 8 }}>{error}</p>
        <p style={{ fontSize: 14, color: '#9CA3AF' }}>Use o link com chave de acesso.</p>
      </div>
    </div>
  )

  if (!data) return null
  const a = data.analytics

  return (
    <div className="animate-in" style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(1rem, 3vw, 2rem) clamp(0.75rem, 3vw, 1.5rem) 4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: '#C5A572', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 16 }}>Resultados Confidenciais</div>
        <h1 className="font-serif" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>Pesquisa — Lideranca na Era da IA</h1>
        <p style={{ fontSize: 14, color: '#9CA3AF' }}>PulsarH.ai · {a.total} resposta{a.total !== 1 ? 's' : ''} coletada{a.total !== 1 ? 's' : ''}</p>
      </div>

      {a.total === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: 16, color: '#6B7280' }}>Nenhuma resposta ainda. Compartilhe o link da pesquisa!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Big number */}
          <div className="grid-kpi">
            {[
              { label: 'Respondentes', value: a.total, color: '#C5A572' },
              { label: 'Top Cargo', value: a.cargo[0]?.label?.split(' / ')[0] || '—', color: '#6B2D8B' },
              { label: 'Top Desafio', value: (a.desafio[0]?.label || '—').slice(0, 25), color: '#3B82F6' },
              { label: 'Fluencia IA', value: a.fluencia_ia[0]?.label?.split(' — ')[0] || '—', color: '#10B981' },
            ].map(kpi => (
              <div key={kpi.label} style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6 }}>{kpi.label}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: kpi.color }}>{typeof kpi.value === 'number' ? kpi.value : kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Block 1: Perfil */}
          <DashSection title="Bloco 1 — Perfil dos Lideres">
            <div className="grid-2">
              <div><p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, marginBottom: 10 }}>Cargo</p><HBar items={a.cargo} color="#6B2D8B" /></div>
              <div><p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, marginBottom: 10 }}>Setor</p><HBar items={a.setor} color="#3B82F6" /></div>
              <div><p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, marginBottom: 10 }}>Tamanho da Equipe</p><HBar items={a.equipe} color="#10B981" /></div>
              <div><p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, marginBottom: 10 }}>Tempo de Lideranca</p><HBar items={a.experiencia} color="#F59E0B" /></div>
            </div>
          </DashSection>

          {/* Block 2: Dores */}
          <DashSection title="Bloco 2 — Desafios & Dores">
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, marginBottom: 10 }}>Maior Desafio</p>
              <HBar items={a.desafio} color="#EF4444" />
            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, marginBottom: 10 }}>Frustracao com Mercado</p>
              <HBar items={a.frustacao} color="#F59E0B" />
            </div>
            {a.tentou.length > 0 && (
              <div>
                <p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, marginBottom: 10 }}>O que ja tentaram (respostas abertas)</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {a.tentou.map((t, i) => (
                    <div key={i} style={{ padding: '12px 16px', borderRadius: 10, background: '#F9FAFB', border: '1px solid #F3F4F6', fontSize: 13, color: '#4B5563', lineHeight: 1.5, fontStyle: 'italic' }}>"{t}"</div>
                  ))}
                </div>
              </div>
            )}
          </DashSection>

          {/* Block 3: IA */}
          <DashSection title="Bloco 3 — Relacao com IA">
            <div className="grid-2">
              <div><p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, marginBottom: 10 }}>Fluencia em IA</p><HBar items={a.fluencia_ia} color="#8B5CF6" /></div>
              <div><p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, marginBottom: 10 }}>IA na Gestao</p><HBar items={a.ia_gestao} color="#3B82F6" /></div>
            </div>
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, marginBottom: 10 }}>Barreiras para Integrar IA</p>
              <HBar items={a.barreira_ia} color="#EF4444" />
            </div>
          </DashSection>

          {/* Block 4: Investimento */}
          <DashSection title="Bloco 4 — Investimento & Formato">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div><p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, marginBottom: 10 }}>Investiu em Formacao (12 meses)</p><HBar items={a.investiu} color="#10B981" /></div>
              <div><p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, marginBottom: 10 }}>Formato Preferido</p><HBar items={a.formato} color="#6B2D8B" /></div>
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, marginBottom: 10 }}>Quem Decide</p>
              <HBar items={a.decisor} color="#F59E0B" />
            </div>
          </DashSection>

          {/* Mensagens */}
          {a.mensagem.length > 0 && (
            <DashSection title="O que os Lideres Disseram (respostas abertas)">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {a.mensagem.map((m, i) => (
                  <div key={i} style={{ padding: '16px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #FAFBFE, #F0EADF)', border: '1px solid #E8D5B0', fontSize: 14, color: '#1A1A2E', lineHeight: 1.6, fontStyle: 'italic' }}>
                    "{m}"
                  </div>
                ))}
              </div>
            </DashSection>
          )}
        </div>
      )}
    </div>
  )
}

// ─── App Router ──────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'survey' | 'thanks' | 'results'>('welcome')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (window.location.pathname === '/resultados') {
      setScreen('results')
    }
  }, [])

  const question = QUESTIONS[currentQ]

  const handleNext = async () => {
    if (currentQ === QUESTIONS.length - 1) {
      setSubmitting(true)
      try {
        await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, submittedAt: new Date().toISOString() }),
        })
      } catch (e) { console.error('Submit error:', e) }
      setSubmitting(false)
      setScreen('thanks')
    } else {
      setCurrentQ(prev => prev + 1)
    }
  }

  return (
    <>
      <style>{globalStyles}</style>
      {screen === 'results' && <ResultsDashboard />}
      {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('survey')} />}
      {screen === 'survey' && (
        <>
          <ProgressBar current={currentQ + 1} total={QUESTIONS.length} />
          {submitting ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTopColor: '#C5A572', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ color: '#6B7280', fontSize: 14 }}>Enviando suas respostas...</p>
              </div>
            </div>
          ) : (
            <QuestionView
              question={question}
              value={answers[question.id]}
              onChange={(v) => setAnswers(prev => ({ ...prev, [question.id]: v }))}
              onNext={handleNext}
              onBack={() => { if (currentQ > 0) setCurrentQ(prev => prev - 1) }}
              isFirst={currentQ === 0}
              isLast={currentQ === QUESTIONS.length - 1}
            />
          )}
        </>
      )}
      {screen === 'thanks' && <ThankYouScreen />}
    </>
  )
}
