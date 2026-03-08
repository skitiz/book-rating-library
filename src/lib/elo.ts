export function updateElo(
  winnerElo: number,
  loserElo: number,
  k = 32
): [number, number] {
  const expected = 1 / (1 + 10 ** ((loserElo - winnerElo) / 400));
  return [
    Math.round(winnerElo + k * (1 - expected)),
    Math.round(loserElo + k * (0 - (1 - expected))),
  ];
}
