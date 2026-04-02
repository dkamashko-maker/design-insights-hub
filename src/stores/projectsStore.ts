import { create } from "zustand";
import { mockProjects, type Project } from "@/data/projectsData";

interface ProjectsState {
  projects: Project[];
  addProject: (p: Project) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  togglePublic: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: mockProjects,
  addProject: (p) => set((s) => ({ projects: [p, ...s.projects] })),
  deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
  duplicateProject: (id) => {
    const original = get().projects.find((p) => p.id === id);
    if (!original) return;
    const dup: Project = {
      ...original,
      id: `proj-${Date.now()}`,
      name: `${original.name} (копия)`,
      isPublic: false,
      shareToken: Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((s) => ({ projects: [dup, ...s.projects] }));
  },
  togglePublic: (id) => set((s) => ({
    projects: s.projects.map((p) => p.id === id ? { ...p, isPublic: !p.isPublic } : p),
  })),
  updateProject: (id, updates) => set((s) => ({
    projects: s.projects.map((p) => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p),
  })),
}));
