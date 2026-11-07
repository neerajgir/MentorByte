import { getCurrentUserData } from "@/modules/auth/actions";
import { SubmissionHistory } from "@/modules/problems/components/submit-history";
import PlaylistsSection from "@/modules/profile/components/playlist-section";
import ProfileStats from "@/modules/profile/components/profile-stats";
import SolvedProblems from "@/modules/profile/components/solved-problems";
import UserInfoCard from "@/modules/profile/components/user-info-card";
import React, { Suspense } from "react";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  return (
    <Suspense fallback={null}>
      <ProfileContent />
    </Suspense>
  );
};

const ProfileContent = async () => {
  const profileData = await getCurrentUserData();

  if (!profileData?.id) {
    redirect("/");
  }

  return (
    <div className="min-h-screen py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <UserInfoCard userData={profileData} />

        <ProfileStats
          submissions={profileData?.submissions}
          solvedCount={profileData?.solvedProblems?.length ?? 0} // Added ?. and fallback
          playlistCount={profileData?.playlists?.length ?? 0}
        />

        <SubmissionHistory submissions={profileData?.submissions ?? []} />

        <div className="grid gap-8">
          <SolvedProblems solvedProblems={profileData?.solvedProblems ?? []} />
          <PlaylistsSection playlists={profileData?.playlists ?? []} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
