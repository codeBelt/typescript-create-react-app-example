import CategoryEnum from '../constants/CategoryEnum';
import {SwapiModelUnion} from '../stores/swapi/models/CategoryResponseModel';
import {IConstructor} from '../models/IConstructor';
import PersonModel from '../stores/swapi/models/PersonModel';
import PlanetModel from '../stores/swapi/models/PlanetModel';
import StarshipModel from '../stores/swapi/models/StarshipModel';
import VehicleModel from '../stores/swapi/models/VehicleModel';
import SpeciesModel from '../stores/swapi/models/SpeciesModel';
import FilmModel from '../stores/swapi/models/FilmModel';
import ISwapiReducerState from '../stores/swapi/models/ISwapiReducerState';
import get from 'lodash/get';
import INeededCategoryIds from '../stores/swapi/models/INeededCategoryIds';
import IDetailsRequest from '../stores/swapi/models/IDetailsRequest';

export default class SwapiUtility {
    /**
     * Takes the last number value from the url
     * Sample url: "https://swapi.co/api/vehicles/4/"
     */
    public static getIdFromUrl(url: string): string {
        return url.split('/').filter(Boolean).pop();
    }

    /**
     * Returns a model by category passed in.
     */
    public static getModelForCreation(category: CategoryEnum): IConstructor<SwapiModelUnion> {
        const map: {[categoryEnum: string]: IConstructor<SwapiModelUnion>} = {
            [CategoryEnum.People]: PersonModel,
            [CategoryEnum.Planets]: PlanetModel,
            [CategoryEnum.Starships]: StarshipModel,
            [CategoryEnum.Vehicles]: VehicleModel,
            [CategoryEnum.Species]: SpeciesModel,
            [CategoryEnum.Films]: FilmModel,
        };

        return map[category];
    }

    /**
     * Returns a category map of ids needed to be fetched by the api.
     *
     * Create an array of categories from the CategoryEnum.
     * Get all the endpoints for each category on the model.
     * Take those endpoints for each category on the model and create an array of ids.
     * Now filter any ids out that we currently have in the swapiReducer because we don't need to load them again.
     */
    public static getCategoryIdsForDetails(model: SwapiModelUnion, swapiReducer: ISwapiReducerState): INeededCategoryIds {
        return Object
            .values(CategoryEnum)
            .reduce((list: INeededCategoryIds, category: CategoryEnum) => {
                const categoryEndpoints: string[] = model[category];

                if (categoryEndpoints && categoryEndpoints.length) {
                    const currentCategoryIds: string[] = get(swapiReducer[category], 'entity.ids', []);

                    list[category] = categoryEndpoints
                        .map((endpoint: string) =>  SwapiUtility.getIdFromUrl(endpoint))
                        .filter((id: string) => currentCategoryIds.includes(id) === false);
                }

                return list;
            }, {});
    }

    public static getDetailRequests(data: INeededCategoryIds): IDetailsRequest[] {
        return Object
            .entries(data)
            .reduce((list: IDetailsRequest[], [category, ids]: [string, string[]]) => {
                const categoryList: IDetailsRequest[] = ids.map((id: string): IDetailsRequest => {
                    return {
                        category: category as CategoryEnum,
                        itemId: id,
                    }
                });

                return [
                    ...list,
                    ...categoryList,
                ]
            }, []);
    }
}
