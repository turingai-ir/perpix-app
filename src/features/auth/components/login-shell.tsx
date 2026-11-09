import type { PropsWithChildren } from "react";
import { Aperture, Film } from "lucide-react";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import LoginArtwork from "./login-artwork";
import AuthCelebration from "./auth-celebration";

const PAGE_CLASS =
  "scheme-dark flex min-h-dvh flex-col overflow-hidden bg-background bg-[radial-gradient(ellipse_44%_55%_at_72%_35%,var(--ambient-brand),transparent_82%),radial-gradient(ellipse_28%_35%_at_16%_80%,var(--ambient-media),transparent_80%)] px-[clamp(20px,5vw,80px)] pt-6 pb-5 text-foreground caret-primary max-md:px-4.5 max-md:py-4 [&_::selection]:bg-(--selection) [&_::selection]:text-(--selection-foreground)";

/* Restyles the auth card/inputs/buttons rendered inside the login panel. */
const FORMS_CLASS = [
  "relative grid",
  "[&_[data-slot=card]]:max-w-none [&_[data-slot=card]]:gap-6 [&_[data-slot=card]]:overflow-visible [&_[data-slot=card]]:rounded-none [&_[data-slot=card]]:border-0 [&_[data-slot=card]]:bg-transparent [&_[data-slot=card]]:p-0 [&_[data-slot=card]]:text-foreground [&_[data-slot=card]]:shadow-none",
  "[&_[data-slot=card-header]]:gap-0 [&_[data-slot=card-header]]:p-0 [&_[data-slot=card-content]]:p-0",
  "[&_[data-slot=card-title]_h2]:max-w-95 [&_[data-slot=card-title]_h2]:text-[clamp(32px,2.8vw,41px)] [&_[data-slot=card-title]_h2]:leading-tight [&_[data-slot=card-title]_h2]:font-extrabold [&_[data-slot=card-title]_h2]:tracking-tighter [&_[data-slot=card-title]_h2]:text-balance max-md:[&_[data-slot=card-title]_h2]:text-3xl",
  "[&_[data-slot=card-description]]:mt-3 [&_[data-slot=card-description]_p]:text-sm [&_[data-slot=card-description]_p]:leading-loose [&_[data-slot=card-description]_p]:text-muted-foreground [&_form_p]:text-sm [&_form_p]:leading-loose [&_form_p]:text-muted-foreground",
  "[&_label]:mb-1.5 [&_label]:text-sm [&_label]:font-bold [&_label]:text-foreground",
  "[&_input]:min-h-15 [&_input]:rounded-2xl [&_input]:border [&_input]:border-input [&_input]:bg-background [&_input]:text-base [&_input]:text-foreground [&_input]:shadow-[inset_0_1px_3px_rgb(0_0_0/40%)] [&_input]:transition-[border-color,box-shadow,transform] [&_input]:duration-200 motion-reduce:[&_input]:transition-none",
  "[&_input:focus-visible]:-translate-y-px [&_input:focus-visible]:border-ring [&_input:focus-visible]:shadow-[0_0_0_4px_color-mix(in_srgb,var(--ring)_22%,transparent),0_0_24px_var(--ambient-brand)] [&_input:focus-visible]:outline-none motion-reduce:[&_input:focus-visible]:translate-y-0",
  "[&_input[aria-invalid=true]]:border-destructive [&_p[data-slot=form-message]]:text-destructive",
  "[&_button]:min-h-11 [&_button]:cursor-pointer [&_button:disabled]:cursor-default [&_button:disabled]:opacity-70 [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-primary",
  "[&_button[type=submit]]:relative [&_button[type=submit]]:flex [&_button[type=submit]]:min-h-15.5 [&_button[type=submit]]:items-center [&_button[type=submit]]:justify-between [&_button[type=submit]]:overflow-hidden [&_button[type=submit]]:rounded-2xl [&_button[type=submit]]:border [&_button[type=submit]]:border-primary [&_button[type=submit]]:bg-primary [&_button[type=submit]]:py-2 [&_button[type=submit]]:ps-4.5 [&_button[type=submit]]:pe-2 [&_button[type=submit]]:text-sm [&_button[type=submit]]:font-extrabold [&_button[type=submit]]:text-primary-foreground [&_button[type=submit]]:shadow-[0_12px_34px_color-mix(in_srgb,var(--primary)_28%,transparent),inset_0_1px_rgb(255_255_255/65%)] [&_button[type=submit]]:transition-[transform,box-shadow] [&_button[type=submit]]:duration-200",
  "[&_button[type=submit]:active:not(:disabled)]:scale-[0.985]",
  "hover-capable:[&_button[type=submit]:hover:not(:disabled)]:-translate-y-0.5 hover-capable:[&_button[type=submit]:hover:not(:disabled)]:shadow-[0_17px_38px_color-mix(in_srgb,var(--primary)_44%,transparent),inset_0_1px_#fff] hover-capable:[&_button[type=submit]:hover:not(:disabled)_[data-auth-submit-icon]]:-translate-x-1 hover-capable:[&_button[type=submit]:hover:not(:disabled)_[data-auth-submit-icon]]:-rotate-8",
  "[&_[data-auth-submit-icon]]:grid [&_[data-auth-submit-icon]]:size-10.5 [&_[data-auth-submit-icon]]:place-items-center [&_[data-auth-submit-icon]]:rounded-xl [&_[data-auth-submit-icon]]:bg-primary-foreground/20 [&_[data-auth-submit-icon]]:text-primary-foreground [&_[data-auth-submit-icon]]:transition-transform [&_[data-auth-submit-icon]]:duration-300 [&_[data-auth-submit-icon]_svg]:size-5",
  "motion-reduce:[&_button[type=submit]]:transition-none motion-reduce:[&_[data-auth-submit-icon]]:transition-none",
  "[&_[data-slot=card-footer]]:justify-between [&_[data-slot=card-footer]]:gap-x-3 [&_[data-slot=card-footer]]:gap-y-1.5 [&_[data-slot=card-footer]]:border-t [&_[data-slot=card-footer]]:border-foreground/14 [&_[data-slot=card-footer]]:bg-transparent [&_[data-slot=card-footer]]:px-0 [&_[data-slot=card-footer]]:pt-4.5 [&_[data-slot=card-footer]]:pb-0 [&_[data-slot=card-footer]_p]:text-sm [&_[data-slot=card-footer]_p]:font-bold [&_[data-slot=card-footer]_p]:text-primary",
].join(" ");

const FORM_SECTION_CLASS =
  "relative isolate col-start-1 row-start-1 w-full max-w-127.5 justify-self-center overflow-hidden rounded-[32px] border border-(--glass-border) bg-(--glass-surface-strong) bg-[radial-gradient(circle_at_95%_0%,var(--ambient-brand),transparent_42%)] p-[clamp(26px,3.1vw,42px)] text-foreground shadow-[0_28px_90px_rgb(0_0_0/60%),inset_0_1px_rgb(255_255_255/12%),0_0_0_7px_rgb(255_255_255/2%)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-(image:--brand-gradient) before:shadow-[0_0_26px_var(--primary)] before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:bg-[radial-gradient(rgb(255_255_255/7%)_0.7px,transparent_0.7px)] after:bg-size-[19px_19px] after:mask-[linear-gradient(135deg,transparent_35%,#000_100%)] after:content-[''] max-md:col-start-1 max-md:row-start-2 max-md:max-w-122.5 max-md:p-7.5 max-[390px]:p-6";

interface LoginShellProps extends PropsWithChildren {
  celebrating?: boolean;
}

export default function LoginShell({
  children,
  celebrating = false,
}: LoginShellProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <main className={PAGE_CLASS}>
      {celebrating ? <AuthCelebration /> : null}
      <header className="relative z-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-xl font-extrabold">
          <img
            className="[mask-image:url('/android-chrome-512x512.png')] [mask-mode:luminance] [mask-size:100%_100%]"
            src="/android-chrome-192x192.png"
            width="40"
            height="40"
            alt=""
          />
          <span>{t("pages.auth.login.visual.brand")}</span>
        </div>
        <span className="text-muted-foreground text-xs max-[390px]:hidden max-md:text-[10px]">
          {t("pages.auth.login.visual.studio")}
        </span>
      </header>
      <div className="mx-auto my-6 grid w-full max-w-330 flex-1 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-[clamp(32px,7vw,112px)] max-md:my-2.5 max-md:mb-7.5 max-md:grid-cols-1 max-md:gap-3.5">
        <section
          className="relative col-start-2 row-start-1 min-w-0 px-5 pt-[clamp(300px,32vw,430px)] pb-9.5 max-[390px]:pt-26.5 max-md:col-start-1 max-md:px-0 max-md:pt-29.5 max-md:pb-0 max-md:text-center"
          aria-labelledby="login-hero-title"
        >
          <LoginArtwork />
          <div className="relative z-1 max-w-130 max-md:mx-auto">
            <h1
              id="login-hero-title"
              className="m-0 text-[clamp(38px,3.9vw,60px)] leading-snug font-extrabold tracking-tight text-balance max-md:text-[clamp(24px,6.5vw,30px)] max-md:leading-normal"
            >
              {t("pages.auth.login.visual.title")}
              <br className="max-md:hidden" />
              <span className="text-primary max-md:before:content-['_']">
                {t("pages.auth.login.visual.titleAccent")}
              </span>
            </h1>
            <p className="text-muted-foreground mt-4.5 max-w-105 text-[15px] leading-loose max-md:hidden">
              {t("pages.auth.login.visual.description")}
            </p>
            <div className="text-foreground/85 [&_svg]:text-primary mt-6 flex items-center gap-5.5 text-xs max-md:hidden [&_span]:inline-flex [&_span]:items-center [&_span]:gap-2">
              <span>
                <Aperture size={16} aria-hidden="true" />
                {t("pages.auth.login.visual.image")}
              </span>
              <span>
                <Film size={16} aria-hidden="true" />
                {t("pages.auth.login.visual.video")}
              </span>
            </div>
          </div>
        </section>
        <section
          className={FORM_SECTION_CLASS}
          aria-label={t("pages.auth.login.title")}
        >
          <div className="text-muted-foreground mb-7.5 flex items-center gap-2.5 text-[11px] font-bold tracking-wide">
            <span
              className="bg-primary size-2 flex-none rounded-full shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_14%,transparent),0_0_16px_var(--primary)]"
              aria-hidden="true"
            />
            <span>{t("pages.auth.login.visual.entryLabel")}</span>
            <span
              className="border-primary/30 text-foreground/85 ms-auto rounded-lg border px-2 py-1.5 font-sans text-[10px] leading-none font-bold tracking-widest"
              aria-hidden="true"
            >
              P/01
            </span>
          </div>
          <div className={FORMS_CLASS}>{children}</div>
          <div className="border-foreground/11 mt-7 flex items-start gap-2.5 border-t pt-4">
            <span
              className="text-primary text-xl leading-tight"
              aria-hidden="true"
            >
              ✳
            </span>
            <p className="text-muted-foreground m-0 text-right text-xs leading-loose">
              {t("pages.auth.login.visual.note")}
            </p>
          </div>
        </section>
      </div>
      <footer
        className={cn(
          "text-muted-foreground flex items-center justify-between gap-4 border-t border-(--glass-border) pt-4.5 text-xs max-md:text-[10px]",
        )}
      >
        <span>{t("pages.auth.login.visual.footer")}</span>
        <span
          className="text-[10px] font-bold tracking-[0.18em]"
          aria-hidden="true"
        >
          PERPIX AI
        </span>
      </footer>
    </main>
  );
}
