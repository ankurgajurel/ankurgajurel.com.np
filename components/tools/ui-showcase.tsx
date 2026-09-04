"use client";

import { useState } from "react";
import { CheckIcon as Check } from "@phosphor-icons/react/dist/ssr/Check";
import { CopySimpleIcon as Copy } from "@phosphor-icons/react/dist/ssr/CopySimple";
import Button from "@/components/ui/button";
import { ToolButton } from "@/components/tools/tool-button";
import { ToolPanel } from "@/components/tools/tool-shell";

export function CodeSample({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_800);
  };
  return (
    <div className="relative overflow-hidden border border-foreground/10 bg-background">
      <ToolButton
        aria-label="Copy code"
        variant="quiet"
        className="absolute right-2 top-2 min-h-0 p-2"
        onClick={() => void copy()}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </ToolButton>
      <pre className="overflow-x-auto p-4 pr-12 text-sm leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ButtonShowcase() {
  const code = `import Button from "@/components/ui/button";

<Button onClick={onClick}>Click me</Button>`;
  return (
    <div className="space-y-6">
      <ToolPanel>
        <h2 className="mb-4 text-lg">live example</h2>
        <div className="flex flex-wrap gap-3">
          <Button>default</Button>
          <ToolButton variant="secondary">secondary</ToolButton>
          <ToolButton variant="quiet">quiet</ToolButton>
          <ToolButton variant="danger">danger</ToolButton>
          <Button disabled>disabled</Button>
        </div>
      </ToolPanel>
      <CodeSample code={code} />
    </div>
  );
}

export function TableShowcase() {
  const rows = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
  ];
  const code = `const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
];

// Compose a responsive table with Tailwind's border utilities.`;
  return (
    <div className="space-y-6">
      <ToolPanel className="overflow-x-auto">
        <h2 className="mb-4 text-lg">live example</h2>
        <div className="min-w-125">
          <div className="border-b border-border grid grid-cols-4 p-2 text-xs lowercase text-foreground/60">
            <span>/ id</span>
            <span>/ name</span>
            <span>/ email</span>
            <span>/ role</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.id}
              className="border-b border-border grid grid-cols-4 p-3 text-sm"
            >
              <span>{row.id}</span>
              <span>{row.name}</span>
              <span>{row.email}</span>
              <span>{row.role}</span>
            </div>
          ))}
        </div>
      </ToolPanel>
      <CodeSample code={code} />
    </div>
  );
}
