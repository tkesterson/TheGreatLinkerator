export async function createNewLink({ name, url, comments, tags }) {
  console.log(name, url, comments, tags);
  try {
    const response = await fetch("/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        url,
        comments,
        tags,
      }),
    });
    const result = await response.json();

    return result;
  } catch (data) {
    return console.error(data);
  }
}
