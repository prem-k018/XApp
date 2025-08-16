export type LeaderBoardListResponse = {
    data: {
        users_getLeaderBoardList: LeaderBoardEntry[];
    };
};

export type LeaderBoardEntry = {
    rank: number;
    userName: string;
    email: string;
    totalPoints: number;
    isCurrentUser: boolean;
};
