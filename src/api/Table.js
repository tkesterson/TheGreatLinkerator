export async function getAllLinks() {
  try {
    const response = await fetch("/api/links", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    return result;
  } catch (data) {
    return console.error(data);
  }
}
