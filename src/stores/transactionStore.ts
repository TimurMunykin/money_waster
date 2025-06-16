import { create } from 'zustand'
import { Transaction, Category } from '@/types'

interface TransactionStore {
  transactions: Transaction[]
  categories: Category[]
  setTransactions: (transactions: Transaction[]) => void
  setCategories: (categories: Category[]) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  addCategory: (category: Category) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  categories: [],
  setTransactions: (transactions) => set({ transactions }),
  setCategories: (categories) => set({ categories }),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),
  updateTransaction: (id, transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...transaction } : t
      ),
    })),
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (id, category) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...category } : c
      ),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
}))
