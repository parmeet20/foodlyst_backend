export interface UserDetailsResponse {
    id: number;
    name: string;
    email: string;
    walletAddress: string;
    walletConnected: boolean;
    balance: number;
    role: string;
}
