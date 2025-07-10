export interface OompaLoompa {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  profession: string;
  image: string;
  email: string;
  age: number;
  country: string;
  height: number;
  description?: string;
  quota?: string;
  favorite: {
    color: string;
    food: string;
    random_string: string;
    song: string;
  };
}

export interface MinimalOompaLoompa {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  profession: string;
  image: string;
}
