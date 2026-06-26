"use client";

import { useState } from "react";
import { Send, Upload, X } from "lucide-react";
import { Container } from "../components/ui";
import { PageHero } from "../components/PageHero";
import { toast } from "../components/Toast";
import { company } from "../lib/site";

const positions = [
  "Estagiário de Contabilidade",
  "Contabilista Certificado",
  "Consultor Fiscal",
  "Técnico de Recursos Humanos",
  "Candidatura Espontânea",
];

const fieldClass =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none transition-all placeholder:text-ink-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";
const labelClass = "mb-2 block text-sm font-medium text-ink-800";

export function ApplyView() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    linkedin: "",
    message: "",
  });
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success(
      "Candidatura enviada com sucesso! Entraremos em contacto em breve."
    );
    setForm({ name: "", email: "", phone: "", position: "", linkedin: "", message: "" });
    setFileName("");
    setSubmitting(false);
  };

  return (
    <>
      <PageHero
        eyebrow="Candidatura"
        title="Enviar candidatura"
        lead="Preencha o formulário abaixo e envie o seu CV. Analisaremos com atenção a sua candidatura."
      />

      <section className="py-20 md:py-24">
        <Container className="max-w-3xl">
          <form
            onSubmit={onSubmit}
            className="card-surface space-y-6 rounded-3xl p-8 md:p-10"
          >
            <div>
              <label htmlFor="name" className={labelClass}>
                Nome Completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={onChange}
                className={fieldClass}
                placeholder="O seu nome"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={onChange}
                  className={fieldClass}
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Telefone *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={onChange}
                  className={fieldClass}
                  placeholder="+351 123 456 789"
                />
              </div>
            </div>

            <div>
              <label htmlFor="position" className={labelClass}>
                Posição Pretendida *
              </label>
              <select
                id="position"
                name="position"
                required
                value={form.position}
                onChange={onChange}
                className={fieldClass}
              >
                <option value="">Selecione uma posição</option>
                {positions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="linkedin" className={labelClass}>
                LinkedIn (opcional)
              </label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                value={form.linkedin}
                onChange={onChange}
                className={fieldClass}
                placeholder="https://linkedin.com/in/seu-perfil"
              />
            </div>

            <div>
              <label className={labelClass}>
                Curriculum Vitae * (PDF, DOC, DOCX — máx. 5MB)
              </label>
              <div className="relative">
                <input
                  id="cv"
                  name="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                  className="hidden"
                />
                <label
                  htmlFor="cv"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 px-4 py-4 text-muted transition-colors hover:border-brand-400 hover:text-brand-700"
                >
                  <Upload className="h-5 w-5" />
                  <span>{fileName || "Clique para selecionar o seu CV"}</span>
                </label>
                {fileName && (
                  <button
                    type="button"
                    onClick={() => {
                      setFileName("");
                      const input = document.getElementById("cv") as HTMLInputElement | null;
                      if (input) input.value = "";
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-ink-400 hover:bg-ink-50"
                    aria-label="Remover ficheiro"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>
                Mensagem / Carta de Motivação *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={onChange}
                className={`${fieldClass} resize-none`}
                placeholder="Fale-nos sobre a sua motivação e porque quer juntar-se à nossa equipa..."
              />
            </div>

            <div className="rounded-xl border border-ink-100 bg-ink-50/70 p-4">
              <p className="text-sm text-muted">
                <strong className="text-ink-800">Proteção de Dados:</strong> Os
                dados pessoais fornecidos serão utilizados exclusivamente para
                fins de recrutamento e tratados de acordo com o RGPD. Ao submeter
                esta candidatura, consente o tratamento dos seus dados pessoais.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-4 font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  A enviar candidatura...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Enviar Candidatura
                </>
              )}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-ink-100 bg-ink-50/60 p-6 text-center">
            <h3 className="font-semibold text-ink-900">Envio alternativo</h3>
            <p className="mt-1 text-sm text-muted">
              Também pode enviar o seu CV diretamente para:{" "}
              <a
                href={`mailto:${company.email}`}
                className="font-medium text-brand-700 hover:underline"
              >
                {company.email}
              </a>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
