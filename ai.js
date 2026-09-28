const AI_URL = "http://127.0.0.1:1234/v1/chat/completions";

async function explainAccessibilityIssue(issue) {
  const prompt = `You are a web accessibility expert.

Analyze this axe-core accessibility issue.

Return exactly:

What it means:
Why it matters:
How to fix:
HTML example:

IMPORTANT:
- Use plain text only.
- Do not use Markdown.
- Do not create links.
- Do not include URLs.
- Do not use [text](url).
- For HTML example, write ONE simple HTML tag only.
- For image issues, use exactly:
<img src="example.jpg" alt="Description of image">
- For decorative images, use exactly:
<img src="example.jpg" alt="">
- Do not add anything before or after the HTML tag.

Issue: ${issue.issue}
Severity: ${issue.severity}
Page: ${issue.page || "unknown"}
Selector: ${issue.selector || "unknown"}`;

  const response = await fetch(AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "qwen2.5-7b-instruct-1m",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0,
      max_tokens: 180,
      stream: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  let result = data.choices[0].message.content;

  result = result
  .replace(/```html/gi, "")
  .replace(/```/g, "")
  .replace(/\\</g, "<")
  .replace(/\\>/g, ">")
  .replace(/&#x20;/gi, " ")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .trim();

  return result;
}


async function generateAccessibilityFix(issue) {
  const prompt = `You are a web accessibility expert helping a developer fix an axe-core issue.

Provide a practical developer fix for this issue.

Return exactly these sections:

Fix:
Code:

Rules:
- Plain text only.
- Do not use Markdown.
- Do not use # headings.
- Do not use bullet points.
- Do not use backticks.
- Do not use code fences.
- Give ONE practical fix.
- Give ONE simple HTML code example.
- Do not repeat the same code example.

Issue: ${issue.issue}
Severity: ${issue.severity}
Page: ${issue.page || "unknown"}
Selector: ${issue.selector || "unknown"}`;

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 120000);

const response = await fetch(AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "qwen2.5-7b-instruct-1m",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0,
      max_tokens: 180,
      stream: false,
      signal: controller.signal
    })
  });

   clearTimeout(timeout);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  let result = data.choices[0].message.content;

result = result
  .replace(/```html/gi, "")
  .replace(/```/g, "")
  .replace(/\\</g, "<")
  .replace(/\\>/g, ">")
  .replace(/&#x20;/gi, " ")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .trim();

return result;

}

module.exports = {
  explainAccessibilityIssue,
  generateAccessibilityFix
};