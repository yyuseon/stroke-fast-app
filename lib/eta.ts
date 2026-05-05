<<<<<<< HEAD
export function getEstimatedEtaMinutes(distanceKm: number) {
  const averageSpeedKmh = 30;
  const minutes = (distanceKm / averageSpeedKmh) * 60;

  return Math.max(3, Math.round(minutes));
=======
export function getEstimatedEtaMinutes(distanceKm: number) {
  const averageSpeedKmh = 30;
  const minutes = (distanceKm / averageSpeedKmh) * 60;

  return Math.max(3, Math.round(minutes));
>>>>>>> 8889a7359e013836eae2d12eb039ad0607c2157d
}