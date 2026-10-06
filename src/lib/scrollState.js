import { create } from 'zustand'

export const scrollState = {
  hero: 0,
  journey: 0,
  skills: 0,
  projects: 0,
}

export const scroller = {
  lenis: null,
}

export const useSceneStore = create((set) => ({
  sceneReady: false,
  introDone: false,
  activeSection: 'accueil',
  setSceneReady: () => set({ sceneReady: true }),
  setIntroDone: () => set({ introDone: true }),
  setActiveSection: (activeSection) => set({ activeSection }),
}))
