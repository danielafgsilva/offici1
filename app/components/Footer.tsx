import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { navigation, company, footerServices } from "../lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-100 bg-ink-50/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div className="lg:col-span-1">
            <Image
              src="/logo.png"
              alt="Offici'um"
              width={536}
              height={376}
              className="mb-4 h-11 w-auto"
            />
            <p className="text-sm leading-relaxed text-muted">
              {company.legalName}
            </p>
            <p className="mt-2 text-sm text-muted">NIF: {company.nif}</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-900">
              Navegação
            </h3>
            <ul className="space-y-2.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-brand-700"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-900">
              Serviços
            </h3>
            <ul className="space-y-2.5 text-sm text-muted">
              {footerServices.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-900">
              Contactos
            </h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600" />
                <span>
                  {company.address.line1} – {company.address.line2}
                  <br />
                  {company.address.postal}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600" />
                <span>
                  {company.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="block transition-colors hover:text-brand-700"
                    >
                      {phone}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-brand-600" />
                <a
                  href={`mailto:${company.email}`}
                  className="transition-colors hover:text-brand-700"
                >
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600" />
                <span>{company.hours[0]}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-ink-100 pt-8 text-center text-sm text-muted">
          <p>
            &copy; {year} {company.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
