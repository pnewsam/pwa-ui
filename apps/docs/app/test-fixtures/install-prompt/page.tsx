"use client";

import { InstallPrompt } from "../../../../../registry/components/install-prompt/install-prompt";
import { useInstallPrompt } from "../../../../../registry/hooks/use-install-prompt";

export default function InstallPromptTestFixture() {
  const { status, promptType, prompt } = useInstallPrompt();

  return (
    <main className="grid gap-4 p-5">
      <p data-testid="prompt-type">{promptType}</p>
      <p data-testid="prompt-status">{status}</p>
      {promptType === "ios-manual" ? (
        <InstallPrompt mode="manual" title="Install Field Notes" />
      ) : null}
      {promptType === "native" ? (
        <InstallPrompt title="Install Field Notes" installing={status === "prompting"} onInstall={() => void prompt()} />
      ) : null}
    </main>
  );
}
