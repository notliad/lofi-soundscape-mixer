
export interface RadioStation {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  streamUrl: string;
  isCustom?: boolean;
}

export const radioStations: RadioStation[] = [
  {
    id: "lofi-girl",
    name: "Lofi Girl",
    description: "Beats to relax/study to",
    thumbnailUrl: "/images/lofi-girl.png",
    streamUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  },
  {
    id: "chillhop",
    name: "Chillhop Music",
    description: "Jazzy beats & lofi hip hop",
    thumbnailUrl: "/images/chillhop.png",
    streamUrl: "https://www.youtube.com/watch?v=5yx6BWlEVcY"
  },
  {
    id: "college-music",
    name: "College Music",
    description: "Chill study beats",
    thumbnailUrl: "/images/collegemusic.png",
    streamUrl: "https://www.youtube.com/watch?v=MCkTebktHVc"
  },
  {
    id: "jazz-hop",
    name: "Jazz Hop Café",
    description: "Jazz influenced hip hop",
    thumbnailUrl: "/images/jazzhopcafe.png",
    streamUrl: "https://www.youtube.com/watch?v=e3L1PIY1pN8"
  },
  {
    id: "bootleg-boy",
    name: "The Bootleg Boy",
    description: "Emotional & chill beats",
    thumbnailUrl: "/images/tblb.png",
    streamUrl: "https://www.youtube.com/watch?v=s49CT4DTAkw"
  }
];

// Default station
export const defaultStation = radioStations[0];
