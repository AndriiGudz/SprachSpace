export interface Meeting {
    id: string;
    title: string;
    category: string;
    startTime: string;
    endTime: string;
    duration: string;
    minParticipants: number;
    maxParticipants: number;
    waitingParticipants: number;
    language: string;
    hostAvatar: string;
    ageRestriction: string | null;
    shareLink: string;
  }