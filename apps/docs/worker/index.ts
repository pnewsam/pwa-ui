import {
  DEFAULT_DEVICE_SIZES,
  DEFAULT_IMAGE_SIZES,
  handleImageOptimization,
} from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface HTMLRewriterElement {
  setAttribute(name: string, value: string): HTMLRewriterElement;
}

interface HTMLRewriterInstance {
  on(selector: string, handlers: { element(element: HTMLRewriterElement): void }): HTMLRewriterInstance;
  transform(response: Response): Response;
}

declare const HTMLRewriter: { new(): HTMLRewriterInstance };

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const viewportContent = "width=device-width, initial-scale=1, viewport-fit=cover";

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === "pwa-ui-docs.paul-newsam.workers.dev") {
      url.hostname = "pwaui.com";
      return Response.redirect(url, 308);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(
        request,
        {
          fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
          transformImage: async (body, { width, format, quality }) => {
            const result = await env.IMAGES.input(body)
              .transform(width > 0 ? { width } : {})
              .output({ format, quality });
            return result.response();
          },
        },
        allowedWidths,
      );
    }

    const response = await handler.fetch(request, env, ctx);
    const headers = new Headers(response.headers);
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "SAMEORIGIN");

    if (url.pathname.startsWith("/r/") && url.pathname.endsWith(".json")) {
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    }

    const outgoingResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    if (headers.get("content-type")?.includes("text/html")) {
      return new HTMLRewriter()
        .on('meta[name="viewport"]', {
          element(element) {
            element.setAttribute("content", viewportContent);
          },
        })
        .transform(outgoingResponse);
    }

    return outgoingResponse;
  },
};

export default worker;
