import { useState } from 'react';
import { getTokenValue } from './tokenValue';

interface TokenLabelProps {
  name: string;
  label: string;
}

export function ColorSwatch({ name, label }: TokenLabelProps) {
  const [value] = useState(() => getTokenValue(name));

  return (
    <div className="sr-foundations-swatch">
      <span
        className="sr-foundations-swatch-color"
        style={{ backgroundColor: `var(${name})` }}
        aria-hidden="true"
      />
      <div className="sr-foundations-swatch-meta">
        <p className="sr-foundations-swatch-label">{label}</p>
        <code className="sr-foundations-swatch-var">{name}</code>
        <code className="sr-foundations-swatch-value">{value}</code>
      </div>
    </div>
  );
}

export function TypeSample({ name, label }: TokenLabelProps) {
  const [value] = useState(() => getTokenValue(name));

  return (
    <div className="sr-foundations-type-row">
      <p className="sr-foundations-type-sample" style={{ fontSize: `var(${name})` }}>
        The quick brown fox jumps over the lazy dog
      </p>
      <div className="sr-foundations-type-meta">
        <code>{name}</code>
        <code>{value}</code>
        <span>{label}</span>
      </div>
    </div>
  );
}

export function SpaceSample({ name, label }: TokenLabelProps) {
  const [value] = useState(() => getTokenValue(name));

  return (
    <div className="sr-foundations-space-row">
      <div className="sr-foundations-space-meta">
        <code>{name}</code>
        <code>{value}</code>
        <span>{label}</span>
      </div>
      <div className="sr-foundations-space-bar" style={{ width: `var(${name})` }} />
    </div>
  );
}
