"use client"
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ProblemsHeader } from "./problems-header";
import { useProblemFilters } from "../hooks/use-problem-filters";
import { ProblemsFilters } from "./problem-filters";
import { usePagination } from "../hooks/use-pagination";
import { ProblemRow } from "./problem-row";
import { ProblemsEmpty } from "./problem-empty";
import { ProblemsPagination } from "./problems-pagination";
// import CreatePlaylistModal from "@/modules/playlists/components/create-playlist";
// import { usePlaylistActions } from "@/modules/playlists/hooks/use-playlist-action";
// import AddToPlaylistModal from "@/modules/playlists/components/add-to-playlist";

const ProblemsTable = ({problems=[] , user}:any) => {

  const filters = useProblemFilters(problems);
  const pagination = usePagination(filters.filteredProblems);
//   const playlist = usePlaylistActions();

  console.log("Filtered Problems:", filters.filteredProblems);
  console.log("Current Page Problems:", pagination.paginatedItems);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
      <ProblemsHeader onCreatePlaylist={playlist.openCreateModal}/>

        <ProblemsFilters
        search={filters.search}
        onSearchChange={filters.setSearch}
        difficulty={filters.difficulty}
        onDifficultyChange={filters.setDifficulty}
        selectedTag={filters.selectedTag}
        onTagChange={filters.setSelectedTag}
        allTags={filters.allTags}
        
        />

        <Card>
          <CardContent>
             <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25">Solved</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-30">Difficulty</TableHead>
                <TableHead className="w-50">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.paginatedItems.length > 0 ? (
                pagination.paginatedItems.map((problem) => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                    user={user}
                    onDelete={()=>{}}
                    onSave={playlist.openAddToPlaylist}
                  />
                ))
              ) : (
                <ProblemsEmpty />
              )}
            </TableBody>
          </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
      {pagination.showPagination && (
        <ProblemsPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          displayRange={pagination.displayRange}
          canGoPrevious={pagination.canGoPrevious}
          canGoNext={pagination.canGoNext}
          onPrevious={pagination.goToPreviousPage}
          onNext={pagination.goToNextPage}
        />
      )}

      <CreatePlaylistModal
      isOpen={playlist.isCreateModalOpen}
      onClose={playlist.closeCreateModal}
      onSubmit={playlist.handleCreatePlaylist}
      />

      <AddToPlaylistModal
      isOpen={playlist.isAddToPlaylistModalOpen}
      onClose={playlist.closeAddToPlaylistModal}
      onSubmit={playlist.handleAddToPlaylist}
      problemId={playlist.selectedProblemId}
      
      />

    </div>
  )
}

export default ProblemsTable