import { create } from 'zustand';
import { User, CompanyAgent, Post, MasterAgent, ChatMessage, ChatSession, MASTER_AGENTS } from '../types';
import { generateCompanyAgent, generateInitialPosts, generateChatReply } from '../utils/mock-data';

interface AppState {
  // Auth
  user: User | null;
  isLoggedIn: boolean;
  login: (phone: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'avatar' | 'bio'>>) => void;

  // Companies
  companies: CompanyAgent[];
  addCompanies: (names: string[]) => void;
  removeCompany: (id: string) => void;

  // Posts
  posts: Post[];
  toggleBookmark: (postId: string) => void;
  getBookmarkedPosts: () => Post[];

  // Masters
  selectedMasters: MasterAgent[];
  addMasters: (ids: string[]) => void;
  activeMasterId: string | null;
  setActiveMaster: (id: string) => void;

  // Chat
  chatSessions: Record<string, ChatMessage[]>;
  sendMessage: (masterId: string, content: string) => void;

  // Search
  searchHistory: string[];
  addSearchHistory: (keyword: string) => void;
  clearSearchHistory: () => void;
}

const STORAGE_KEY = 'investment-assistant-state';

function loadState(): Partial<AppState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return {};
}

function saveState(state: Partial<AppState>) {
  try {
    const toSave = {
      user: state.user,
      isLoggedIn: state.isLoggedIn,
      companies: state.companies,
      posts: state.posts,
      selectedMasters: state.selectedMasters,
      activeMasterId: state.activeMasterId,
      chatSessions: state.chatSessions,
      searchHistory: state.searchHistory,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {}
}

const saved = loadState();

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: saved.user || null,
  isLoggedIn: saved.isLoggedIn || false,
  login: (phone: string) => {
    const user: User = {
      id: `user-${Date.now()}`,
      phone,
      name: '',
      avatar: '',
      bio: '',
      createdAt: new Date().toISOString(),
    };
    set({ user, isLoggedIn: true });
    saveState(get());
  },
  logout: () => {
    set({
      user: null,
      isLoggedIn: false,
      companies: [],
      posts: [],
      selectedMasters: [],
      activeMasterId: null,
      chatSessions: {},
      searchHistory: [],
    });
    localStorage.removeItem(STORAGE_KEY);
  },
  updateProfile: (data) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, ...data } });
      saveState(get());
    }
  },

  // Companies
  companies: saved.companies || [],
  addCompanies: (names: string[]) => {
    const newCompanies = names.map((name, i) => generateCompanyAgent(name, i));
    const newPosts = newCompanies.flatMap((c) => generateInitialPosts(c));
    set((state) => ({
      companies: [...state.companies, ...newCompanies],
      posts: [...newPosts, ...state.posts],
    }));
    saveState(get());
  },
  removeCompany: (id: string) => {
    set((state) => ({
      companies: state.companies.filter((c) => c.id !== id),
      posts: state.posts.filter((p) => p.companyId !== id),
    }));
    saveState(get());
  },

  // Posts
  posts: saved.posts || [],
  toggleBookmark: (postId: string) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, bookmarked: !p.bookmarked } : p
      ),
    }));
    saveState(get());
  },
  getBookmarkedPosts: () => {
    return get().posts.filter((p) => p.bookmarked);
  },

  // Masters
  selectedMasters: saved.selectedMasters || [],
  addMasters: (ids: string[]) => {
    const masters = MASTER_AGENTS.filter((m) => ids.includes(m.id));
    set({ selectedMasters: masters, activeMasterId: masters[0]?.id || null });
    saveState(get());
  },
  activeMasterId: saved.activeMasterId || null,
  setActiveMaster: (id: string) => {
    set({ activeMasterId: id });
    saveState(get());
  },

  // Chat
  chatSessions: saved.chatSessions || {},
  sendMessage: (masterId: string, content: string) => {
    const master = get().selectedMasters.find((m) => m.id === masterId);
    if (!master) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    const reply = generateChatReply(master.name, master.style, content);
    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: reply,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      chatSessions: {
        ...state.chatSessions,
        [masterId]: [...(state.chatSessions[masterId] || []), userMsg, assistantMsg],
      },
    }));
    saveState(get());
  },

  // Search
  searchHistory: saved.searchHistory || [],
  addSearchHistory: (keyword: string) => {
    set((state) => ({
      searchHistory: [keyword, ...state.searchHistory.filter((k) => k !== keyword)].slice(0, 20),
    }));
    saveState(get());
  },
  clearSearchHistory: () => {
    set({ searchHistory: [] });
    saveState(get());
  },
}));
