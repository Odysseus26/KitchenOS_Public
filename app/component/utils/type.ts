import {User} from "@supabase/supabase-js"

export interface User_Metadata{
    user_id: string
    created_at: string
    first_name: string
    last_name: string
    age: number
    organization: object
    email: string
    recipes_references: string[]
    organizations: string[] | null
    invite_requests: string[] | null
}


export type AmountUnit = 'grams' | 'liters' | 'teaspoons' | 'cups' | 'tablespoons' | 'pieces' | string; 

export interface Ingredient {
  name: string;
  amount: number;
  type_amount: AmountUnit;   
  vendor: string;            
}

export interface Step {
  desc: string;      
  notes: string[];   
}


export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
  created_by: string;
  updated_by: string | null;
  ingredients: Ingredient[];   
  steps: Step[];               
  tags: string[] | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  servings: number ;
  difficulty: Difficulty | null;
  is_public: boolean;

}





export interface organizations_members{
  user_id: string
  level: number
}

export interface Vendor{
  vendor_name: string
  location: string | null
  items_found_there: string[]
}

export interface Inventory{
  item_name: string
  amount: number
}


export interface Task{
  desc: string
  completed: boolean
}

export interface Assigned_Tasks{
  user_id: string
  tasks: Task[]
}


export interface Organizations{
  organization_id: string
  created_at: string
  recipe_references: string[]
  created_by: string
  owner_id: string
  users: organizations_members[]
  vendor: Vendor[]
  inventory: Inventory[]
  assigned_tasks: Assigned_Tasks[]
  organization_name: string
}

export interface User_Organization extends Organizations{
  level: number
}

export interface Public_Facing_Info{
  organization_id: string
  user: User
}