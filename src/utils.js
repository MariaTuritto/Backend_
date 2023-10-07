import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getValidFilters = (filters, DocumentType) => {
    const cleanFilters = {};
    //CREAREMOS UN DICCIONARIO DE FILTROS
    switch(DocumentType){
        case "product" :{
            if(filters.category){
                if(typeof category === "string"){
                    cleanFilters['category'] = {$in:[filters.category]}
                } 
                else {
                    cleanFilters['category'] = {$in:filters.category}
                }
            }
            if (filters.gte){
                cleanFilters['price'] = {$gte: filters.gte}
            }
            if (filters.price){
                cleanFilters['price'] = filters.price
            }
            return cleanFilters
        }

    }
}
 
export default __dirname;

