import { useState } from "react";
import { toast } from "sonner";

export function usePlaylistActions() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null,
  );

  const handleCreatePlaylist = async (data: any) => {
    try {
      const response = await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsCreateModalOpen(false);
        toast.success("Playlist created successfully");
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create playlist",
      );
      return false;
    }
  };

  const handleAddToPlaylist = async (problemId: string, playlistId: string) => {
    try {
      const response = await fetch("/api/playlist/add-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, playlistId }),
      });

      const result = await response.json();

      if (result.success) {
        setIsAddToPlaylistModalOpen(false);
        toast.success("Problem added to playlist");
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error adding to playlist:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add problem to playlist",
      );
      return false;
    }
  };

  const openAddToPlaylist = (problemId: string) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  return {
    isCreateModalOpen,
    openCreateModal: () => setIsCreateModalOpen(true),
    closeCreateModal: () => setIsCreateModalOpen(false),
    handleCreatePlaylist,

    // Add to playlist modal
    isAddToPlaylistModalOpen,
    selectedProblemId,
    openAddToPlaylist,
    closeAddToPlaylistModal: () => setIsAddToPlaylistModalOpen(false),
    handleAddToPlaylist,
  };
}