export function getEstimatedEtaMinutes(distanceKm: number) {
  const averageSpeedKmh = 30;
  const minutes = (distanceKm / averageSpeedKmh) * 60;

  return Math.max(3, Math.round(minutes));

}