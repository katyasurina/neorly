export type Rating = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

export interface CardState {
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueAt: Date;
}

export function scheduleCard(
  state: CardState,
  rating: Rating,
  now = new Date()
): CardState {
  let { easeFactor, interval, repetitions, dueAt } = state;

  if (rating === 1) {
    repetitions = 0;
    interval = 1;
    easeFactor = 2.5;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
  }

  if (rating === 2) interval = Math.round(interval * 1.2);
  if (rating === 4) {
    easeFactor += 0.15;
    interval = Math.round(interval * 1.3);
  } else {
    easeFactor = easeFactor - 0.15 + 0.01 * (5 - rating);
  }

  easeFactor = Math.max(1.3, easeFactor);

  const due = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  return {
    easeFactor,
    interval,
    repetitions,
    dueAt: due,
  };
}
