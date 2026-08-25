import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, FileText, Send, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { profileCompleteness, useAppState } from "@/store/app-state";
import { listJobs } from "@/services/jobs";
import { calculateMatch, matchTier, matchTierLabel } from "@/services/matching";
import { formatSalaryRange, relativeDate } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — MatchCV" },
      {
        name: "description",
        content:
          "Acompanhe seu match com vagas, o progresso do seu perfil e seus currículos otimizados para ATS.",
      },
      { property: "og:title", content: "Dashboard — MatchCV" },
      {
        property: "og:description",
        content: "Match inteligente entre seu perfil e vagas, com currículos otimizados para ATS.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { state, hydrated } = useAppState();
  const pct = profileCompleteness(state);
  const jobs = listJobs();
  const ranked = jobs
    .map((job) => ({ job, match: calculateMatch(state, job) }))
    .sort((a, b) => b.match.finalScore - a.match.finalScore)
    .slice(0, 4);

  const stats = [
    { label: "Vagas disponíveis", value: jobs.length, icon: Briefcase },
    { label: "Vagas salvas", value: state.savedJobIds.length, icon: Target },
    { label: "Candidaturas", value: state.applications.length, icon: Send },
    { label: "Currículos", value: state.resumes.length, icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {state.profile.fullName ? `Olá, ${state.profile.fullName.split(" ")[0]}` : "Bem-vindo(a)"}
        </h1>
        <p className="text-muted-foreground">
          Sua central de match entre perfil profissional e vagas — sem login, tudo salvo neste
          dispositivo.
        </p>
      </header>

      {hydrated && pct < 100 && (
        <Card className="border-primary/30 bg-primary-soft">
          <CardHeader>
            <CardTitle className="text-base">Complete seu perfil para melhorar o match</CardTitle>
            <CardDescription>
              Quanto mais completo o perfil, mais preciso o cálculo de compatibilidade e a análise
              ATS.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={pct} className="h-2" />
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium">{pct}% concluído</span>
              <Button asChild size="sm">
                <Link to="/perfil">
                  Continuar <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <span className="grid size-10 place-items-center rounded-lg bg-secondary text-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-2xl font-bold leading-none">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Melhores matches</h2>
            <p className="text-sm text-muted-foreground">
              Ranqueadas pelo seu perfil atual ({state.skills.length} habilidades cadastradas).
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/vagas">Ver todas</Link>
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {ranked.map(({ job, match }) => {
            const tier = matchTier(match.finalScore);
            return (
              <Card key={job.id}>
                <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{job.title}</CardTitle>
                    <CardDescription>
                      {job.company} · {job.location} · {job.workMode}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p
                      className={
                        tier === "excelente" || tier === "bom"
                          ? "text-2xl font-bold text-success"
                          : tier === "medio"
                            ? "text-2xl font-bold text-warning"
                            : "text-2xl font-bold text-destructive"
                      }
                    >
                      {match.finalScore}%
                    </p>
                    <p className="text-xs text-muted-foreground">{matchTierLabel[tier]}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {formatSalaryRange(job.salaryMin, job.salaryMax)} · publicada{" "}
                    {relativeDate(job.publishedAt)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.slice(0, 6).map((skill) => (
                      <Badge
                        key={skill}
                        variant={
                          match.matchedSkills.includes(skill.toLowerCase()) ? "default" : "secondary"
                        }
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
