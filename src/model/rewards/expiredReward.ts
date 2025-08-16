export type Point = {
    point_id: string;
    point_desc: string;
    created_at: string;
    expires_at: string;
    points: number;
    type: string;
};

export type Total = {
    filtered: number;
}

export type PointsList = {
    pointsList: Point[];
    total: Total;
};

export type PointsToExpireResponse = {
    data: {
        users_pointsToExpire: PointsList;
    };
};
