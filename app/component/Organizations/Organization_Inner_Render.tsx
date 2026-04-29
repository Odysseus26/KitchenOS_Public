import { Public_Facing_Info } from "../utils/type";


import ComingSoon from "../ComingSoon";

import Organisation_Recipes from "./Recipe/Organization_Recipes";
import Organisation_Inventory from "./Inventory/Organization_Inventory";
import Organisation_Vendor from "./Vendor/Organization_Vendor";
import Organization_Dashboard from "./Dashboard/Organization_Dashboard";
import Organization_Tools from "./Tools/Organization_Tools";

export default function Organization_Inner_Render({state,organization_details}:{
    state: string
    organization_details: Public_Facing_Info
}){

    switch(state){
        case "RECIPES":
            return <Organisation_Recipes
            organization_details={organization_details}
            />
        case "INVENTORY":
            return <Organisation_Inventory organization_details={organization_details}/>
        case "VENDOR":
            return <Organisation_Vendor organization_details={organization_details}/>
        case "DASHBOARD":
            return <Organization_Dashboard organization_details={organization_details}/>
        case "TOOLS":
            return <Organization_Tools organization_details={organization_details}/>
        default:
            return <ComingSoon/>
    }
}