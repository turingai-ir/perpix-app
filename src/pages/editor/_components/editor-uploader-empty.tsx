import { useState } from "react";
import {
  ArrowRight,
  Check,
  ImagePlus,
  MoveUpRight,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
import { useRouteBack } from "@/hooks/use-route-back";
import "./editor-studio.css";

interface Props {
  onFileSelect: (file: File) => void;
}

export function EditorUploaderEmpty({ onFileSelect }: Props) {
  const { t } = useAppTranslate();
  const routeBack = useRouteBack();
  const [isDragging, setIsDragging] = useState(false);
  const steps = [
    t("pages.editor.studio.stepOne"),
    t("pages.editor.studio.stepTwo"),
    t("pages.editor.studio.stepThree"),
  ];
  return (
    <main className="editor-onboarding" dir="rtl">
      <header className="editor-onboarding-header">
        <button
          type="button"
          onClick={routeBack}
          className="editor-onboarding-back"
        >
          <ArrowRight size={18} />
          {t("pages.editor.back")}
        </button>
        <span className="editor-onboarding-brand">
          <span>P</span> PerPix <small>STUDIO</small>
        </span>
      </header>
      <div className="editor-onboarding-layout">
        <section className="editor-onboarding-copy">
          <div className="editor-onboarding-eyebrow">
            <Sparkles size={15} />
            {t("pages.editor.studio.eyebrow")}
          </div>
          <h1>{t("pages.editor.smartTitle")}</h1>
          <p className="editor-onboarding-intro">
            {t("pages.editor.studio.intro")}
          </p>
          <div className="editor-onboarding-steps">
            {steps.map((step, index) => (
              <div className="editor-onboarding-step" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
                <Check size={16} />
              </div>
            ))}
          </div>
          <label
            className={`editor-onboarding-drop ${isDragging ? "is-dragging" : ""}`}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              const file = event.dataTransfer.files[0];
              if (file) onFileSelect(file);
            }}
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              aria-label={t("pages.editor.uploaderBtn")}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onFileSelect(file);
              }}
            />
            <span className="editor-onboarding-upload-icon">
              <UploadCloud size={24} />
            </span>
            <strong>
              {t("pages.editor.uploaderBtn")}
              <MoveUpRight size={17} />
            </strong>
            <span>{t("pages.editor.studio.dropHint")}</span>
            <small>{t("pages.editor.studio.formats")}</small>
          </label>
        </section>
        <div className="editor-onboarding-art" aria-hidden="true">
          <div className="editor-onboarding-orbit orbit-one" />
          <div className="editor-onboarding-orbit orbit-two" />
          <div className="editor-onboarding-art-card art-card-back">
            <span className="art-card-top">PERPIX / 01</span>
            <span className="art-card-sun" />
            <span className="art-card-landscape" />
          </div>
          <div className="editor-onboarding-art-card art-card-front">
            <span className="art-card-top">
              <ImagePlus size={15} /> STUDIO / PREVIEW
            </span>
            <span className="art-card-shape shape-one" />
            <span className="art-card-shape shape-two" />
            <span className="art-card-sheen" />
          </div>
          <div className="editor-onboarding-art-chip">
            <Sparkles size={16} /> CREATE · EDIT · EXPORT
          </div>
        </div>
      </div>
    </main>
  );
}
