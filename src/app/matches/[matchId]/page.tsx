import MatchDetailScreen from "@/features/matches/match-detail-screen";

export const metadata = {
    title: "Chat | Vouch",
};

export default async function Page({
    params,
}: {
    params: Promise<{ matchId: string }>;
}) {
    const { matchId } = await params;
    return <MatchDetailScreen matchId={matchId} />;
}
