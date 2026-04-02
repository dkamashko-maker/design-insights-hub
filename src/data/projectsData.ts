import projectThumb1 from "@/assets/project-thumb-1.jpg";
import projectThumb2 from "@/assets/project-thumb-2.jpg";
import projectThumb3 from "@/assets/project-thumb-3.jpg";
import designpack1 from "@/assets/designpack-1.jpg";
import designpack2 from "@/assets/designpack-2.jpg";
import design1 from "@/assets/design-1.jpg";

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  roomWidthCm: number;
  roomHeightCm: number;
  isPublic: boolean;
  shareToken: string;
  createdAt: string;
  updatedAt: string;
  productIds: string[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  thumbnail: string;
  widthCm: number;
  heightCm: number;
}

export const projectTemplates: ProjectTemplate[] = [
  { id: "tpl-1", name: "Студия 30 м²", thumbnail: projectThumb1, widthCm: 600, heightCm: 500 },
  { id: "tpl-2", name: "Однокомнатная 50 м²", thumbnail: projectThumb2, widthCm: 800, heightCm: 625 },
  { id: "tpl-3", name: "Двухкомнатная 75 м²", thumbnail: projectThumb3, widthCm: 1000, heightCm: 750 },
];

export const mockProjects: Project[] = [
  {
    id: "proj-1", userId: "user-1", name: "Гостиная в скандинавском стиле",
    description: "Проект гостиной 25 м² с мебелью из каталога", thumbnailUrl: projectThumb1,
    roomWidthCm: 600, roomHeightCm: 400, isPublic: true, shareToken: "abc123",
    createdAt: "2025-03-10T10:00:00Z", updatedAt: "2025-03-28T14:30:00Z",
    productIds: ["p1", "p6", "p8", "p3"],
  },
  {
    id: "proj-2", userId: "user-1", name: "Спальня минимализм",
    description: "Компактная спальня с комодом и светильниками", thumbnailUrl: projectThumb2,
    roomWidthCm: 400, roomHeightCm: 350, isPublic: false, shareToken: "def456",
    createdAt: "2025-04-01T09:00:00Z", updatedAt: "2025-04-05T16:00:00Z",
    productIds: ["p2", "p4", "p9"],
  },
  {
    id: "proj-3", userId: "user-1", name: "Кухня-столовая",
    description: "Просторная кухня с обеденной зоной", thumbnailUrl: projectThumb3,
    roomWidthCm: 500, roomHeightCm: 400, isPublic: false, shareToken: "ghi789",
    createdAt: "2025-04-08T11:00:00Z", updatedAt: "2025-04-10T12:00:00Z",
    productIds: ["p4", "p10", "p5"],
  },
];

export interface PublicDesign {
  id: string;
  authorName: string;
  authorAvatar: string;
  name: string;
  description: string;
  coverImage: string;
  style: string;
  productIds: string[];
  createdAt: string;
}

export const mockPublicDesigns: PublicDesign[] = [
  {
    id: "des-1", authorName: "Анна К.", authorAvatar: "",
    name: "Скандинавская гостиная", description: "Уютная гостиная с природными материалами и мягкими текстурами.",
    coverImage: designpack1, style: "Скандинавский", productIds: ["p1", "p6", "p8", "p3", "p5"],
    createdAt: "2025-03-01",
  },
  {
    id: "des-2", authorName: "Михаил Р.", authorAvatar: "",
    name: "Минималистичная спальня", description: "Элегантная спальня с акцентами серого и тёплым освещением.",
    coverImage: designpack2, style: "Минималистичный", productIds: ["p2", "p4", "p9"],
    createdAt: "2025-03-15",
  },
  {
    id: "des-3", authorName: "Елена В.", authorAvatar: "",
    name: "Индустриальный кабинет", description: "Рабочее пространство в стиле лофт с металлическими акцентами.",
    coverImage: design1, style: "Индустриальный", productIds: ["p5", "p7"],
    createdAt: "2025-04-01",
  },
];
