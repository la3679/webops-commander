"use client";

import type {} from "@mcp-b/webmcp-types";
import { useEffect } from "react";
import { useCommanderStore } from "@/lib/store/use-commander-store";
import { executeWebMcpTool } from "./tool-handlers";
import { toolDefinitions } from "./tool-definitions";

export function useWebMcpRegistration() {
  const setStatus = useCommanderStore((state) => state.setWebMcpStatus);

  useEffect(() => {
    const modelContext = document.modelContext;
    if (!modelContext) {
      setStatus("UNAVAILABLE");
      return;
    }

    const controller = new AbortController();
    let active = true;

    async function register() {
      try {
        for (const definition of toolDefinitions) {
          await modelContext!.registerTool(
            {
              name: definition.name,
              title: definition.title,
              description: definition.description,
              inputSchema: definition.inputSchema,
              annotations: { readOnlyHint: definition.readOnly, untrustedContentHint: false },
              execute: (input) => executeWebMcpTool(definition.name, input),
            },
            { signal: controller.signal },
          );
        }
        if (active) setStatus("CONNECTED");
      } catch (error) {
        if (!controller.signal.aborted && active)
          setStatus("ERROR", error instanceof Error ? error.message : "Tool registration failed.");
      }
    }

    void register();
    return () => {
      active = false;
      controller.abort();
    };
  }, [setStatus]);
}
