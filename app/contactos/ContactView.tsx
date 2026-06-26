"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Container } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { PageHero } from "../components/PageHero";
import { toast } from "../components/Toast";
import { company } from "../lib/site";

const subjects = [
  "Pedido de Informação",
  "Contabilidade",
  "Consultoria Fiscal",
  "Abertura de Empresa",
  "Recursos Humanos",
  "Candidatura Espontânea",
  "Outro",
];

const contactInfo = [
  {
    icon: MapPin,
    title: "Morada",
    details: [
      company.address.line1,
      company.address.line2,
      company.address.postal,
      company.address.country,
    ],
  },
  {
    icon: Phone,
    title: "Telefone",
    details: company.phones,
    links: company.phones.map((p) => `tel:${p.replace(/\s/g, "")}`),
  },
  {
    icon: Mail,
    title: "Email",
    details: [company.email],
    links: [`mailto:${company.email}`],
  },
  {
    icon: Clock,
    title: "Horário",
    details: company.hours,
  },
];

const fieldClass =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none transition-all placeholder:text-ink-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";
const labelClass = "mb-2 block text-sm font-medium text-ink-800";

export function ContactView() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Mensagem enviada com sucesso! Entraremos em contacto em breve.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setSubmitting(false);
  };

  return (
    <>
      <PageHero
        eyebrow="Contactos"
        title="Estamos aqui para ajudar"
        lead="Entre em contacto connosco e descubra como podemos impulsionar o seu negócio."
      />

      <section className="py-20 md:py-28">
        <Container>
          {/* Info cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, i) => (
              <Reveal key={info.title} delay={(i % 4) * 0.08}>
                <div className="card-surface flex h-full flex-col gap-3 rounded-2xl p-6">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <info.icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-semibold text-ink-900">{info.title}</h3>
                  <div className="space-y-0.5 text-sm text-muted">
                    {info.details.map((detail, idx) => {
                      const href = "links" in info ? info.links?.[idx] : undefined;
                      return (
                        <p key={detail}>
                          {href ? (
                            <a
                              href={href}
                              className="transition-colors hover:text-brand-700"
                            >
                              {detail}
                            </a>
                          ) : (
                            detail
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Form + map */}
          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900">
                Envie-nos uma mensagem
              </h2>
              <form onSubmit={onSubmit} className="mt-6 space-y-6">
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
                      Telefone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={onChange}
                      className={fieldClass}
                      placeholder="+351 123 456 789"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>
                    Assunto *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={onChange}
                    className={fieldClass}
                  >
                    <option value="">Selecione um assunto</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={onChange}
                    className={`${fieldClass} resize-none`}
                    placeholder="Escreva a sua mensagem aqui..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      A enviar...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            </Reveal>

            <Reveal delay={0.1} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-ink-900">Encontre-nos</h2>
                <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-ink-100 shadow-sm">
                  <iframe
                    src="https://www.google.com/maps?q=Av.%20da%20Rep%C3%BAblica%20872%2C%204430-190%20Vila%20Nova%20de%20Gaia&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização Offici'um"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-6">
                <MapPin className="mb-4 h-6 w-6 text-brand-600" />
                <h3 className="mb-4 text-lg font-semibold text-ink-900">
                  Informação Legal
                </h3>
                <div className="space-y-3 text-sm text-muted">
                  <p>
                    <strong className="text-ink-800">Denominação Social:</strong>
                    <br />
                    {company.legalName}
                  </p>
                  <p>
                    <strong className="text-ink-800">NIF:</strong> {company.nif}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
