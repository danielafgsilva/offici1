"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { fieldErrors } from "@/components/field-errors";
import { SelectField } from "@/components/select-field";
import { sendApplication, type ApplicationState } from "./actions";

const initialState: ApplicationState = { status: "idle" };
const MAX_CV_BYTES = 3 * 1024 * 1024; // the server checks again

type Job = { _id: string; title: string | null };

// `vacancy` fixes the form to one vacancy (the vacancy's own page); without it the visitor chooses, spontaneous application included
export function ApplicationForm({ jobs, vacancy: fixed }: { jobs: Job[]; vacancy?: Job }) {
  const [state, formAction, pending] = useActionState(sendApplication, initialState);
  const [vacancy, setVacancy] = useState("espontanea");

  // "Candidatar-me a esta vaga" links elsewhere on the page carry the vacancy in data-vaga and choose it here
  useEffect(() => {
    const choose = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLElement>("[data-vaga]");
      if (link?.dataset.vaga) setVacancy(link.dataset.vaga);
    };
    document.addEventListener("click", choose);
    return () => document.removeEventListener("click", choose);
  }, []);

  if (state.status === "sent") {
    return (
      <div role="status" className="py-4">
        <p className="font-display text-h2 font-semibold text-navy">Candidatura enviada.</p>
        <p className="mt-3">Obrigado pelo interesse em trabalhar connosco. O seu currículo seguiu para o gabinete.</p>
      </div>
    );
  }

  const { errors = {}, values = {} } = state;
  const { describe, error } = fieldErrors(errors);

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <p role="alert" className="rounded-[1rem] bg-error/10 p-4 font-medium text-error">
          {state.message}
        </p>
      )}

      {fixed ? (
        <div>
          <input type="hidden" name="vaga" value={fixed._id} />
          <p className="field-label">Vaga</p>
          <p>{fixed.title}</p>
        </div>
      ) : (
      <div>
        <label htmlFor="vaga" className="field-label">
          Vaga
        </label>
        <SelectField
          id="vaga"
          name="vaga"
          value={vacancy}
          onValueChange={(next) => setVacancy(String(next))}
          items={[{ value: "espontanea", label: "Candidatura espontânea" }, ...jobs.map((job) => ({ value: job._id, label: job.title ?? "" }))]}
          {...describe("vaga")}
        />
        {error("vaga")}
      </div>
      )}

      <div>
        <label htmlFor="name" className="field-label">
          Nome
        </label>
        <input id="name" name="name" autoComplete="name" required maxLength={100} defaultValue={values.name} className="field" {...describe("name")} />
        {error("name")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" spellCheck={false} required maxLength={200} defaultValue={values.email} className="field" {...describe("email")} />
          {error("email")}
        </div>
        <div>
          <label htmlFor="phone" className="field-label">
            Telefone <span className="font-normal text-muted">(opcional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} defaultValue={values.phone} className="field" {...describe("phone")} />
          {error("phone")}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          Mensagem <span className="font-normal text-muted">(opcional)</span>
        </label>
        <textarea id="message" name="message" rows={4} maxLength={2000} defaultValue={values.message} className="field" {...describe("message")} />
        {error("message")}
      </div>

      <div>
        <label htmlFor="cv" className="field-label">
          Currículo
        </label>
        <input
          id="cv"
          name="cv"
          type="file"
          accept="application/pdf,.pdf"
          required
          className="field file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-1.5 file:font-semibold file:text-offwhite"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            // Stops an oversized file before it is uploaded
            event.currentTarget.setCustomValidity(
              file && file.size > MAX_CV_BYTES ? "O ficheiro tem mais de 3 MB. Escolha um PDF mais leve." : "",
            );
          }}
          {...describe("cv", "cv-hint")}
        />
        <p id="cv-hint" className="mt-1.5 text-sm text-muted">
          Em PDF, até 3 MB.
        </p>
        {error("cv")}
      </div>

      {/* Honeypot: hidden from people and assistive technology */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            required
            defaultChecked={values.consent === "on"}
            className="mt-0.5 size-6 shrink-0 accent-navy"
            {...describe("consent")}
          />
          <span>
            Autorizo a Offici’um a usar estes dados e o meu currículo para avaliar a minha candidatura, nos termos da{" "}
            <Link href="/politica-de-privacidade" className="link">
              política de privacidade
            </Link>
            .
          </span>
        </label>
        {error("consent")}
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary btn-lg w-full sm:w-auto">
        {pending ? "A enviar…" : "Enviar candidatura"}
      </button>
    </form>
  );
}
