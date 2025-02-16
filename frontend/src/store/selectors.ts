import { RootState } from "../store/store.ts";
import { UserStatus } from "../../../models/GameState";

export const getRank =
  (id: string) =>
  (state: RootState): number => {
    const userStatuses = state.gameState?.userStatuses;

    if (!Array.isArray(userStatuses)) {
      return -1;
    }

    const userStatus = userStatuses.find(
      (user: UserStatus) => user.userId === id
    );
    return userStatus ? userStatus.rank : -1;
  };

export const getLifePoints =
  (id: string) =>
  (state: RootState): number => {
    const userStatuses = state.gameState?.userStatuses;

    if (!Array.isArray(userStatuses)) {
      return -1;
    }

    const userStatus = userStatuses.find(
      (user: UserStatus) => user.userId === id
    );
    return userStatus ? userStatus.lifePoints : -1;
  };

export const getTopUsers =
  (k = 3) =>
  (state: RootState): UserStatus[] => {
    const userStatuses = state.gameState?.userStatuses;

    if (!Array.isArray(userStatuses)) {
      return [];
    }

    return userStatuses
      .slice()
      .sort((a, b) => b.lifePoints - a.lifePoints)
      .slice(0, k);
  };
