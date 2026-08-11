"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { quoteSchema, PROPERTY_TYPES, SERVICE_OPTIONS, type QuoteInput } from "@/lib/validation";
import { submitQuote } from "@/app/actions/submit-quote";
import { BUSINESS, DIRECTORS, mailtoHref, telHref } from "@/config/business";
import { Arrow } from "@/components/ui/Labels";

type Success = { firstName: string; propertyAddress: string };

export function QuoteForm() {
  const [success, setSuccess] = useState<Success | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const params = useSearchParams();
  const ids = useId();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    mode: "onBlur",
    defaultValues: { propertyAddress: "", fullName: "", phone: "", email: "", message: "" },
  });

  // The residential/commercial CTAs on the homepage preselect the property type.
  useEffect(() => {
    const preset = params.get("property");
    if (preset === "residential") setValue("propertyType", "Residential");
    if (preset === "commercial") setValue("propertyType", "Commercial");
  }, [params, setValue]);

  async function onSubmit(values: QuoteInput) {
    setFormError(null);
    const result = await submitQuote(values);

    if (result.ok) {
      setSuccess({ firstName: result.firstName, propertyAddress: result.propertyAddress });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as keyof QuoteInput, { message });
      }
      return;
    }
    setFormError(result.formError ?? "We couldn't submit your request right now.");
  }

  if (success) return <SuccessState {...success} />;

  const fieldId = (name: string) => `${ids}-${name}`;
  const errorId = (name: string) => `${ids}-${name}-error`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {formError && <SubmissionError message={formError} />}

      <Field
        label="Property address"
        required
        id={fieldId("propertyAddress")}
        error={errors.propertyAddress?.message}
        errorId={errorId("propertyAddress")}
        hint="Street address of the driveway or lot. We'll measure it from the map."
      >
        <input
          id={fieldId("propertyAddress")}
          className="field-input"
          autoComplete="street-address"
          aria-invalid={Boolean(errors.propertyAddress)}
          aria-describedby={errors.propertyAddress ? errorId("propertyAddress") : undefined}
          {...register("propertyAddress")}
        />
      </Field>

      <Field
        label="Full name"
        required
        id={fieldId("fullName")}
        error={errors.fullName?.message}
        errorId={errorId("fullName")}
      >
        <input
          id={fieldId("fullName")}
          className="field-input"
          autoComplete="name"
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? errorId("fullName") : undefined}
          {...register("fullName")}
        />
      </Field>

      <fieldset className="border-0 p-0">
        <legend className="label mb-1 text-[0.6875rem] text-muted">
          Phone or email — at least one
        </legend>
        <div className="mt-3 grid gap-6 sm:grid-cols-2">
          <Field
            label="Phone"
            id={fieldId("phone")}
            error={errors.phone?.message}
            errorId={errorId("phone")}
          >
            <input
              id={fieldId("phone")}
              type="tel"
              inputMode="tel"
              className="field-input"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? errorId("phone") : undefined}
              {...register("phone")}
            />
          </Field>

          <Field
            label="Email"
            id={fieldId("email")}
            error={errors.email?.message}
            errorId={errorId("email")}
          >
            <input
              id={fieldId("email")}
              type="email"
              inputMode="email"
              className="field-input"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? errorId("email") : undefined}
              {...register("email")}
            />
          </Field>
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Property type" id={fieldId("propertyType")} optional>
          <select id={fieldId("propertyType")} className="field-input" {...register("propertyType")}>
            <option value="">Select</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="What do you need?" id={fieldId("service")} optional>
          <select id={fieldId("service")} className="field-input" {...register("service")}>
            <option value="">Select</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Message" id={fieldId("message")} optional>
        <textarea id={fieldId("message")} className="field-input" rows={4} {...register("message")} />
      </Field>

      {/* Honeypot. Hidden from people and from screen readers; bots fill it. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor={fieldId("company")}>Company</label>
        <input id={fieldId("company")} tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <button type="submit" className="btn btn-primary mt-2 w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Request my free quote"}
        {!isSubmitting && <Arrow />}
      </button>

      <p className="text-xs text-muted">
        No photos, measurements or account needed. TARMAX measures the property from the map or on
        site.
      </p>
    </form>
  );
}

function Field({
  label,
  id,
  children,
  error,
  errorId,
  hint,
  required,
  optional,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  error?: string;
  errorId?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label text-[0.6875rem] text-muted">
        {label}
        {required && (
          <span className="ml-1.5 text-red" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
        {optional && <span className="ml-2 normal-case tracking-normal opacity-60">Optional</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && (
        // Errors sit next to their field and are announced, never colour-only.
        <p id={errorId} role="alert" className="flex items-start gap-2 text-sm text-[#F0888C]">
          <span aria-hidden="true">↳</span>
          {error}
        </p>
      )}
    </div>
  );
}

/** Shown when the request could not be recorded. Gives the customer a way out. */
function SubmissionError({ message }: { message: string }) {
  return (
    <div role="alert" className="border border-[#F0888C]/45 bg-[#F0888C]/8 p-5">
      <p className="font-semibold text-bone">{message}</p>
      <ul className="mt-4 flex flex-col gap-2 text-sm">
        {DIRECTORS.map((d) => (
          <li key={d.email} className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-muted">{d.firstName}</span>
            <a href={telHref(d)} className="font-display font-bold text-bone hover:text-red">
              {d.phone}
            </a>
          </li>
        ))}
        <li>
          <a href={mailtoHref(BUSINESS.generalEmail)} className="break-all text-bone hover:text-red">
            {BUSINESS.generalEmail}
          </a>
        </li>
      </ul>
    </div>
  );
}

function SuccessState({ firstName, propertyAddress }: Success) {
  return (
    <div className="border border-white/14 bg-white/[0.03] p-7 md:p-10">
      <p className="label text-red">Quote request received</p>
      <h2 className="display-md mt-4">Thanks, {firstName}.</h2>

      <p className="mt-5 text-bone/75">We&rsquo;ve received your property information.</p>
      <p className="mt-4 text-bone/75">TARMAX will review:</p>
      <p className="mt-3 border-l-2 border-red pl-4 font-display text-lg font-bold">
        {propertyAddress}
      </p>
      <p className="mt-4 text-bone/75">and contact you using the information you provided.</p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <a href={telHref(DIRECTORS[0])} className="btn btn-primary">
          Call TARMAX
        </a>
        <Link href="/" className="btn btn-ghost">
          Return home
        </Link>
      </div>
    </div>
  );
}
