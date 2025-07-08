export async function POST(req: Request) {
    const { messages } = await req.json();
  
    const reply = {
      role: "assistant",
      content: `Đây là phản hồi mẫu từ trợ lý AI. Bạn vừa hỏi: "${messages[messages.length - 1]?.content}"`,
    };
  
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(JSON.stringify(reply)));
        controller.close();
      },
    });
  
    return new Response(stream, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  