# Remix of MatchCV: Your Career Compass

# MatchCV — Plataforma de Matchmaking de Vagas e Currículos ATS

Crie **do zero, 100% dentro do Lovable**, uma aplicação web completa chamada **MatchCV**.

A plataforma deve conectar usuários a vagas de emprego por meio de **match inteligente** e permitir que o usuário gere **versões personalizadas do próprio currículo, otimizadas para ATS (Applicant Tracking Systems)** de acordo com cada vaga.

**IMPORTANTE: NÃO criar login, cadastro ou autenticação neste primeiro momento.**

O usuário deve conseguir **entrar diretamente na aplicação e começar a utilizá-la imediatamente**, sem criar conta, informar email ou senha.

O objetivo é proporcionar uma experiência **"comece agora e veja o valor primeiro"**.

Não quero apenas uma landing page. Quero uma aplicação funcional, com páginas, componentes, fluxos, estado da aplicação e estrutura preparada para posteriormente adicionar autenticação e persistência de usuários.

---

# 1. STACK E REGRAS GERAIS

Use prioritariamente os recursos nativos disponíveis no Lovable.

## Design System

Use **shadcn/ui como design system principal**.

Todos os componentes da interface devem seguir o padrão do shadcn/ui, incluindo:

- Button
- Input
- Textarea
- Select
- Checkbox
- Radio Group
- Switch
- Dialog
- Drawer
- Dropdown Menu
- Tabs
- Card
- Badge
- Alert
- Tooltip
- Progress
- Table
- Pagination
- Sheet
- Toast/Sonner
- Skeleton
- Avatar
- Separator
- Accordion
- Command
- Calendar
- Form

Não crie um design system paralelo.

Crie componentes reutilizáveis e mantenha consistência visual em toda a aplicação.

---

## Visual

A identidade visual deve utilizar principalmente:

- **Branco** — fundo principal
- **Preto** — textos e elementos de alto contraste
- **Azul claro** — ações primárias, informações e elementos de destaque
- **Vermelho carmesim** — alertas, incompatibilidades, ações destrutivas e pontos de atenção

O visual deve ser:

- moderno
- profissional
- minimalista
- semelhante a SaaS B2C moderno
- limpo
- com bastante espaço em branco
- responsivo
- acessível
- com excelente hierarquia visual

Evite aparência excessivamente colorida.

Use azul claro e carmesim como cores de destaque, não como preenchimento excessivo da interface.

Utilize bordas discretas, cards com aparência moderna, sombras suaves e tipografia altamente legível.

---

# 2. OBJETIVO DO PRODUTO

O usuário entra diretamente na plataforma e consegue:

1. Criar seu perfil profissional localmente/durante a sessão.
2. Informar experiências profissionais.
3. Informar formação acadêmica.
4. Informar habilidades.
5. Informar idiomas.
6. Adicionar certificações.
7. Criar seu currículo base.
8. Pesquisar ou importar vagas.
9. Ver o quanto seu perfil combina com cada vaga.
10. Ver quais requisitos da vaga ele possui.
11. Ver quais requisitos estão faltando.
12. Analisar uma vaga.
13. Gerar uma versão específica do currículo para aquela vaga.
14. Otimizar o currículo para ATS.
15. Visualizar o currículo.
16. Editar o currículo.
17. Salvar diferentes versões durante a utilização.
18. Comparar versões.
19. Exportar o currículo em PDF.
20. Acompanhar suas vagas favoritas e candidaturas.

A ideia central é:

**Perfil → Vaga → Match → Análise → Currículo ATS → Exportação**

---

# 3. EXPERIÊNCIA SEM LOGIN

A aplicação deve ser **imediatamente utilizável**.

Ao acessar o endereço da aplicação, o usuário deve entrar diretamente no fluxo principal.

Não mostrar:

- tela de login
- tela de cadastro
- autenticação
- recuperação de senha
- confirmação de email
- OAuth
- Google Login
- GitHub Login

Não bloquear nenhuma funcionalidade atrás de autenticação.

---

## Entrada inicial

Ao abrir a aplicação, apresentar uma tela inicial extremamente simples:

### "Encontre vagas que combinam com você."

Subtítulo:

**"Analise seu perfil, descubra seu Match Score e gere currículos preparados para ATS."**

Botão principal:

**"Começar agora"**

Botão secundário:

**"Já tenho um currículo"**

O botão "Começar agora" deve levar diretamente para o preenchimento do perfil.

O botão "Já tenho um currículo" deve permitir que o usuário informe/importar seu currículo para iniciar o processo.

---

# 4. PERSISTÊNCIA TEMPORÁRIA

Como não haverá login inicialmente, utilizar uma estrutura de dados baseada na sessão/localmente.

Utilizar, quando apropriado:

- React state
- Context
- localStorage

Os dados devem permanecer disponíveis enquanto o usuário estiver utilizando a aplicação e, preferencialmente, continuar disponíveis ao recarregar a página no mesmo navegador.

Estruturar o código de maneira que futuramente seja fácil substituir:

```text
localStorage

por:
API + banco de dados + autenticação

Não criar uma arquitetura que dependa de usuário autenticado.
5. ESTRUTURA PRINCIPAL DA APLICAÇÃO
Criar as seguintes áreas:
Público / Entrada
/
/start
Aplicação
/dashboard
/profile
/resume
/jobs
/jobs/:id
/matches
/applications
/resumes
/resumes/:id
/settings
Não criar:
/login
/signup
/forgot-password
6. LANDING / TELA INICIAL
Criar uma tela inicial profissional.
Hero:
"Encontre vagas que combinam com você. Crie currículos que passam pelo ATS."
Subtítulo:
"O MatchCV analisa suas habilidades e experiências, encontra oportunidades compatíveis e adapta seu currículo para cada vaga."
CTA principal:
"Começar agora"
CTA secundário:
"Ver como funciona"
A página deve possuir:
Hero
headline forte
subtítulo
CTA
mockup visual do dashboard
indicação visual de Match Score
Seção "Como funciona"
3 ou 4 etapas:
Crie seu perfil
Encontre vagas compatíveis
Analise seu Match Score
Gere seu currículo ATS
Seção de benefícios
Exemplos:
Match inteligente
Currículo personalizado
Otimização para ATS
Identificação de gaps
Múltiplas versões de currículo
Acompanhamento de candidaturas
Seção visual
Mostrar um exemplo de:
Vaga → Match 87% → Currículo otimizado
CTA final
"Comece agora gratuitamente"
Não exigir login para clicar em nenhum CTA.
7. ONBOARDING SEM CONTA
Criar onboarding em etapas.
O onboarding deve ser iniciado imediatamente após clicar em:
"Começar agora"
Etapa 1 — Informações pessoais
Campos:
Nome completo
Cargo desejado
Localização
Email
Telefone
LinkedIn
GitHub
Portfólio
O email aqui é apenas uma informação opcional do currículo.
Não usar email para autenticação.
Etapa 2 — Experiência
Permitir adicionar múltiplas experiências.
Cada experiência deve possuir:
Cargo
Empresa
Localização
Data inicial
Data final
Emprego atual
Descrição
Principais responsabilidades
Resultados/conquistas
Permitir adicionar/remover experiências.
Etapa 3 — Formação
Campos:
Instituição
Curso
Grau
Data inicial
Data final
Em andamento
Etapa 4 — Habilidades
Permitir adicionar várias skills.
Exemplos:
JavaScript
TypeScript
React
Node.js
Python
SQL
Docker
Cada habilidade pode possuir nível:
Básico
Intermediário
Avançado
Especialista
Etapa 5 — Idiomas
Idioma
Nível
Etapa 6 — Certificações
Nome
Instituição
Data
URL
Etapa 7 — Objetivo profissional
Campos:
Cargo desejado
Área
Modalidade:
Remoto
Híbrido
Presencial
Localização desejada
Pretensão salarial
Ao finalizar:
"Seu perfil está pronto!"
Botão:
"Ver minhas vagas"
8. DASHBOARD
Criar dashboard moderno.
No topo:
"Olá, [nome] 👋"
Não utilizar nome fixo.
Cards principais:
Perfil
Perfil 86% completo
Progress bar.
Match médio
82%
Vagas compatíveis
24
Currículos criados
7
Seção "Melhores oportunidades"
Mostrar cards de vagas.
Cada card deve possuir:
Empresa
Logo
Cargo
Localização
Modalidade
Faixa salarial
Match Score
Skills compatíveis
Skills ausentes
botão "Ver vaga"
botão "Gerar currículo"
9. SISTEMA DE MATCHMAKING
Essa é uma das funcionalidades principais.
Cada vaga deve receber um Match Score de 0 a 100.
Exemplo:
92% Match
Dividir a pontuação em categorias:
Skills: 40%
Experiência: 25%
Formação: 15%
Localização/modalidade: 10%
Idiomas/certificações: 10%
Mostrar visualmente a composição da pontuação.
Exemplo:
Match Score
92%

Skills             ███████████████████ 96%
Experiência        █████████████████   88%
Formação           ███████████████████ 95%
Localização        ███████████████████ 100%
Idiomas            ███████████████     75%

Também mostrar:
Você possui
React
TypeScript
Git
REST APIs
Você não possui
AWS
Kubernetes
Experiência
2 de 3 anos exigidos
Recomendação
"Você possui grande compatibilidade com esta vaga. O principal gap é experiência com AWS."
Os resultados devem ser calculados com base no perfil atual do usuário.
10. PÁGINA DE VAGAS
Criar /jobs.
Possuir:
Busca
Campo:
"Cargo, tecnologia ou empresa..."
Filtros
Localização
Modalidade
Nível
Área
Faixa salarial
Empresa
Match Score mínimo
Ordenação
Melhor Match
Mais recentes
Maior salário
Mais relevantes
11. CARD DE VAGA
Cada vaga deve apresentar:
Logo da empresa
Empresa
Cargo
Localização
Modalidade
Senioridade
Salário
Data de publicação
Match Score
Exemplo:
Frontend Developer

Empresa XYZ
São Paulo • Remoto

R$ 5.000 — R$ 7.000

██████████████████░░ 87% Match

[Ver vaga] [Gerar currículo]

12. DETALHE DA VAGA
Criar página /jobs/:id.
Estrutura:
Header
Cargo
Empresa
Localização
Modalidade
Salário
Data
Botões:
Salvar vaga
Gerar currículo ATS
Descrição
Mostrar descrição completa da vaga.
Requisitos
Separar:
Obrigatórios
Desejáveis
Match
Mostrar grande card:
87% Match
E explicar detalhadamente o motivo da pontuação.
13. ANÁLISE DA VAGA
Criar uma seção chamada:
"Análise da vaga"
Dividir os requisitos em:
Você atende
Lista de requisitos com destaque positivo.
Você atende parcialmente
Lista de requisitos com indicação de atenção.
Você não atende
Lista com destaque carmesim.
Palavras-chave importantes
Mostrar tags:
React
TypeScript
REST API
Git
Docker
AWS
Isso será importante para a otimização ATS.
14. CURRÍCULO BASE
Criar /resume.
O usuário deve conseguir montar seu currículo base.
Seções:
Informações pessoais
Resumo profissional
Experiência
Formação
Skills
Idiomas
Certificações
Projetos
Permitir:
adicionar
editar
remover
reordenar
Salvar automaticamente no estado/localStorage.
15. GERADOR DE CURRÍCULO ATS
Essa é outra funcionalidade central.
Quando o usuário clicar:
"Gerar currículo ATS"
abrir fluxo:
Passo 1
Selecionar vaga.
Passo 2
Analisar vaga.
Passo 3
Mostrar palavras-chave identificadas.
Passo 4
Mostrar sugestões.
Exemplo:
Seu currículo atual:

"Desenvolvimento de aplicações web."

Sugestão:

"Desenvolvimento de aplicações web utilizando React,
TypeScript e APIs REST."

Passo 5
Gerar currículo personalizado.
16. REGRAS DO CURRÍCULO ATS
O gerador deve seguir boas práticas ATS.
Evitar:
tabelas complexas
múltiplas colunas
elementos gráficos desnecessários
ícones substituindo texto
excesso de imagens
informações escondidas
fontes difíceis de interpretar
cabeçalhos complexos
Priorizar:
texto simples
títulos claros
estrutura hierárquica
palavras-chave relevantes
experiências objetivas
resultados mensuráveis
datas claras
skills relevantes
O currículo deve ser otimizado para leitura por sistemas ATS sem simplesmente copiar a descrição da vaga.
Nunca inventar experiências, empresas, cargos, certificações ou habilidades que o usuário não informou.
17. SCORE ATS
Após gerar o currículo, mostrar:
ATS Score: 94/100
Dividir em:
Keywords: 95%
Estrutura: 100%
Experiência: 92%
Skills: 96%
Legibilidade: 98%
Mostrar recomendações.
Exemplo:
✓ Estrutura compatível com ATS
✓ Palavras-chave relevantes
✓ Experiências bem estruturadas
⚠ Adicione resultados mensuráveis à experiência X

18. EDITOR DE CURRÍCULO
Criar editor visual.
Layout desktop:
Esquerda: controles/seções
Centro: preview do currículo
Direita: análise ATS
Exemplo:
┌──────────────┬─────────────────────────┬───────────────┐
│ SEÇÕES       │ PREVIEW DO CURRÍCULO    │ ATS           │
│              │                         │               │
│ Perfil       │ João Silva              │ Score 94      │
│ Experiência  │ Frontend Developer      │               │
│ Formação     │                         │ Keywords      │
│ Skills       │ Experiência             │ ✓ React       │
│ Projetos     │ ...                     │ ✓ TypeScript  │
│              │                         │ ⚠ AWS         │
└──────────────┴─────────────────────────┴───────────────┘

No mobile, transformar isso em uma interface por tabs/drawers.
19. VERSÕES DE CURRÍCULO
Criar /resumes.
O usuário deve visualizar:
Currículo principal
Currículo Frontend
Currículo Backend
Currículo para empresa X
Currículo para vaga Y
Cada currículo deve possuir:
Nome
Vaga associada
ATS Score
Data de criação
Data de atualização
Ações:
Editar
Duplicar
Renomear
Excluir
Visualizar
Exportar PDF
Como não existe autenticação, essas versões devem ser armazenadas temporariamente/localmente.
20. EXPORTAÇÃO PDF
Adicionar botão:
"Exportar PDF"
O PDF deve possuir layout profissional e ATS-friendly.
Não adicionar elementos decorativos que prejudiquem a leitura por ATS.
Permitir ao usuário gerar o PDF diretamente, sem necessidade de criar conta.
21. ACOMPANHAMENTO DE CANDIDATURAS
Criar /applications.
Utilizar visual estilo Kanban.
Colunas:
Salvas
Aplicado
Entrevista
Teste
Oferta
Rejeitado
Permitir mover vagas entre colunas.
Cada candidatura deve armazenar:
Empresa
Cargo
Data
Status
Match Score
Currículo utilizado
Observações
Tudo deve funcionar sem login.
22. FAVORITOS
Permitir salvar vagas.
Criar seção:
"Vagas salvas"
Mostrar:
vaga
empresa
Match Score
data
status
Persistir localmente durante a sessão/uso do navegador.
23. PERFIL
Criar /profile.
Permitir editar todas as informações do onboarding.
Adicionar indicador:
Perfil 92% completo
Mostrar o que falta preencher.
24. CONFIGURAÇÕES
Criar /settings.
Como não existe conta/autenticação, não criar configurações de senha, email de login ou segurança de conta.
Criar:
Preferências profissionais
Cargo
Localização
Modalidade
Salário
Notificações
Novas vagas compatíveis
Atualizações de candidatura
Sugestões de currículo
Dados locais
Adicionar opções:
"Exportar meus dados"
"Limpar todos os dados locais"
Antes de apagar os dados, mostrar Dialog de confirmação usando shadcn/ui.
25. BANCO DE DADOS / MODELO DE DADOS
Neste primeiro estágio, não exigir banco de dados autenticado.
Estruturar os modelos de dados de maneira compatível com uma futura persistência.
Modelos:
profile
experiences
education
skills
user_skills
languages
certifications
projects
jobs
job_skills
saved_jobs
matches
resumes
resume_versions
resume_sections
applications
notifications
Criar interfaces/types/schemas bem definidos para esses objetos.
Deixar a arquitetura preparada para futuramente migrar esses dados para banco de dados.
26. DADOS DE EXEMPLO
Para o primeiro carregamento da aplicação, criar dados demonstrativos realistas para que o dashboard não fique vazio.
Exemplos de vagas:
Frontend Developer
Full Stack Developer
Backend Developer
Software Engineer
React Developer
Empresas fictícias podem ser usadas para demonstração.
O sistema deve deixar claro internamente que são dados de demonstração.
A arquitetura deve permitir substituir posteriormente esses dados por uma API real.
27. ARQUITETURA DE SERVIÇOS
Organizar a lógica para que integrações futuras sejam simples.
Separar responsabilidades conceitualmente:
profile
jobs
matching
resume
ats
applications
notifications
storage

Não colocar toda a lógica diretamente nos componentes visuais.
28. MATCH ENGINE
Criar uma estrutura de serviço responsável pelo cálculo de Match Score.
Exemplo conceitual:
calculateMatch(userProfile, job)

→ skillsScore
→ experienceScore
→ educationScore
→ locationScore
→ languageScore

→ finalScore

A lógica deve ser modular para que futuramente possa ser substituída por uma API/IA.
29. ATS ENGINE
Criar uma estrutura de serviço responsável por:
analyzeJob(jobDescription)

extractKeywords()

analyzeResume(resume)

calculateATSScore()

suggestImprovements()

generateOptimizedResume()

Inicialmente pode utilizar regras determinísticas/mockadas para demonstrar o funcionamento.
A arquitetura deve permitir substituir posteriormente essa implementação por uma API de IA.
30. IA
Preparar a aplicação para futuras funcionalidades de IA:
análise semântica da vaga
identificação de skills
melhoria de bullet points
geração de resumo profissional
adaptação do currículo
identificação de gaps
recomendações de carreira
IMPORTANTE:
Nunca inventar informações sobre o usuário.
A IA deve trabalhar somente com informações fornecidas pelo usuário e informações presentes na vaga.
31. COMPONENTES REUTILIZÁVEIS
Criar componentes como:
AppSidebar
Topbar
JobCard
MatchScore
SkillBadge
JobFilters
ResumePreview
ATSScore
ATSAnalysis
ProfileCompletion
ApplicationCard
EmptyState
LoadingState
PageHeader
StatCard
ConfirmDialog
Evitar duplicação de componentes.
32. RESPONSIVIDADE
A aplicação precisa funcionar perfeitamente em:
Desktop
Tablet
Mobile
No mobile:
sidebar vira menu/drawer
tabelas devem possuir comportamento responsivo
editor de currículo deve se adaptar
cards devem ocupar largura disponível
filtros devem virar drawer
navegação deve permanecer intuitiva
33. ESTADOS DA INTERFACE
Criar estados completos:
Loading
Utilizar Skeleton do shadcn/ui.
Empty
Exemplo:
"Você ainda não salvou nenhuma vaga."
Error
Mostrar mensagem amigável.
Success
Utilizar toast.
Não deixar páginas sem feedback visual.
34. ACESSIBILIDADE
Garantir:
contraste adequado
labels em inputs
navegação por teclado
foco visível
aria-label quando necessário
mensagens de erro claras
botões com nomes descritivos
35. NAVEGAÇÃO
Desktop:
Sidebar com:
Dashboard
Vagas
Matches
Currículos
Candidaturas
Perfil
Configurações
Na parte inferior:
avatar
nome do usuário
menu de sessão local
opção "Limpar dados"
Não exibir:
Login
Cadastro
Logout
Conta autenticada
36. DESIGN DA SIDEBAR
Sidebar minimalista.
Logo:
MatchCV
Ícone simples relacionado a currículo/match.
Menu ativo deve utilizar azul claro de forma elegante.
Não utilizar gradientes exagerados.
37. MATCH SCORE VISUAL
Criar componente reutilizável.
Exemplo:
92%
Usar:
azul claro para scores bons
carmesim para scores baixos
tons intermediários para scores medianos
Classificação:
80–100: Excelente
60–79: Bom
40–59: Médio
0–39: Baixo
38. UX
Priorize uma experiência extremamente simples.
O usuário deve conseguir entender imediatamente:
Quais vagas combinam comigo?
Por que essa vaga combina comigo?
O que está faltando?
Como melhorar meu currículo?
Qual currículo devo enviar?
A interface deve sempre apresentar uma próxima ação clara.
39. MICROCOPY
Utilizar português brasileiro em toda a interface.
Exemplos:
"Encontrar vagas"
"Analisar vaga"
"Gerar currículo"
"Otimizar para ATS"
"Ver análise"
"Salvar vaga"
"Candidatar-se"
"Editar currículo"
"Exportar PDF"
"Começar agora"
Evitar textos genéricos como "Click here".
40. EXPERIÊNCIA DO PRIMEIRO USO
Após acessar a aplicação:
Entrar na aplicação
↓
Começar agora
↓
Preencher perfil
↓
Perfil completo
↓
Dashboard
↓
Primeiras vagas recomendadas
↓
Selecionar vaga
↓
Ver Match Score
↓
Analisar gaps
↓
Gerar currículo ATS
↓
Visualizar
↓
Exportar PDF

Não interromper esse fluxo com login ou cadastro.
O usuário deve conseguir chegar ao valor principal da aplicação sem fornecer credenciais.
41. SEGURANÇA
Como não existe autenticação inicialmente:
Não armazenar senhas.
Não armazenar tokens de autenticação.
Não solicitar credenciais desnecessárias.
Não expor:
chaves de API
secrets
tokens privados
Nunca colocar chaves privadas diretamente no frontend.
Preparar variáveis de ambiente quando necessárias.
42. PERFORMANCE
Evitar:
renders desnecessários
componentes gigantes
chamadas repetidas
carregamentos desnecessários
Utilizar:
loading states
skeletons
lazy loading quando fizer sentido
componentes reutilizáveis
43. PREPARAÇÃO PARA FUTURA AUTENTICAÇÃO
Embora não exista login nesta versão, estruturar o projeto de forma que futuramente seja possível adicionar:
Authentication
    ↓
User
    ↓
Profile
    ↓
Resumes
    ↓
Matches
    ↓
Applications

Não criar autenticação fake apenas para simular.
Não criar telas de login escondidas.
A aplicação deve funcionar completamente sem autenticação.
44. RESULTADO FINAL
Quero uma aplicação com aparência de produto SaaS real, e não de projeto acadêmico.
O resultado deve parecer um produto que poderia ser apresentado a usuários reais.
Prioridades:
UX
Design
Matchmaking
Currículo ATS
Responsividade
Arquitetura limpa
Persistência local
Preparação para APIs/IA futuras
Zero barreira de entrada
Nenhum login ou cadastro
Use shadcn/ui em toda a interface, mantendo a identidade visual baseada em:
branco
preto
azul claro
vermelho carmesim
Comece criando toda a estrutura da aplicação, layout, componentes, estados, lógica de matchmaking, análise ATS, editor de currículo, exportação e fluxos principais.
O usuário deve poder abrir a aplicação e começar a criar seu currículo imediatamente, sem login, sem cadastro e sem qualquer etapa de autenticação.
Não reduza o projeto a uma landing page ou protótipo visual.
Construa a aplicação completa e funcional dentro do Lovable.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9bc4b9b8-4220-49e2-b8fc-fb172f27727f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
