import { createClient } from '@/lib/supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function getAuthHeaders() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    return {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
    };
}

export const leagueService = {
    async createLeague(name: string, teamName: string) {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/leagues/`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ name, team_name: teamName }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to create league');
        }
        return response.json();
    },

    async joinLeague(inviteCode: string, teamName: string) {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/leagues/join`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ invite_code: inviteCode, team_name: teamName }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to join league');
        }
        return response.json();
    },

    async getMyLeagues() {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/leagues/me`, {
            headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch leagues');
        }
        return response.json();
    }
};
