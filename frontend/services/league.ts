const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const leagueService = {
    async createLeague(name: string) {
        const response = await fetch(`${API_BASE_URL}/leagues/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to create league');
        }
        return response.json();
    },

    async joinLeague(inviteCode: string) {
        const response = await fetch(`${API_BASE_URL}/leagues/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invite_code: inviteCode }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to join league');
        }
        return response.json();
    },

    async getMyLeagues() {
        const response = await fetch(`${API_BASE_URL}/leagues/me`);
        if (!response.ok) {
            throw new Error('Failed to fetch leagues');
        }
        return response.json();
    }
};
