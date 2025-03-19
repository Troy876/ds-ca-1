export type Game = {
    id: number,
    title: String,
    description: string,
    mature: boolean
}

export type GameStudio = {
    gameId: number;
    studioName: string;
    primaryGenre: string;
}

export type GameStudioQueryParams = {
    gameId: string;
    studioName?: string;
    primaryGenre?: string;
}
