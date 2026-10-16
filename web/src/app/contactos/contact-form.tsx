"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { fieldErrors } from "@/components/field-errors";
import { SelectField } from "@/components/select-field";
import { sendContact, type ContactState } from "./actions";

const initialState: ContactState = { status: "idle" };

const MAX_FILE_BYTES = 3 * 1024 * 1024; // the server checks again, and also the total

export function ContactForm({ services }: { services: { _id: string; title: string | null }[] }) {
  const [state, formAction, pending] = useActionState(sendContact, initialState);

  const { errors = {}, values = {} } = state;
  const [chosen, setChosen] = useState<string | null>(null);
  const clientType = chosen ?? values.clientType ?? "";
  const ticked = (values.services ?? "").split(",");
  const { describe, error } = fieldErrors(errors);

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <p role="alert" className="rounded-[1rem] bg-error/10 p-4 font-medium text-error">
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="clientType" className="field-label">
          Fala em nome de
        </label>
        <SelectField
          id="clientType"
          name="clientType"
          placeholder="Escolha uma opção"
          required
          value={clientType}
          onValueChange={(next) => setChosen(String(next))}
          items={[
            { value: "particular", label: "Particular" },
            { value: "empresa", label: "Empresa" },
          ]}
          {...describe("clientType")}
        />
        {error("clientType")}
      </div>

      <div>
        <label htmlFor="services" className="field-label">
          Serviços em que está interessado <span className="font-normal text-muted">(um ou mais, opcional)</span>
        </label>
        <SelectField
          id="services"
          name="services"
          multiple
          placeholder="Escolha um ou mais serviços"
          defaultValue={ticked.filter(Boolean)}
          items={services.map((service) => ({ value: service._id, label: service.title ?? "" }))}
        />
      </div>

      {/* The visitor's signature line: we sign with our names, they sign with their company's */}
      {clientType === "empresa" && (
        <div>
          <label htmlFor="company" className="field-label">
            Nome da empresa <span className="font-normal text-muted">(opcional)</span>
          </label>
          <input id="company" name="company" autoComplete="organization" maxLength={100} defaultValue={values.company} className="field-signature" />
        </div>
      )}

      <div>
        <label htmlFor="name" className="field-label">
          Nome
        </label>
        <input id="name" name="name" autoComplete="name" required maxLength={100} defaultValue={values.name} className="field" {...describe("name")} />
        {error("name")}
      </div>

      {/* A phone number or an email: the server asks for at least one */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="field-label">
            Telefone
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} defaultValue={values.phone} className="field" {...describe("phone")} />
          {error("phone")}
        </div>
        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" spellCheck={false} maxLength={200} defaultValue={values.email} className="field" {...describe("email")} />
          {error("email")}
        </div>
      </div>

      <div>
        <label htmlFor="time" className="field-label">
          Melhor horário para o contactarmos
        </label>
        <SelectField
          key={values.time}
          id="time"
          name="time"
          defaultValue={values.time || "qualquer"}
          items={[
            { value: "qualquer", label: "Tanto faz" },
            { value: "manha", label: "De manhã" },
            { value: "tarde", label: "À tarde" },
          ]}
        />
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          Sobre o que quer falar?
        </label>
        <textarea id="message" name="message" rows={4} required maxLength={3000} defaultValue={values.message} className="field" {...describe("message")} />
        {error("message")}
      </div>

      <div>
        <label htmlFor="documents" className="field-label">
          Documentos <span className="font-normal text-muted">(opcional)</span>
        </label>
        <input
          id="documents"
          name="documents"
          type="file"
          multiple
          accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png"
          className="field file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-1.5 file:font-semibold file:text-offwhite"
          onChange={(event) => {
            const files = [...(event.currentTarget.files ?? [])];
            // Stops oversized files before they are uploaded
            event.currentTarget.setCustomValidity(
              files.length > 3
                ? "Pode anexar até 3 documentos."
                : files.some((file) => file.size > MAX_FILE_BYTES)
                  ? "Um dos ficheiros tem mais de 3 MB. Escolha ficheiros mais leves."
                  : "",
            );
          }}
          {...describe("documents", "documents-hint")}
        />
        <p id="documents-hint" className="mt-1.5 text-sm text-muted">
          Até 3 ficheiros em PDF, JPG ou PNG, com 3 MB cada. Envie só o que for necessário: seguem por email para o
          gabinete e não ficam guardados neste site.
        </p>
        {error("documents")}
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
            Autorizo a Offici’um a usar estes dados e os documentos que anexei para me contactar sobre este pedido, nos termos da{" "}
            <Link href="/politica-de-privacidade" className="link">
              política de privacidade
            </Link>
            .
          </span>
        </label>
        {error("consent")}
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary btn-lg w-full sm:w-auto">
        {pending ? "A enviar…" : "Quero ser contactado"}
      </button>
    </form>
  );
}
