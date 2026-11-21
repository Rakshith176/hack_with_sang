import { InterrogationVerdict } from "../types";
import { PlainStatus, StepKind } from "./types";

const STATUS_TEXT: Record<PlainStatus, string> = {
  record: "Matches the record",
  changed: "The telling changed",
  disagree: "People disagree",
  thin: "Not enough yet",
  unchecked: "Not checked yet",
};

const STEP_TEXT: Record<StepKind, string> = {
  record: "On the record",
  guess: "A reasonable guess",
  disagree: "People disagree",
  thin: "Not enough yet",
  gap: "Not enough yet",
};

const VERDICT_TEXT: Record<InterrogationVerdict["verdict"], string> = {
  rebuttal_found: "A disagreement was found",
  uncontested: "No disagreement found",
  active_dispute: "People disagree",
  insufficient_data: "Not enough yet",
};

export function statusText(status: PlainStatus): string {
  return STATUS_TEXT[status];
}

export function stepKindText(kind: StepKind): string {
  return STEP_TEXT[kind];
}

export function verdictText(verdict: InterrogationVerdict["verdict"]): string {
  return VERDICT_TEXT[verdict];
}
