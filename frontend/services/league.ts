import { createClient } from '@/lib/supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function getAuthHeaders() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('Please log in to perform this action');
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
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
    },

    async getLeagueDetails(leagueId: string) {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/leagues/${leagueId}`, {
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to fetch league details');
        }
        return response.json();
    },

    async startDraft(leagueId: string) {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/leagues/${leagueId}/start-draft`, {
            method: 'POST',
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to start draft');
        }
        return response.json();
    },

    async getAvailablePlayers(leagueId: string) {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/leagues/${leagueId}/draft/players`, {
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to get available players');
        }
        return response.json();
    },

    async makeDraftPick(leagueId: string, playerId: number) {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/leagues/${leagueId}/draft/pick`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ player_id: playerId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to make draft pick');
        }
        return response.json();
    }
};
