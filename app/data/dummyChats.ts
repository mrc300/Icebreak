export type User = {
  name: string;
  avatar: any;
};

export type Message = {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
};

export const users: Record<string, User> = {
  "1": {
    name: "Haley James",
    avatar: require("../../assets/images/dummy_avatars/avatar1.jpg"),
  },
  "2": {
    name: "Nathan Scott",
    avatar: require("../../assets/images/dummy_avatars/avatar2.jpg"),
  },
  "3": {
    name: "Brooke Davis",
    avatar: require("../../assets/images/dummy_avatars/avatar3.jpg"),
  },
  "4": {
    name: "Marvin McFadden",
    avatar: require("../../assets/images/dummy_avatars/avatar4.jpg"),
  },
  "5": {
    name: "Peyton Sawyer",
    avatar: require("../../assets/images/dummy_avatars/avatar5.jpg"),
  },
};

export const chatPreview: Record<string, Omit<Message, "time">[]> = {
  "1": [
    { id: "m1", sender: "them", text: "Are you coming tonight?" },
    { id: "m2", sender: "me", text: "Maybe! Who else is going?" },
  ],
  "2": [{ id: "m3", sender: "them", text: "Stand up for what you believe in" }],
  "3": [
    { id: "m4", sender: "them", text: "Hey Lucas!" },
    { id: "m5", sender: "me", text: "Hi Brooke!" },
    { id: "m6", sender: "them", text: "How's your project going?" },
  ],
  "4": [{ id: "m7", sender: "them", text: "What are you up to?" }],
  "5": [{ id: "m8", sender: "them", text: "Hey! What's up ?!" }],
};

export const times = ["08:20", "09:44", "15:24", "20:10", "00:12"];
