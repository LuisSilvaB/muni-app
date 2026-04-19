import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { queryClient } from '@/lib/query-client'

interface Root {
  id: string
  name: string
  isMain?: boolean
}

interface Branch {
  id: string
  name: string
}

interface User {
  id: string
  email: string
  name?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isHydrated: boolean
  roots: Root[]
  branches: Branch[]
  selectedRootId: string | null
  selectedBranchId: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => void
  setHydrated: (hydrated: boolean) => void
  setRoots: (roots: Root[]) => void
  setBranches: (branches: Branch[]) => void
  setSelectedRoot: (rootId: string | null) => void
  setSelectedBranch: (branchId: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isHydrated: false,
      roots: [],
      branches: [],
      selectedRootId: null,
      selectedBranchId: null,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      signOut: () => {
        queryClient.clear()
        set({ user: null, roots: [], branches: [], selectedRootId: null, selectedBranchId: null })
      },
      setHydrated: (isHydrated) => set({ isHydrated }),
      setRoots: (roots) => set((state) => ({ 
        roots, 
        selectedRootId: state.selectedRootId && roots.some(r => r.id === state.selectedRootId) 
          ? state.selectedRootId 
          : roots.length > 0 ? roots[0].id : null 
      })),
      setBranches: (branches) => set((state) => ({ 
        branches, 
        selectedBranchId: state.selectedBranchId && branches.some(b => b.id === state.selectedBranchId)
          ? state.selectedBranchId
          : null 
      })),
      setSelectedRoot: (rootId) => set({ selectedRootId: rootId, selectedBranchId: null }),
      setSelectedBranch: (branchId) => set({ selectedBranchId: branchId }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)