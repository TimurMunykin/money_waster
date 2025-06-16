import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Transaction, Category } from '@/types'
import { useTransactionStore } from '@/stores/transactionStore'

export const useTransactions = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { transactions, categories, setTransactions, setCategories } = useTransactionStore()

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .limit(100)

    if (error) {
      setError(error.message)
    } else {
      setTransactions((data as Transaction[]) || [])
    }
    setLoading(false)
  }, [setTransactions])

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      setError(error.message)
    } else {
      setCategories((data as Category[]) || [])
    }
  }, [setCategories])

  const createTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...transaction,
        user_id: '00000000-0000-0000-0000-000000000000' // Temporary user ID for demo
      })
      .select()

    if (error) {
      setError(error.message)
    } else if (data?.[0]) {
      useTransactionStore.getState().addTransaction(data[0] as Transaction)
    }
    setLoading(false)
  }

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    setLoading(true)
    const { error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      useTransactionStore.getState().updateTransaction(id, updates)
    }
    setLoading(false)
  }

  const deleteTransaction = async (id: string) => {
    setLoading(true)
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      useTransactionStore.getState().deleteTransaction(id)
    }
    setLoading(false)
  }

  useEffect(() => {
    void fetchTransactions()
    void fetchCategories()
  }, [fetchTransactions, fetchCategories])

  return {
    transactions,
    categories,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  }
}
