import {z} from "zod"

export const MessageSchema = z.object({
  senderId: z.string(),
  messageType: z.enum(["normal"]),
  contentType: z.enum(["text"]),
  textContent: z.string().optional()
}).strict().superRefine((data, ctx) => {
  if (data.contentType === "text" && !data.textContent) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "textContent is required when contentType is 'text'",
      path: ["textContent"],
    });
  }

  if (data.contentType !== "text" && data.textContent) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "textContent must not be provided when contentType is not 'text'",
      path: ["textContent"],
    });
  }
});
