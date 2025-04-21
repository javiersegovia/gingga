import { render } from "@react-email/components";
import type { ReactElement } from "react";
import { z } from "zod";
import { apiEnv } from "~/env";

const ResendErrorSchema = z.union([
  z.object({
    name: z.string(),
    message: z.string(),
    statusCode: z.number(),
  }),
  z.object({
    name: z.literal("UnknownError"),
    message: z.literal("Unknown Error"),
    statusCode: z.literal(500),
    cause: z.any(),
  }),
]);
type ResendError = z.infer<typeof ResendErrorSchema>;

const resendSuccessSchema = z.object({
  id: z.string(),
});

export async function sendEmail({
  react,
  ...options
}: {
  to: string;
  subject: string;
  from?: string;
} & (
  | { html: string; text: string; react?: never }
  | { react: ReactElement; html?: never; text?: never }
)) {
  /* This can be improved. Right now all emails will be treated as delivered in dev mode. */
  const from =
    options.from ||
    (process.env.NODE_ENV === "development"
      ? "delivered@resend.dev"
      : apiEnv.VITE_RESEND_EMAIL_FROM);

  const to =
    process.env.NODE_ENV === "development"
      ? "delivered@resend.dev"
      : options.to;

  const email = {
    ...options,
    ...(react ? await renderReactEmail(react) : null),
    from,
    to,
  };

  if (!apiEnv.RESEND_API_KEY) {
    console.error(`RESEND_API_KEY not set and we're not in mocks mode.`);
    console.error(
      "To send emails, set the RESEND_API_KEY environment variable."
    );
    console.error(
      "Would have sent the following email:",
      JSON.stringify(email)
    );

    return {
      status: "success",
      data: { id: "mocked" },
    } as const;
  }

  // if (import.meta.env.DEV && from !== env.VITE_RESEND_EMAIL_FROM) {
  //   console.log('Sending email:', { ...options, from, to })
  //   return {
  //     status: 'success',
  //     data: { id: 'mocked' },
  //   } as const
  // }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    body: JSON.stringify(email),
    headers: {
      Authorization: `Bearer ${apiEnv.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  const parsedData = resendSuccessSchema.safeParse(data);

  if (response.ok && parsedData.success) {
    return {
      status: "success",
      data: parsedData,
    } as const;
  }

  const parseResult = ResendErrorSchema.safeParse(data);
  if (parseResult.success) {
    return {
      status: "error",
      error: parseResult.data,
    } as const;
  }

  return {
    status: "error",
    error: {
      name: "UnknownError",
      message: "Unknown Error",
      statusCode: 500,
      cause: data,
    } satisfies ResendError,
  } as const;
}

async function renderReactEmail(react: ReactElement) {
  const [html, text] = await Promise.all([
    render(react),
    render(react, { plainText: true }),
  ]);
  return { html, text };
}
