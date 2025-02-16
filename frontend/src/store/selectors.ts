import { RootState } from "../store/store.ts";
import { UserStatus } from "../../../models/GameState";

export const getRank =
  (id: string) =>
  (state: RootState): number | null => {
    const userStatuses = state.gameState?.userStatuses;

    if (!Array.isArray(userStatuses)) {
      return null;
    }

    const userStatus = userStatuses.find(
      (user: UserStatus) => user.userId === id
    );
    return userStatus ? userStatus.rank : null;
  };

export const getLifePoints =
  (id: string) =>
  (state: RootState): number | null => {
    const userStatuses = state.gameState?.userStatuses;

    if (!Array.isArray(userStatuses)) {
      return null;
    }

    const userStatus = userStatuses.find(
      (user: UserStatus) => user.userId === id
    );
    return userStatus ? userStatus.lifePoints : null;
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
