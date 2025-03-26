
export interface RadioStation {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  streamUrl: string;
}

export const radioStations: RadioStation[] = [
  {
    id: "lofi-girl",
    name: "Lofi Girl",
    description: "Beats to relax/study to",
    thumbnailUrl: "https://i.ibb.co/G0VWw9t/lofi-girl.jpg",
    streamUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  },
  {
    id: "chillhop",
    name: "Chillhop Music",
    description: "Jazzy beats & lofi hip hop",
    thumbnailUrl: "https://i.ibb.co/YWMg6cr/chillhop.jpg",
    streamUrl: "https://www.youtube.com/watch?v=5yx6BWlEVcY"
  },
  {
    id: "college-music",
    name: "College Music",
    description: "Chill study beats",
    thumbnailUrl: "https://i.ibb.co/zSXKHQv/college-music.jpg",
    streamUrl: "https://www.youtube.com/watch?v=MCkTebktHVc"
  },
  {
    id: "jazz-hop",
    name: "Jazz Hop Café",
    description: "Jazz influenced hip hop",
    thumbnailUrl: "https://i.ibb.co/KD025JB/jazzhop.jpg",
    streamUrl: "https://www.youtube.com/watch?v=e3L1PIY1pN8"
  },
  {
    id: "bootleg-boy",
    name: "The Bootleg Boy",
    description: "Emotional & chill beats",
    thumbnailUrl: "https://i.ibb.co/ZSvQ092/bootleg-boy.jpg",
    streamUrl: "https://www.youtube.com/watch?v=s49CT4DTAkw"
  }
];

// Default station
export const defaultStation = radioStations[0];
