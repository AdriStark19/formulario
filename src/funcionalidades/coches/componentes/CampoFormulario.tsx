import type { ReactNode } from "react";

type Props = {
  id: string;
  etiqueta: string;
  error?: string;
  children: ReactNode;
};

export function CampoFormulario({ id, etiqueta, error, children }: Props) {
  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>
      {children}
      {error && (
        <p id={`${id}-error`} className="campo-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}