import React, { useState } from 'react'

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
`

// ─── Questions ───────────────────────────────────────────────────────────────

type Question = {
  id: string
  block: number
  label: string
  type: 'select' | 'multiselect' | 'text' | 'scale'
  options?: string[]
  placeholder?: string
  required?: boolean
}

const QUESTIONS: Question[] = [
  // BLOCO 1 — Perfil do Líder
  { id: 'cargo', block: 1, label: 'Qual seu cargo atual?', type: 'select', required: true,
    options: ['C-Level / Diretor(a)', 'Gerente / Head', 'Coordenador(a) / Supervisor(a)', 'Consultor(a) / Especialista', 'Empreendedor(a)', 'Profissional de RH / T&D', 'Outro'] },
  { id: 'setor', block: 1, label: 'Em qual setor você atua?', type: 'select', required: true,
    options: ['Tecnologia', 'Educação', 'Saúde', 'Indústria', 'Serviços / Consultoria', 'Varejo / Comércio', 'Financeiro', 'Outro'] },
  { id: 'equipe', block: 1, label: 'Quantas pessoas você lidera (direta ou indiretamente)?', type: 'select', required: true,
    options: ['Nenhuma (contribuidor individual)', '1 a 5', '6 a 20', '21 a 50', '51 a 200', 'Mais de 200'] },
  { id: 'experiencia', block: 1, label: 'Há quanto tempo exerce cargo de liderança?', type: 'select',
    options: ['Menos de 1 ano', '1 a 3 anos', '4 a 10 anos', 'Mais de 10 anos'] },

  // BLOCO 2 — Dor & Desafio
  { id: 'desafio', block: 2, label: 'Qual o MAIOR desafio que você enfrenta como líder hoje?', type: 'select', required: true,
    options: ['Engajar e reter talentos', 'Integrar IA na operação sem perder o lado humano', 'Produtividade do time (fazer mais com menos)', 'Tomar decisões estratégicas com dados', 'Desenvolver novas competências de liderança', 'Escalar processos mantendo qualidade', 'Outro'] },
  { id: 'tentou', block: 2, label: 'O que você já tentou para resolver esse desafio?', type: 'text', placeholder: 'Cursos, mentorias, consultorias, mudanças internas...' },
  { id: 'frustacao', block: 2, label: 'O que mais te frustra nas soluções que existem no mercado?', type: 'select',
    options: ['Muito teóricas, pouca aplicação prática', 'Focam em ferramentas, não em liderança', 'Não consideram a realidade do líder brasileiro', 'Caras demais para o que entregam', 'Genéricas — não falam com meu contexto', 'Nenhuma frustração, não busquei soluções ainda'] },

  // BLOCO 3 — Relação com IA
  { id: 'fluencia_ia', block: 3, label: 'Como você classifica sua fluência em IA?', type: 'select', required: true,
    options: ['Iniciante — uso ChatGPT ocasionalmente', 'Intermediário — uso IA no dia a dia para tarefas', 'Avançado — integrei IA em processos do time', 'Expert — construo soluções com IA para o negócio'] },
  { id: 'ia_gestao', block: 3, label: 'Você usa IA para apoiar sua gestão de pessoas?', type: 'select',
    options: ['Não uso nada', 'Uso para tarefas pessoais, mas não na gestão do time', 'Meu time usa, mas sem direcionamento meu', 'Sim, tenho processos com IA integrados na operação'] },
  { id: 'barreira_ia', block: 3, label: 'O que falta para você integrar IA de verdade na sua liderança?', type: 'multiselect',
    options: ['Conhecimento técnico', 'Método prático (passo a passo)', 'Tempo para implementar', 'Apoio da empresa', 'Confiança de que funciona', 'Exemplos reais de quem já fez'] },

  // BLOCO 4 — Disposição de Investimento
  { id: 'investiu', block: 4, label: 'Já investiu em formação de liderança nos últimos 12 meses?', type: 'select',
    options: ['Não', 'Sim, até R$ 500', 'Sim, entre R$ 500 e R$ 2.000', 'Sim, entre R$ 2.000 e R$ 5.000', 'Sim, mais de R$ 5.000'] },
  { id: 'formato', block: 4, label: 'Qual formato de aprendizado funciona melhor pra você?', type: 'multiselect',
    options: ['Imersão online intensiva (1-2 dias)', 'Formação online com módulos semanais', 'Mentoria individual', 'Workshop presencial', 'Comunidade + conteúdo contínuo'] },
  { id: 'decisor', block: 4, label: 'Quem decide sobre investir em formação na sua empresa?', type: 'select',
    options: ['Eu mesmo(a)', 'Meu gestor direto', 'RH / T&D', 'Diretoria / C-Level', 'Não tenho orçamento para isso'] },
  { id: 'mensagem', block: 4, label: 'Se pudesse dizer uma coisa para quem está construindo uma formação de liderança na era da IA, o que diria?', type: 'text', placeholder: 'Sua opinião sincera aqui...' },
]

const BLOCK_TITLES = ['', 'Seu Perfil', 'Desafios & Dores', 'Você e a IA', 'Investimento & Formato']
const BLOCK_SUBTITLES = ['', 'Queremos entender quem você é como líder', 'O que tira seu sono hoje', 'Como a IA entra (ou não) na sua liderança', 'Como você investe no seu desenvolvimento']

// ─── Components ──────────────────────────────────────────────────────────────

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 640, textAlign: 'center' }}>
        {/* Logo */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 999, background: 'linear-gradient(135deg, #C5A572 0%, #E8D5B0 100%)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            PulsarH.ai
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#1A1A2E', lineHeight: 1.15, marginBottom: '1.5rem' }}>
          A 1a Revolução da IA<br />
          <span style={{ color: '#9CA3AF' }}>já passou.</span>
        </h1>

        <h2 className="font-serif gold-shimmer" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '2rem' }}>
          A 2a está acontecendo agora.<br />
          E quero a sua opinião.
        </h2>

        {/* Context */}
        <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 2.5rem' }}>
          Estou ouvindo líderes que admiro para entender como a inteligência artificial
          está mudando a forma de liderar — e o que falta no mercado para preparar
          quem lidera gente <strong style={{ color: '#1A1A2E' }}>e</strong> tecnologia.
        </p>

        <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: '2.5rem' }}>
          São <strong style={{ color: '#6B7280' }}>14 perguntas</strong> · Leva cerca de <strong style={{ color: '#6B7280' }}>3 minutos</strong> · Suas respostas são confidenciais
        </p>

        {/* CTA */}
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

        {/* Signature */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>
            <strong style={{ color: '#6B7280' }}>Rodrigo Braga</strong> · Fundador PulsarH.ai
          </p>
          <p style={{ fontSize: 11, color: '#C5A572', marginTop: 4, fontWeight: 600 }}>
            21 anos de liderança · ex-C&A · 4.500 pessoas lideradas
          </p>
        </div>
      </div>
    </div>
  )
}

function ThankYouScreen() {
  return (
    <div className="animate-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 540, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: '1.5rem' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C5A572" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h1 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: '#1A1A2E', marginBottom: '1rem' }}>
          Obrigado pela sua visao.
        </h1>
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
          <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {BLOCK_TITLES[QUESTIONS[current - 1]?.block] || ''}
          </span>
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
  const block = question.block
  const canProceed = !question.required || (question.type === 'multiselect' ? (value as string[])?.length > 0 : !!value)

  return (
    <div className="animate-in" key={question.id} style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Block subtitle */}
      <p style={{ fontSize: 12, color: '#C5A572', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
        {BLOCK_SUBTITLES[block]}
      </p>

      <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 700, color: '#1A1A2E', marginBottom: '2rem', lineHeight: 1.3 }}>
        {question.label}
      </h2>

      {/* Select */}
      {question.type === 'select' && question.options && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {question.options.map(opt => (
            <button key={opt} onClick={() => onChange(opt)}
              style={{
                padding: '14px 20px', borderRadius: 12, textAlign: 'left',
                fontSize: 14, fontWeight: value === opt ? 600 : 400,
                background: value === opt ? '#1A1A2E' : '#fff',
                color: value === opt ? '#fff' : '#4B5563',
                border: `1.5px solid ${value === opt ? '#1A1A2E' : '#E5E7EB'}`,
                cursor: 'pointer', transition: 'all 0.2s ease',
                boxShadow: value === opt ? '0 4px 16px rgba(26,26,46,0.2)' : '0 1px 4px rgba(0,0,0,0.04)',
              }}>
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Multiselect */}
      {question.type === 'multiselect' && question.options && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>Selecione todas que se aplicam</p>
          {question.options.map(opt => {
            const selected = (value as string[] || []).includes(opt)
            return (
              <button key={opt} onClick={() => {
                const arr = (value as string[] || [])
                onChange(selected ? arr.filter((v: string) => v !== opt) : [...arr, opt])
              }}
                style={{
                  padding: '14px 20px', borderRadius: 12, textAlign: 'left',
                  fontSize: 14, fontWeight: selected ? 600 : 400,
                  background: selected ? '#F0EADF' : '#fff',
                  color: selected ? '#8B6914' : '#4B5563',
                  border: `1.5px solid ${selected ? '#C5A572' : '#E5E7EB'}`,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
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

      {/* Text */}
      {question.type === 'text' && (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)}
          placeholder={question.placeholder || 'Escreva aqui...'}
          rows={4}
          style={{
            width: '100%', padding: '16px 20px', borderRadius: 14, border: '1.5px solid #E5E7EB',
            fontSize: 14, color: '#1A1A2E', background: '#fff', resize: 'vertical',
            outline: 'none', fontFamily: 'Inter, sans-serif', lineHeight: 1.6,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
          onFocus={e => e.currentTarget.style.borderColor = '#C5A572'}
          onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
        />
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', gap: 12 }}>
        {!isFirst ? (
          <button onClick={onBack} style={{
            padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 500,
            color: '#6B7280', background: '#fff', border: '1.5px solid #E5E7EB',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            Voltar
          </button>
        ) : <div />}

        <button onClick={onNext} disabled={!canProceed}
          style={{
            padding: '12px 32px', borderRadius: 12, fontSize: 14, fontWeight: 700,
            color: canProceed ? '#fff' : '#9CA3AF',
            background: canProceed ? 'linear-gradient(135deg, #1A1A2E 0%, #2A2A4E 100%)' : '#F3F4F6',
            border: 'none', cursor: canProceed ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s', boxShadow: canProceed ? '0 4px 16px rgba(26,26,46,0.2)' : 'none',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
          {isLast ? 'Enviar Respostas' : 'Continuar'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'survey' | 'thanks'>('welcome')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)

  const question = QUESTIONS[currentQ]

  const handleNext = async () => {
    if (currentQ === QUESTIONS.length - 1) {
      // Submit
      setSubmitting(true)
      try {
        await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, submittedAt: new Date().toISOString() }),
        })
      } catch (e) {
        console.error('Submit error:', e)
      }
      setSubmitting(false)
      setScreen('thanks')
    } else {
      setCurrentQ(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ(prev => prev - 1)
  }

  return (
    <>
      <style>{globalStyles}</style>

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
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <QuestionView
              question={question}
              value={answers[question.id]}
              onChange={(v) => setAnswers(prev => ({ ...prev, [question.id]: v }))}
              onNext={handleNext}
              onBack={handleBack}
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
