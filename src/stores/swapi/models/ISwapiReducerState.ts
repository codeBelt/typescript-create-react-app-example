import ICategoriesResponse from './ICategoriesResponse';
import CategoryEnum from '../../../constants/CategoryEnum';
import ILoadMoreEntity from './ILoadMoreEntity';

type OthersUnion = boolean | null | CategoryEnum | ICategoriesResponse | ILoadMoreEntity;

export default interface ISwapiReducerState {
    readonly [swapiEnum: string]: ILoadMoreEntity | OthersUnion;
    readonly currentCategory: CategoryEnum;
    readonly isLoadingCategories: boolean;
    readonly categories: ICategoriesResponse | null;
}
