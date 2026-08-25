import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { storage, uid } from "@/services/storage";
import type {
  AppState,
  Application,
  CareerGoal,
  Certification,
  Education,
  Experience,
  LanguageEntry,
  NotificationPrefs,
  Profile,
  ProjectEntry,
  Resume,
  UserSkill,
} from "@/types";

export function createEmptyState(): AppState {
  const now = new Date().toISOString();
  const profile: Profile = {
    id: uid("profile"),
    fullName: "",
    headline: "",
    location: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    createdAt: now,
    updatedAt: now,
  };
  const goal: CareerGoal = {
    targetRole: "",
    area: "",
    workMode: "remoto",
    desiredLocation: "",
    salaryExpectation: "",
  };
  const notifications: NotificationPrefs = {
    newMatchingJobs: true,
    applicationUpdates: true,
    resumeSuggestions: true,
  };
  return {
    profile,
    goal,
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
    savedJobIds: [],
    applications: [],
    resumes: [],
    notifications,
    onboardingCompleted: false,
  };
}

type Setter = (updater: (state: AppState) => AppState) => void;

interface AppStateContextValue {
  state: AppState;
  hydrated: boolean;
  update: Setter;
  updateProfile: (patch: Partial<Profile>) => void;
  updateGoal: (patch: Partial<CareerGoal>) => void;
  addExperience: (item: Omit<Experience, "id" | "profileId">) => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (item: Omit<Education, "id" | "profileId">) => void;
  updateEducation: (id: string, patch: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (item: Omit<UserSkill, "id" | "profileId">) => void;
  removeSkill: (id: string) => void;
  addLanguage: (item: Omit<LanguageEntry, "id" | "profileId">) => void;
  removeLanguage: (id: string) => void;
  addCertification: (item: Omit<Certification, "id" | "profileId">) => void;
  removeCertification: (id: string) => void;
  addProject: (item: Omit<ProjectEntry, "id" | "profileId">) => void;
  removeProject: (id: string) => void;
  toggleSavedJob: (jobId: string) => void;
  upsertApplication: (application: Application) => void;
  removeApplication: (id: string) => void;
  upsertResume: (resume: Resume) => void;
  removeResume: (id: string) => void;
  resetAll: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => createEmptyState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = storage.load();
    if (loaded) setState({ ...createEmptyState(), ...loaded });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) storage.save(state);
  }, [state, hydrated]);

  const value = useMemo<AppStateContextValue>(() => {
    const update: Setter = (updater) => setState((prev) => updater(prev));
    const touch = (s: AppState): AppState => ({
      ...s,
      profile: { ...s.profile, updatedAt: new Date().toISOString() },
    });

    return {
      state,
      hydrated,
      update,
      updateProfile: (patch) => update((s) => touch({ ...s, profile: { ...s.profile, ...patch } })),
      updateGoal: (patch) => update((s) => touch({ ...s, goal: { ...s.goal, ...patch } })),

      addExperience: (item) =>
        update((s) => ({
          ...s,
          experiences: [
            ...s.experiences,
            { ...item, id: uid("exp"), profileId: s.profile.id } as Experience,
          ],
        })),
      updateExperience: (id, patch) =>
        update((s) => ({
          ...s,
          experiences: s.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
      removeExperience: (id) =>
        update((s) => ({ ...s, experiences: s.experiences.filter((e) => e.id !== id) })),

      addEducation: (item) =>
        update((s) => ({
          ...s,
          education: [
            ...s.education,
            { ...item, id: uid("edu"), profileId: s.profile.id } as Education,
          ],
        })),
      updateEducation: (id, patch) =>
        update((s) => ({
          ...s,
          education: s.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
      removeEducation: (id) =>
        update((s) => ({ ...s, education: s.education.filter((e) => e.id !== id) })),

      addSkill: (item) =>
        update((s) =>
          s.skills.some((k) => k.name.toLowerCase() === item.name.toLowerCase())
            ? s
            : {
                ...s,
                skills: [
                  ...s.skills,
                  { ...item, id: uid("skill"), profileId: s.profile.id } as UserSkill,
                ],
              },
        ),
      removeSkill: (id) => update((s) => ({ ...s, skills: s.skills.filter((k) => k.id !== id) })),

      addLanguage: (item) =>
        update((s) => ({
          ...s,
          languages: [
            ...s.languages,
            { ...item, id: uid("lang"), profileId: s.profile.id } as LanguageEntry,
          ],
        })),
      removeLanguage: (id) =>
        update((s) => ({ ...s, languages: s.languages.filter((l) => l.id !== id) })),

      addCertification: (item) =>
        update((s) => ({
          ...s,
          certifications: [
            ...s.certifications,
            { ...item, id: uid("cert"), profileId: s.profile.id } as Certification,
          ],
        })),
      removeCertification: (id) =>
        update((s) => ({ ...s, certifications: s.certifications.filter((c) => c.id !== id) })),

      addProject: (item) =>
        update((s) => ({
          ...s,
          projects: [
            ...s.projects,
            { ...item, id: uid("proj"), profileId: s.profile.id } as ProjectEntry,
          ],
        })),
      removeProject: (id) =>
        update((s) => ({ ...s, projects: s.projects.filter((p) => p.id !== id) })),

      toggleSavedJob: (jobId) =>
        update((s) => ({
          ...s,
          savedJobIds: s.savedJobIds.includes(jobId)
            ? s.savedJobIds.filter((id) => id !== jobId)
            : [...s.savedJobIds, jobId],
        })),

      upsertApplication: (application) =>
        update((s) => ({
          ...s,
          applications: s.applications.some((a) => a.id === application.id)
            ? s.applications.map((a) => (a.id === application.id ? application : a))
            : [...s.applications, application],
        })),
      removeApplication: (id) =>
        update((s) => ({ ...s, applications: s.applications.filter((a) => a.id !== id) })),

      upsertResume: (resume) =>
        update((s) => ({
          ...s,
          resumes: s.resumes.some((r) => r.id === resume.id)
            ? s.resumes.map((r) => (r.id === resume.id ? resume : r))
            : [...s.resumes, resume],
        })),
      removeResume: (id) => update((s) => ({ ...s, resumes: s.resumes.filter((r) => r.id !== id) })),

      resetAll: () => {
        storage.clear();
        setState(createEmptyState());
      },
    };
  }, [state, hydrated]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState deve ser usado dentro de AppStateProvider");
  return ctx;
}

/** Percentual de completude do perfil — alimenta dashboard e onboarding. */
export function profileCompleteness(state: AppState): number {
  const checks = [
    !!state.profile.fullName,
    !!state.profile.headline,
    !!state.profile.email,
    !!state.profile.location,
    state.profile.summary.length >= 80,
    !!state.goal.targetRole,
    state.experiences.length > 0,
    state.education.length > 0,
    state.skills.length >= 5,
    state.languages.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
