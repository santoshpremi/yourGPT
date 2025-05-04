import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { trpc } from "../../lib/api/trpc/trpc";
import { Stack } from "@mui/joy";
import { AnimatePresence, motion } from "framer-motion";
import ArtifactCanvas from "./ArtifactCanvas";
import type { Artifact } from "../../../backend/src/api/chat/artifact/artifactTypes";

// Update the Artifact type in ArtifactProvider.tsx


interface ArtifactProviderMethods {
  visible: boolean;
  isLoading: boolean;
  artifact: Artifact | undefined;
  versionIndex: number;
  hide: () => void;
  showArtifact: (versionId?: string) => void;
  createNewVersion: ({
    highlightedText,
    feedback,
    context,
  }: {
    highlightedText: string;
    feedback: string;
    context: string | null;
  }) => void;
}

const ArtifactContext = createContext<ArtifactProviderMethods | null>(null);

interface ArtifactContextProps {
  chatId: string;
  children: React.ReactNode;
  embedded?: boolean;
}

export const ArtifactProvider = ({
  children,
  chatId,
  embedded = false,
}: ArtifactContextProps) => {
  const [versionIndex, setVersionIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [artifact, setArtifact] = useState<Artifact | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const { mutateAsync: createVersion, isPending: createVersionLoading } =
    trpc.artifact.createVersion.useMutation();

const { data, isLoading: artifactLoading } =
  trpc.artifact.getArtifact.useQuery({ chatId });
  const utils = trpc.useUtils();

  const isLoading = createVersionLoading || artifactLoading || loading;

  useEffect(() => {
    if (!data) return;
    setArtifact({ ...data, type: "defaultType" }); // Replace "defaultType" with the appropriate value for the type property
  }, [data]);

  const show = useCallback(
    (versionId?: string) => {
      setVisible(true);
      const index = artifact?.versions.findIndex((v) => v.id === versionId);
      setVersionIndex(index ?? -1);
    },
    [artifact, setVersionIndex],
  );

  const hide = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const addVersion = useCallback(
    (versionId: string) => {
      setArtifact((prev) => {
        if (!prev) return;
        return {
          ...prev,
          versions: [
            ...(prev?.versions ?? []),
            {
              id: versionId,
              content: "",
              createdAt: new Date().toISOString(),
              fromChat: false,
              version: prev?.versions.length + 1,
            },
          ],
        };
      });
      setVersionIndex(artifact?.versions.length ?? 0);
    },
    [setArtifact, artifact],
  );
  

  const updateVersion = useCallback(
    ({ versionId, content }: { versionId: string; content: string }) => {
      setArtifact((prev) => {
        if (!prev) return;
        return {
          ...prev,
          versions: prev.versions.map((v) =>
            v.id === versionId ? { ...v, content } : v,
          ),
        };
      });
    },
    [setArtifact],
  );

  const createNewVersion = useCallback(
    async ({
      highlightedText,
      feedback,
      context,
    }: {
      highlightedText: string;
      feedback: string;
      context: string | null;
    }) => {
      if (!artifact) return;
      const { id: baseVersionId } = artifact.versions.at(versionIndex)!;
      setLoading(true);

      const stream = await createVersion({
        chatId,
        baseVersionId,
        highlightedText,
        feedback,
        context: context ?? undefined,
        title: "",
        content: "",
        artifactId: ""
      });

      let newVersionId: string | undefined;
      try {
        if (Array.isArray(stream)) {
          for (const chunk of stream) {
            if (chunk.type === "init") {
              newVersionId = chunk.newVersionId;
              if (newVersionId) {
                addVersion(newVersionId);
              }
              continue;
            }

            if (chunk.type === "chunk") {
              const { chunk: content } = chunk;
              updateVersion({ versionId: newVersionId!, content });
            }
          }
        } else {
          console.error("Stream is not iterable:", stream);
        }
      } catch (error) {
        console.error("Failed to create new version:", error);
      } finally {
        void utils.artifact.invalidate();
        setLoading(false);
      }
    },
    [
      artifact,
      utils,
      chatId,
      versionIndex,
      createVersion,
      addVersion,
      updateVersion,
    ],
  );

  const value: ArtifactProviderMethods = useMemo(
    () => ({
      visible,
      artifact: artifact ?? undefined,
      versionIndex,
      createNewVersion,
      isLoading,
      hide,
      showArtifact: show,
    }),
    [visible, artifact, versionIndex, isLoading, createNewVersion, hide, show],
  );

  return (
    <ArtifactContext.Provider value={value}>
      <Stack direction="row" sx={{ width: "100%" }}>
        {children}
        <AnimatePresence>
          {artifact && visible && (
            <>
              {embedded && (
                <motion.div
                  onClick={hide}
                  className="fixed bottom-0 left-0 right-0 top-0 z-40 h-screen w-full bg-black/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
              <ArtifactCanvas embedded={embedded} />
            </>
          )}
        </AnimatePresence>
      </Stack>
    </ArtifactContext.Provider>
  );
};

export const useArtifact = () => {
  const context = useContext(ArtifactContext);
  if (!context) {
    throw new Error("useArtifact must be used within an ArtifactProvider");
  }
  return context;
};
