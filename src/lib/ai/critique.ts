import { generateText, Output } from "ai";
import { z } from "zod";

const PROMPT_VERSION = "2026-04-01.v1";

const critiqueSchema = z.object({
  overall_verdict: z
    .string()
    .describe("Concise verdict on the submission quality and readiness."),
  thesis_strength: z
    .string()
    .describe("Assessment of the thesis or central claim's strength."),
  structural_failures: z
    .array(z.string())
    .describe("Structural breakdowns in argument, organization, or flow."),
  unsupported_claims: z
    .array(z.string())
    .describe("Claims lacking evidence or citation."),
  vague_terms: z
    .array(z.string())
    .describe("Terms or phrases that are vague or undefined."),
  strongest_objection: z
    .string()
    .describe("Most serious objection to the argument."),
  doctrinal_or_historical_imprecision: z
    .array(z.string())
    .describe("Doctrinal or historical inaccuracies or imprecision."),
  rewrite_priorities: z
    .array(z.string())
    .describe("Prioritized rewrite actions for the next draft."),
  score: z
    .number()
    .min(0)
    .max(100)
    .nullable()
    .describe("Overall score from 0-100, or null if not applicable."),
});

export type CritiqueResult = z.infer<typeof critiqueSchema>;

export async function generateCritique(input: {
  assignmentTitle: string;
  instructions: string;
  submission: string;
}) {
  const model = process.env.AI_MODEL ?? "openai/gpt-5.4";

  const prompt = `You are a rigorous academic reviewer.\n\nAssignment: ${input.assignmentTitle}\nInstructions: ${input.instructions}\n\nSubmission:\n${input.submission}\n\nReturn a critique as structured JSON following the schema. Be precise, cite concrete issues, and avoid filler.`;

  const { output } = await generateText({
    model,
    prompt,
    output: Output.object({
      schema: critiqueSchema,
      name: "critique",
      description:
        "Academic critique with verdict, thesis strength, structural failures, unsupported claims, vague terms, strongest objection, doctrinal or historical imprecision, rewrite priorities, and optional score.",
    }),
  });

  return { output, model, promptVersion: PROMPT_VERSION };
}
