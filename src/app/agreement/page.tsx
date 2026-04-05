import Link from "next/link";
import { PrintButton } from "./print-button";

export default function AgreementPage() {
  return (
    <div className="min-h-screen bg-white print:bg-white" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Nav */}
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 print:hidden">
        <Link href="/" className="text-[18px] font-semibold tracking-[-0.02em] text-[#0F1A2E]" style={{ fontFamily: "var(--font-serif)" }}>
          Abscondata
        </Link>
        <PrintButton />
      </nav>

      {/* Agreement */}
      <article className="mx-auto max-w-3xl px-5 pb-20 pt-8 sm:px-8">
        <h1
          className="text-[28px] font-medium leading-[1.25] text-[#0F1A2E] sm:text-[32px]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Abscondata Service Agreement
        </h1>

        <div className="mt-8 space-y-2 text-[14px] leading-[1.7] text-[#5A564F]">
          <p>Effective Date: ___________</p>
          <p>Between: <strong className="text-[#0F1A2E]">Abscondata</strong> (&ldquo;Provider&rdquo;) and <strong className="text-[#0F1A2E]">___________</strong> (&ldquo;Client&rdquo;)</p>
        </div>

        <div className="mt-12 space-y-10 text-[14px] leading-[1.8] text-[#3D3A35]">
          {/* a) Services */}
          <section>
            <h2 className="text-[15px] font-semibold text-[#0F1A2E]">a) Services</h2>
            <p className="mt-3">
              Provider will perform managed back-office operations as selected during onboarding, including but not limited to: invoice generation, payment follow-up, review requests, lead intake processing, and weekly summary reporting. Services are performed by trained operators using the Client&apos;s existing business tools.
            </p>
          </section>

          {/* b) Access */}
          <section>
            <h2 className="text-[15px] font-semibold text-[#0F1A2E]">b) Access</h2>
            <p className="mt-3">
              Client will provide necessary credentials and tool access within 5 business days of agreement. Provider will use credentials solely for performing agreed services.
            </p>
          </section>

          {/* c) AI Tools */}
          <section>
            <h2 className="text-[15px] font-semibold text-[#0F1A2E]">c) AI Tools</h2>
            <p className="mt-3">
              Provider uses artificial intelligence tools to generate drafts and assist with task execution. All AI-generated output is reviewed by a human operator before delivery. Client data processed by AI tools is not used for training and is handled in accordance with the provider&apos;s data practices.
            </p>
          </section>

          {/* d) Fees */}
          <section>
            <h2 className="text-[15px] font-semibold text-[#0F1A2E]">d) Fees</h2>
            <p className="mt-3">
              Flat monthly rate as quoted. Invoiced on the 1st of each month. Payment due within 15 days. No refunds for partial months.
            </p>
          </section>

          {/* e) Term */}
          <section>
            <h2 className="text-[15px] font-semibold text-[#0F1A2E]">e) Term</h2>
            <p className="mt-3">
              Month-to-month. Either party may cancel with 30 days written notice.
            </p>
          </section>

          {/* f) Subcontractors */}
          <section>
            <h2 className="text-[15px] font-semibold text-[#0F1A2E]">f) Subcontractors</h2>
            <p className="mt-3">
              Provider may use subcontractors (including virtual assistants) to perform services. Provider remains responsible for quality and confidentiality.
            </p>
          </section>

          {/* g) Confidentiality */}
          <section>
            <h2 className="text-[15px] font-semibold text-[#0F1A2E]">g) Confidentiality</h2>
            <p className="mt-3">
              Provider will maintain confidentiality of all client business data and will not share with third parties except as necessary to perform services.
            </p>
          </section>

          {/* h) Limitation of Liability */}
          <section>
            <h2 className="text-[15px] font-semibold text-[#0F1A2E]">h) Limitation of Liability</h2>
            <p className="mt-3">
              Provider&apos;s total liability shall not exceed fees paid in the 3 months prior to any claim.
            </p>
          </section>

          {/* i) Governing Law */}
          <section>
            <h2 className="text-[15px] font-semibold text-[#0F1A2E]">i) Governing Law</h2>
            <p className="mt-3">
              This agreement shall be governed by the laws of the State of Florida.
            </p>
          </section>
        </div>

        {/* Signature block */}
        <div className="mt-16 grid grid-cols-2 gap-12 text-[14px] text-[#3D3A35]">
          <div>
            <p className="font-semibold text-[#0F1A2E]">Provider</p>
            <div className="mt-8 border-t border-[#D6D3CD] pt-2">
              <p>Abscondata</p>
              <p className="text-[#8A8680]">Date: ___________</p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-[#0F1A2E]">Client</p>
            <div className="mt-8 border-t border-[#D6D3CD] pt-2">
              <p>___________</p>
              <p className="text-[#8A8680]">Date: ___________</p>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-[#E5E2DC] print:hidden">
        <div className="mx-auto max-w-3xl px-5 py-6 text-center text-xs text-[#8A8680]">
          &copy; 2026 Abscondata
        </div>
      </footer>
    </div>
  );
}
