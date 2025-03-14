import { createClient } from '@supabase/supabase-js';
import type { PasswordHistoryEntry } from "@/context/PasswordContext";

// 環境変数から取得することをお勧めします
const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL ;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ;
if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase URL and anon key must be provided.');

type SupabasePasswordHistoryEntry = PasswordHistoryEntry & {
    userId: string;
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// お気に入りパスワードをSupabaseに保存
export async function saveFavoritePassword(passwordEntry: SupabasePasswordHistoryEntry) {
    const { data, error } = await supabase
        .from('passwords')
        .upsert({
            id: passwordEntry.id,
            password: passwordEntry.password,
            created_at: passwordEntry.createdAt,
            is_favorite: passwordEntry.isFavorite,
            user_id: passwordEntry.userId
        });

    if (error) {
        console.error('Error saving password:', error);
        return null;
    }

    return data;
}

// ユーザーのパスワード履歴を取得
export async function fetchPasswordHistory(userId: string) {
    const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching password history:', error);
        return [];
    }

    return data.map(item => ({
        id: item.id,
        password: item.password,
        createdAt: item.created_at,
        isFavorite: item.is_favorite
    }));
}

// パスワード履歴から削除
export async function removePassword(id: string) {
    const { error } = await supabase
        .from('passwords')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error removing password:', error);
    }
}
