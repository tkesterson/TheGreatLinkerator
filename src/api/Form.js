export async function createNewLink({ name, url, comment, tags }) {
  try {
    const response = await fetch("/api/links", {
      method: "POST",
      body: JSON.stringify({
        name,
        url,
        comment,
        tags,
      }),
    });
    const result = await response.json();

    return result;
  } catch (data) {
    return console.error(data);
  }
}
