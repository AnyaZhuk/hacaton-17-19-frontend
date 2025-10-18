export const startSimulation = async () => {
  await fetch('/simulate/start', { method: 'POST' });
};

export const stopSimulation = async () => {
  await fetch('/simulate/stop', { method: 'POST' });
};

export const fetchStatisticCount = async (status_t) => {
  const response = await fetch(`/statistic/all_count/${status_t}`);
  return response.json();
};

export const fetchTimeSpending = async () => {
  const response = await fetch('/statistic/time_spending');
  return response.json();
};

export const fetchCards = async (status) => {
  const response = await fetch(`/statistic/cards/${status}?status_t=${status}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
