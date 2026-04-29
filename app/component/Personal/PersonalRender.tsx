import {User} from "@supabase/supabase-js"

import ComingSoon from "../ComingSoon"

import Personal_RecipePage from "./Recipes/Personal_RecipePage"
import Personal_Tool_Home from "./Tools/Personal_Tool_Home"
import Sharing_Personal_Home from "./Sharing/Sharing_Personal_Home"


export default function Personal_Render({state,user}:{
    state: string
    user: User
}){
    switch(state){
        case "RECIPES":
            return <Personal_RecipePage user={user}/>
        case "TOOLS":
            return <Personal_Tool_Home user={user}/>
        case "SHARING":
            return <Sharing_Personal_Home user={user}/>
        default:
            return <ComingSoon/>
    }
}