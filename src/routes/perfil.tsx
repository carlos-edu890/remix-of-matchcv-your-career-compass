import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { profileCompleteness, useAppState } from "@/store/app-state";
import type { LanguageLevel, SkillLevel, WorkMode } from "@/types";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil profissional — MatchCV" },
      {
        name: "description",
        content:
          "Cadastre dados pessoais, objetivo de carreira, experiências, formação, habilidades e idiomas para alimentar o match e o currículo ATS.",
      },
      { property: "og:title", content: "Meu perfil profissional — MatchCV" },
      {
        property: "og:description",
        content: "Preencha seu perfil e melhore o match com as vagas.",
      },
    ],
  }),
  component: PerfilPage,
});

const skillLevels: SkillLevel[] = ["basico", "intermediario", "avancado", "especialista"];
const languageLevels: LanguageLevel[] = [
  "basico",
  "intermediario",
  "avancado",
  "fluente",
  "nativo",
];
const workModes: WorkMode[] = ["remoto", "hibrido", "presencial"];

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function PerfilPage() {
  const app = useAppState();
  const { state } = app;
  const pct = profileCompleteness(state);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Meu perfil</h1>
        <p className="text-muted-foreground">
          Estes dados alimentam o cálculo de match e a geração dos currículos otimizados.
        </p>
        <div className="flex items-center gap-3">
          <Progress value={pct} className="h-2 max-w-sm" />
          <span className="text-sm font-medium">{pct}%</span>
        </div>
      </header>

      <Tabs defaultValue="dados">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="dados">Dados</TabsTrigger>
          <TabsTrigger value="objetivo">Objetivo</TabsTrigger>
          <TabsTrigger value="experiencia">Experiência</TabsTrigger>
          <TabsTrigger value="formacao">Formação</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="extras">Extras</TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="mt-6">
          <DadosTab />
        </TabsContent>
        <TabsContent value="objetivo" className="mt-6">
          <ObjetivoTab />
        </TabsContent>
        <TabsContent value="experiencia" className="mt-6">
          <ExperienciaTab />
        </TabsContent>
        <TabsContent value="formacao" className="mt-6">
          <FormacaoTab />
        </TabsContent>
        <TabsContent value="skills" className="mt-6">
          <SkillsTab />
        </TabsContent>
        <TabsContent value="extras" className="mt-6">
          <ExtrasTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DadosTab() {
  const { state, updateProfile } = useAppState();
  const p = state.profile;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados pessoais e contato</CardTitle>
        <CardDescription>Aparecem no cabeçalho do currículo exportado.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nome completo"
          value={p.fullName}
          onChange={(v) => updateProfile({ fullName: v })}
        />
        <Field
          label="Cargo desejado"
          value={p.headline}
          onChange={(v) => updateProfile({ headline: v })}
          placeholder="Ex.: Desenvolvedor Front-end Pleno"
        />
        <Field
          label="Cidade / Estado"
          value={p.location}
          onChange={(v) => updateProfile({ location: v })}
          placeholder="São Paulo, SP"
        />
        <Field
          label="E-mail"
          type="email"
          value={p.email}
          onChange={(v) => updateProfile({ email: v })}
        />
        <Field label="Telefone" value={p.phone} onChange={(v) => updateProfile({ phone: v })} />
        <Field label="LinkedIn" value={p.linkedin} onChange={(v) => updateProfile({ linkedin: v })} />
        <Field label="GitHub" value={p.github} onChange={(v) => updateProfile({ github: v })} />
        <Field
          label="Portfólio"
          value={p.portfolio}
          onChange={(v) => updateProfile({ portfolio: v })}
        />
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="summary">Resumo profissional</Label>
          <Textarea
            id="summary"
            rows={5}
            value={p.summary}
            placeholder="Descreva sua trajetória, principais competências e resultados em 3 a 5 linhas."
            onChange={(e) => updateProfile({ summary: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">{p.summary.length} caracteres (ideal 300+)</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ObjetivoTab() {
  const { state, updateGoal } = useAppState();
  const g = state.goal;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Objetivo profissional</CardTitle>
        <CardDescription>Usado para priorizar vagas compatíveis.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Cargo alvo"
          value={g.targetRole}
          onChange={(v) => updateGoal({ targetRole: v })}
        />
        <Field
          label="Área de atuação"
          value={g.area}
          onChange={(v) => updateGoal({ area: v })}
          placeholder="Tecnologia, Dados, Design…"
        />
        <div className="space-y-1.5">
          <Label>Modelo de trabalho</Label>
          <Select value={g.workMode} onValueChange={(v) => updateGoal({ workMode: v as WorkMode })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {workModes.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Field
          label="Localidade desejada"
          value={g.desiredLocation}
          onChange={(v) => updateGoal({ desiredLocation: v })}
        />
        <Field
          label="Pretensão salarial"
          value={g.salaryExpectation}
          onChange={(v) => updateGoal({ salaryExpectation: v })}
          placeholder="R$ 8.000"
        />
      </CardContent>
    </Card>
  );
}

const emptyExperience = {
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  responsibilities: "",
  achievements: "",
};

function ExperienciaTab() {
  const { state, addExperience, updateExperience, removeExperience } = useAppState();
  const [draft, setDraft] = useState(emptyExperience);

  return (
    <div className="space-y-6">
      {state.experiences.map((exp) => (
        <Card key={exp.id}>
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle className="text-base">{exp.role || "Sem cargo"}</CardTitle>
              <CardDescription>
                {exp.company} · {exp.startDate} — {exp.current ? "atual" : exp.endDate}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remover experiência"
              onClick={() => removeExperience(exp.id)}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Cargo"
              value={exp.role}
              onChange={(v) => updateExperience(exp.id, { role: v })}
            />
            <Field
              label="Empresa"
              value={exp.company}
              onChange={(v) => updateExperience(exp.id, { company: v })}
            />
            <Field
              label="Início"
              type="month"
              value={exp.startDate}
              onChange={(v) => updateExperience(exp.id, { startDate: v })}
            />
            <Field
              label="Fim"
              type="month"
              value={exp.endDate}
              onChange={(v) => updateExperience(exp.id, { endDate: v })}
            />
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={exp.current}
                onCheckedChange={(c) => updateExperience(exp.id, { current: c === true })}
              />
              Emprego atual
            </label>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Responsabilidades</Label>
              <Textarea
                rows={3}
                value={exp.responsibilities}
                onChange={(e) => updateExperience(exp.id, { responsibilities: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Conquistas e resultados</Label>
              <Textarea
                rows={3}
                value={exp.achievements}
                placeholder="Use números: reduzi o tempo de carga em 40%…"
                onChange={(e) => updateExperience(exp.id, { achievements: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Adicionar experiência</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Cargo (novo)"
            value={draft.role}
            onChange={(v) => setDraft({ ...draft, role: v })}
          />
          <Field
            label="Empresa (nova)"
            value={draft.company}
            onChange={(v) => setDraft({ ...draft, company: v })}
          />
          <Field
            label="Início (novo)"
            type="month"
            value={draft.startDate}
            onChange={(v) => setDraft({ ...draft, startDate: v })}
          />
          <Field
            label="Fim (novo)"
            type="month"
            value={draft.endDate}
            onChange={(v) => setDraft({ ...draft, endDate: v })}
          />
          <div className="sm:col-span-2">
            <Button
              disabled={!draft.role.trim() || !draft.company.trim()}
              onClick={() => {
                addExperience(draft);
                setDraft(emptyExperience);
              }}
            >
              <Plus className="size-4" /> Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const emptyEducation = {
  institution: "",
  course: "",
  degree: "",
  startDate: "",
  endDate: "",
  inProgress: false,
};

function FormacaoTab() {
  const { state, addEducation, updateEducation, removeEducation } = useAppState();
  const [draft, setDraft] = useState(emptyEducation);

  return (
    <div className="space-y-6">
      {state.education.map((edu) => (
        <Card key={edu.id}>
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle className="text-base">{edu.course || "Curso"}</CardTitle>
              <CardDescription>{edu.institution}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remover formação"
              onClick={() => removeEducation(edu.id)}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Instituição"
              value={edu.institution}
              onChange={(v) => updateEducation(edu.id, { institution: v })}
            />
            <Field
              label="Curso"
              value={edu.course}
              onChange={(v) => updateEducation(edu.id, { course: v })}
            />
            <Field
              label="Grau"
              value={edu.degree}
              onChange={(v) => updateEducation(edu.id, { degree: v })}
              placeholder="Bacharelado, Tecnólogo…"
            />
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={edu.inProgress}
                onCheckedChange={(c) => updateEducation(edu.id, { inProgress: c === true })}
              />
              Em andamento
            </label>
            <Field
              label="Início (formação)"
              type="month"
              value={edu.startDate}
              onChange={(v) => updateEducation(edu.id, { startDate: v })}
            />
            <Field
              label="Conclusão"
              type="month"
              value={edu.endDate}
              onChange={(v) => updateEducation(edu.id, { endDate: v })}
            />
          </CardContent>
        </Card>
      ))}

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Adicionar formação</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Instituição (nova)"
            value={draft.institution}
            onChange={(v) => setDraft({ ...draft, institution: v })}
          />
          <Field
            label="Curso (novo)"
            value={draft.course}
            onChange={(v) => setDraft({ ...draft, course: v })}
          />
          <div className="sm:col-span-2">
            <Button
              disabled={!draft.institution.trim() || !draft.course.trim()}
              onClick={() => {
                addEducation(draft);
                setDraft(emptyEducation);
              }}
            >
              <Plus className="size-4" /> Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SkillsTab() {
  const { state, addSkill, removeSkill, addLanguage, removeLanguage } = useAppState();
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("intermediario");
  const [langName, setLangName] = useState("");
  const [langLevel, setLangLevel] = useState<LanguageLevel>("intermediario");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Habilidades técnicas</CardTitle>
          <CardDescription>
            O peso maior do match. Cadastre as tecnologias e ferramentas que domina.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-40 flex-1 space-y-1.5">
              <Label htmlFor="skill-name">Habilidade</Label>
              <Input
                id="skill-name"
                value={skillName}
                placeholder="React"
                onChange={(e) => setSkillName(e.target.value)}
              />
            </div>
            <Select value={skillLevel} onValueChange={(v) => setSkillLevel(v as SkillLevel)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {skillLevels.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              disabled={!skillName.trim()}
              onClick={() => {
                addSkill({ name: skillName.trim(), level: skillLevel });
                setSkillName("");
              }}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {state.skills.map((s) => (
              <Badge key={s.id} variant="secondary" className="gap-1.5 py-1">
                {s.name} · {s.level}
                <button
                  type="button"
                  aria-label={`Remover ${s.name}`}
                  onClick={() => removeSkill(s.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
            {state.skills.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma habilidade cadastrada ainda.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Idiomas</CardTitle>
          <CardDescription>Vagas com exigência de idioma usam este dado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-40 flex-1 space-y-1.5">
              <Label htmlFor="lang-name">Idioma</Label>
              <Input
                id="lang-name"
                value={langName}
                placeholder="Inglês"
                onChange={(e) => setLangName(e.target.value)}
              />
            </div>
            <Select value={langLevel} onValueChange={(v) => setLangLevel(v as LanguageLevel)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageLevels.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              disabled={!langName.trim()}
              onClick={() => {
                addLanguage({ name: langName.trim(), level: langLevel });
                setLangName("");
              }}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {state.languages.map((l) => (
              <Badge key={l.id} variant="secondary" className="gap-1.5 py-1">
                {l.name} · {l.level}
                <button
                  type="button"
                  aria-label={`Remover ${l.name}`}
                  onClick={() => removeLanguage(l.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
            {state.languages.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum idioma cadastrado ainda.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExtrasTab() {
  const { state, addCertification, removeCertification, addProject, removeProject, resetAll } =
    useAppState();
  const [cert, setCert] = useState({ name: "", issuer: "", date: "", url: "" });
  const [proj, setProj] = useState({ name: "", description: "", url: "", techs: "" });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Certificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Certificação"
              value={cert.name}
              onChange={(v) => setCert({ ...cert, name: v })}
            />
            <Field
              label="Emissor"
              value={cert.issuer}
              onChange={(v) => setCert({ ...cert, issuer: v })}
            />
            <Field
              label="Data da certificação"
              type="month"
              value={cert.date}
              onChange={(v) => setCert({ ...cert, date: v })}
            />
            <Field
              label="Link da certificação"
              value={cert.url}
              onChange={(v) => setCert({ ...cert, url: v })}
            />
          </div>
          <Button
            disabled={!cert.name.trim()}
            onClick={() => {
              addCertification(cert);
              setCert({ name: "", issuer: "", date: "", url: "" });
            }}
          >
            <Plus className="size-4" /> Adicionar certificação
          </Button>
          <ul className="space-y-2">
            {state.certifications.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span>
                  {c.name} {c.issuer && <span className="text-muted-foreground">· {c.issuer}</span>}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remover certificação"
                  onClick={() => removeCertification(c.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projetos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nome do projeto"
              value={proj.name}
              onChange={(v) => setProj({ ...proj, name: v })}
            />
            <Field
              label="Link do projeto"
              value={proj.url}
              onChange={(v) => setProj({ ...proj, url: v })}
            />
            <Field
              label="Tecnologias (separadas por vírgula)"
              value={proj.techs}
              onChange={(v) => setProj({ ...proj, techs: v })}
            />
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="proj-desc">Descrição do projeto</Label>
              <Textarea
                id="proj-desc"
                rows={3}
                value={proj.description}
                onChange={(e) => setProj({ ...proj, description: e.target.value })}
              />
            </div>
          </div>
          <Button
            disabled={!proj.name.trim()}
            onClick={() => {
              addProject({
                name: proj.name,
                description: proj.description,
                url: proj.url,
                techs: proj.techs
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              });
              setProj({ name: "", description: "", url: "", techs: "" });
            }}
          >
            <Plus className="size-4" /> Adicionar projeto
          </Button>
          <ul className="space-y-2">
            {state.projects.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span>{p.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remover projeto"
                  onClick={() => removeProject(p.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base">Apagar todos os dados</CardTitle>
          <CardDescription>
            Remove perfil, currículos e candidaturas salvos neste navegador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={resetAll}>
            Apagar tudo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
