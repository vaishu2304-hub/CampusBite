const API_URL = "http://localhost:3001";

export async function getFoods() {
  const response = await fetch(`${API_URL}/foods`);

  if (!response.ok) {
    throw new Error("Failed to load food items");
  }

  return response.json();
}