import {
  ApiCreateCompletedCourse,
  ApiXP,
} from "../../../packages/apiTypes/src/CompletedCourse";
import {
  calcLevelProgress,
  normalizeCurrentProgress,
} from "../../../packages/apiTypes/src/academy/calcLevelProgress";

import { useRootApi, useRootSchemaResource, useRootSWR } from "../hooks/useApi";

export type UserXP = {
  xp: number;
  currentLevel: number;
  currentLevelProgress: number;
  xpNeededForNextLevel: number;
  normalizedProgress: number;
  isNewLevel: boolean;
  normalizedProgressBefore: number;
};

export type FinishCourseResponse = {
  data: {
    completedCourse?: {
      awardedXp: number;
    };
    userXp?: number;
  };
  status?: number;
};

export function useXP() {
  return useRootSchemaResource("academy/gamification/xp", ApiXP);
}

export function useMutateXP() {
  return useRootSWR("academy/gamification/xp").mutate;
}

export function useFinishCourse() {
  const mutate = useMutateXP();
  const api = useRootApi();
  return async (request: ApiCreateCompletedCourse) => {
    const resp = await api.post("elearning/courses/finish", request);
    await mutate();
    return resp;
  };
}

/**
 * Get all the necessary data for the user's XP
 */
export function calcUserXP(xp: number, awardedXP: number) {
  const userLevel = calcLevelProgress(xp);
  const userLevelBefore = calcLevelProgress(xp - awardedXP);

  const isNewLevel = userLevelBefore.currentLevel < userLevel.currentLevel;
  const normalized = normalizeCurrentProgress(
    userLevel.currentLevelProgress,
    userLevel.currentLevel,
  );
  let normalizedBefore = normalizeCurrentProgress(
    userLevelBefore.currentLevelProgress,
    userLevelBefore.currentLevel,
  );
  if (normalizedBefore >= normalized) {
    normalizedBefore = 0;
  }

  const userData: UserXP = {
    xp: xp,
    currentLevel: userLevel.currentLevel,
    currentLevelProgress: userLevel.currentLevelProgress,
    xpNeededForNextLevel: userLevel.xpNeededForNextLevel,
    normalizedProgress: normalized,
    isNewLevel: isNewLevel,
    normalizedProgressBefore: normalizedBefore,
  };
  return userData;
}
